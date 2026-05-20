import React, { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Banknote, CreditCard, User, CheckCircle } from "lucide-react";

export default function PaymentModal({ open, onClose, cart, onComplete, processing }) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashAmount, setCashAmount] = useState("");
  const [completed, setCompleted] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.line_total, 0);
  const change = cashAmount ? Math.max(0, parseFloat(cashAmount) - total) : 0;

  const handlePayment = async () => {
    const paymentData = {
      method: paymentMethod,
      cashPaid: paymentMethod === "cash" ? parseFloat(cashAmount) : 0,
      cardPaid: paymentMethod === "card" ? total : 0,
      change: change
    };

    await onComplete(paymentData);
    setCompleted(true);
    setTimeout(() => {
      setCompleted(false);
      setCashAmount("");
      onClose();
    }, 2000);
  };

  if (completed) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600">Receipt printed</p>
            {change > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600">Change to give</p>
                <p className="text-3xl font-bold text-yellow-600">£{change.toFixed(2)}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Process Payment</DialogTitle>
        </DialogHeader>

        <div className="mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg p-6">
            <p className="text-sm opacity-90 mb-1">Total Amount Due</p>
            <p className="text-4xl font-bold">£{total.toFixed(2)}</p>
          </div>
        </div>

        <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cash" className="flex items-center gap-2">
              <Banknote className="w-4 h-4" />
              Cash
            </TabsTrigger>
            <TabsTrigger value="card" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Card
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cash" className="space-y-4 mt-6">
            <div>
              <Label htmlFor="cash-amount">Cash Received</Label>
              <Input
                id="cash-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                className="text-2xl h-16 mt-2"
                autoFocus
              />
            </div>

            {cashAmount && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Change</span>
                  <span className="font-bold text-green-600">£{change.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 20, 50].map(amount => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => setCashAmount((total + amount).toString())}
                  className="h-12"
                >
                  +£{amount}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="card" className="mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <CreditCard className="w-12 h-12 mx-auto mb-3 text-blue-600" />
              <p className="font-medium text-gray-900 mb-2">Card Payment Ready</p>
              <p className="text-sm text-gray-600">
                Customer can tap, insert, or swipe card on terminal
              </p>
            </div>
          </TabsContent>

          <TabsContent value="account" className="mt-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
              <User className="w-12 h-12 mx-auto mb-3 text-purple-600" />
              <p className="font-medium text-gray-900 mb-2">Account Customer</p>
              <p className="text-sm text-gray-600">
                Sale will be added to customer's credit account
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={processing}>
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={processing || (paymentMethod === "cash" && (!cashAmount || parseFloat(cashAmount) < total))}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700"
          >
            {processing ? "Processing..." : "Complete Sale"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}