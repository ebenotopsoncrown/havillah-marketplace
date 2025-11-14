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
import { CheckCircle, Truck, Store, CreditCard, Banknote, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  const subtotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  const vat = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity * item.vat_rate / 100), 0);
  const deliveryCharge = formData.delivery_type === "delivery" ? 5 : 0;
  const total = subtotal + vat + deliveryCharge;

  if (completed) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-4">Thank you for your order</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">We'll send you a confirmation email at:</p>
              <p className="font-semibold text-gray-900">{formData.customer_email}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Store className="w-6 h-6" />
            Secure Checkout
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg p-6">
            <p className="text-sm opacity-90 mb-1">Order Total</p>
            <p className="text-4xl font-bold mb-4">£{total.toFixed(2)}</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="opacity-75">Subtotal</p>
                <p className="font-semibold">£{subtotal.toFixed(2)}</p>
              </div>
              <div>
                <p className="opacity-75">VAT (20%)</p>
                <p className="font-semibold">£{vat.toFixed(2)}</p>
              </div>
              <div>
                <p className="opacity-75">Delivery</p>
                <p className="font-semibold">£{deliveryCharge.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="customer_name">Full Name *</Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_email">Email Address *</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  required
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_phone">Phone Number *</Label>
                <Input
                  id="customer_phone"
                  type="tel"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  required
                  placeholder="07XXX XXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Delivery Method</h3>
            <RadioGroup
              value={formData.delivery_type}
              onValueChange={(value) => setFormData({ ...formData, delivery_type: value })}
            >
              <div className="flex items-center space-x-2 border-2 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery" className="flex items-center gap-3 cursor-pointer flex-1">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Truck className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Home Delivery</p>
                    <p className="text-sm text-gray-600">Delivered to your address</p>
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                    £5.00
                  </Badge>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border-2 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="click_and_collect" id="click_and_collect" />
                <Label htmlFor="click_and_collect" className="flex items-center gap-3 cursor-pointer flex-1">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Store className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Click & Collect</p>
                    <p className="text-sm text-gray-600">Pick up from store</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    FREE
                  </Badge>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Delivery Address */}
          {formData.delivery_type === "delivery" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Delivery Address</h3>
              <div className="space-y-2">
                <Label htmlFor="delivery_address">Street Address *</Label>
                <Textarea
                  id="delivery_address"
                  value={formData.delivery_address}
                  onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                  required
                  rows={3}
                  placeholder="123 Main Street, Apartment 4B"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delivery_postcode">Postcode *</Label>
                  <Input
                    id="delivery_postcode"
                    value={formData.delivery_postcode}
                    onChange={(e) => setFormData({ ...formData, delivery_postcode: e.target.value })}
                    required
                    placeholder="SW1A 1AA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery_slot">Preferred Time Slot</Label>
                  <Input
                    id="delivery_slot"
                    value={formData.delivery_slot}
                    onChange={(e) => setFormData({ ...formData, delivery_slot: e.target.value })}
                    placeholder="e.g., 2-4 PM tomorrow"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Payment Method</h3>
            <RadioGroup
              value={formData.payment_method}
              onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
            >
              <div className="flex items-center space-x-2 border-2 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-sm text-gray-500">Pay securely online</p>
                  </div>
                </Label>
                <Badge variant="outline" className="bg-green-50 text-green-700">Recommended</Badge>
              </div>
              <div className="flex items-center space-x-2 border-2 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="cash_on_delivery" id="cash" />
                <Label htmlFor="cash" className="flex items-center gap-3 cursor-pointer flex-1">
                  <Banknote className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border-2 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="account" id="account" />
                <Label htmlFor="account" className="flex items-center gap-3 cursor-pointer flex-1">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Account Customer</p>
                    <p className="text-sm text-gray-500">Charge to business account</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Payment Info */}
          {formData.payment_method === "card" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Secure Payment:</strong> After placing your order, you'll be redirected to our secure payment partner to complete your card payment. Your card details are never stored on our servers.
              </p>
            </div>
          )}

          {/* Order Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Order Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Any special instructions or requests..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={processing} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={processing}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 h-12 text-lg"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Place Order - £{total.toFixed(2)}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}