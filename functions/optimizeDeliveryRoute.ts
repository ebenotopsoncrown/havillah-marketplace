import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

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

    const { orderIds } = await req.json();

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

    // Call Google Maps Directions API with waypoint optimization
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    const origin = encodeURIComponent(STORE_ADDRESS);
    const destination = encodeURIComponent(STORE_ADDRESS); // Return to store
    const waypointsParam = waypoints
      .map(w => `optimize:true|${encodeURIComponent(w.address)}`)
      .join('|');

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${waypointsParam}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return Response.json({ 
        error: 'Route optimization failed', 
        details: data.status 
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
      summary: route.summary
    });

  } catch (error) {
    console.error('Route optimization error:', error);
    return Response.json({ 
      error: 'Failed to optimize route', 
      details: error.message 
    }, { status: 500 });
  }
});