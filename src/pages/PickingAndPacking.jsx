import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Package, Loader2, AlertCircle, Truck, Store } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PickingAndPacking() {
  const [user, setUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pickedItems, setPickedItems] = useState(new Set());
  const queryClient = useQueryClient();

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const currentUser = await base44.auth.me();
    setUser(currentUser);
    
    if (currentUser.role !== 'admin' && currentUser.department !== 'picking_and_sorting') {
      alert('Access denied. This page is for Picking & Sorting staff only.');
      window.location.href = '/';
    }
  };

  const { data: confirmedOrders = [], isLoading } = useQuery({
    queryKey: ['confirmed-orders'],
    queryFn: async () => {
      const orders = await base44.entities.Order.filter({ status: 'confirmed' }, '-confirmed_at');
      return orders;
    }
  });

  const { data: allOrderItems = [] } = useQuery({
    queryKey: ['order-items'],
    queryFn: () => base44.entities.OrderItem.list('-created_date', 1000)
  });

  const completePickingMutation = useMutation({
    mutationFn: async ({ orderId }) => {
      await base44.entities.Order.update(orderId, {
        status: 'ready',
        picked_by: user.email,
        picked_at: new Date().toISOString()
      });
      return orderId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confirmed-orders'] });
      setSelectedOrder(null);
      setPickedItems(new Set());
    }
  });

  const getOrderItems = (orderId) => {
    return allOrderItems.filter(item => item.order_id === orderId);
  };

  const handlePickItem = (itemId, checked) => {
    const newSet = new Set(pickedItems);
    if (checked) {
      newSet.add(itemId);
    } else {
      newSet.delete(itemId);
    }
    setPickedItems(newSet);
  };

  const handleFinishPicking = () => {
    const orderItems = getOrderItems(selectedOrder.id);
    
    if (pickedItems.size !== orderItems.length) {
      alert('Please pick and check all items before finishing.');
      return;
    }

    completePickingMutation.mutate({ orderId: selectedOrder.id });
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Picking & Packing</h1>
          <p className="text-gray-600">Pick and pack confirmed orders for dispatch</p>
        </div>

        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Package className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            Select orders in sequence, pick all items, pack them carefully, and mark as complete.
          </AlertDescription>
        </Alert>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : confirmedOrders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No orders waiting to be picked.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {confirmedOrders.map((order, index) => {
              const items = getOrderItems(order.id);
              return (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <CardTitle className="text-xl">{order.order_number}</CardTitle>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Confirmed
                          </Badge>
                          <Badge variant="outline">
                            {items.length} items
                          </Badge>
                          {order.delivery_type === 'delivery' ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              <Truck className="w-3 h-3 mr-1" />
                              Delivery
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700">
                              <Store className="w-3 h-3 mr-1" />
                              Click & Collect
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-indigo-600">£{order.total_amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-semibold">{order.customer_name}</p>
                      </div>
                      {order.delivery_type === 'delivery' && (
                        <div>
                          <p className="text-sm text-gray-500">Delivery Address</p>
                          <p className="text-sm">{order.delivery_address}, {order.delivery_postcode}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500">Confirmed At</p>
                        <p className="text-sm">{new Date(order.confirmed_at).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Confirmed By</p>
                        <p className="text-sm">{order.confirmed_by}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => {
                        setSelectedOrder(order);
                        setPickedItems(new Set());
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Start Picking
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Picking Modal */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Pick & Pack - {selectedOrder?.order_number}
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-4">
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-900">
                    Pick each item from inventory, verify quantity and quality, pack securely, and check the box.
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {selectedOrder.delivery_type === 'delivery' ? (
                      <>
                        <Truck className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold">Home Delivery Order</span>
                      </>
                    ) : (
                      <>
                        <Store className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold">Click & Collect Order</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.delivery_type === 'delivery' 
                      ? 'Pack for delivery - will go to Delivery page when complete'
                      : 'Pack for collection - will go to Click & Collect page when complete'}
                  </p>
                </div>

                <div className="space-y-3">
                  {getOrderItems(selectedOrder.id).map(item => (
                    <div 
                      key={item.id}
                      className={`border-2 rounded-lg p-4 transition-all ${
                        pickedItems.has(item.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={pickedItems.has(item.id)}
                          onCheckedChange={(checked) => handlePickItem(item.id, checked)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">{item.product_name}</p>
                              <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                              <p className="text-lg font-bold text-indigo-600 mt-1">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">£{item.line_total.toFixed(2)}</p>
                            </div>
                          </div>
                          {pickedItems.has(item.id) && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Picked & Packed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Items Picked:</span>
                    <span className="text-lg font-bold text-indigo-600">
                      {pickedItems.size} / {getOrderItems(selectedOrder.id).length}
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
                      onClick={handleFinishPicking}
                      disabled={
                        pickedItems.size !== getOrderItems(selectedOrder.id).length ||
                        completePickingMutation.isPending
                      }
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {completePickingMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Finish Picking
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