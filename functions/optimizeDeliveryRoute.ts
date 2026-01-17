import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { checkRateLimit, sanitizeObject } from './utils/validation.js';

const STORE_ADDRESS = "846-848 Wimborne Rd, Bournemouth BH9 2DS, UK";

// Extract earliest time from delivery slot (e.g., "2-3pm" -> 14)
function extractTimeFromSlot(slot) {
  if (!slot || slot === 'Anytime') return 9; // Default early morning
  
  const match = slot.match(/(\d+)/);
  if (!match) return 9;
  
  let hour = parseInt(match[1]);
  if (slot.toLowerCase().includes('pm') && hour < 12) hour += 12;
  if (slot.toLowerCase().includes('am') && hour === 12) hour = 0;
  
  return hour;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    const rateLimit = checkRateLimit(user.email, 20, 60000);
    if (!rateLimit.allowed) {
      return Response.json({ 
        error: 'Rate limit exceeded',
        retryAfter: rateLimit.retryAfter 
      }, { status: 429 });
    }

    const requestData = await req.json();
    const sanitized = sanitizeObject(requestData);
    const { orderIds } = sanitized;

    if (!orderIds || orderIds.length === 0) {
      return Response.json({ error: 'No orders provided' }, { status: 400 });
    }

    // Fetch order details
    const orders = await Promise.all(
      orderIds.map(id => base44.entities.Order.get(id))
    );

    // Build waypoints (delivery addresses) with time slots
    const waypoints = orders
      .filter(order => order.delivery_address && order.delivery_postcode)
      .map(order => ({
        order_id: order.id,
        order_number: order.order_number,
        address: `${order.delivery_address}, ${order.delivery_postcode}, UK`,
        customer_name: order.customer_name,
        total: order.total_amount,
        delivery_slot: order.delivery_slot || 'Anytime'
      }));

    // Sort by delivery slot time (earliest first)
    waypoints.sort((a, b) => {
      const timeA = extractTimeFromSlot(a.delivery_slot);
      const timeB = extractTimeFromSlot(b.delivery_slot);
      return timeA - timeB;
    });

    if (waypoints.length === 0) {
      return Response.json({ error: 'No valid delivery addresses found' }, { status: 400 });
    }

    // PATCH 1: GUARD CLAUSE - Single stop doesn't need optimization, just return it
    if (waypoints.length === 1) {
      console.log('Single stop - no optimization needed, returning as-is');
      return Response.json({
        optimized_stops: [{
          ...waypoints[0],
          sequence: 1,
          distance_miles: '0.00',
          duration_minutes: 15,
          estimated_arrival: null
        }],
        total_distance_miles: '0.00',
        estimated_duration_minutes: 15,
        polyline: '',
        summary: 'Single delivery stop',
        optimized: false,
        reason: 'NOT_ENOUGH_STOPS'
      });
    }

    // Call Google Maps Directions API with waypoint optimization
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'Google Maps API key not configured' }, { status: 500 });
    }

    console.log('API Key (masked):', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4));

    const origin = encodeURIComponent(STORE_ADDRESS);
    const destination = encodeURIComponent(STORE_ADDRESS); // Return to store
    const waypointsParam = 'optimize:true|' + waypoints
      .map(w => encodeURIComponent(w.address))
      .join('|');

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${waypointsParam}&key=${apiKey}`;
    
    console.log('Requesting route optimization for', waypoints.length, 'stops');
    console.log('Store address:', STORE_ADDRESS);
    console.log('Request URL (without key):', url.replace(apiKey, 'HIDDEN'));
    
    const response = await fetch(url);
    const data = await response.json();

    console.log('=== GOOGLE MAPS API RESPONSE ===');
    console.log('HTTP Status:', response.status);
    console.log('Response Status:', data.status);
    console.log('Error message:', data.error_message);
    console.log('Full response:', JSON.stringify(data, null, 2));
    console.log('================================');

    if (data.status !== 'OK') {
      console.error('Google Maps API error - Full details:', JSON.stringify(data, null, 2));
      
      // FALLBACK: Return unoptimized route if optimization fails
      console.log('Attempting fallback: returning stops in original order');
      try {
        const fallbackUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${waypoints.map(w => encodeURIComponent(w.address)).join('|')}&key=${apiKey}`;
        const fallbackResponse = await fetch(fallbackUrl);
        const fallbackData = await fallbackResponse.json();
        
        if (fallbackData.status === 'OK') {
          const route = fallbackData.routes[0];
          const legs = route.legs;
          const detailedStops = waypoints.map((stop, index) => ({
            ...stop,
            sequence: index + 1,
            distance_miles: (legs[index].distance.value / 1609.34).toFixed(2),
            duration_minutes: Math.ceil(legs[index].duration.value / 60),
            estimated_arrival: null
          }));

          const totalDistance = legs.reduce((sum, leg) => sum + leg.distance.value, 0) / 1609.34;
          const totalDuration = legs.reduce((sum, leg) => sum + leg.duration.value, 0) / 60;

          return Response.json({
            optimized_stops: detailedStops,
            total_distance_miles: totalDistance.toFixed(2),
            estimated_duration_minutes: Math.ceil(totalDuration),
            polyline: route.overview_polyline.points,
            summary: route.summary,
            optimized: false,
            fallback: true,
            original_error: data.error_message
          });
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
      
      return Response.json({ 
        error: 'Route optimization failed', 
        status: data.status,
        google_error: data.error_message || 'No error message provided',
        upstream_status: response.status,
        details: `API returned status: ${data.status}. Check if: 1) API key has correct restrictions (None for server calls), 2) Directions API is enabled, 3) Billing is active`,
        api_key_preview: apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4),
        full_response: data
      }, { status: 500 });
    }

    // Extract optimized order
    const route = data.routes[0];
    const waypointOrder = route.waypoint_order || waypoints.map((_, i) => i);
    
    // Reorder waypoints based on optimization
    const optimizedStops = waypointOrder.map(index => waypoints[index]);

    // Calculate distances and times for each leg
    const legs = route.legs;
    const detailedStops = optimizedStops.map((stop, index) => ({
      ...stop,
      sequence: index + 1,
      distance_miles: (legs[index].distance.value / 1609.34).toFixed(2),
      duration_minutes: Math.ceil(legs[index].duration.value / 60),
      delivery_slot: stop.delivery_slot,
      estimated_arrival: null // Will be calculated when run starts
    }));

    // Calculate totals
    const totalDistance = legs.reduce((sum, leg) => sum + leg.distance.value, 0) / 1609.34;
    const totalDuration = legs.reduce((sum, leg) => sum + leg.duration.value, 0) / 60;

    return Response.json({
      optimized_stops: detailedStops,
      total_distance_miles: totalDistance.toFixed(2),
      estimated_duration_minutes: Math.ceil(totalDuration),
      polyline: route.overview_polyline.points,
      summary: route.summary,
      optimized: true
    });

  } catch (error) {
    console.error('Route optimization error:', error);
    return Response.json({ 
      error: 'Failed to optimize route', 
      details: error.message 
    }, { status: 500 });
  }
});