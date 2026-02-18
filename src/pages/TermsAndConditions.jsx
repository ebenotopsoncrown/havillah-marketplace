import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
          </div>
          
          <p className="text-sm text-gray-600 mb-8">
            Last Updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Agreement to Terms</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <p>
                  By accessing and using Havillah Marketplace services, you agree to be bound by 
                  these Terms and Conditions and our Privacy Policy. If you do not agree, please do not use our services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <p>Havillah Marketplace provides:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Retail and wholesale food products</li>
                  <li>Home delivery services</li>
                  <li>Click & Collect services</li>
                  <li>Online ordering platform</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Orders & Payments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <h3 className="font-semibold">Order Acceptance:</h3>
                <p>All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order.</p>
                
                <h3 className="font-semibold mt-4">Pricing:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>All prices are in GBP (£) and include VAT where applicable</li>
                  <li>Prices may change without notice</li>
                  <li>The price at checkout is the price you pay</li>
                </ul>

                <h3 className="font-semibold mt-4">Payment:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>We accept card payments via Stripe</li>
                  <li>Cash on delivery (where available)</li>
                  <li>Account customers (credit terms available upon approval)</li>
                  <li>Payment must be received before delivery</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Delivery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <h3 className="font-semibold">Delivery Areas:</h3>
                <p>We deliver to Bournemouth and surrounding areas. Delivery charges apply based on location and order value.</p>
                
                <h3 className="font-semibold mt-4">Delivery Times:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Delivery slots are approximate and subject to traffic conditions</li>
                  <li>We will notify you if there are delays</li>
                  <li>Someone must be available to receive the order</li>
                  <li>Failed deliveries may incur re-delivery charges</li>
                </ul>

                <h3 className="font-semibold mt-4">Minimum Orders:</h3>
                <p>Minimum order values may apply for delivery services. Free delivery available on orders over £50.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Returns & Refunds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <h3 className="font-semibold">Perishable Goods:</h3>
                <p>Due to food safety regulations, we cannot accept returns of perishable items unless they are faulty or damaged.</p>
                
                <h3 className="font-semibold mt-4">Damaged or Incorrect Items:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Report issues within 24 hours of delivery</li>
                  <li>Provide photos of damaged items</li>
                  <li>Refunds or replacements will be issued after verification</li>
                </ul>

                <h3 className="font-semibold mt-4">Cancellations:</h3>
                <p>Orders can be cancelled before they are dispatched. Contact us immediately if you need to cancel.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You are responsible for maintaining account security</li>
                  <li>Do not share login credentials</li>
                  <li>Notify us immediately of unauthorized access</li>
                  <li>We reserve the right to suspend accounts for suspicious activity</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <p>While we strive for accuracy:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Product descriptions and images are for illustration</li>
                  <li>Actual products may vary slightly</li>
                  <li>We cannot guarantee availability of all items</li>
                  <li>Substitutions may be offered if items are unavailable</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <p>
                  Our liability is limited to the value of your order. We are not liable for indirect, 
                  consequential, or incidental damages. This does not affect your statutory rights as a consumer.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <p>
                  All content on our website and platform, including logos, images, and text, 
                  is the property of Havillah Marketplace and protected by copyright laws.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <p>
                  We reserve the right to modify these terms at any time. Changes will be posted 
                  on this page with an updated date. Continued use constitutes acceptance of changes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Governing Law</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <p>
                  These terms are governed by the laws of England and Wales. 
                  Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>12. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <p className="mb-2"><strong>Company:</strong> Havillah Marketplace</p>
                <p className="mb-2"><strong>Address:</strong> Flat 2, 30 The Triangle, BH2 5SE Bournemouth, United Kingdom</p>
                <p className="mb-2"><strong>Email:</strong> <a href="mailto:info@havillahmarketplace.com" className="text-indigo-600 underline">info@havillahmarketplace.com</a></p>
                <p className="mb-2"><strong>Phone:</strong> +4407389170496</p>
                <p className="mt-4 text-sm text-gray-600">
                  For complaints or concerns, please contact us using the details above. 
                  We aim to respond within 48 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}