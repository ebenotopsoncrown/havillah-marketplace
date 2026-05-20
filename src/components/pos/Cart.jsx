import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Trash2, Plus, Minus, X } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Cart({ cart, updateCartItem, removeFromCart, clearCart, onCheckout }) {
  const subtotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  const vatAmount = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity * item.vat_rate / 100), 0);
  const total = subtotal + vatAmount;

  return (
    <div className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Current Cart</h2>
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
            {cart.length} items
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Cart is empty</p>
            <p className="text-sm">Add products to start a sale</p>
          </div>
        ) : (
          cart.map((item) => (
            <Card key={item.product_id} className="p-4 border-2 hover:border-indigo-200 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{item.product_name}</h3>
                  <p className="text-xs text-gray-500">{item.sku}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => updateCartItem(item.product_id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateCartItem(item.product_id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">£{item.unit_price.toFixed(2)} each</p>
                  <p className="font-bold text-indigo-600">£{item.line_total.toFixed(2)}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">£{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">VAT</span>
              <span className="font-medium">£{vatAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-300">
              <span>Total</span>
              <span className="text-indigo-600">£{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={onCheckout}
              className="w-full h-14 text-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
            >
              Process Payment
            </Button>
            <Button 
              onClick={clearCart}
              variant="outline"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}