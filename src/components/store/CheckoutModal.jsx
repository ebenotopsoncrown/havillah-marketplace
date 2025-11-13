import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, Truck, Store } from "lucide-react";

export default function CheckoutModal({ open, onClose, cart, onPlaceOrder, processing }) {
  const [completed, setCompleted] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    delivery_type: "delivery",
    delivery_address: "",
    delivery_postcode: "",
    delivery_slot: "",
    payment_method: "card",
    notes: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onPlaceOrder(formData);
    setCompleted(true);
    setTimeout(() => {
      setCompleted(false);
      setFormData({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        delivery_type: "delivery",
        delivery_address: "",
        delivery_postcode: "",
        delivery_slot: "",
        payment_method: "card",
        notes: ""
      });
      onClose();
    }, 3000);
  };

  const total = cart.reduce((sum, item) => sum + item.line_total, 0) + 
                (formData.delivery_type === "delivery" ? 5 : 0);

  if (completed) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600">We'll send you a confirmation email shortly</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Checkout</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg p-4">
            <p className="text-sm opacity-90">Order Total</p>
            <p className="text-3xl font-bold">£{total.toFixed(2)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="customer_name">Full Name *</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_email">Email *</Label>
              <Input
                id="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_phone">Phone *</Label>
              <Input
                id="customer_phone"
                type="tel"
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Delivery Method</Label>
            <RadioGroup
              value={formData.delivery_type}
              onValueChange={(value) => setFormData({ ...formData, delivery_type: value })}
            >
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-medium">Home Delivery</p>
                    <p className="text-sm text-gray-500">£5.00 delivery charge</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="click_and_collect" id="click_and_collect" />
                <Label htmlFor="click_and_collect" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Store className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-medium">Click & Collect</p>
                    <p className="text-sm text-gray-500">Free - Pick up from store</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {formData.delivery_type === "delivery" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="delivery_address">Delivery Address *</Label>
                <Textarea
                  id="delivery_address"
                  value={formData.delivery_address}
                  onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                  required
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery_postcode">Postcode *</Label>
                <Input
                  id="delivery_postcode"
                  value={formData.delivery_postcode}
                  onChange={(e) => setFormData({ ...formData, delivery_postcode: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery_slot">Preferred Delivery Slot</Label>
                <Input
                  id="delivery_slot"
                  value={formData.delivery_slot}
                  onChange={(e) => setFormData({ ...formData, delivery_slot: e.target.value })}
                  placeholder="e.g., 2-4 PM tomorrow"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Order Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Any special instructions..."
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={processing} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={processing}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700"
            >
              {processing ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}