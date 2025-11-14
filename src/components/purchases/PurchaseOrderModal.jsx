import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PurchaseOrderModal({ open, onClose, suppliers, products }) {
  const [formData, setFormData] = useState({
    supplier_id: "",
    expected_delivery_date: "",
    notes: ""
  });
  const [items, setItems] = useState([]);
  const queryClient = useQueryClient();

  const createPOMutation = useMutation({
    mutationFn: async (data) => {
      const po = await base44.entities.PurchaseOrder.create(data.po);
      for (const item of data.items) {
        await base44.entities.PurchaseOrderItem.create({ ...item, po_id: po.id });
      }
      return po;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      handleClose();
    },
  });

  const addItem = () => {
    setItems([...items, {
      product_id: "",
      quantity_ordered: 1,
      unit_cost: 0
    }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    
    if (field === 'product_id') {
      const product = products.find(p => p.id === value);
      if (product) {
        updated[index].unit_cost = product.cost_price || 0;
      }
    }
    
    setItems(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const supplier = suppliers.find(s => s.id === formData.supplier_id);
    const totalAmount = items.reduce((sum, item) => sum + (item.quantity_ordered * item.unit_cost), 0);
    
    const poNumber = `PO-${Date.now()}`;
    
    const poItems = items.map(item => {
      const product = products.find(p => p.id === item.product_id);
      return {
        product_id: item.product_id,
        product_name: product?.name,
        sku: product?.sku,
        quantity_ordered: parseInt(item.quantity_ordered),
        quantity_received: 0,
        unit_cost: parseFloat(item.unit_cost),
        line_total: parseFloat(item.quantity_ordered) * parseFloat(item.unit_cost)
      };
    });

    createPOMutation.mutate({
      po: {
        po_number: poNumber,
        po_date: new Date().toISOString().split('T')[0],
        supplier_id: formData.supplier_id,
        supplier_name: supplier?.company_name,
        expected_delivery_date: formData.expected_delivery_date,
        total_amount: totalAmount,
        status: "approved",
        notes: formData.notes
      },
      items: poItems
    });
  };

  const handleClose = () => {
    setFormData({ supplier_id: "", expected_delivery_date: "", notes: "" });
    setItems([]);
    onClose();
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity_ordered * item.unit_cost), 0);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create Purchase Order</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Select
                value={formData.supplier_id}
                onValueChange={(value) => setFormData({ ...formData, supplier_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_date">Expected Delivery Date</Label>
              <Input
                id="delivery_date"
                type="date"
                value={formData.expected_delivery_date}
                onChange={(e) => setFormData({ ...formData, expected_delivery_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Order Items *</Label>
              <Button type="button" onClick={addItem} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                <p>No items added yet. Click "Add Item" to start.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto border rounded-lg p-4">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Product</Label>
                        <Select
                          value={item.product_id}
                          onValueChange={(value) => updateItem(index, 'product_id', value)}
                          required
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity_ordered}
                          onChange={(e) => updateItem(index, 'quantity_ordered', e.target.value)}
                          className="h-9"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Unit Cost (£)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unit_cost}
                          onChange={(e) => updateItem(index, 'unit_cost', e.target.value)}
                          className="h-9"
                          required
                        />
                      </div>
                    </div>
                    <div className="pt-5">
                      <Badge variant="outline" className="mr-2">
                        £{(item.quantity_ordered * item.unit_cost).toFixed(2)}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="h-9 w-9"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Additional notes or special instructions..."
            />
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Order Value:</span>
              <span className="text-2xl font-bold text-indigo-600">£{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createPOMutation.isPending || items.length === 0}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700"
            >
              {createPOMutation.isPending ? "Creating..." : "Create Purchase Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}