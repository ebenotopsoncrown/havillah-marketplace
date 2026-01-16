import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, Bell } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          
          <p className="text-sm text-gray-600 mb-8">
            Last Updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  1. Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Personal Information:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Name, email address, phone number</li>
                    <li>Delivery address and postcode</li>
                    <li>Order history and preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Payment Information:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Payment processing handled by Stripe (PCI-DSS compliant)</li>
                    <li>We do not store credit card numbers</li>
                    <li>Transaction records stored for accounting purposes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Automatically Collected:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>IP address and browser information</li>
                    <li>Shopping behavior and product preferences</li>
                    <li>Delivery tracking information</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  2. How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Order Processing:</strong> To fulfill and deliver your orders</li>
                  <li><strong>Communication:</strong> Order confirmations, delivery updates, customer service</li>
                  <li><strong>Account Management:</strong> Maintain your account and order history</li>
                  <li><strong>Business Operations:</strong> Inventory management, accounting, analytics</li>
                  <li><strong>Legal Compliance:</strong> Tax records, regulatory requirements</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  3. Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">We implement industry-standard security measures:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Encryption:</strong> All data encrypted in transit (HTTPS/SSL) and at rest</li>
                  <li><strong>Secure Payment Processing:</strong> Stripe handles all card payments (Level 1 PCI-DSS)</li>
                  <li><strong>Access Controls:</strong> Role-based access with authentication required</li>
                  <li><strong>Regular Backups:</strong> Automated backups for data recovery</li>
                  <li><strong>Monitoring:</strong> Continuous security monitoring and audit logs</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  4. Your Rights (UK GDPR)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-700">Under UK data protection law, you have the right to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                  <li><strong>Erasure:</strong> Request deletion of your data (right to be forgotten)</li>
                  <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
                  <li><strong>Withdraw Consent:</strong> Stop processing based on consent</li>
                  <li><strong>Object:</strong> Object to processing for direct marketing</li>
                </ul>
                <p className="mt-4 text-gray-700">
                  To exercise these rights, contact us at: <a href="mailto:privacy@coriander.co.uk" className="text-indigo-600 underline">privacy@coriander.co.uk</a>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Data Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Order Records:</strong> 7 years (UK tax law requirement)</li>
                  <li><strong>Customer Accounts:</strong> Until account deletion requested</li>
                  <li><strong>Marketing Data:</strong> Until consent withdrawn</li>
                  <li><strong>Inactive Accounts:</strong> Deleted after 3 years of inactivity</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-gray-700">We use the following third-party services:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Stripe:</strong> Payment processing (see Stripe Privacy Policy)</li>
                  <li><strong>Google Maps:</strong> Delivery route optimization and address validation</li>
                  <li><strong>Base44:</strong> Cloud hosting and database services</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Cookies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We use essential cookies to maintain your session and shopping cart. 
                  We do not use tracking or advertising cookies. You can manage cookie 
                  preferences in your browser settings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Data Controller:</strong> Coriander Cash & Carry</p>
                  <p><strong>Address:</strong> 846-848 Wimborne Rd, Bournemouth BH9 2DS, UK</p>
                  <p><strong>Email:</strong> <a href="mailto:privacy@coriander.co.uk" className="text-indigo-600 underline">privacy@coriander.co.uk</a></p>
                  <p><strong>Phone:</strong> 020 XXXX XXXX</p>
                  <p className="mt-4">
                    <strong>ICO Registration:</strong> [Your ICO registration number once registered]
                  </p>
                  <p className="text-sm text-gray-600 mt-4">
                    You have the right to lodge a complaint with the Information Commissioner's Office (ICO) 
                    if you believe your data protection rights have been breached.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}