import React, { useState, useEffect } from 'react';
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
import { AlertCircle } from "lucide-react";

export default function StockAdjustmentModal({ open, onClose, product, onSave, processing }) {
  const [adjustmentType, setAdjustmentType] = useState("correction");
  const [quantityChange, setQuantityChange] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      setAdjustmentType("correction");
      setQuantityChange("");
      setReason("");
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const change = parseInt(quantityChange);
    const newQuantity = (product.stock_quantity || 0) + change;

    if (newQuantity < 0) {
      alert("Stock cannot go below zero");
      return;
    }

    onSave({
      productId: product.id,
      newQuantity: newQuantity,
      adjustment: {
        product_id: product.id,
        product_name: product.name,
        sku: product.sku,
        adjustment_type: adjustmentType,
        quantity_change: change,
        old_quantity: product.stock_quantity || 0,
        new_quantity: newQuantity,
        reason: reason,
        adjusted_by: "Admin User"
      }
    });
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Adjust Stock Level</DialogTitle>
        </DialogHeader>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600 mb-1">Product</p>
          <p className="font-semibold text-gray-900">{product.name}</p>
          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-gray-600">Current Stock:</span>
            <span className="text-2xl font-bold text-indigo-600">{product.stock_quantity || 0}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adjustment_type">Adjustment Type</Label>
            <Select value={adjustmentType} onValueChange={setAdjustmentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="correction">Stock Correction</SelectItem>
                <SelectItem value="damage">Damage</SelectItem>
                <SelectItem value="shrinkage">Shrinkage</SelectItem>
                <SelectItem value="wastage">Wastage</SelectItem>
                <SelectItem value="stock_take">Stock Take</SelectItem>
                <SelectItem value="return">Return</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity_change">
              Quantity Change (use negative for decrease)
            </Label>
            <Input
              id="quantity_change"
              type="number"
              value={quantityChange}
              onChange={(e) => setQuantityChange(e.target.value)}
              placeholder="e.g., 10 or -5"
              required
            />
          </div>

          {quantityChange && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                New stock level will be:{" "}
                <span className="font-bold text-blue-700">
                  {(product.stock_quantity || 0) + parseInt(quantityChange)}
                </span>
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the reason for this adjustment"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={processing || !quantityChange}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700"
            >
              {processing ? "Saving..." : "Save Adjustment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}