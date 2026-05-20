import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

export default function ArchitectureDiagram() {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-container { 
            max-width: 100% !important;
            padding: 20px !important;
          }
          body { background: white !important; }
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Print/Download Controls */}
        <div className="no-print sticky top-0 z-50 bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">System Architecture Diagram</h1>
            <div className="flex gap-3">
              <Button onClick={handlePrint} variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownload} className="bg-indigo-600 hover:bg-indigo-700">
                <Download className="w-4 h-4 mr-2" />
                Save as PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Printable Content */}
        <div className="print-container max-w-[1200px] mx-auto p-8">
          {/* Header */}
          <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Coriander Cash & Carry Business Suite
            </h1>
            <h2 className="text-2xl text-indigo-600 mb-4">System Architecture & Design</h2>
            <p className="text-sm text-gray-600 mb-2">Complete ERP, POS & E-commerce Platform</p>
            <p className="text-xs text-gray-500">
              <strong>Designed and Developed by Ebenezer James</strong>
              <br />
              Using Base44 Platform | Version 1.0 | 2025
            </p>
          </div>

          {/* System Overview */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-200">
              1. SYSTEM OVERVIEW
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                <h4 className="font-bold text-blue-900 mb-2">🏪 Public Store</h4>
                <ul className="text-xs space-y-1 text-gray-700">
                  <li>• Homepage</li>
                  <li>• Online Store</li>
                  <li>• Product Catalog</li>
                  <li>• Shopping Cart</li>
                  <li>• Order Placement</li>
                </ul>
              </div>
              <div className="border-2 border-indigo-200 rounded-lg p-4 bg-indigo-50">
                <h4 className="font-bold text-indigo-900 mb-2">💼 Business Suite</h4>
                <ul className="text-xs space-y-1 text-gray-700">
                  <li>• POS System</li>
                  <li>• Inventory Management</li>
                  <li>• Order Processing</li>
                  <li>• Financial Reports</li>
                  <li>• User Management</li>
                </ul>
              </div>
              <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                <h4 className="font-bold text-green-900 mb-2">📊 Analytics</h4>
                <ul className="text-xs space-y-1 text-gray-700">
                  <li>• Real-time Dashboard</li>
                  <li>• Sales Analytics</li>
                  <li>• Profit & Loss</li>
                  <li>• Balance Sheet</li>
                  <li>• Cash Flow</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Layered Architecture */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-200">
              2. LAYERED ARCHITECTURE
            </h3>
            <div className="space-y-3">
              {/* Layer 1 */}
              <div className="border-2 border-purple-300 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-purple-900">Layer 1: Presentation Layer (Frontend)</h4>
                  <span className="text-xs bg-purple-200 px-2 py-1 rounded">React + Tailwind CSS</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="bg-white rounded p-2 border">
                    <strong>Pages:</strong> Dashboard, POS, Products, Sales, Orders, Reports, etc.
                  </div>
                  <div className="bg-white rounded p-2 border">
                    <strong>Components:</strong> Forms, Tables, Modals, Charts
                  </div>
                  <div className="bg-white rounded p-2 border">
                    <strong>UI Library:</strong> shadcn/ui components
                  </div>
                  <div className="bg-white rounded p-2 border">
                    <strong>State:</strong> React Query, Hooks
                  </div>
                </div>
              </div>

              {/* Layer 2 */}
              <div className="border-2 border-blue-300 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-blue-900">Layer 2: Application Layer (Business Logic)</h4>
                  <span className="text-xs bg-blue-200 px-2 py-1 rounded">Base44 SDK</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="bg-white rounded p-2 border">
                    <strong>Authentication:</strong> JWT, Session Management
                  </div>
                  <div className="bg-white rounded p-2 border">
                    <strong>API Client:</strong> base44.entities, base44.auth
                  </div>
                  <div className="bg-white rounded p-2 border">
                    <strong>Integrations:</strong> LLM, Email, File Upload
                  </div>
                  <div className="bg-white rounded p-2 border">
                    <strong>Validation:</strong> Form validation, Data checks
                  </div>
                </div>
              </div>

              {/* Layer 3 */}
              <div className="border-2 border-green-300 rounded-lg p-4 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-green-900">Layer 3: Data Layer (Backend)</h4>
                  <span className="text-xs bg-green-200 px-2 py-1 rounded">Base44 Platform</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="bg-white rounded p-2 border">
                    <strong>Database:</strong> PostgreSQL with JSON Schema
                  </div>
                  <div className="bg-white rounded p-2 border">
                    <strong>Entities:</strong> 12 core entities (Product, Sale, Order, etc.)
                  </div>
                  <div className="bg-white rounded p-2 border">
                    <strong>Storage:</strong> File uploads, Images
                  </div>
                  <div className="bg-white rounded p-2 border">
                    <strong>Security:</strong> RBAC, Row-level security
                  </div>
                </div>
              </div>

              {/* Layer 4 */}
              <div className="border-2 border-orange-300 rounded-lg p-4 bg-gradient-to-r from-orange-50 to-yellow-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-orange-900">Layer 4: Infrastructure Layer</h4>
                  <span className="text-xs bg-orange-200 px-2 py-1 rounded">Cloud Infrastructure</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="bg-white rounded p-2 border">
                    <strong>Hosting:</strong> Cloud deployment (AWS/GCP)
                  </div>
                  <div className="bg-white rounded p-2 border">
                    <strong>CDN:</strong> Static assets delivery
                  </div>
                  <div className="bg-white rounded p-2 border">
                    <strong>SSL:</strong> HTTPS encryption
                  </div>
                  <div className="bg-white rounded p-2 border">
                    <strong>Monitoring:</strong> Performance tracking
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Flow */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-200">
              3. DATA FLOW DIAGRAM
            </h3>
            <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-6">
                <div className="text-center flex-1">
                  <div className="w-24 h-24 mx-auto bg-blue-100 border-2 border-blue-400 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl">👤</span>
                  </div>
                  <p className="text-xs font-bold">User</p>
                  <p className="text-xs text-gray-600">Customer/Staff</p>
                </div>
                <div className="text-2xl text-gray-400">→</div>
                <div className="text-center flex-1">
                  <div className="w-24 h-24 mx-auto bg-purple-100 border-2 border-purple-400 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl">💻</span>
                  </div>
                  <p className="text-xs font-bold">Frontend</p>
                  <p className="text-xs text-gray-600">React App</p>
                </div>
                <div className="text-2xl text-gray-400">↔</div>
                <div className="text-center flex-1">
                  <div className="w-24 h-24 mx-auto bg-indigo-100 border-2 border-indigo-400 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <p className="text-xs font-bold">API Layer</p>
                  <p className="text-xs text-gray-600">Base44 SDK</p>
                </div>
                <div className="text-2xl text-gray-400">↔</div>
                <div className="text-center flex-1">
                  <div className="w-24 h-24 mx-auto bg-green-100 border-2 border-green-400 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl">🗄️</span>
                  </div>
                  <p className="text-xs font-bold">Database</p>
                  <p className="text-xs text-gray-600">PostgreSQL</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-white rounded p-3 border-2">
                  <strong className="text-blue-900">1. User Action</strong>
                  <p className="text-gray-600 mt-1">Browse products, Process sale, View reports</p>
                </div>
                <div className="bg-white rounded p-3 border-2">
                  <strong className="text-purple-900">2. API Request</strong>
                  <p className="text-gray-600 mt-1">base44.entities.Product.list(), create(), update()</p>
                </div>
                <div className="bg-white rounded p-3 border-2">
                  <strong className="text-green-900">3. Data Response</strong>
                  <p className="text-gray-600 mt-1">JSON data with id, timestamps, audit trail</p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Entities */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-200">
              4. CORE DATA ENTITIES
            </h3>
            <div className="grid grid-cols-4 gap-3 text-xs">
              <div className="border-2 border-indigo-200 rounded p-3 bg-indigo-50">
                <strong className="text-indigo-900">Product</strong>
                <p className="text-gray-700 mt-1">SKU, name, price, stock, category, barcode, images</p>
              </div>
              <div className="border-2 border-green-200 rounded p-3 bg-green-50">
                <strong className="text-green-900">Sale</strong>
                <p className="text-gray-700 mt-1">Sale number, items, total, payment method, date</p>
              </div>
              <div className="border-2 border-blue-200 rounded p-3 bg-blue-50">
                <strong className="text-blue-900">Order</strong>
                <p className="text-gray-700 mt-1">Order number, customer, delivery, status, items</p>
              </div>
              <div className="border-2 border-purple-200 rounded p-3 bg-purple-50">
                <strong className="text-purple-900">Customer</strong>
                <p className="text-gray-700 mt-1">Name, email, phone, address, type, credit limit</p>
              </div>
              <div className="border-2 border-orange-200 rounded p-3 bg-orange-50">
                <strong className="text-orange-900">Expense</strong>
                <p className="text-gray-700 mt-1">Date, category, amount, VAT, payment method</p>
              </div>
              <div className="border-2 border-red-200 rounded p-3 bg-red-50">
                <strong className="text-red-900">Purchase Order</strong>
                <p className="text-gray-700 mt-1">PO number, supplier, items, expected delivery</p>
              </div>
              <div className="border-2 border-teal-200 rounded p-3 bg-teal-50">
                <strong className="text-teal-900">Supplier</strong>
                <p className="text-gray-700 mt-1">Company, contact, payment terms, balance</p>
              </div>
              <div className="border-2 border-pink-200 rounded p-3 bg-pink-50">
                <strong className="text-pink-900">Category</strong>
                <p className="text-gray-700 mt-1">Name, description, parent category, ordering</p>
              </div>
              <div className="border-2 border-yellow-200 rounded p-3 bg-yellow-50">
                <strong className="text-yellow-900">Stock Adjustment</strong>
                <p className="text-gray-700 mt-1">Type, quantity change, reason, adjusted by</p>
              </div>
              <div className="border-2 border-cyan-200 rounded p-3 bg-cyan-50">
                <strong className="text-cyan-900">Sale Item</strong>
                <p className="text-gray-700 mt-1">Product, quantity, price, VAT, line total</p>
              </div>
              <div className="border-2 border-lime-200 rounded p-3 bg-lime-50">
                <strong className="text-lime-900">Order Item</strong>
                <p className="text-gray-700 mt-1">Product, quantity, price, line total</p>
              </div>
              <div className="border-2 border-violet-200 rounded p-3 bg-violet-50">
                <strong className="text-violet-900">PO Item</strong>
                <p className="text-gray-700 mt-1">Product, quantity ordered/received, cost</p>
              </div>
            </div>
          </div>

          {/* Security Model */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-200">
              5. SECURITY & ACCESS CONTROL
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                <h4 className="font-bold text-red-900 mb-3">🔐 Authentication</h4>
                <ul className="text-xs space-y-1 text-gray-700">
                  <li>• JWT token-based authentication</li>
                  <li>• Secure session management</li>
                  <li>• Password hashing (bcrypt)</li>
                  <li>• Auto token refresh</li>
                  <li>• Login/logout functionality</li>
                </ul>
              </div>
              <div className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50">
                <h4 className="font-bold text-orange-900 mb-3">👥 Authorization</h4>
                <ul className="text-xs space-y-1 text-gray-700">
                  <li>• Role-based access control (RBAC)</li>
                  <li>• Admin vs User permissions</li>
                  <li>• Row-level security</li>
                  <li>• User entity special rules</li>
                  <li>• Protected routes</li>
                </ul>
              </div>
              <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                <h4 className="font-bold text-blue-900 mb-3">📊 Audit Trail</h4>
                <ul className="text-xs space-y-1 text-gray-700">
                  <li>• created_by field (user email)</li>
                  <li>• created_date timestamp</li>
                  <li>• updated_date tracking</li>
                  <li>• Complete transaction history</li>
                  <li>• Real-time activity monitoring</li>
                </ul>
              </div>
              <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                <h4 className="font-bold text-green-900 mb-3">🛡️ Data Protection</h4>
                <ul className="text-xs space-y-1 text-gray-700">
                  <li>• HTTPS encryption (SSL/TLS)</li>
                  <li>• Input validation & sanitization</li>
                  <li>• SQL injection prevention</li>
                  <li>• XSS protection</li>
                  <li>• GDPR compliant data handling</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-200">
              6. TECHNOLOGY STACK
            </h3>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <h4 className="font-bold text-indigo-900 mb-2 text-sm">Frontend</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• React 18</li>
                  <li>• Tailwind CSS</li>
                  <li>• shadcn/ui components</li>
                  <li>• React Router DOM</li>
                  <li>• React Query (TanStack)</li>
                  <li>• Recharts (visualization)</li>
                  <li>• Lucide React (icons)</li>
                  <li>• date-fns, moment</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-green-900 mb-2 text-sm">Backend</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Base44 Platform</li>
                  <li>• Node.js runtime</li>
                  <li>• PostgreSQL database</li>
                  <li>• JSON Schema validation</li>
                  <li>• RESTful API</li>
                  <li>• JWT authentication</li>
                  <li>• File storage system</li>
                  <li>• Email service</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-blue-900 mb-2 text-sm">Integrations</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• AI LLM (GPT-4)</li>
                  <li>• Image generation</li>
                  <li>• Email notifications</li>
                  <li>• File upload/download</li>
                  <li>• Data extraction (OCR)</li>
                  <li>• Web scraping</li>
                  <li>• PDF generation</li>
                  <li>• Barcode generation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-200">
              7. KEY FEATURES & MODULES
            </h3>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="border-2 rounded-lg p-3 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <h4 className="font-bold text-blue-900 mb-2">🛒 POS System</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Product search & barcode scanning</li>
                  <li>• Shopping cart management</li>
                  <li>• Multiple payment methods</li>
                  <li>• Receipt generation</li>
                  <li>• Real-time stock updates</li>
                </ul>
              </div>
              <div className="border-2 rounded-lg p-3 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <h4 className="font-bold text-purple-900 mb-2">📦 Inventory</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Product catalog management</li>
                  <li>• Stock level tracking</li>
                  <li>• Low stock alerts</li>
                  <li>• Barcode generation</li>
                  <li>• Stock adjustments</li>
                </ul>
              </div>
              <div className="border-2 rounded-lg p-3 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <h4 className="font-bold text-green-900 mb-2">🛍️ Online Store</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Public product catalog</li>
                  <li>• Shopping cart & checkout</li>
                  <li>• Order placement</li>
                  <li>• Delivery scheduling</li>
                  <li>• Payment options</li>
                </ul>
              </div>
              <div className="border-2 rounded-lg p-3 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
                <h4 className="font-bold text-orange-900 mb-2">📊 Reports</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Profit & Loss statement</li>
                  <li>• Balance sheet</li>
                  <li>• Cash flow statement</li>
                  <li>• Sales analytics</li>
                  <li>• Expense analysis</li>
                </ul>
              </div>
              <div className="border-2 rounded-lg p-3 bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                <h4 className="font-bold text-red-900 mb-2">📋 Order Management</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Order processing workflow</li>
                  <li>• Status tracking</li>
                  <li>• Delivery management</li>
                  <li>• Driver assignment</li>
                  <li>• Customer notifications</li>
                </ul>
              </div>
              <div className="border-2 rounded-lg p-3 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
                <h4 className="font-bold text-indigo-900 mb-2">👥 User Management</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• User invitations</li>
                  <li>• Role assignment</li>
                  <li>• Access control</li>
                  <li>• Activity monitoring</li>
                  <li>• Audit logs</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t-2 border-gray-300 text-center text-xs text-gray-600">
            <p className="mb-2">
              <strong className="text-gray-900">Designed and Developed by Ebenezer James</strong>
            </p>
            <p className="mb-1">Using Base44 Platform - Full-stack Development Platform</p>
            <p>© 2025 Coriander Cash & Carry Business Suite | All Rights Reserved</p>
            <p className="mt-2 text-gray-500">Version 1.0 | Last Updated: November 2025</p>
          </div>
        </div>
      </div>
    </>
  );
}