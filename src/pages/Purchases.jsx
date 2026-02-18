import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import AdminGuard from "../components/AdminGuard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Package, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

import PurchaseOrderModal from "../components/purchases/PurchaseOrderModal";
import ReceiveInventoryModal from "../components/purchases/ReceiveInventoryModal";

export default function Purchases() {
  const [showPOForm, setShowPOForm] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const queryClient = useQueryClient();

  const { data: purchaseOrders = [] } = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: () => base44.entities.PurchaseOrder.list('-created_date'),
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => base44.entities.Supplier.list(),
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list(),
  });

  const handleReceive = (po) => {
    setSelectedPO(po);
    setShowReceive(true);
  };

  const pendingPOs = purchaseOrders.filter(po => po.status === 'approved' || po.status === 'sent');
  const receivedPOs = purchaseOrders.filter(po => po.status === 'received');

  return (
    <AdminGuard><div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Orders & Inventory Receiving</h1>
            <p className="text-gray-600">Manage supplier purchases and receive inventory</p>
          </div>
          <Button
            onClick={() => setShowPOForm(true)}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Purchase Order
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total POs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{purchaseOrders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">{pendingPOs.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Received</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{receivedPOs.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-indigo-600">
                £{purchaseOrders.reduce((sum, po) => sum + (po.total_amount || 0), 0).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Orders Table */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Purchase Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>PO Number</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No purchase orders yet</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    purchaseOrders.map((po) => (
                      <TableRow key={po.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono font-medium">{po.po_number}</TableCell>
                        <TableCell>{format(new Date(po.created_date), 'dd MMM yyyy')}</TableCell>
                        <TableCell>{po.supplier_name}</TableCell>
                        <TableCell>
                          {po.expected_delivery_date ? format(new Date(po.expected_delivery_date), 'dd MMM yyyy') : 'TBD'}
                        </TableCell>
                        <TableCell className="font-semibold">£{po.total_amount?.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              po.status === 'received' ? 'default' :
                              po.status === 'sent' ? 'secondary' :
                              'outline'
                            }
                            className={
                              po.status === 'received' ? 'bg-green-100 text-green-700' :
                              po.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                              ''
                            }
                          >
                            {po.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {(po.status === 'approved' || po.status === 'sent') && (
                            <Button
                              size="sm"
                              onClick={() => handleReceive(po)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Receive
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <PurchaseOrderModal
        open={showPOForm}
        onClose={() => setShowPOForm(false)}
        suppliers={suppliers}
        products={products}
      />

      <ReceiveInventoryModal
        open={showReceive}
        onClose={() => {
          setShowReceive(false);
          setSelectedPO(null);
        }}
        purchaseOrder={selectedPO}
        products={products}
      />
    </div></AdminGuard>
  );
}