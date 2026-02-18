import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import AdminGuard from "../components/AdminGuard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

import OrderDetailsCard from "../components/orders/OrderDetailsCard";
import OrderConfirmationModal from "../components/orders/OrderConfirmationModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmingOrder, setConfirmingOrder] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => base44.entities.Order.list('-created_date'),
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

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId) => {
      return base44.functions.invoke('cancelOrder', {
        orderId,
        cancelledBy: 'staff',
        reason: 'Cancelled by store staff'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setCancellingOrder(null);
    },
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === "" ||
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getOrderItems = (orderId) => {
    return orderItems.filter(item => item.order_id === orderId);
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderMutation.mutate({ id: orderId, data: { status: newStatus } });
  };

  const statusColors = {
    pending_confirmation: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    picking: "bg-purple-100 text-purple-800 border-purple-200",
    ready: "bg-indigo-100 text-indigo-800 border-indigo-200",
    dispatched: "bg-orange-100 text-orange-800 border-orange-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200"
  };

  const pendingOrders = orders.filter(o => ['pending_confirmation', 'confirmed'].includes(o.status));
  const activeOrders = orders.filter(o => ['picking', 'ready', 'dispatched'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'delivered');

  return (
    <AdminGuard><div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">Track and manage online orders</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{pendingOrders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{activeOrders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{completedOrders.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending_confirmation">Pending Confirmation</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="picking">Picking</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="dispatched">Dispatched</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No orders found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer bg-white"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{order.order_number}</h3>
                          <Badge className={`${statusColors[order.status]} border`}>
                            {order.status === 'pending_confirmation' ? 'pending' : order.status}
                          </Badge>
                          {order.delivery_type === "delivery" ? (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Truck className="w-3 h-3" />
                              Delivery
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              Collection
                            </Badge>
                          )}
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Customer</p>
                            <p className="font-medium">{order.customer_name}</p>
                            <p className="text-gray-500">{order.customer_phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Order Date</p>
                            <p className="font-medium">{format(new Date(order.created_date), 'dd MMM yyyy HH:mm')}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Delivery</p>
                            <p className="font-medium">{order.delivery_slot || 'TBC'}</p>
                            {order.delivery_postcode && (
                              <p className="text-gray-500">{order.delivery_postcode}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <p className="text-2xl font-bold text-indigo-600">£{order.total_amount?.toFixed(2)}</p>
                        <div className="flex gap-2">
                          {order.status === 'pending_confirmation' && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmingOrder(order);
                              }}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Confirm Order
                            </Button>
                          )}
                          {!['delivered', 'cancelled'].includes(order.status) && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCancellingOrder(order);
                              }}
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedOrder && (
          <OrderDetailsCard
            order={selectedOrder}
            items={getOrderItems(selectedOrder.id)}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={(orderId, newStatus) => {
              handleStatusChange(orderId, newStatus);
              setSelectedOrder(null);
            }}
            onConfirmOrder={(order) => {
              setSelectedOrder(null);
              setConfirmingOrder(order);
            }}
          />
        )}

        {confirmingOrder && (
          <OrderConfirmationModal
            open={!!confirmingOrder}
            onClose={() => setConfirmingOrder(null)}
            order={confirmingOrder}
            items={getOrderItems(confirmingOrder.id)}
          />
        )}

        <AlertDialog open={!!cancellingOrder} onOpenChange={() => setCancellingOrder(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel order <strong>{cancellingOrder?.order_number}</strong>?
                {cancellingOrder?.stripe_payment_intent_id && (
                  <span className="block mt-2 text-green-700 font-medium">
                    ✓ A full refund of £{cancellingOrder?.total_amount?.toFixed(2)} will be processed automatically.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Order</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => cancelOrderMutation.mutate(cancellingOrder.id)}
                className="bg-red-600 hover:bg-red-700"
                disabled={cancelOrderMutation.isPending}
              >
                {cancelOrderMutation.isPending ? 'Cancelling...' : 'Yes, Cancel Order'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div></AdminGuard>
  );
}