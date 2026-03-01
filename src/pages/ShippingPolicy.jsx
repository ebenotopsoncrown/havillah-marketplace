import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Truck, Clock, MapPin, ArrowLeft, Package, CheckCircle } from "lucide-react";

export default function ShippingPolicy() {
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
            <Truck className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Shipping Policy</h1>
          <p className="text-gray-500 text-sm">Last updated: February 2026</p>
        </div>

        <div className="space-y-6">
          {/* Free Delivery Banner */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-start gap-4">
            <CheckCircle className="w-7 h-7 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-green-800 mb-1">🎉 FREE Delivery on All Orders!</h2>
              <p className="text-green-700 text-sm leading-relaxed">
                We are pleased to offer <strong>free delivery to any location within the United Kingdom</strong> on all orders. 
                No minimum spend, no hidden charges — just free delivery straight to your door.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
            <section>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-rose-500" />
                <h2 className="text-xl font-bold text-gray-900">Delivery Coverage</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                We deliver to <strong>all addresses across England, Scotland, Wales and Northern Ireland</strong>. 
                Whether you are in London, Manchester, Birmingham, Glasgow, Cardiff, Belfast or any rural area — 
                we will get your order to you.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-rose-500" />
                <h2 className="text-xl font-bold text-gray-900">Delivery Timeframes</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl text-sm">
                  <div>
                    <p className="font-semibold text-gray-800">Standard Delivery</p>
                    <p className="text-gray-500">All UK addresses</p>
                  </div>
                  <span className="bg-rose-100 text-rose-700 font-semibold px-3 py-1 rounded-full text-xs">2–4 Working Days</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl text-sm">
                  <div>
                    <p className="font-semibold text-gray-800">Click & Collect</p>
                    <p className="text-gray-500">From our Bournemouth store</p>
                  </div>
                  <span className="bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full text-xs">Ready in 1–2 Days</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Delivery times are estimated and may vary during busy periods, public holidays, or due to courier delays. 
                Orders placed after 2pm may be processed the next working day.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-5 h-5 text-rose-500" />
                <h2 className="text-xl font-bold text-gray-900">Order Processing</h2>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Orders are processed Monday to Friday (excluding Bank Holidays).</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> You will receive an order confirmation email once your order is placed.</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> A second confirmation email is sent once your order has been picked and is ready for dispatch.</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Tracking information (where available) will be included in your dispatch email.</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Packaging</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                All orders are carefully packed to ensure your groceries, beauty products and cultural goods arrive in perfect condition. 
                Fragile or perishable items are packed with appropriate protective materials. 
                We strive to use minimal packaging to reduce our environmental footprint.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Delivery Issues</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                If your order has not arrived within the estimated timeframe, or if you have received a damaged or incorrect item, 
                please contact us immediately:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>📧 <a href="mailto:info@havillahmarketplace.com" className="text-rose-500 hover:underline">info@havillahmarketplace.com</a></li>
                <li>📞 <a href="https://wa.me/447389170496" className="text-rose-500 hover:underline">+44 7389 170496 (WhatsApp)</a></li>
              </ul>
              <p className="text-xs text-gray-400 mt-3">Please include your order number when contacting us so we can resolve the issue quickly.</p>
            </section>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link to={createPageUrl("CustomerStore")}>
            <button className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors">
              Start Shopping
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}