import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

const GOOGLE_MAPS_API_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY");

Deno.serve(async (req) => {
  try {
    const { postcode, address } = await req.json();
    
    if (!postcode) {
      return Response.json({ error: 'Postcode is required' }, { status: 400 });
    }

    // Geocode the address using Google Maps API
    const query = address ? `${address}, ${postcode}, UK` : `${postcode}, UK`;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}&components=country:GB`;
    
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      const location = result.geometry.location;
      
      // Extract address components
      const components = {};
      result.address_components.forEach(comp => {
        if (comp.types.includes('postal_code')) components.postcode = comp.long_name;
        if (comp.types.includes('locality') || comp.types.includes('postal_town')) components.city = comp.long_name;
        if (comp.types.includes('route')) components.street = comp.long_name;
        if (comp.types.includes('street_number')) components.streetNumber = comp.long_name;
      });

      return Response.json({
        valid: true,
        formatted_address: result.formatted_address,
        location: {
          lat: location.lat,
          lng: location.lng
        },
        components,
        place_id: result.place_id
      });
    } else {
      return Response.json({
        valid: false,
        error: 'Address not found',
        status: data.status
      });
    }
  } catch (error) {
    console.error('Address validation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});