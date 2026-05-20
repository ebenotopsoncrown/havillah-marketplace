import React from "react";
import { Store, ShoppingCart, Package, TruckIcon, Users, BarChart3, Receipt, Globe, Smartphone, Database, Cloud, Lock, CreditCard, Bell, FileText, Settings } from "lucide-react";

export default function AppInfographic() {
  const modules = [
    { name: "POS System", icon: ShoppingCart, color: "bg-blue-500", features: ["Fast checkout", "Barcode scanning", "Multiple payment methods"] },
    { name: "Online Store", icon: Globe, color: "bg-green-500", features: ["Customer portal", "Real-time inventory", "Stripe payments"] },
    { name: "Order Management", icon: Receipt, color: "bg-purple-500", features: ["Order tracking", "Status updates", "Email notifications"] },
    { name: "Delivery & Logistics", icon: TruckIcon, color: "bg-orange-500", features: ["Route optimization", "Driver portal", "Click & Collect"] },
    { name: "Inventory Control", icon: Package, color: "bg-indigo-500", features: ["Stock tracking", "Low stock alerts", "Bulk import"] },
    { name: "Customer Management", icon: Users, color: "bg-pink-500", features: ["Customer accounts", "Credit management", "Order history"] },
    { name: "Financial Reports", icon: BarChart3, color: "bg-cyan-500", features: ["P&L statements", "Cash flow", "Balance sheet"] },
    { name: "Supplier Management", icon: Store, color: "bg-amber-500", features: ["Purchase orders", "Stock receiving", "Payment tracking"] }
  ];

  const techStack = [
    { name: "React", desc: "Frontend UI" },
    { name: "Base44 BaaS", desc: "Backend & Database" },
    { name: "Stripe", desc: "Payment Processing" },
    { name: "Google Maps", desc: "Route Optimization" },
    { name: "Real-time Sync", desc: "Live Updates" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978a8de9be83b8a34f67a8d/49e6f5db7_HavillahMarketplacelogo.jpg" 
              alt="Havillah Marketplace" 
              className="h-20 w-auto rounded-xl"
            />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              Havillah Marketplace
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete All-in-One Retail & E-Commerce Management System
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4" /> Web-Based
            </span>
            <span className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" /> Mobile Responsive
            </span>
            <span className="flex items-center gap-2">
              <Cloud className="w-4 h-4" /> Cloud-Powered
            </span>
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4" /> Secure
            </span>
          </div>
        </div>

        {/* System Architecture */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Database className="w-8 h-8 text-green-600" />
            System Architecture
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {/* Frontend Layer */}
            <div className="col-span-1 space-y-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl text-center">
                <Smartphone className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold">Frontend</h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-center">
                <p className="font-semibold">React UI</p>
                <p className="text-xs text-gray-600">Responsive Design</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-center">
                <p className="font-semibold">Tailwind CSS</p>
                <p className="text-xs text-gray-600">Modern Styling</p>
              </div>
            </div>

            {/* Application Layer */}
            <div className="col-span-2 space-y-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl text-center">
                <Settings className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold">Application Layer</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 p-3 rounded-lg text-sm text-center">
                  <p className="font-semibold">Order Processing</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-sm text-center">
                  <p className="font-semibold">Inventory Control</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-sm text-center">
                  <p className="font-semibold">Payment Gateway</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-sm text-center">
                  <p className="font-semibold">Route Optimization</p>
                </div>
              </div>
            </div>

            {/* Backend Layer */}
            <div className="col-span-1 space-y-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl text-center">
                <Cloud className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold">Backend</h3>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-sm text-center">
                <p className="font-semibold">Base44 BaaS</p>
                <p className="text-xs text-gray-600">Serverless</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-sm text-center">
                <p className="font-semibold">PostgreSQL</p>
                <p className="text-xs text-gray-600">Database</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Modules */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Package className="w-8 h-8 text-green-600" />
            Core Modules & Features
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {modules.map((module, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all">
                <div className={`${module.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
                  <module.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{module.name}</h3>
                <ul className="space-y-1">
                  {module.features.map((feature, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Data Flow */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-green-600" />
            Data Flow Architecture
          </h2>
          <div className="flex items-center justify-between gap-4">
            {/* Customer Order */}
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Customer Order</h3>
              <p className="text-xs text-gray-600">Online Store / POS</p>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400"></div>
            </div>

            {/* Order Processing */}
            <div className="flex-1 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Receipt className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Order Processing</h3>
              <p className="text-xs text-gray-600">Validation & Confirmation</p>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-orange-400"></div>
            </div>

            {/* Fulfillment */}
            <div className="flex-1 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Fulfillment</h3>
              <p className="text-xs text-gray-600">Picking & Packing</p>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-green-400"></div>
            </div>

            {/* Delivery */}
            <div className="flex-1 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <TruckIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Delivery</h3>
              <p className="text-xs text-gray-600">Route Optimized</p>
            </div>
          </div>

          {/* Real-time Updates */}
          <div className="mt-6 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-center gap-3 text-green-900">
              <Bell className="w-5 h-5" />
              <p className="font-semibold">Real-time notifications & status updates throughout the entire flow</p>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-cyan-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Cloud className="w-8 h-8 text-cyan-600" />
            Technology Stack
          </h2>
          <div className="flex items-center justify-around">
            {techStack.map((tech, idx) => (
              <div key={idx} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center mb-3 mx-auto border-2 border-cyan-200">
                  <span className="text-2xl font-bold text-cyan-700">{tech.name.charAt(0)}</span>
                </div>
                <h3 className="font-bold text-gray-900">{tech.name}</h3>
                <p className="text-xs text-gray-600">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">Key Benefits</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="font-bold mb-2">Integrated Payments</h3>
              <p className="text-sm text-white/80">Stripe integration for secure online payments</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mx-auto mb-3">
                <Bell className="w-8 h-8" />
              </div>
              <h3 className="font-bold mb-2">Real-time Updates</h3>
              <p className="text-sm text-white/80">Live order tracking and instant notifications</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-bold mb-2">Financial Reports</h3>
              <p className="text-sm text-white/80">Comprehensive P&L, cash flow, and balance sheets</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-gray-600 mb-2">Built with modern web technologies for scalability and performance</p>
          <p className="text-sm text-gray-500">© 2026 Havillah Marketplace - All-in-One Retail Management</p>
        </div>
      </div>
    </div>
  );
}