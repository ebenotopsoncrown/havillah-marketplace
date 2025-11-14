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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ExpenseFormModal({ open, onClose, expense, onSave, processing }) {
  const [formData, setFormData] = useState({
    expense_date: "",
    category: "other",
    description: "",
    amount: "",
    vat_amount: "",
    payment_method: "cash",
    paid_to: "",
    reference: "",
    status: "pending",
    notes: ""
  });

  useEffect(() => {
    if (expense) {
      setFormData(expense);
    } else {
      setFormData({
        expense_date: new Date().toISOString().split('T')[0],
        category: "other",
        description: "",
        amount: "",
        vat_amount: "",
        payment_method: "cash",
        paid_to: "",
        reference: "",
        status: "pending",
        notes: ""
      });
    }
  }, [expense, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const expenseNumber = expense?.expense_number || `EXP-${Date.now()}`;
    
    onSave({
      ...formData,
      expense_number: expenseNumber,
      amount: parseFloat(formData.amount),
      vat_amount: parseFloat(formData.vat_amount) || 0
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {expense ? "Edit Expense" : "Record New Expense"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expense_date">Date *</Label>
              <Input
                id="expense_date"
                type="date"
                value={formData.expense_date}
                onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="utilities">Utilities (Electric, Water, Gas)</SelectItem>
                  <SelectItem value="salaries">Salaries & Wages</SelectItem>
                  <SelectItem value="transport">Transport & Fuel</SelectItem>
                  <SelectItem value="marketing">Marketing & Advertising</SelectItem>
                  <SelectItem value="supplies">Office Supplies</SelectItem>
                  <SelectItem value="maintenance">Maintenance & Repairs</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="tax">Tax Payments</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Monthly shop rent - January 2025"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (£) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vat_amount">VAT Amount (£)</Label>
              <Input
                id="vat_amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.vat_amount}
                onChange={(e) => setFormData({ ...formData, vat_amount: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paid_to">Paid To *</Label>
              <Input
                id="paid_to"
                value={formData.paid_to}
                onChange={(e) => setFormData({ ...formData, paid_to: e.target.value })}
                placeholder="Company or person name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Invoice/Receipt Reference</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="INV-12345"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup
              value={formData.payment_method}
              onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
              className="grid grid-cols-4 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="cursor-pointer">Cash</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="bank_transfer" id="transfer" />
                <Label htmlFor="transfer" className="cursor-pointer">Transfer</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="cursor-pointer">Card</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="cheque" id="cheque" />
                <Label htmlFor="cheque" className="cursor-pointer">Cheque</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <RadioGroup
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="pending" id="pending" />
                <Label htmlFor="pending" className="cursor-pointer">Pending Payment</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="paid" id="paid" />
                <Label htmlFor="paid" className="cursor-pointer">Paid</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Additional notes or details..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700"
            >
              {processing ? "Saving..." : expense ? "Update Expense" : "Save Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}