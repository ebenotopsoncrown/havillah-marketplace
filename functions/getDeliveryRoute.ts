import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

const GOOGLE_MAPS_API_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY");

// Store location (you can update this)
const STORE_LOCATION = {
  lat: 51.5074,
  lng: -0.1278,
  address: "123 High Street, London, SW1A 1AA"
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!GOOGLE_MAPS_API_KEY) {
      return Response.json({ error: 'Google Maps API key not configured' }, { status: 500 });
    }

    const { destination, waypoints } = await req.json();
    
    if (!destination) {
      return Response.json({ error: 'Destination is required' }, { status: 400 });
    }
    
    console.log('Calculating route to:', destination);

    // Build the directions API URL
    let directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${STORE_LOCATION.lat},${STORE_LOCATION.lng}&destination=${encodeURIComponent(destination)}&key=${GOOGLE_MAPS_API_KEY}&mode=driving&units=imperial`;
    
    // Add waypoints if provided (for multi-stop routes)
    if (waypoints && waypoints.length > 0) {
      const waypointStr = waypoints.map(w => encodeURIComponent(w)).join('|');
      directionsUrl += `&waypoints=optimize:true|${waypointStr}`;
    }

    const response = await fetch(directionsUrl);
    const data = await response.json();

    console.log('Google Maps API response status:', data.status);

    if (data.status === 'OK' && data.routes.length > 0) {
      const route = data.routes[0];
      const leg = route.legs[0];
      
      return Response.json({
        success: true,
        route: {
          distance: leg.distance.text,
          duration: leg.duration.text,
          start_address: leg.start_address,
          end_address: leg.end_address,
          steps: leg.steps.map(step => ({
            instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
            distance: step.distance.text,
            duration: step.duration.text,
            start_location: step.start_location,
            end_location: step.end_location
          })),
          polyline: route.overview_polyline.points,
          bounds: route.bounds
        },
        store_location: STORE_LOCATION,
        optimized_waypoint_order: route.waypoint_order || []
      });
    } else {
      console.error('Route not found. API status:', data.status, 'Error:', data.error_message);
      return Response.json({
        success: false,
        error: 'Route not found',
        status: data.status,
        message: data.error_message || 'Unable to calculate route to this address'
      });
    }
  } catch (error) {
    console.error('Route calculation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});