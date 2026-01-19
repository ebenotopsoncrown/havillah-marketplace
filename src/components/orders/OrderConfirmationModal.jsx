import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Loader2, AlertCircle, Package } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function OrderConfirmationModal({ open, onClose, order, items }) {
  const [confirmedItems, setConfirmedItems] = useState(new Set());
  const queryClient = useQueryClient();

  const confirmOrderMutation = useMutation({
    mutationFn: async () => {
      // Update order status
      await base44.entities.Order.update(order.id, {
        status: 'confirmed',
        confirmed_at: new Date().toISOString()
      });

      // Send confirmation email to customer
      await base44.integrations.Core.SendEmail({
        to: order.customer_email,
        subject: `Order Confirmed - ${order.order_number}`,
        body: `
          <h2>Your Order Has Been Confirmed!</h2>
          <p>Dear ${order.customer_name},</p>
          <p>Great news! Your order <strong>${order.order_number}</strong> has been confirmed and is being prepared.</p>
          <p><strong>Order Total:</strong> £${order.total_amount.toFixed(2)}</p>
          <p><strong>Delivery Type:</strong> ${order.delivery_type === 'delivery' ? 'Home Delivery' : 'Click & Collect'}</p>
          ${order.delivery_type === 'delivery' ? `<p><strong>Delivery Address:</strong> ${order.delivery_address}</p>` : ''}
          <p>We'll notify you when your order is ready for ${order.delivery_type === 'delivery' ? 'dispatch' : 'collection'}.</p>
          <p>Thank you for shopping with Coriander!</p>
        `
      });

      return order.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setConfirmedItems(new Set());
      onClose();
    }
  });

  const handleConfirmItem = (itemId, checked) => {
    const newSet = new Set(confirmedItems);
    if (checked) {
      newSet.add(itemId);
    } else {
      newSet.delete(itemId);
    }
    setConfirmedItems(newSet);
  };

  const handleFinishConfirmation = () => {
    if (confirmedItems.size !== items.length) {
      alert('Please confirm all items before finishing.');
      return;
    }

    confirmOrderMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Confirm Order - {order?.order_number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-900">
              Check each item's availability and verify pricing. Tick the checkbox once confirmed.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Customer</p>
                <p className="font-semibold">{order.customer_name}</p>
                <p className="text-gray-600">{order.customer_email}</p>
              </div>
              <div>
                <p className="text-gray-600">Order Total</p>
                <p className="text-2xl font-bold text-indigo-600">£{order.total_amount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {items.map(item => (
              <div 
                key={item.id}
                className={`border-2 rounded-lg p-4 transition-all ${
                  confirmedItems.has(item.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={confirmedItems.has(item.id)}
                    onCheckedChange={(checked) => handleConfirmItem(item.id, checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{item.product_name}</p>
                        <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-indigo-600">£{item.line_total.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × £{item.unit_price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {confirmedItems.has(item.id) && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Confirmed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Items Confirmed:</span>
              <span className="text-lg font-bold text-indigo-600">
                {confirmedItems.size} / {items.length}
              </span>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleFinishConfirmation}
                disabled={
                  confirmedItems.size !== items.length ||
                  confirmOrderMutation.isPending
                }
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {confirmOrderMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Confirm Order
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}