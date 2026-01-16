import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Store, 
  Package, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Search,
  Phone,
  Mail,
  User,
  ShoppingBag
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function ClickAndCollect() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmingOrder, setConfirmingOrder] = useState(null);
  const [orderNotes, setOrderNotes] = useState('');
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: () => base44.entities.Order.list('-order_date'),
  });

  const { data: orderItems = [] } = useQuery({
    queryKey: ['order-items'],
    queryFn: () => base44.entities.OrderItem.list(),
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Order.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  // Filter only click & collect orders
  const clickCollectOrders = orders.filter(o => o.delivery_type === 'click_and_collect');

  // Filter by status
  const filteredOrders = clickCollectOrders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Status counts
  const pendingCount = clickCollectOrders.filter(o => o.status === 'pending').length;
  const pickingCount = clickCollectOrders.filter(o => o.status === 'picking').length;
  const readyCount = clickCollectOrders.filter(o => o.status === 'ready').length;
  const collectedCount = clickCollectOrders.filter(o => o.status === 'delivered').length;

  const getOrderItems = (orderId) => {
    return orderItems.filter(item => item.order_id === orderId);
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    updateOrderMutation.mutate({
      id: orderId,
      data: { status: newStatus }
    });
  };

  const handleStartPicking = (order) => {
    handleStatusUpdate(order.id, 'picking');
  };

  const handleMarkReady = (order) => {
    setConfirmingOrder(order);
    setOrderNotes('');
  };

  const handleConfirmReady = async () => {
    if (confirmingOrder) {
      const updateData = {
        status: 'ready',
        ...(orderNotes && { notes: orderNotes })
      };
      
      await updateOrderMutation.mutateAsync({
        id: confirmingOrder.id,
        data: updateData
      });

      // Send notification email if there are notes
      if (orderNotes) {
        try {
          await base44.integrations.Core.SendEmail({
            to: confirmingOrder.customer_email,
            subject: `Order ${confirmingOrder.order_number} Ready for Collection - Important Note`,
            body: `
              Dear ${confirmingOrder.customer_name},
              
              Your order ${confirmingOrder.order_number} is ready for collection!
              
              IMPORTANT NOTE:
              ${orderNotes}
              
              Please collect your order at:
              Coriander Cash & Carry
              846-848 Wimborne Rd, Moordown, Bournemouth BH9 2DS
              
              If you have any questions, please contact us.
              
              Thank you for shopping with us!
            `
          });
        } catch (error) {
          console.error('Failed to send notification:', error);
        }
      }

      setConfirmingOrder(null);
      setOrderNotes('');
    }
  };

  const handleCollected = (orderId) => {
    handleStatusUpdate(orderId, 'delivered');
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    picking: 'bg-blue-100 text-blue-800',
    ready: 'bg-green-100 text-green-800',
    delivered: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Store className="w-8 h-8 text-green-600" />
          Click & Collect Orders
        </h1>
        <p className="text-gray-600 mt-1">Manage in-store pickup orders</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Picking</p>
                <p className="text-3xl font-bold text-blue-600">{pickingCount}</p>
              </div>
              <Package className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ready</p>
                <p className="text-3xl font-bold text-green-600">{readyCount}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Collected</p>
                <p className="text-3xl font-bold text-gray-600">{collectedCount}</p>
              </div>
              <ShoppingBag className="w-10 h-10 text-gray-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by order number or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('all')}
          >
            All
          </Button>
          <Button
            variant={selectedStatus === 'pending' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('pending')}
          >
            Pending
          </Button>
          <Button
            variant={selectedStatus === 'picking' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('picking')}
          >
            Picking
          </Button>
          <Button
            variant={selectedStatus === 'ready' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('ready')}
          >
            Ready
          </Button>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid gap-4">
        {filteredOrders.map(order => {
          const items = getOrderItems(order.id);
          return (
            <Card key={order.id} className="border-2">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">Order #{order.order_number}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {order.customer_name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {order.customer_phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {order.customer_email}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={statusColors[order.status]}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <p className="text-2xl font-bold text-gray-900 mt-2">£{order.total_amount?.toFixed(2)}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Items */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Items ({items.length})</h4>
                  <div className="space-y-2">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.product_name}</span>
                        <span className="font-medium">£{item.line_total?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-amber-900">Order Notes</p>
                        <p className="text-sm text-amber-800">{order.notes}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <Button
                      onClick={() => handleStartPicking(order)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Start Picking
                    </Button>
                  )}

                  {order.status === 'picking' && (
                    <Button
                      onClick={() => handleMarkReady(order)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Ready
                    </Button>
                  )}

                  {order.status === 'ready' && (
                    <Button
                      onClick={() => handleCollected(order.id)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Mark as Collected
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredOrders.length === 0 && (
          <Card className="p-12 text-center">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No orders found</p>
          </Card>
        )}
      </div>

      {/* Confirm Ready Dialog */}
      <Dialog open={!!confirmingOrder} onOpenChange={() => setConfirmingOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Order Ready</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are all items picked and ready for collection for order #{confirmingOrder?.order_number}?
            </p>
            
            <div className="space-y-2">
              <Label>Notes (Optional - e.g., out of stock items, substitutions)</Label>
              <Textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Any items out of stock? Substitutions made? Customer will be notified by email..."
                rows={4}
              />
              <p className="text-xs text-gray-500">
                If you add notes, the customer will receive an email notification
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmingOrder(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReady} className="bg-green-600 hover:bg-green-700">
              Confirm Ready
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}