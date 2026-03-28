import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

const GOOGLE_MAPS_API_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY");

Deno.serve(async (req) => {
  try {
    const { postcode, address } = await req.json();
    
    if (!postcode) {
      return Response.json({ error: 'Postcode is required' }, { status: 400 });
    }

    if (!GOOGLE_MAPS_API_KEY) {
      console.error('GOOGLE_MAPS_API_KEY not set');
      return Response.json({ 
        valid: false, 
        error: 'Address validation service not configured' 
      }, { status: 500 });
    }

    // First try with full address
    const query = address ? `${address}, ${postcode}, UK` : `${postcode}, UK`;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}&region=uk`;
    
    console.log('Validating address:', query);
    
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    console.log('Google Maps response:', JSON.stringify(data, null, 2));

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
    } 
    
    // If full address fails, try just the postcode
    if (address) {
      console.log('Trying postcode only:', postcode);
      const postcodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(postcode)}&components=country:GB&key=${GOOGLE_MAPS_API_KEY}`;
      const postcodeResponse = await fetch(postcodeUrl);
      const postcodeData = await postcodeResponse.json();
      
      if (postcodeData.status === 'OK' && postcodeData.results.length > 0) {
        const result = postcodeData.results[0];
        return Response.json({
          valid: true,
          formatted_address: `${address}, ${result.formatted_address}`,
          location: {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng
          },
          place_id: result.place_id,
          note: 'Verified postcode area, full street address could not be confirmed'
        });
      }
    }
    
    // Return detailed error
    return Response.json({
      valid: false,
      error: 'Address not found',
      status: data.status,
      error_message: data.error_message || 'Could not verify this address with Google Maps',
      suggestion: 'Please check the postcode and try again, or proceed if you are certain the address is correct'
    });
  } catch (error) {
    console.error('Address validation error:', error);
    return Response.json({ 
      valid: false,
      error: error.message,
      suggestion: 'Verification service temporarily unavailable. You can proceed with checkout.'
    }, { status: 500 });
  }
});