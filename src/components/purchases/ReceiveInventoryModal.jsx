import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ReceiveInventoryModal({ open, onClose, purchaseOrder, products }) {
  const [receivedQuantities, setReceivedQuantities] = useState({});
  const [completed, setCompleted] = useState(false);
  const queryClient = useQueryClient();

  const { data: poItems = [] } = useQuery({
    queryKey: ['po-items', purchaseOrder?.id],
    queryFn: () => base44.entities.PurchaseOrderItem.list(),
    enabled: !!purchaseOrder
  });

  const currentPOItems = poItems.filter(item => item.po_id === purchaseOrder?.id);

  useEffect(() => {
    if (currentPOItems.length > 0) {
      const initial = {};
      currentPOItems.forEach(item => {
        initial[item.id] = item.quantity_ordered;
      });
      setReceivedQuantities(initial);
    }
  }, [currentPOItems.length, purchaseOrder]);

  const receiveInventoryMutation = useMutation({
    mutationFn: async (data) => {
      // Update each PO item with received quantity
      for (const itemId in data.receivedQuantities) {
        const item = currentPOItems.find(i => i.id === itemId);
        if (item) {
          await base44.entities.PurchaseOrderItem.update(itemId, {
            quantity_received: data.receivedQuantities[itemId]
          });

          // Update product stock
          const product = products.find(p => p.id === item.product_id);
          if (product) {
            const newStock = (product.stock_quantity || 0) + data.receivedQuantities[itemId];
            await base44.entities.Product.update(product.id, {
              stock_quantity: newStock
            });
          }
        }
      }

      // Update PO status
      await base44.entities.PurchaseOrder.update(data.poId, {
        status: "received",
        received_date: new Date().toISOString().split('T')[0]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['po-items'] });
      setCompleted(true);
      setTimeout(() => {
        setCompleted(false);
        onClose();
      }, 2000);
    },
  });

  const handleReceive = () => {
    receiveInventoryMutation.mutate({
      poId: purchaseOrder.id,
      receivedQuantities
    });
  };

  if (completed) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Inventory Received!</h2>
            <p className="text-gray-600">Stock levels have been updated</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!purchaseOrder) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Package className="w-6 h-6" />
            Receive Inventory - {purchaseOrder.po_number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* PO Info */}
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Supplier</p>
              <p className="font-semibold">{purchaseOrder.supplier_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">PO Date</p>
              <p className="font-semibold">{new Date(purchaseOrder.created_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="font-semibold">£{purchaseOrder.total_amount?.toFixed(2)}</p>
            </div>
          </div>

          {/* Items to Receive */}
          <div>
            <Label className="text-lg mb-3 block">Items to Receive</Label>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Ordered</TableHead>
                    <TableHead>Receiving</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPOItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.quantity_ordered}</Badge>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max={item.quantity_ordered}
                          value={receivedQuantities[item.id] || 0}
                          onChange={(e) => setReceivedQuantities({
                            ...receivedQuantities,
                            [item.id]: parseInt(e.target.value) || 0
                          })}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>£{item.unit_cost?.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">
                        £{((receivedQuantities[item.id] || 0) * item.unit_cost).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Received quantities will be added to your inventory stock levels immediately.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={receiveInventoryMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleReceive}
            disabled={receiveInventoryMutation.isPending}
            className="bg-gradient-to-r from-green-600 to-green-700"
          >
            {receiveInventoryMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Receiving...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Receive Inventory
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}