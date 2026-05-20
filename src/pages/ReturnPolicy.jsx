import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { RotateCcw, ArrowLeft, CheckCircle, XCircle, AlertCircle, Mail } from "lucide-react";

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="bg-white border-b border-rose-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link to={createPageUrl("Home")} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-rose-500 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Returns & Refunds Policy</h1>
          <p className="text-gray-500 text-sm">Last updated: February 2026</p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              We want you to be completely satisfied with your purchase. If something isn't right, 
              we are here to help. Please read our policy below and contact us if you have any questions.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Your Right to Return</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Under UK Consumer Rights, you have the right to return most items purchased online within <strong>14 days</strong> of 
                receiving your order. You then have a further 14 days to return the item once you have notified us. 
                We aim to make this process as simple as possible.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">What Can Be Returned?</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">Eligible for Return</h3>
                  </div>
                  <ul className="space-y-1.5 text-sm text-green-700">
                    <li>• Non-perishable grocery items (unopened, in original packaging)</li>
                    <li>• Beauty &amp; hair care products (unused, sealed)</li>
                    <li>• Fashion &amp; clothing items (unworn, with tags)</li>
                    <li>• Items received damaged or faulty</li>
                    <li>• Wrong items delivered</li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold text-red-800">Not Eligible for Return</h3>
                  </div>
                  <ul className="space-y-1.5 text-sm text-red-700">
                    <li>• Fresh, chilled or frozen food items</li>
                    <li>• Opened food products</li>
                    <li>• Items where the hygiene seal has been broken (cosmetics, creams)</li>
                    <li>• Perishable goods that have been delivered correctly</li>
                    <li>• Items damaged by misuse</li>
                  </ul>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">How to Return an Item</h2>
              <ol className="space-y-3">
                {[
                  { step: "1", text: "Contact us within 14 days of receiving your order at info@havillahmarketplace.com or via WhatsApp +44 7389 170496." },
                  { step: "2", text: "Include your order number, the item(s) you wish to return and the reason for return." },
                  { step: "3", text: "We will confirm the return and provide you with a return address and instructions." },
                  { step: "4", text: "Pack the item securely in its original packaging if possible and send it to us." },
                  { step: "5", text: "Once we receive and inspect the item, we will process your refund within 5–7 working days." },
                ].map(({ step, text }) => (
                  <li key={step} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 font-bold flex items-center justify-center flex-shrink-0 text-xs">{step}</span>
                    {text}
                  </li>
                ))}
              </ol>
              <p className="text-xs text-gray-400 mt-3">
                Return shipping costs are the responsibility of the customer unless the item is faulty, damaged or incorrect.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Refunds</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Once your return is received and approved, your refund will be processed to your original payment method:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> <strong>Card payments:</strong> Refunded via Stripe within 5–10 business days (depending on your bank).</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> <strong>Cash on delivery:</strong> Refund issued by bank transfer or store credit.</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> <strong>Account customers:</strong> Credit applied to your business account.</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Damaged or Faulty Items</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                If you receive a damaged, faulty or incorrect item, please contact us within <strong>48 hours</strong> of delivery 
                with a photo of the issue. We will arrange a free return and issue a full refund or replacement at no extra cost to you.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-5 h-5 text-rose-500" />
                <h2 className="text-xl font-bold text-gray-900">Contact Us</h2>
              </div>
              <p className="text-sm text-gray-600 mb-2">For any returns or refund enquiries:</p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>📧 <a href="mailto:info@havillahmarketplace.com" className="text-rose-500 hover:underline">info@havillahmarketplace.com</a></li>
                <li>📞 <a href="https://wa.me/447389170496" className="text-rose-500 hover:underline">+44 7389 170496 (WhatsApp)</a></li>
              </ul>
            </section>

          </div>
        </div>

        <div className="text-center mt-10">
          <Link to={createPageUrl("CustomerStore")}>
            <button className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors">
              Continue Shopping
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}