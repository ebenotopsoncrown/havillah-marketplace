import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Clock, Package, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function OrderConfirmation() {
  const [user, setUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmedItems, setConfirmedItems] = useState(new Set());
  const queryClient = useQueryClient();

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const currentUser = await base44.auth.me();
    setUser(currentUser);
    
    if (currentUser.role !== 'admin' && currentUser.department !== 'inventory_manager') {
      alert('Access denied. This page is for Admin and Inventory Managers only.');
      window.location.href = '/';
    }
  };

  const { data: pendingOrders = [], isLoading } = useQuery({
    queryKey: ['pending-orders'],
    queryFn: async () => {
      const orders = await base44.entities.Order.filter({ status: 'pending_confirmation' }, '-created_date');
      return orders;
    }
  });

  const { data: allOrderItems = [] } = useQuery({
    queryKey: ['order-items'],
    queryFn: () => base44.entities.OrderItem.list('-created_date', 1000)
  });

  const confirmOrderMutation = useMutation({
    mutationFn: async ({ orderId, orderItems }) => {
      // Update order status
      await base44.entities.Order.update(orderId, {
        status: 'confirmed',
        confirmed_by: user.email,
        confirmed_at: new Date().toISOString()
      });

      // Send confirmation email to customer
      const order = pendingOrders.find(o => o.id === orderId);
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

      return orderId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-orders'] });
      setSelectedOrder(null);
      setConfirmedItems(new Set());
    }
  });

  const getOrderItems = (orderId) => {
    return allOrderItems.filter(item => item.order_id === orderId);
  };

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
    const orderItems = getOrderItems(selectedOrder.id);
    
    if (confirmedItems.size !== orderItems.length) {
      alert('Please confirm all items before finishing.');
      return;
    }

    confirmOrderMutation.mutate({
      orderId: selectedOrder.id,
      orderItems
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmation</h1>
          <p className="text-gray-600">Review and confirm order availability and pricing</p>
        </div>

        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            Confirm product availability and verify prices before approving orders. Customers will receive an email notification once confirmed.
          </AlertDescription>
        </Alert>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : pendingOrders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No orders waiting for confirmation.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingOrders.map(order => {
              const items = getOrderItems(order.id);
              return (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{order.order_number}</CardTitle>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending Confirmation
                          </Badge>
                          <Badge variant="outline">
                            {items.length} items
                          </Badge>
                          <Badge variant="outline" className={order.delivery_type === 'delivery' ? 'bg-blue-50' : 'bg-green-50'}>
                            {order.delivery_type === 'delivery' ? 'Delivery' : 'Click & Collect'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-indigo-600">£{order.total_amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Total Amount</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-semibold">{order.customer_name}</p>
                        <p className="text-sm text-gray-600">{order.customer_email}</p>
                      </div>
                      {order.delivery_type === 'delivery' && (
                        <div>
                          <p className="text-sm text-gray-500">Delivery Address</p>
                          <p className="text-sm">{order.delivery_address}</p>
                          <p className="text-sm">{order.delivery_postcode}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="text-sm">{new Date(order.order_date).toLocaleString()}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => {
                        setSelectedOrder(order);
                        setConfirmedItems(new Set());
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Review & Confirm Order
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Confirmation Modal */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Confirm Order - {selectedOrder?.order_number}
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-4">
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-900">
                    Check each item's availability and verify pricing. Tick the checkbox once confirmed.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  {getOrderItems(selectedOrder.id).map(item => (
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
                      {confirmedItems.size} / {getOrderItems(selectedOrder.id).length}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedOrder(null)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleFinishConfirmation}
                      disabled={
                        confirmedItems.size !== getOrderItems(selectedOrder.id).length ||
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
                          Finish & Confirm Order
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}