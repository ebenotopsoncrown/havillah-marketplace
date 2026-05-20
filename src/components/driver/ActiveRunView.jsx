import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  MapPin, 
  Clock, 
  Package, 
  CheckCircle, 
  Navigation,
  Phone,
  Flag,
  AlertCircle
} from "lucide-react";
import DeliveryConfirmationModal from "./DeliveryConfirmationModal";

export default function ActiveRunView({ run, driver }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const queryClient = useQueryClient();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch orders in this run
  const { data: orders = [] } = useQuery({
    queryKey: ['run-orders', run.id],
    queryFn: async () => {
      const orderPromises = run.order_ids.map(id => 
        base44.entities.Order.get(id)
      );
      return Promise.all(orderPromises);
    },
    enabled: !!run.order_ids?.length,
  });

  const completeRunMutation = useMutation({
    mutationFn: async () => {
      // Validation: Ensure all stops are completed
      if (!run.delivery_stops || run.delivery_stops.length === 0) {
        throw new Error('Cannot complete run with no delivery stops');
      }
      
      const incompleteStops = run.delivery_stops.filter(s => !s.completion_time);
      if (incompleteStops.length > 0) {
        throw new Error(`Cannot complete run. ${incompleteStops.length} stops still pending.`);
      }

      const endTime = new Date().toISOString();
      const startTime = new Date(run.start_time);
      const duration = (new Date(endTime) - startTime) / 60000; // minutes

      await base44.entities.DeliveryRun.update(run.id, {
        status: 'completed',
        end_time: endTime,
        total_duration_minutes: Math.ceil(duration)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-runs'] });
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  const elapsedTime = Math.floor((currentTime - new Date(run.start_time)) / 1000);
  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = elapsedTime % 60;

  const completedStops = run.delivery_stops?.filter(s => s.completion_time) || [];
  const pendingStops = run.delivery_stops?.filter(s => !s.completion_time) || [];

  // Safety check: If run has no delivery stops, show error
  if (!run.delivery_stops || run.delivery_stops.length === 0) {
    return (
      <Card className="border-2 border-red-200 bg-red-50">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-900 mb-2">Invalid Delivery Run</h3>
          <p className="text-red-700 mb-4">
            This delivery run has no stops loaded. Please contact dispatch or start a new run.
          </p>
          <Button
            onClick={() => completeRunMutation.mutate()}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            Cancel This Run
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timer & Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-2 border-indigo-200 bg-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <p className="text-sm font-medium text-indigo-900">Elapsed Time</p>
            </div>
            <p className="text-3xl font-bold text-indigo-600">
              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-gray-700">Completed</p>
            </div>
            <p className="text-3xl font-bold text-green-600">{completedStops.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-orange-600" />
              <p className="text-sm font-medium text-gray-700">Remaining</p>
            </div>
            <p className="text-3xl font-bold text-orange-600">{pendingStops.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-medium text-gray-700">Distance</p>
            </div>
            <p className="text-3xl font-bold text-blue-600">{run.total_distance_miles}</p>
            <p className="text-xs text-gray-500">miles</p>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Stops */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Delivery Route
            </span>
            {pendingStops.length === 0 && run.delivery_stops?.length > 0 && (
              <Button
                onClick={() => {
                  if (window.confirm('Are you sure you want to complete this delivery run? All stops have been delivered.')) {
                    completeRunMutation.mutate();
                  }
                }}
                className="bg-green-600 hover:bg-green-700"
                disabled={completeRunMutation.isPending}
              >
                <Flag className="w-4 h-4 mr-2" />
                Complete Run
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {run.delivery_stops?.map((stop, index) => {
            const order = orders.find(o => o.id === stop.order_id);
            const isCompleted = !!stop.completion_time;
            const isNext = !isCompleted && completedStops.length === index;

            return (
              <div 
                key={stop.order_id}
                className={`border-2 rounded-lg p-4 transition-all ${
                  isCompleted 
                    ? 'border-green-200 bg-green-50' 
                    : isNext
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    isCompleted 
                      ? 'bg-green-600 text-white' 
                      : isNext
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : stop.sequence}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-900">{order?.order_number}</p>
                        <p className="text-sm text-gray-600">{stop.customer_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-indigo-600">£{order?.total_amount.toFixed(2)}</p>
                        {isCompleted && (
                          <Badge className="bg-green-100 text-green-700 mt-1">Delivered</Badge>
                        )}
                        {isNext && (
                          <Badge className="bg-indigo-100 text-indigo-700 mt-1">Next Stop</Badge>
                        )}
                      </div>
                    </div>

                    {stop.delivery_slot && (
                      <Badge className="bg-blue-100 text-blue-700 mb-2">
                        <Clock className="w-3 h-3 mr-1" />
                        {stop.delivery_slot}
                      </Badge>
                    )}

                    <p className="text-sm text-gray-700 flex items-start gap-2 mb-3">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                      {stop.address}
                    </p>

                    {order?.customer_phone && (
                      <p className="text-sm text-gray-600 flex items-center gap-2 mb-3">
                        <Phone className="w-4 h-4" />
                        {order.customer_phone}
                      </p>
                    )}

                    {isCompleted ? (
                      <div className="text-sm text-gray-600">
                        <p>Delivered at: {new Date(stop.completion_time).toLocaleTimeString()}</p>
                        {stop.duration_minutes && (
                          <p>Time taken: {stop.duration_minutes} minutes</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-3">
                        <Button
                          onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stop.address)}`)}
                          variant="outline"
                          size="sm"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Navigate
                        </Button>
                        <Button
                          onClick={() => setSelectedOrder(order)}
                          disabled={!isNext}
                          className="bg-indigo-600 hover:bg-indigo-700"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete Delivery
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {selectedOrder && (
        <DeliveryConfirmationModal
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
          run={run}
        />
      )}
    </div>
  );
}