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
import { CheckCircle, Truck, Store, CreditCard, Banknote, User, Loader2, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import AddressAutocomplete from "./AddressAutocomplete";

export default function CheckoutModal({ open, onClose, cart, onPlaceOrder, processing }) {
  const [completed, setCompleted] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [addressValidation, setAddressValidation] = useState(null);
  const [deliveryFeeData, setDeliveryFeeData] = useState(null);
  const [calculatingFee, setCalculatingFee] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    delivery_type: "delivery",
    delivery_address: "",
    delivery_postcode: "",
    delivery_slot: "",
    payment_method: "card",
    notes: "",
    marketing_consent: false,
    sms_consent: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // For card payments, redirect to Stripe
    if (formData.payment_method === "card") {
      setStripeLoading(true);
      try {
        // First create the order
        const orderId = await onPlaceOrder(formData, true); // true = don't show success, return order ID
        
        // Save to address book (fire-and-forget)
        base44.functions.invoke('upsertAddressBook', {
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          delivery_address: formData.delivery_address,
          delivery_postcode: formData.delivery_postcode,
          marketing_consent: formData.marketing_consent,
          sms_consent: formData.sms_consent,
        }).catch(() => {});

        // Then create Stripe checkout session
        const response = await base44.functions.invoke('createStripeCheckout', {
          cart,
          formData,
          orderId
        });
        
        if (response.data.url) {
          // Redirect to Stripe Checkout
          window.location.href = response.data.url;
        } else {
          throw new Error('Failed to create payment session');
        }
      } catch (error) {
        console.error('Payment error:', error);
        alert('Payment setup failed. Please try again.');
        setStripeLoading(false);
      }
      return;
    }
    
    // Save to address book (fire-and-forget)
    base44.functions.invoke('upsertAddressBook', {
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      customer_phone: formData.customer_phone,
      delivery_address: formData.delivery_address,
      delivery_postcode: formData.delivery_postcode,
      marketing_consent: formData.marketing_consent,
      sms_consent: formData.sms_consent,
    }).catch(() => {});

    // For non-card payments, proceed normally
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
        notes: "",
        marketing_consent: false,
        sms_consent: false
      });
      onClose();
    }, 3000);
  };

  // Calculate delivery fee when postcode changes
  React.useEffect(() => {
    if (formData.delivery_type === "delivery" && formData.delivery_postcode && formData.delivery_postcode.length >= 5) {
      const timer = setTimeout(async () => {
        setCalculatingFee(true);
        try {
          const response = await base44.functions.invoke('calculateDeliveryFee', {
            cart,
            deliveryPostcode: formData.delivery_postcode,
            orderTotal: subtotal
          });
          
          if (response.data.fee !== null && response.data.fee !== undefined) {
            setDeliveryFeeData(response.data);
          } else {
            setDeliveryFeeData(null);
          }
        } catch (error) {
          console.error('Fee calculation error:', error);
          setDeliveryFeeData(null);
        }
        setCalculatingFee(false);
      }, 800);
      
      return () => clearTimeout(timer);
    } else {
      setDeliveryFeeData(null);
    }
  }, [formData.delivery_postcode, formData.delivery_type, cart]);

  const subtotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  const vat = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity * item.vat_rate / 100), 0);
  const deliveryCharge = 0;
  const total = subtotal + vat + deliveryCharge;
  
  const MINIMUM_ORDER_FOR_DELIVERY = 15;
  const canDeliverOrder = subtotal >= MINIMUM_ORDER_FOR_DELIVERY;
  
  // Auto-switch to click & collect if below minimum
  React.useEffect(() => {
    if (!canDeliverOrder && formData.delivery_type === "delivery") {
      setFormData({ ...formData, delivery_type: "click_and_collect" });
    }
  }, [canDeliverOrder]);

  if (completed) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-700 mb-4">Thank you for your order, {formData.customer_name}!</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">What happens next?</p>
              <p className="text-sm text-blue-800 mb-3">
                Please wait for a confirmation email. Our team will review your order and confirm product availability.
              </p>
              <p className="text-sm text-blue-700">
                Once confirmed, you'll receive a confirmation email at:
              </p>
              <p className="font-semibold text-blue-900 mt-1">{formData.customer_email}</p>
            </div>
            <p className="text-xs text-gray-500">This usually takes a few minutes</p>
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
                <p className="font-semibold">FREE</p>
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
            {!canDeliverOrder && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  <strong>Minimum order for delivery: £{MINIMUM_ORDER_FOR_DELIVERY}</strong>
                  <br />
                  Add £{(MINIMUM_ORDER_FOR_DELIVERY - subtotal).toFixed(2)} more to unlock home delivery, or choose Click & Collect.
                </p>
              </div>
            )}
            <RadioGroup
              value={formData.delivery_type}
              onValueChange={(value) => setFormData({ ...formData, delivery_type: value })}
            >
              <div className={`flex items-center space-x-2 border-2 rounded-lg p-4 transition-colors ${canDeliverOrder ? 'cursor-pointer hover:bg-gray-50' : 'opacity-50 cursor-not-allowed bg-gray-50'}`}>
                <RadioGroupItem value="delivery" id="delivery" disabled={!canDeliverOrder} />
                <Label htmlFor="delivery" className={`flex items-center gap-3 flex-1 ${canDeliverOrder ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Truck className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Home Delivery</p>
                    <p className="text-sm text-gray-600">Delivered to your address</p>
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                    {calculatingFee ? 'Calculating...' : deliveryFeeData?.fee !== null && deliveryFeeData?.fee !== undefined ? `£${deliveryFeeData.fee.toFixed(2)}` : 'From £4.50'}
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

              <AddressAutocomplete
                address={formData.delivery_address}
                postcode={formData.delivery_postcode}
                onAddressChange={(value) => setFormData({ ...formData, delivery_address: value })}
                onPostcodeChange={(value) => setFormData({ ...formData, delivery_postcode: value })}
                onValidation={setAddressValidation}
              />

              {deliveryFeeData && deliveryFeeData.breakdown && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-indigo-900 mb-2">Delivery Fee Breakdown</h4>
                  <div className="space-y-1 text-sm text-indigo-700">
                    {deliveryFeeData.breakdown.freeDelivery ? (
                      <p className="font-semibold text-green-700">🎉 {deliveryFeeData.breakdown.reason}</p>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span>Base fee:</span>
                          <span>£{deliveryFeeData.breakdown.baseFee.toFixed(2)}</span>
                        </div>
                        {deliveryFeeData.breakdown.distanceFee > 0 && (
                          <div className="flex justify-between">
                            <span>Distance ({deliveryFeeData.distance} miles):</span>
                            <span>+£{deliveryFeeData.breakdown.distanceFee.toFixed(2)}</span>
                          </div>
                        )}
                        {deliveryFeeData.breakdown.weightSurcharge > 0 && (
                          <div className="flex justify-between">
                            <span>Weight surcharge ({deliveryFeeData.weight} kg):</span>
                            <span>+£{deliveryFeeData.breakdown.weightSurcharge.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold border-t border-indigo-300 pt-1 mt-1">
                          <span>Total delivery:</span>
                          <span>£{deliveryFeeData.fee.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    {deliveryFeeData.estimatedTime && (
                      <p className="text-xs mt-2">Estimated delivery time: {deliveryFeeData.estimatedTime}</p>
                    )}
                  </div>
                </div>
              )}

              {(deliveryFeeData?.outOfRange || deliveryFeeData?.belowMinimum) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700 font-medium">{deliveryFeeData.error}</p>
                  {deliveryFeeData?.belowMinimum && (
                    <p className="text-xs text-red-600 mt-1">
                      Add £{(deliveryFeeData.minimumRequired - subtotal).toFixed(2)} more to qualify for delivery
                    </p>
                  )}
                </div>
              )}

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
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-900 font-medium">Secure Payment via Stripe</p>
                  <p className="text-xs text-blue-700 mt-1">
                    You'll be redirected to Stripe's secure checkout to complete your card payment. 
                    Your card details are never stored on our servers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Marketing Consent */}
          <div className="space-y-2 border rounded-lg p-4 bg-gray-50">
            <p className="text-sm font-semibold text-gray-700">Stay in touch (optional)</p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-0.5 w-4 h-4" checked={formData.marketing_consent} onChange={e => setFormData({ ...formData, marketing_consent: e.target.checked })} />
              <span className="text-xs text-gray-600">I'd like to receive offers, news and promotions via email</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-0.5 w-4 h-4" checked={formData.sms_consent} onChange={e => setFormData({ ...formData, sms_consent: e.target.checked })} />
              <span className="text-xs text-gray-600">I'd like to receive SMS updates and exclusive deals</span>
            </label>
          </div>

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
            <Button type="button" variant="outline" onClick={onClose} disabled={processing || stripeLoading} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={processing || stripeLoading || (formData.delivery_type === "delivery" && deliveryFeeData?.outOfRange)}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 h-12 text-lg"
            >
              {processing || stripeLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {stripeLoading ? 'Redirecting to Payment...' : 'Processing...'}
                </>
              ) : formData.payment_method === "card" ? (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay £{total.toFixed(2)} with Card
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