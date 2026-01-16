import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, MapPin, Loader2, Navigation, CheckCircle } from "lucide-react";

export default function LoadOrdersModal({ open, onClose, readyOrders, driver }) {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const queryClient = useQueryClient();

  const createRunMutation = useMutation({
    mutationFn: async (runData) => {
      const run = await base44.entities.DeliveryRun.create(runData);
      
      // Update orders status to dispatched and assign driver
      for (const orderId of runData.order_ids) {
        await base44.entities.Order.update(orderId, {
          status: 'dispatched',
          driver_id: driver.id
        });
      }
      
      return run;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-runs'] });
      queryClient.invalidateQueries({ queryKey: ['ready-orders'] });
      setSelectedOrders([]);
      setOptimizedRoute(null);
      onClose();
    },
  });

  const toggleOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
    setOptimizedRoute(null); // Clear route when selection changes
  };

  const handleOptimizeRoute = async () => {
    setOptimizing(true);
    try {
      const response = await base44.functions.invoke('optimizeDeliveryRoute', {
        orderIds: selectedOrders
      });
      setOptimizedRoute(response.data);
    } catch (error) {
      console.error('Route optimization failed:', error);
      alert('Failed to optimize route. Please try again.');
    }
    setOptimizing(false);
  };

  const handleStartRun = async () => {
    const runNumber = `RUN-${Date.now()}`;
    
    const runData = {
      run_number: runNumber,
      driver_id: driver.id,
      driver_name: driver.full_name,
      status: 'in_progress',
      order_ids: selectedOrders,
      optimized_route: optimizedRoute,
      start_time: new Date().toISOString(),
      total_distance_miles: parseFloat(optimizedRoute.total_distance_miles),
      delivery_stops: optimizedRoute.optimized_stops.map(stop => ({
        order_id: stop.order_id,
        address: stop.address,
        customer_name: stop.customer_name,
        sequence: stop.sequence,
        estimated_duration: stop.duration_minutes
      }))
    };

    await createRunMutation.mutateAsync(runData);
  };

  const selectedOrderDetails = readyOrders.filter(order => 
    selectedOrders.includes(order.id)
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Package className="w-6 h-6" />
            Load Orders for Delivery
          </DialogTitle>
        </DialogHeader>

        {!optimizedRoute ? (
          <>
            {/* Order Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Select orders to include in this delivery run
                </p>
                <Badge>{selectedOrders.length} selected</Badge>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {readyOrders.map(order => (
                  <div 
                    key={order.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedOrders.includes(order.id)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleOrder(order.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => toggleOrder(order.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-gray-900">{order.order_number}</p>
                          <p className="font-bold text-indigo-600">£{order.total_amount.toFixed(2)}</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{order.customer_name}</p>
                        <p className="text-sm text-gray-500 flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5" />
                          {order.delivery_address}, {order.delivery_postcode}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleOptimizeRoute}
                  disabled={selectedOrders.length === 0 || optimizing}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  {optimizing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Optimizing Route...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-5 h-5 mr-2" />
                      Optimize Route ({selectedOrders.length})
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Optimized Route Preview */}
            <div className="space-y-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="font-semibold text-green-900">Route Optimized!</p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Distance</p>
                    <p className="font-bold text-gray-900">{optimizedRoute.total_distance_miles} miles</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Est. Duration</p>
                    <p className="font-bold text-gray-900">{optimizedRoute.estimated_duration_minutes} mins</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Stops</p>
                    <p className="font-bold text-gray-900">{optimizedRoute.optimized_stops.length}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-gray-900">Delivery Sequence:</p>
                
                {/* Store Start */}
                <div className="flex items-start gap-3 pl-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      S
                    </div>
                    <div className="w-0.5 h-8 bg-indigo-300"></div>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-semibold text-gray-900">Coriander Store</p>
                    <p className="text-sm text-gray-500">846-848 Wimborne Rd, Bournemouth</p>
                  </div>
                </div>

                {optimizedRoute.optimized_stops.map((stop, index) => (
                  <div key={stop.order_id} className="flex items-start gap-3 pl-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      {index < optimizedRoute.optimized_stops.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-300"></div>
                      )}
                    </div>
                    <div className="flex-1 pt-1 pb-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-900">{stop.order_number}</p>
                        <Badge variant="outline">{stop.duration_minutes} mins</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{stop.customer_name}</p>
                      <p className="text-sm text-gray-500">{stop.address}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setOptimizedRoute(null)}
                  className="flex-1"
                >
                  Change Selection
                </Button>
                <Button
                  onClick={handleStartRun}
                  disabled={createRunMutation.isPending}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {createRunMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirm & Start Delivery Run
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}