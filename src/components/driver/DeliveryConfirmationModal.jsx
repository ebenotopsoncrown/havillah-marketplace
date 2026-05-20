import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Package, User, Loader2 } from "lucide-react";

export default function DeliveryConfirmationModal({ open, onClose, order, run }) {
  const [notes, setNotes] = useState('');
  const [customerName, setCustomerName] = useState('');
  const queryClient = useQueryClient();

  const completeDeliveryMutation = useMutation({
    mutationFn: async () => {
      const completionTime = new Date().toISOString();
      
      // Find this stop in the run
      const stopIndex = run.delivery_stops.findIndex(s => s.order_id === order.id);
      const stop = run.delivery_stops[stopIndex];
      
      // Calculate duration
      const arrivalTime = stop.arrival_time || run.start_time;
      const duration = Math.ceil((new Date(completionTime) - new Date(arrivalTime)) / 60000);
      
      // Update stop details
      const updatedStops = [...run.delivery_stops];
      updatedStops[stopIndex] = {
        ...stop,
        completion_time: completionTime,
        duration_minutes: duration,
        notes: notes,
        customer_signature: customerName
      };
      
      // Update the delivery run
      await base44.entities.DeliveryRun.update(run.id, {
        delivery_stops: updatedStops
      });
      
      // Update order status
      await base44.entities.Order.update(order.id, {
        status: 'delivered'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-runs'] });
      queryClient.invalidateQueries({ queryKey: ['run-orders'] });
      setNotes('');
      setCustomerName('');
      onClose();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            Confirm Delivery
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-gray-600" />
              <p className="font-semibold text-gray-900">{order.order_number}</p>
            </div>
            <p className="text-sm text-gray-600">{order.customer_name}</p>
            <p className="text-sm text-gray-500">{order.delivery_address}</p>
            <p className="font-bold text-indigo-600 mt-2">£{order.total_amount.toFixed(2)}</p>
          </div>

          {/* Customer Confirmation */}
          <div className="space-y-2">
            <Label htmlFor="customer_name">
              <User className="w-4 h-4 inline mr-2" />
              Received by (Name) *
            </Label>
            <input
              id="customer_name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer's name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Delivery Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Delivery Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about this delivery..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={completeDeliveryMutation.isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => completeDeliveryMutation.mutate()}
              disabled={!customerName || completeDeliveryMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {completeDeliveryMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirm Delivery
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}