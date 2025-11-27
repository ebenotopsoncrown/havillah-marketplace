import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation, Clock, MapPin, Truck, ExternalLink, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const storeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const deliveryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Decode Google polyline
function decodePolyline(encoded) {
  const points = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : (result >> 1);

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : (result >> 1);

    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

export default function DeliveryMap({ order, onClose }) {
  const [loading, setLoading] = useState(true);
  const [routeData, setRouteData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (order?.delivery_address && order?.delivery_postcode) {
      fetchRoute();
    }
  }, [order]);

  const fetchRoute = async () => {
    setLoading(true);
    setError(null);
    try {
      const destination = `${order.delivery_address}, ${order.delivery_postcode}, UK`;
      const response = await base44.functions.invoke('getDeliveryRoute', {
        destination
      });
      
      if (response.data.success) {
        setRouteData(response.data);
      } else {
        setError(response.data.error || 'Could not calculate route');
      }
    } catch (err) {
      console.error('Route error:', err);
      setError('Failed to load route');
    } finally {
      setLoading(false);
    }
  };

  const openInGoogleMaps = () => {
    const destination = encodeURIComponent(`${order.delivery_address}, ${order.delivery_postcode}`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
  };

  if (loading) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-600" />
          <p className="text-gray-600">Calculating route...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchRoute} variant="outline">Try Again</Button>
        </div>
      </Card>
    );
  }

  const storeLocation = routeData?.store_location || { lat: 51.5074, lng: -0.1278 };
  const routePolyline = routeData?.route?.polyline ? decodePolyline(routeData.route.polyline) : [];

  // Calculate center and bounds
  const center = routePolyline.length > 0 
    ? [routePolyline[Math.floor(routePolyline.length / 2)][0], routePolyline[Math.floor(routePolyline.length / 2)][1]]
    : [storeLocation.lat, storeLocation.lng];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Delivery Route
          </CardTitle>
          <div className="flex items-center gap-4">
            {routeData?.route && (
              <>
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {routeData.route.distance}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {routeData.route.duration}
                </Badge>
              </>
            )}
            <Button size="sm" onClick={openInGoogleMaps}>
              <ExternalLink className="w-4 h-4 mr-1" />
              Open in Maps
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-80">
          <MapContainer
            center={center}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            
            {/* Store marker */}
            <Marker position={[storeLocation.lat, storeLocation.lng]} icon={storeIcon}>
              <Popup>
                <div className="text-center">
                  <strong>Coriander Cash & Carry</strong>
                  <br />
                  <span className="text-xs text-gray-600">{storeLocation.address}</span>
                </div>
              </Popup>
            </Marker>

            {/* Delivery destination marker */}
            {routePolyline.length > 0 && (
              <Marker 
                position={routePolyline[routePolyline.length - 1]} 
                icon={deliveryIcon}
              >
                <Popup>
                  <div>
                    <strong>{order.customer_name}</strong>
                    <br />
                    <span className="text-xs text-gray-600">
                      {order.delivery_address}<br />
                      {order.delivery_postcode}
                    </span>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Route polyline */}
            {routePolyline.length > 0 && (
              <Polyline
                positions={routePolyline}
                color="#4F46E5"
                weight={4}
                opacity={0.8}
              />
            )}
          </MapContainer>
        </div>

        {/* Turn-by-turn directions */}
        {routeData?.route?.steps && (
          <div className="p-4 border-t bg-gray-50 max-h-48 overflow-y-auto">
            <p className="text-sm font-semibold text-gray-700 mb-2">Directions:</p>
            <div className="space-y-2">
              {routeData.route.steps.slice(0, 5).map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold text-indigo-700">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-gray-800">{step.instruction}</p>
                    <p className="text-xs text-gray-500">{step.distance}</p>
                  </div>
                </div>
              ))}
              {routeData.route.steps.length > 5 && (
                <p className="text-xs text-gray-500 pl-8">
                  +{routeData.route.steps.length - 5} more steps
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}