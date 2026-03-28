import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!apiKey) {
      return Response.json({ 
        success: false,
        error: 'API key not configured in environment variables' 
      }, { status: 500 });
    }

    // Test 1: Simple Directions API call
    const testOrigin = "846-848 Wimborne Rd, Bournemouth BH9 2DS, UK";
    const testDestination = "First a number 38 Tro Twnpath, BH9 2DS";
    
    const testUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(testOrigin)}&destination=${encodeURIComponent(testDestination)}&key=${apiKey}`;
    
    console.log('Testing Google Maps API with simple directions call...');
    console.log('API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
    
    const response = await fetch(testUrl);
    const data = await response.json();
    
    console.log('Google Maps API Response:', JSON.stringify(data, null, 2));
    
    return Response.json({
      success: data.status === 'OK',
      api_status: data.status,
      error_message: data.error_message,
      api_key_configured: true,
      api_key_preview: apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4),
      test_origin: testOrigin,
      test_destination: testDestination,
      response_summary: {
        status: data.status,
        error_message: data.error_message,
        available_travel_modes: data.available_travel_modes,
        routes_found: data.routes?.length || 0
      },
      full_response: data,
      diagnostics: {
        message: data.status === 'OK' 
          ? 'API key is working correctly!' 
          : 'API call failed. Common fixes: 1) Set Application Restrictions to "None" in Google Cloud Console, 2) Enable Directions API, 3) Check billing is active',
        next_steps: data.status !== 'OK' 
          ? [
              'Go to Google Cloud Console → APIs & Services → Credentials',
              'Find your API key: ' + apiKey.substring(0, 10) + '...',
              'Edit the key and set Application Restrictions to "None"',
              'Under API Restrictions, enable: Directions API, Geocoding API, Maps JavaScript API',
              'Ensure billing account is active and linked to project'
            ]
          : ['API is working! Route optimization should work now.']
      }
    });

  } catch (error) {
    console.error('Test failed with error:', error);
    return Response.json({ 
      success: false,
      error: 'Test failed',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
});