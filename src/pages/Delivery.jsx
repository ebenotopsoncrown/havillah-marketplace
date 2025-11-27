import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Truck, MapPin, Clock, CheckCircle, Package, Navigation, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DeliveryMap from "../components/delivery/DeliveryMap";

export default function Delivery() {
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showMap, setShowMap] = useState(false);
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

  const deliveryOrders = orders.filter(o => o.delivery_type === "delivery");

  const filteredOrders = deliveryOrders.filter(order => {
    if (statusFilter === "pending") {
      return ["pending", "confirmed", "picking", "ready"].includes(order.status);
    } else if (statusFilter === "in_transit") {
      return order.status === "dispatched";
    } else if (statusFilter === "completed") {
      return order.status === "delivered";
    }
    return true;
  });

  const getOrderItems = (orderId) => {
    return orderItems.filter(item => item.order_id === orderId);
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderMutation.mutate({ id: orderId, data: { status: newStatus } });
  };

  const pendingDeliveries = deliveryOrders.filter(o => ["pending", "confirmed", "picking", "ready"].includes(o.status));
  const inTransit = deliveryOrders.filter(o => o.status === "dispatched");
  const completedToday = deliveryOrders.filter(o => {
    if (o.status !== "delivered") return false;
    const deliveredDate = new Date(o.updated_date);
    const today = new Date();
    return deliveredDate.toDateString() === today.toDateString();
  });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    picking: "bg-purple-100 text-purple-800 border-purple-200",
    ready: "bg-indigo-100 text-indigo-800 border-indigo-200",
    dispatched: "bg-orange-100 text-orange-800 border-orange-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Management</h1>
          <p className="text-gray-600">Track and manage delivery operations</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{pendingDeliveries.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">In Transit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">{inTransit.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Completed Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{completedToday.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{deliveryOrders.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Delivery Queue</h2>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending Pickup</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No deliveries in this category</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const items = getOrderItems(order.id);
                  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

                  return (
                    <Card key={order.id} className="border-2 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Left: Order Info */}
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-bold text-lg">{order.order_number}</h3>
                                  <Badge className={`${statusColors[order.status]} border`}>
                                    {order.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Ordered: {format(new Date(order.created_date), 'dd MMM yyyy HH:mm')}
                                </p>
                              </div>
                              <p className="text-2xl font-bold text-indigo-600">
                                £{order.total_amount?.toFixed(2)}
                              </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Package className="w-4 h-4" />
                                  <span className="font-semibold">{itemsCount} items</span>
                                </div>
                                <div className="flex items-start gap-2 text-sm">
                                  <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-gray-900">{order.customer_name}</p>
                                    <p className="text-gray-600">{order.delivery_address}</p>
                                    <p className="text-gray-600">{order.delivery_postcode}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="w-4 h-4 text-gray-600" />
                                  <span className="text-gray-600">
                                    Slot: <span className="font-medium text-gray-900">{order.delivery_slot || 'ASAP'}</span>
                                  </span>
                                </div>
                                <div className="text-sm">
                                  <p className="text-gray-600">Contact:</p>
                                  <p className="font-medium text-gray-900">{order.customer_phone}</p>
                                </div>
                              </div>
                            </div>

                            {order.notes && (
                              <div className="pt-4 border-t">
                                <p className="text-sm text-gray-600 mb-1">Notes:</p>
                                <p className="text-sm text-gray-900 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                  {order.notes}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Right: Actions */}
                          <div className="lg:w-64 flex flex-col gap-2">
                            {order.status === "ready" && (
                              <Button
                                onClick={() => handleStatusChange(order.id, "dispatched")}
                                className="w-full bg-gradient-to-r from-orange-600 to-orange-700"
                              >
                                <Truck className="w-4 h-4 mr-2" />
                                Dispatch for Delivery
                              </Button>
                            )}
                            {order.status === "dispatched" && (
                              <Button
                                onClick={() => handleStatusChange(order.id, "delivered")}
                                className="w-full bg-gradient-to-r from-green-600 to-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Delivered
                              </Button>
                            )}
                            {["pending", "confirmed"].includes(order.status) && (
                              <Button
                                onClick={() => handleStatusChange(order.id, "picking")}
                                variant="outline"
                                className="w-full"
                              >
                                Start Picking
                              </Button>
                            )}
                            {order.status === "picking" && (
                              <Button
                                onClick={() => handleStatusChange(order.id, "ready")}
                                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700"
                              >
                                Mark as Ready
                              </Button>
                            )}
                            <Button variant="outline" className="w-full">
                              View Details
                            </Button>
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowMap(true);
                              }}
                            >
                              <Navigation className="w-4 h-4 mr-2" />
                              View Route & Map
                            </Button>
                          </div>
                        </div>

                        {/* Items Preview */}
                        <div className="mt-6 pt-6 border-t">
                          <p className="text-sm font-semibold text-gray-700 mb-3">Order Items:</p>
                          <div className="grid md:grid-cols-3 gap-3">
                            {items.slice(0, 6).map((item) => (
                              <div key={item.id} className="text-sm bg-gray-50 p-3 rounded-lg">
                                <p className="font-medium text-gray-900">{item.product_name}</p>
                                <p className="text-gray-600">Qty: {item.quantity} × £{item.unit_price?.toFixed(2)}</p>
                              </div>
                            ))}
                            {items.length > 6 && (
                              <div className="text-sm bg-gray-50 p-3 rounded-lg flex items-center justify-center text-gray-600">
                                +{items.length - 6} more items
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Route Map Modal */}
      <Dialog open={showMap} onOpenChange={setShowMap}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Delivery Route - {selectedOrder?.order_number}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customer_phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Delivery Address</p>
                  <p className="font-semibold">{selectedOrder.delivery_address}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.delivery_postcode}</p>
                </div>
              </div>
              <DeliveryMap order={selectedOrder} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}