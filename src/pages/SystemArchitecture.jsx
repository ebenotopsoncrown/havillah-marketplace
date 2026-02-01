import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, Database, Globe, Lock, ShoppingCart, Users, 
  Package, TruckIcon, FileText, BarChart3, Code, Layers,
  Shield, CreditCard, Mail, Cloud, Smartphone, ChevronRight
} from "lucide-react";

export default function SystemArchitecture() {
  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">System Architecture</h1>
          <p className="text-lg text-gray-600">Comprehensive architectural design and technical documentation for Havillah Marketplace</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tech-stack">Tech Stack</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="data">Data Models</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  System Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Havillah Marketplace is a comprehensive multi-channel retail management system designed for Afro-Asian grocery and merchandise operations. 
                  The platform integrates point-of-sale (POS), e-commerce, inventory management, order fulfillment, and delivery operations into a unified system.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Frontend Architecture
                    </h3>
                    <p className="text-sm text-blue-800">Single Page Application (SPA) built with React, providing responsive interfaces for staff, customers, and drivers</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <Server className="w-4 h-4" />
                      Backend Architecture
                    </h3>
                    <p className="text-sm text-green-800">Serverless backend powered by Base44 platform with Deno runtime for custom functions</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      Data Layer
                    </h3>
                    <p className="text-sm text-purple-800">PostgreSQL database with JSON schema-based entities, real-time subscriptions, and relational integrity</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                      <Cloud className="w-4 h-4" />
                      Cloud Infrastructure
                    </h3>
                    <p className="text-sm text-orange-800">Fully cloud-hosted on Base44 platform with auto-scaling, CDN delivery, and 99.9% uptime SLA</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { icon: ShoppingCart, title: "Multi-Channel Sales", desc: "In-store POS, online ordering, click & collect" },
                    { icon: Package, title: "Inventory Management", desc: "Real-time stock tracking, auto-reorder alerts, batch tracking" },
                    { icon: TruckIcon, title: "Delivery Operations", desc: "Route optimization, driver tracking, ETA calculations" },
                    { icon: Users, title: "Customer Management", desc: "Account creation, order history, loyalty tracking" },
                    { icon: BarChart3, title: "Business Intelligence", desc: "Sales analytics, P&L statements, financial reports" },
                    { icon: Lock, title: "Security & Compliance", desc: "GDPR compliance, data encryption, audit logging" },
                  ].map((item, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <item.icon className="w-6 h-6 text-indigo-600 mb-2" />
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TECH STACK TAB */}
          <TabsContent value="tech-stack" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Technology Stack
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Frontend Technologies
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Core Framework</h4>
                      <div className="space-y-2">
                        <Badge variant="secondary">React 18.2</Badge>
                        <Badge variant="secondary">React Router DOM 6.26</Badge>
                        <Badge variant="secondary">React Query (TanStack)</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Component-based architecture with hooks, client-side routing, and optimistic updates</p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">UI & Styling</h4>
                      <div className="space-y-2">
                        <Badge variant="secondary">Tailwind CSS 3.x</Badge>
                        <Badge variant="secondary">Radix UI</Badge>
                        <Badge variant="secondary">shadcn/ui Components</Badge>
                        <Badge variant="secondary">Lucide Icons</Badge>
                        <Badge variant="secondary">Framer Motion</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Utility-first CSS, accessible components, smooth animations</p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Data Visualization</h4>
                      <div className="space-y-2">
                        <Badge variant="secondary">Recharts 2.15</Badge>
                        <Badge variant="secondary">Date-fns</Badge>
                        <Badge variant="secondary">Moment.js</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Charts, graphs, and date/time formatting</p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Form Management</h4>
                      <div className="space-y-2">
                        <Badge variant="secondary">React Hook Form 7.54</Badge>
                        <Badge variant="secondary">Zod 3.24</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Type-safe form validation and state management</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Server className="w-5 h-5 text-green-600" />
                    Backend Technologies
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Runtime Environment</h4>
                      <div className="space-y-2">
                        <Badge variant="secondary">Deno Deploy</Badge>
                        <Badge variant="secondary">Base44 SDK 0.8.11</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Secure TypeScript/JavaScript runtime with built-in security</p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Backend Functions</h4>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>calculateDeliveryFee</li>
                        <li>optimizeDeliveryRoute</li>
                        <li>validateAddress</li>
                        <li>createStripeCheckout</li>
                        <li>processRefund</li>
                        <li>cancelOrder</li>
                        <li>deleteCustomerData</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-600" />
                    Database & Storage
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Database</h4>
                      <div className="space-y-2">
                        <Badge variant="secondary">PostgreSQL</Badge>
                        <Badge variant="secondary">JSON Schema Validation</Badge>
                        <Badge variant="secondary">Real-time Subscriptions</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Relational database with ACID compliance and WebSocket support</p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">File Storage</h4>
                      <div className="space-y-2">
                        <Badge variant="secondary">Supabase Storage</Badge>
                        <Badge variant="secondary">CDN Delivery</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Object storage for images, documents, and media files</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-orange-600" />
                    External Services & APIs
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Payment Processing</h4>
                      <Badge variant="secondary">Stripe API</Badge>
                      <p className="text-sm text-gray-600 mt-2">PCI-compliant payment processing, refunds, webhooks</p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Maps & Routing</h4>
                      <Badge variant="secondary">Google Maps API</Badge>
                      <p className="text-sm text-gray-600 mt-2">Address validation, geocoding, route optimization, distance matrix</p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Email & Notifications</h4>
                      <Badge variant="secondary">Base44 Core</Badge>
                      <p className="text-sm text-gray-600 mt-2">Transactional emails, order confirmations, notifications</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MODULES TAB */}
          <TabsContent value="modules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  System Modules & Functionalities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    title: "Point of Sale (POS)",
                    icon: ShoppingCart,
                    color: "blue",
                    features: [
                      "Fast product search and barcode scanning",
                      "Cart management with discounts",
                      "Multiple payment methods (cash, card, account)",
                      "Split payments and change calculation",
                      "Receipt generation and printing",
                      "Real-time inventory updates",
                      "Customer lookup and purchase history",
                      "Quick sale processing for walk-in customers"
                    ]
                  },
                  {
                    title: "E-Commerce Storefront",
                    icon: Globe,
                    color: "green",
                    features: [
                      "Public-facing online store",
                      "Product catalog with categories and search",
                      "Shopping cart with quantity management",
                      "Customer account creation and login",
                      "Order placement (delivery or click & collect)",
                      "Stripe payment integration",
                      "Real-time delivery fee calculation",
                      "Order tracking and history",
                      "Product detail modals with images",
                      "Responsive mobile-first design"
                    ]
                  },
                  {
                    title: "Inventory Management",
                    icon: Package,
                    color: "purple",
                    features: [
                      "Product catalog with SKU and barcode",
                      "Category-based organization",
                      "Stock quantity tracking with reserved stock",
                      "Low stock alerts (category-based thresholds)",
                      "Stock adjustment logging (damage, wastage, corrections)",
                      "Bulk import via CSV/file upload",
                      "Barcode generation and printing",
                      "Multi-unit support (piece, kg, litre, pack)",
                      "Price tiers (retail, wholesale)",
                      "VAT rate management (0%, 5%, 20%)",
                      "Image upload and storage"
                    ]
                  },
                  {
                    title: "Order Management",
                    icon: FileText,
                    color: "indigo",
                    features: [
                      "Order lifecycle management (pending → confirmed → picking → ready → dispatched → delivered)",
                      "Order search and filtering",
                      "Customer details and delivery information",
                      "Order confirmation workflow",
                      "Picking and packing interface",
                      "Order cancellation with refund processing",
                      "Click & collect management",
                      "Ready for pickup notifications",
                      "Order item breakdown with pricing",
                      "VAT and delivery charge calculation",
                      "Payment method tracking"
                    ]
                  },
                  {
                    title: "Delivery Operations",
                    icon: TruckIcon,
                    color: "orange",
                    features: [
                      "Driver assignment and management",
                      "Delivery run creation and optimization",
                      "Google Maps route optimization",
                      "Postcode-based delivery zones",
                      "Dynamic delivery fee calculation",
                      "Driver mobile app interface",
                      "Real-time delivery tracking",
                      "Customer signature capture",
                      "Delivery manifest and run summary",
                      "Distance and duration tracking",
                      "Delivery completion workflow"
                    ]
                  },
                  {
                    title: "Customer Management",
                    icon: Users,
                    color: "pink",
                    features: [
                      "Customer database with contact info",
                      "Customer types (retail, wholesale, restaurant, shop)",
                      "Pricing tiers for different customer segments",
                      "Credit limits and balance tracking",
                      "Purchase history and order tracking",
                      "Account management (retail vs wholesale)",
                      "Customer portal for online ordering",
                      "Address book and delivery preferences",
                      "Customer data export (GDPR)",
                      "Account deletion functionality"
                    ]
                  },
                  {
                    title: "Financial Management",
                    icon: BarChart3,
                    color: "emerald",
                    features: [
                      "Sales tracking and reporting",
                      "Profit & Loss statements",
                      "Balance sheet generation",
                      "Cash flow analysis",
                      "Expense management and categorization",
                      "VAT tracking and reporting",
                      "Payment method breakdown",
                      "Revenue analytics by period",
                      "Top products and customer analysis",
                      "Financial drill-down capabilities"
                    ]
                  },
                  {
                    title: "Supplier & Purchasing",
                    icon: TruckIcon,
                    color: "red",
                    features: [
                      "Supplier database management",
                      "Purchase order creation and tracking",
                      "Goods receiving workflow",
                      "Supplier payment terms and balances",
                      "Order quantity vs received tracking",
                      "Cost price management",
                      "Purchase history by supplier",
                      "Purchase order status management"
                    ]
                  },
                  {
                    title: "Reports & Analytics",
                    icon: BarChart3,
                    color: "cyan",
                    features: [
                      "Dashboard with key metrics",
                      "Sales charts and trends",
                      "Low stock alerts",
                      "Top selling products",
                      "Recent sales summary",
                      "Transaction drill-down",
                      "Expense analysis",
                      "Inventory valuation reports",
                      "Custom date range filtering"
                    ]
                  },
                  {
                    title: "Security & Compliance",
                    icon: Shield,
                    color: "slate",
                    features: [
                      "Role-based access control (admin/user)",
                      "Audit logging for all critical actions",
                      "GDPR compliance tools",
                      "Cookie consent management",
                      "Privacy policy and terms of service",
                      "Data export functionality",
                      "Account deletion with cascade",
                      "Encrypted sensitive data",
                      "IP address logging",
                      "Session management"
                    ]
                  }
                ].map((module, idx) => (
                  <div key={idx} className={`border border-${module.color}-200 rounded-lg p-5 bg-${module.color}-50`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 bg-${module.color}-100 rounded-lg`}>
                        <module.icon className={`w-6 h-6 text-${module.color}-600`} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-2">
                      {module.features.map((feature, fidx) => (
                        <div key={fidx} className="flex items-start gap-2 text-sm text-gray-700">
                          <ChevronRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* DATA MODELS TAB */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Models & Entities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    entity: "Product",
                    description: "Core product catalog with inventory tracking",
                    fields: ["sku", "barcode", "name", "description", "category_id", "brand", "retail_price", "wholesale_price", "cost_price", "vat_rate", "stock_quantity", "reserved_quantity", "reorder_level", "unit_type", "weight_kg", "is_active", "image_url", "location"]
                  },
                  {
                    entity: "Category",
                    description: "Product categorization and minimum stock levels",
                    fields: ["name", "description", "parent_category_id", "display_order", "is_active", "minimum_stock_level"]
                  },
                  {
                    entity: "Order",
                    description: "Customer orders for delivery or click & collect",
                    fields: ["order_number", "order_date", "customer_id", "customer_name", "customer_email", "customer_phone", "delivery_address", "delivery_postcode", "delivery_type", "delivery_slot", "subtotal", "vat_amount", "delivery_charge", "total_amount", "status", "payment_method", "payment_status", "stripe_payment_intent_id", "confirmed_by", "confirmed_at", "picked_by", "picked_at", "driver_id", "cancelled_by", "cancelled_at", "cancellation_reason", "refund_amount", "refund_id", "refund_status", "notes"]
                  },
                  {
                    entity: "OrderItem",
                    description: "Line items for each order",
                    fields: ["order_id", "product_id", "product_name", "sku", "quantity", "unit_price", "vat_rate", "line_total"]
                  },
                  {
                    entity: "Sale",
                    description: "In-store POS transactions",
                    fields: ["sale_number", "sale_date", "customer_id", "customer_name", "subtotal", "vat_amount", "discount_amount", "total_amount", "payment_method", "cash_paid", "card_paid", "change_given", "status", "cashier_name", "terminal_id", "notes"]
                  },
                  {
                    entity: "SaleItem",
                    description: "Line items for each POS sale",
                    fields: ["sale_id", "product_id", "product_name", "sku", "quantity", "unit_price", "vat_rate", "discount_percent", "line_total"]
                  },
                  {
                    entity: "Customer",
                    description: "Customer accounts and contact information",
                    fields: ["customer_code", "business_name", "contact_name", "email", "phone", "customer_type", "pricing_tier", "credit_limit", "credit_balance", "address_line1", "address_line2", "city", "postcode", "vat_number", "is_active"]
                  },
                  {
                    entity: "Supplier",
                    description: "Supplier database for purchasing",
                    fields: ["supplier_code", "company_name", "contact_name", "email", "phone", "address", "postcode", "payment_terms", "vat_number", "account_balance", "is_active"]
                  },
                  {
                    entity: "PurchaseOrder",
                    description: "Purchase orders to suppliers",
                    fields: ["po_number", "po_date", "supplier_id", "supplier_name", "expected_delivery_date", "total_amount", "status", "received_date", "notes"]
                  },
                  {
                    entity: "PurchaseOrderItem",
                    description: "Line items for purchase orders",
                    fields: ["po_id", "product_id", "product_name", "sku", "quantity_ordered", "quantity_received", "unit_cost", "line_total"]
                  },
                  {
                    entity: "StockAdjustment",
                    description: "Inventory adjustments and corrections",
                    fields: ["adjustment_date", "product_id", "product_name", "sku", "adjustment_type", "quantity_change", "old_quantity", "new_quantity", "reason", "adjusted_by"]
                  },
                  {
                    entity: "Expense",
                    description: "Business expense tracking",
                    fields: ["expense_date", "expense_number", "category", "description", "amount", "vat_amount", "payment_method", "paid_to", "reference", "status", "notes"]
                  },
                  {
                    entity: "DeliveryRun",
                    description: "Delivery route optimization and tracking",
                    fields: ["run_number", "driver_id", "driver_name", "status", "order_ids", "optimized_route", "start_time", "end_time", "total_duration_minutes", "total_distance_miles", "delivery_stops"]
                  },
                  {
                    entity: "AuditLog",
                    description: "System audit trail for security and compliance",
                    fields: ["action", "user_email", "user_id", "ip_address", "entity_type", "entity_id", "old_value", "new_value", "details", "timestamp", "success", "error_message"]
                  },
                  {
                    entity: "User (Built-in)",
                    description: "System users with role-based access",
                    fields: ["id", "full_name", "email", "role (admin/user)", "created_date"]
                  }
                ].map((model, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{model.entity}</h3>
                      <Badge variant="outline">{model.fields.length} fields</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {model.fields.map((field, fidx) => (
                        <Badge key={fidx} variant="secondary" className="text-xs">{field}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Built-in Entity Attributes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">Every entity automatically includes the following system-managed fields:</p>
                <div className="grid md:grid-cols-4 gap-3">
                  <Badge variant="outline" className="justify-center py-2">id (UUID)</Badge>
                  <Badge variant="outline" className="justify-center py-2">created_date</Badge>
                  <Badge variant="outline" className="justify-center py-2">updated_date</Badge>
                  <Badge variant="outline" className="justify-center py-2">created_by</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECURITY TAB */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Authentication & Authorization</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">User Authentication</h4>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>Base44 built-in authentication system</li>
                        <li>Email/password login</li>
                        <li>Session management with secure tokens</li>
                        <li>Automatic session expiry</li>
                        <li>Password reset functionality</li>
                      </ul>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Role-Based Access Control</h4>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li><strong>Admin:</strong> Full system access</li>
                        <li><strong>User:</strong> Limited staff access</li>
                        <li><strong>Customer:</strong> Self-service portal only</li>
                        <li>Role enforcement at API level</li>
                        <li>UI elements hidden based on permissions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Data Security</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Encryption</h4>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>HTTPS/TLS for all communications</li>
                        <li>Database encryption at rest</li>
                        <li>Encrypted API secrets and keys</li>
                        <li>Secure cookie storage</li>
                      </ul>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Data Protection</h4>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>Input validation and sanitization</li>
                        <li>SQL injection prevention</li>
                        <li>XSS protection</li>
                        <li>CSRF token validation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">GDPR Compliance</h3>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Right to Access</h4>
                        <p className="text-sm text-gray-600">Users can export their personal data in JSON format</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Right to Erasure</h4>
                        <p className="text-sm text-gray-600">Account deletion with cascade data removal</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Consent Management</h4>
                        <p className="text-sm text-gray-600">Cookie consent banner with preferences storage</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Audit & Compliance</h3>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Audit Logging</h4>
                    <p className="text-sm text-gray-600 mb-3">Comprehensive audit trail for all critical system actions:</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>User login/logout events</li>
                        <li>Order creation and status changes</li>
                        <li>Payment processing and refunds</li>
                        <li>Stock adjustments and inventory updates</li>
                      </ul>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>Product and pricing changes</li>
                        <li>Customer data modifications</li>
                        <li>System configuration changes</li>
                        <li>Failed authentication attempts</li>
                      </ul>
                    </div>
                    <p className="text-sm text-gray-500 mt-3 italic">All audit logs include: timestamp, user email, IP address, action type, old/new values, and success status</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Payment Security</h3>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                      <li><strong>PCI-DSS Compliance:</strong> Stripe handles all card data, no card details stored in system</li>
                      <li><strong>Tokenization:</strong> Card payments use secure tokens, not raw card numbers</li>
                      <li><strong>3D Secure:</strong> Optional SCA (Strong Customer Authentication) for EU payments</li>
                      <li><strong>Webhook Verification:</strong> Stripe webhook signatures validated before processing</li>
                      <li><strong>Refund Processing:</strong> Secure refund API with amount validation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* INTEGRATIONS TAB */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="w-5 h-5" />
                  External Integrations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border border-green-200 rounded-lg p-5 bg-green-50">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">Stripe Payment Processing</h3>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Complete payment infrastructure for online orders with support for multiple payment methods
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Features</h4>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>Checkout session creation</li>
                        <li>Card payment processing</li>
                        <li>Payment intent tracking</li>
                        <li>Automatic refund processing</li>
                        <li>Webhook event handling</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Implementation</h4>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>Backend function: createStripeCheckout</li>
                        <li>Backend function: processRefund</li>
                        <li>Secret: STRIPE_SECRET_KEY</li>
                        <li>Secret: STRIPE_PUBLISHABLE_KEY</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-blue-200 rounded-lg p-5 bg-blue-50">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">Google Maps Platform</h3>
                    <Badge className="bg-blue-600">Active</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Location services for delivery operations, address validation, and route optimization
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">APIs Used</h4>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>Geocoding API - Address validation</li>
                        <li>Distance Matrix API - Delivery fees</li>
                        <li>Directions API - Route optimization</li>
                        <li>Places API - Address autocomplete</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Implementation</h4>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>Backend function: validateAddress</li>
                        <li>Backend function: calculateDeliveryFee</li>
                        <li>Backend function: optimizeDeliveryRoute</li>
                        <li>Secret: GOOGLE_MAPS_API_KEY</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-purple-200 rounded-lg p-5 bg-purple-50">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-900">Email Service (Base44 Core)</h3>
                    <Badge className="bg-purple-600">Built-in</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Transactional email service for customer and staff notifications
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Email Types</h4>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>Order confirmations</li>
                        <li>Order status updates</li>
                        <li>Ready for collection notifications</li>
                        <li>Delivery confirmations</li>
                        <li>Refund notifications</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Implementation</h4>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>Base44 SendEmail integration</li>
                        <li>HTML email templates</li>
                        <li>Automatic sender configuration</li>
                        <li>Delivery tracking</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-orange-200 rounded-lg p-5 bg-orange-50">
                  <div className="flex items-center gap-3 mb-3">
                    <Database className="w-6 h-6 text-orange-600" />
                    <h3 className="text-lg font-bold text-gray-900">Base44 Platform Services</h3>
                    <Badge className="bg-orange-600">Built-in</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Core Services</h4>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>Entity database with real-time subscriptions</li>
                        <li>User authentication and management</li>
                        <li>File storage and CDN delivery</li>
                        <li>Backend function execution</li>
                        <li>Environment variable management</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">AI Services</h4>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>LLM invocation with web context</li>
                        <li>Image generation</li>
                        <li>File data extraction</li>
                        <li>JSON schema parsing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">
                    All external API calls are routed through secure backend functions to protect API keys and ensure proper error handling:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <span className="font-mono text-xs">Frontend (React)</span>
                      <span className="text-gray-400">→</span>
                      <Server className="w-4 h-4 text-green-600" />
                      <span className="font-mono text-xs">Backend Function (Deno)</span>
                      <span className="text-gray-400">→</span>
                      <Cloud className="w-4 h-4 text-purple-600" />
                      <span className="font-mono text-xs">External API</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    ✓ API keys never exposed to frontend<br/>
                    ✓ Request validation and rate limiting<br/>
                    ✓ Centralized error handling and logging
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Deployment Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-blue-600" />
                  Hosting
                </h4>
                <p className="text-sm text-gray-600">Fully managed on Base44 platform with global CDN distribution and auto-scaling</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Server className="w-5 h-5 text-green-600" />
                  Backend Functions
                </h4>
                <p className="text-sm text-gray-600">Serverless Deno functions with instant deployment and automatic HTTPS</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-600" />
                  Database
                </h4>
                <p className="text-sm text-gray-600">Managed PostgreSQL with automatic backups and point-in-time recovery</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}