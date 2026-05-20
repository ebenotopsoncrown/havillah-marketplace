import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Loader2, AlertCircle, XCircle, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

export default function OrderConfirmationModal({ open, onClose, order, items }) {
  const [itemStatuses, setItemStatuses] = useState({});
  const [substitutes, setSubstitutes] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list(),
  });

  const confirmOrderMutation = useMutation({
    mutationFn: async () => {
      const unavailableItems = items.filter(item => itemStatuses[item.id] === 'unavailable');
      const confirmedItems = items.filter(item => itemStatuses[item.id] === 'available');

      // Calculate refund amount for price differences
      let totalRefundAmount = 0;
      const refundDetails = [];

      unavailableItems.forEach(item => {
        const substitute = substitutes[item.id];
        const originalPrice = item.line_total;
        
        if (substitute) {
          // Calculate substitute total
          const substituteTotalPrice = substitute.retail_price * item.quantity;
          const priceDifference = originalPrice - substituteTotalPrice;
          
          if (priceDifference > 0) {
            // Substitute is cheaper - add to refund
            totalRefundAmount += priceDifference;
            refundDetails.push({
              item: item.product_name,
              substitute: substitute.name,
              amount: priceDifference
            });
          }
        } else {
          // No substitute - full refund for this item
          totalRefundAmount += originalPrice;
          refundDetails.push({
            item: item.product_name,
            substitute: null,
            amount: originalPrice
          });
        }
      });

      // Update or delete order items based on availability
      for (const item of unavailableItems) {
        const substitute = substitutes[item.id];
        
        if (substitute) {
          // Update item with substitute product
          await base44.entities.OrderItem.update(item.id, {
            product_id: substitute.id,
            product_name: substitute.name,
            sku: substitute.sku,
            unit_price: substitute.retail_price,
            line_total: substitute.retail_price * item.quantity
          });
        } else {
          // No substitute - delete the item
          await base44.entities.OrderItem.delete(item.id);
        }
      }

      // Update order status
      await base44.entities.Order.update(order.id, {
        status: 'confirmed',
        confirmed_at: new Date().toISOString()
      });

      // Process refund if needed and payment was via card
      if (totalRefundAmount > 0 && order.stripe_payment_intent_id) {
        try {
          await base44.functions.invoke('processRefund', {
            orderId: order.id,
            amount: totalRefundAmount,
            reason: 'Item unavailable or price adjustment'
          });
        } catch (refundError) {
          console.error('Refund failed:', refundError);
          // Continue with confirmation even if refund fails
        }
      }

      // Build email body with unavailable items info
      let emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Your Order Has Been Confirmed!</h2>
          <p>Dear ${order.customer_name},</p>
          <p>Your order <strong>${order.order_number}</strong> has been reviewed and confirmed.</p>
      `;

      if (unavailableItems.length > 0) {
        emailBody += `
          <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0;">
            <h3 style="color: #92400E; margin-top: 0;">Items Not Available</h3>
            <p style="color: #78350F;">Unfortunately, the following items are currently unavailable:</p>
            <ul style="color: #78350F;">
        `;
        
        unavailableItems.forEach(item => {
          const substitute = substitutes[item.id];
          emailBody += `<li><strong>${item.product_name}</strong> (${item.quantity}x)`;
          if (substitute) {
            emailBody += `<br/><span style="color: #059669;">→ Substituted with: ${substitute.name} at £${substitute.retail_price.toFixed(2)}</span>`;
          } else {
            emailBody += ` - <em>Removed from order</em>`;
          }
          emailBody += `</li>`;
        });
        
        emailBody += `
            </ul>
          </div>
        `;

        // Add refund information if applicable
        if (totalRefundAmount > 0 && order.stripe_payment_intent_id) {
          emailBody += `
            <div style="background-color: #D1FAE5; border-left: 4px solid #059669; padding: 15px; margin: 20px 0;">
              <h3 style="color: #065F46; margin-top: 0;">Refund Processed</h3>
              <p style="color: #047857;">
                A refund of <strong>£${totalRefundAmount.toFixed(2)}</strong> has been processed to your original payment method.
              </p>
              <p style="color: #047857; font-size: 12px; margin-top: 10px;">
                The refund will appear in your account within 5-10 business days.
              </p>
            </div>
          `;
        }
      }

      emailBody += `
          <div style="background-color: #F3F4F6; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <p><strong>Confirmed Items:</strong> ${confirmedItems.length} of ${items.length}</p>
            <p><strong>Delivery Type:</strong> ${order.delivery_type === 'delivery' ? 'Home Delivery' : 'Click & Collect'}</p>
            ${order.delivery_type === 'delivery' ? `<p><strong>Delivery Address:</strong> ${order.delivery_address}</p>` : ''}
          </div>
          <p>We'll notify you when your order is ready for ${order.delivery_type === 'delivery' ? 'dispatch' : 'collection'}.</p>
          <p style="margin-top: 30px;">Thank you for shopping with Coriander!</p>
        </div>
      `;

      // Send confirmation email
      await base44.integrations.Core.SendEmail({
        to: order.customer_email,
        subject: unavailableItems.length > 0 
          ? `Order Confirmed with Changes - ${order.order_number}`
          : `Order Confirmed - ${order.order_number}`,
        body: emailBody
      });

      return order.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-items'] });
      setItemStatuses({});
      setSubstitutes({});
      setSearchTerms({});
      onClose();
    }
  });

  const handleItemStatusChange = (itemId, status) => {
    setItemStatuses({ ...itemStatuses, [itemId]: status });
    if (status === 'available') {
      // Clear substitute if marking as available
      const newSubs = { ...substitutes };
      delete newSubs[itemId];
      setSubstitutes(newSubs);
    }
  };

  const handleSelectSubstitute = (itemId, product) => {
    setSubstitutes({ ...substitutes, [itemId]: product });
    setSearchTerms({ ...searchTerms, [itemId]: '' });
  };

  const handleFinishConfirmation = () => {
    // Check all items have a status
    const unprocessedItems = items.filter(item => !itemStatuses[item.id]);
    if (unprocessedItems.length > 0) {
      alert('Please review all items before confirming.');
      return;
    }

    // Check unavailable items have substitutes selected
    const unavailableWithoutSub = items.filter(
      item => itemStatuses[item.id] === 'unavailable' && !substitutes[item.id]
    );
    if (unavailableWithoutSub.length > 0) {
      const proceed = confirm(
        `${unavailableWithoutSub.length} unavailable item(s) have no substitute. They will be removed from the order. Continue?`
      );
      if (!proceed) return;
    }

    confirmOrderMutation.mutate();
  };

  const getFilteredProducts = (itemId, searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) return [];
    return products
      .filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5);
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
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              For each item: mark as <strong>Available</strong> or <strong>Not Available</strong>. If unavailable, select a substitute product.
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

          <div className="space-y-4">
            {items.map(item => {
              const status = itemStatuses[item.id];
              const substitute = substitutes[item.id];
              const searchTerm = searchTerms[item.id] || '';
              const filteredProducts = getFilteredProducts(item.id, searchTerm);

              return (
                <div 
                  key={item.id}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    status === 'available'
                      ? 'border-green-500 bg-green-50'
                      : status === 'unavailable'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Item Info */}
                    <div className="flex items-start justify-between">
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

                    {/* Status Selection */}
                    <RadioGroup
                      value={status}
                      onValueChange={(value) => handleItemStatusChange(item.id, value)}
                    >
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="available" id={`available-${item.id}`} />
                          <Label htmlFor={`available-${item.id}`} className="flex items-center gap-1 cursor-pointer">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Available
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="unavailable" id={`unavailable-${item.id}`} />
                          <Label htmlFor={`unavailable-${item.id}`} className="flex items-center gap-1 cursor-pointer">
                            <XCircle className="w-4 h-4 text-orange-600" />
                            Not Available
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>

                    {/* Status Badge */}
                    {status === 'available' && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Confirmed Available
                      </Badge>
                    )}

                    {/* Substitute Selection */}
                    {status === 'unavailable' && (
                      <div className="space-y-2 border-t border-orange-300 pt-3 mt-2">
                        <Label className="text-sm font-medium text-orange-900">
                          Select Substitute (Optional)
                        </Label>
                        {substitute ? (
                          <div className="bg-white border border-green-300 rounded-lg p-3 flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-green-900">{substitute.name}</p>
                              <p className="text-sm text-green-700">£{substitute.retail_price.toFixed(2)} - SKU: {substitute.sku}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newSubs = { ...substitutes };
                                delete newSubs[item.id];
                                setSubstitutes(newSubs);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              placeholder="Search for substitute product..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerms({ ...searchTerms, [item.id]: e.target.value })}
                              className="pl-9"
                            />
                            {filteredProducts.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {filteredProducts.map(product => (
                                  <button
                                    key={product.id}
                                    type="button"
                                    onClick={() => handleSelectSubstitute(item.id, product)}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                  >
                                    <p className="font-medium text-gray-900">{product.name}</p>
                                    <p className="text-sm text-gray-600">
                                      £{product.retail_price.toFixed(2)} - {product.sku}
                                    </p>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{items.length}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-green-700">Available</p>
                <p className="text-2xl font-bold text-green-600">
                  {Object.values(itemStatuses).filter(s => s === 'available').length}
                </p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-orange-700">Unavailable</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Object.values(itemStatuses).filter(s => s === 'unavailable').length}
                </p>
              </div>
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
                  Object.keys(itemStatuses).length !== items.length ||
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
                    Confirm & Send Email
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