import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Store location - Coriander Cash & Carry
const STORE_ADDRESS = "846-848 Wimborne Rd, Moordown, Bournemouth BH9 2DS, UK";

// Delivery fee structure
const BASE_FEE = 4.5;
const FREE_DELIVERY_THRESHOLD = 50;

// Distance tiers (in miles)
const DISTANCE_TIERS = [
  { max: 5, rate: 0 },           // 0-5 miles: base fee only
  { max: 10, rate: 1.5 },         // 5-10 miles: +£1.50/mile over 5
  { max: 15, rate: 2.0 },         // 10-15 miles: +£2/mile over 10
  { max: 999, rate: 3.0 }         // 15+ miles: +£3/mile over 15
];

// Weight bands (in kg)
const WEIGHT_BANDS = [
  { max: 10, surcharge: 0 },     // 0-10kg: no surcharge
  { max: 25, surcharge: 2 },     // 10-25kg: +£2
  { max: 50, surcharge: 4 },     // 25-50kg: +£4
  { max: 999, surcharge: 8 }     // 50kg+: +£8
];

const MAX_DELIVERY_DISTANCE = 20; // miles

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { cart, deliveryPostcode, orderTotal } = await req.json();

    if (!deliveryPostcode || !cart || cart.length === 0) {
      return Response.json({ 
        error: 'Missing required parameters',
        fee: BASE_FEE 
      }, { status: 400 });
    }

    // Check for free delivery threshold
    if (orderTotal >= FREE_DELIVERY_THRESHOLD) {
      return Response.json({ 
        fee: 0,
        distance: null,
        weight: null,
        breakdown: {
          baseFee: 0,
          distanceFee: 0,
          weightSurcharge: 0,
          freeDelivery: true,
          reason: `Free delivery on orders over £${FREE_DELIVERY_THRESHOLD}`
        }
      });
    }

    // Calculate total weight
    const products = await base44.entities.Product.list();
    let totalWeight = 0;
    
    for (const item of cart) {
      const product = products.find(p => p.id === item.product_id);
      if (product) {
        const weight = product.weight_kg || 0.5; // Default 0.5kg if not set
        totalWeight += weight * item.quantity;
      }
    }

    // Get distance using Google Maps Distance Matrix API
    const mapsApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(STORE_ADDRESS)}&destinations=${encodeURIComponent(deliveryPostcode + ', UK')}&units=imperial&key=${mapsApiKey}`;
    
    const distanceResponse = await fetch(distanceUrl);
    const distanceData = await distanceResponse.json();

    if (distanceData.status !== 'OK' || !distanceData.rows[0]?.elements[0]?.distance) {
      return Response.json({ 
        error: 'Unable to calculate distance. Please check the postcode.',
        fee: BASE_FEE 
      }, { status: 400 });
    }

    const element = distanceData.rows[0].elements[0];
    if (element.status !== 'OK') {
      return Response.json({ 
        error: 'Invalid delivery address',
        fee: BASE_FEE 
      }, { status: 400 });
    }

    // Distance in miles
    const distanceMeters = element.distance.value;
    const distanceMiles = distanceMeters * 0.000621371;

    // Check if within delivery range
    if (distanceMiles > MAX_DELIVERY_DISTANCE) {
      return Response.json({ 
        error: `Sorry, we don't deliver to areas more than ${MAX_DELIVERY_DISTANCE} miles away`,
        fee: null,
        distance: distanceMiles,
        outOfRange: true
      }, { status: 400 });
    }

    // Calculate distance fee
    let distanceFee = 0;
    if (distanceMiles > 5) {
      if (distanceMiles <= 10) {
        distanceFee = (distanceMiles - 5) * DISTANCE_TIERS[1].rate;
      } else if (distanceMiles <= 15) {
        distanceFee = (5 * DISTANCE_TIERS[1].rate) + ((distanceMiles - 10) * DISTANCE_TIERS[2].rate);
      } else {
        distanceFee = (5 * DISTANCE_TIERS[1].rate) + (5 * DISTANCE_TIERS[2].rate) + ((distanceMiles - 15) * DISTANCE_TIERS[3].rate);
      }
    }

    // Calculate weight surcharge
    let weightSurcharge = 0;
    for (const band of WEIGHT_BANDS) {
      if (totalWeight <= band.max) {
        weightSurcharge = band.surcharge;
        break;
      }
    }

    // Total delivery fee
    const totalFee = parseFloat((BASE_FEE + distanceFee + weightSurcharge).toFixed(2));

    return Response.json({
      fee: totalFee,
      distance: parseFloat(distanceMiles.toFixed(1)),
      weight: parseFloat(totalWeight.toFixed(1)),
      breakdown: {
        baseFee: BASE_FEE,
        distanceFee: parseFloat(distanceFee.toFixed(2)),
        weightSurcharge: weightSurcharge,
        freeDelivery: false
      },
      estimatedTime: element.duration?.text || 'N/A'
    });

  } catch (error) {
    console.error('Delivery calculation error:', error);
    return Response.json({ 
      error: 'Failed to calculate delivery fee',
      fee: BASE_FEE,
      details: error.message 
    }, { status: 500 });
  }
});