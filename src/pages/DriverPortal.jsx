import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Play, 
  CheckCircle,
  Navigation,
  LogOut,
  FileText,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadOrdersModal from "../components/driver/LoadOrdersModal";
import ActiveRunView from "../components/driver/ActiveRunView";
import DeliveryManifest from "../components/driver/DeliveryManifest";

export default function DriverPortal() {
  const [user, setUser] = useState(null);
  const [showLoadOrders, setShowLoadOrders] = useState(false);
  const [activeRun, setActiveRun] = useState(null);
  const [showManifest, setShowManifest] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };
    loadUser();
  }, []);

  // Fetch active delivery run for this driver
  const { data: deliveryRuns = [] } = useQuery({
    queryKey: ['driver-runs', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return base44.entities.DeliveryRun.filter({ 
        driver_id: user.id, 
        status: 'in_progress' 
      });
    },
    enabled: !!user?.id,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Get ready orders (picked and ready for dispatch)
  const { data: readyOrders = [] } = useQuery({
    queryKey: ['ready-orders'],
    queryFn: () => base44.entities.Order.filter({ 
      status: 'ready',
      delivery_type: 'delivery'
    }),
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (deliveryRuns.length > 0) {
      setActiveRun(deliveryRuns[0]);
    } else {
      setActiveRun(null);
    }
  }, [deliveryRuns]);

  const handleLogout = async () => {
    await base44.auth.logout(window.location.origin);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Driver Sign In</h2>
            <p className="text-gray-600 mb-6">Please sign in to access your delivery portal</p>
            <Button 
              onClick={() => base44.auth.redirectToLogin(window.location.pathname)}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Driver Portal</h1>
                <p className="text-indigo-100">{user.full_name}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeRun ? (
          <>
            {/* Active Delivery Run */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500 text-white px-4 py-2 text-base">
                  <Navigation className="w-4 h-4 mr-2" />
                  Active Run: {activeRun.run_number}
                </Badge>
                {activeRun.start_time && (
                  <div className="text-sm text-gray-600">
                    Started: {new Date(activeRun.start_time).toLocaleTimeString()}
                  </div>
                )}
              </div>
              <Button
                onClick={() => setShowManifest(true)}
                variant="outline"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Manifest
              </Button>
            </div>

            <ActiveRunView run={activeRun} driver={user} />
          </>
        ) : (
          <>
            {/* Dashboard - No Active Run */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-600" />
                    Ready for Pickup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-orange-600">{readyOrders.length}</p>
                  <p className="text-sm text-gray-600 mt-2">Orders waiting for delivery</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    Your Deliveries Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-blue-600">0</p>
                  <p className="text-sm text-gray-600 mt-2">Completed today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    On Time Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-green-600">100%</p>
                  <p className="text-sm text-gray-600 mt-2">Performance this week</p>
                </CardContent>
              </Card>
            </div>

            {/* Load Orders Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  Start New Delivery Run
                </CardTitle>
              </CardHeader>
              <CardContent>
                {readyOrders.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      There are <strong>{readyOrders.length}</strong> orders ready for delivery.
                    </p>
                    <Button
                      onClick={() => setShowLoadOrders(true)}
                      className="bg-indigo-600 hover:bg-indigo-700"
                      size="lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Load Orders
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No orders ready for pickup at the moment</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <LoadOrdersModal
        open={showLoadOrders}
        onClose={() => setShowLoadOrders(false)}
        readyOrders={readyOrders}
        driver={user}
      />

      {activeRun && (
        <DeliveryManifest
          open={showManifest}
          onClose={() => setShowManifest(false)}
          run={activeRun}
        />
      )}
    </div>
  );
}