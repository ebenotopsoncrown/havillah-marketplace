import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Package, CheckCircle, Truck } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OrderDetailsCard({ order, items, onClose, onStatusChange }) {
  const statusColors = {
    pending_confirmation: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    picking: "bg-purple-100 text-purple-800 border-purple-200",
    ready: "bg-indigo-100 text-indigo-800 border-indigo-200",
    dispatched: "bg-orange-100 text-orange-800 border-orange-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200"
  };
  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Order Details</CardTitle>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-sm text-gray-600">{order.order_number}</p>
              <Badge className={`${statusColors[order.status]} border`}>
                {order.status.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{order.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{order.customer_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{order.customer_phone}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Delivery Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{order.delivery_type}</span>
              </div>
              {order.delivery_type === "delivery" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium text-right max-w-xs">{order.delivery_address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Postcode:</span>
                    <span className="font-medium">{order.delivery_postcode}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Slot:</span>
                <span className="font-medium">{order.delivery_slot || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Order Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.product_name}</TableCell>
                  <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>£{item.unit_price?.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold">£{item.line_total?.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="space-y-2 max-w-md ml-auto">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">£{order.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">VAT:</span>
              <span className="font-medium">£{order.vat_amount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Charge:</span>
              <span className="font-medium">£{order.delivery_charge?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t">
              <span>Total:</span>
              <span className="text-indigo-600">£{order.total_amount?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-sm">Order Notes</h3>
            <p className="text-sm text-gray-700">{order.notes}</p>
          </div>
        )}

        {/* Action Buttons Based on Status */}
        {onStatusChange && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3">Order Actions</h3>
            <div className="flex gap-3">
              {order.status === 'confirmed' && (
                <Button
                  onClick={() => onStatusChange(order.id, 'picking')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Start Picking
                </Button>
              )}
              {order.status === 'picking' && (
                <Button
                  onClick={() => onStatusChange(order.id, 'ready')}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Ready
                </Button>
              )}
              {order.status === 'ready' && order.delivery_type === 'delivery' && (
                <Button
                  onClick={() => onStatusChange(order.id, 'dispatched')}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Mark as Dispatched
                </Button>
              )}
              {order.status === 'dispatched' && (
                <Button
                  onClick={() => onStatusChange(order.id, 'delivered')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Delivered
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}