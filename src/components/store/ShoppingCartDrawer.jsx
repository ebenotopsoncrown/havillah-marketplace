import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";

export default function ShoppingCartDrawer({ open, onClose, cart, updateQuantity, onCheckout }) {
  const subtotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  const vatAmount = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity * item.vat_rate / 100), 0);
  const deliveryCharge = 0;
  const total = subtotal + vatAmount + deliveryCharge;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-2xl">
            <ShoppingCart className="w-6 h-6" />
            Shopping Cart ({cart.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product_id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                  <p className="text-sm text-gray-500">{item.sku}</p>
                  <p className="text-sm font-medium text-indigo-600 mt-1">
                    £{item.unit_price.toFixed(2)} each
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 bg-white rounded-lg border">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      {item.quantity === 1 ? <Trash2 className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4" />}
                    </button>
                    <span className="w-10 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="font-bold text-lg">£{item.line_total.toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t pt-6 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">VAT</span>
                <span className="font-medium">£{vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium">£{deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-indigo-600">£{total.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              onClick={onCheckout}
              className="w-full h-14 text-lg bg-gradient-to-r from-indigo-600 to-indigo-700"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}