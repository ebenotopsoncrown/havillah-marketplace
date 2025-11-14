import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, 
  Shield, 
  Layers, 
  Globe, 
  Database, 
  Lock, 
  Cloud,
  ShoppingCart,
  Store,
  TrendingUp,
  Users,
  Package,
  CreditCard,
  FileText,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SystemDocumentation() {
  const [activeTab, setActiveTab] = useState("architecture");

  const downloadDocumentation = () => {
    alert("Documentation download feature - would export all diagrams and specs as PDF");
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Coriander Cash & Carry - System Documentation
            </h1>
            <p className="text-gray-600">Complete technical architecture and design specifications</p>
          </div>
          <Button onClick={downloadDocumentation} className="bg-indigo-600">
            <Download className="w-4 h-4 mr-2" />
            Export Documentation
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="architecture">System Architecture</TabsTrigger>
            <TabsTrigger value="design">UI/UX Design</TabsTrigger>
            <TabsTrigger value="technical">Technical Stack</TabsTrigger>
            <TabsTrigger value="security">Security & Compliance</TabsTrigger>
          </TabsList>

          {/* SYSTEM ARCHITECTURE TAB */}
          <TabsContent value="architecture" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  System Architecture Diagram
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 border-2 border-indigo-200">
                  <div className="space-y-8">
                    {/* Layer 1: User Interface Layer */}
                    <div>
                      <h3 className="text-center text-lg font-bold text-indigo-900 mb-4 border-b-2 border-indigo-300 pb-2">
                        USER INTERFACE LAYER
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-green-400">
                          <div className="flex items-center gap-2 mb-2">
                            <ShoppingCart className="w-5 h-5 text-green-600" />
                            <h4 className="font-bold text-green-900">POS System</h4>
                          </div>
                          <ul className="text-xs space-y-1 text-gray-700">
                            <li>• Product Scanning</li>
                            <li>• Sales Processing</li>
                            <li>• Payment Collection</li>
                            <li>• Receipt Printing</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-blue-400">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <h4 className="font-bold text-blue-900">ERP Admin Panel</h4>
                          </div>
                          <ul className="text-xs space-y-1 text-gray-700">
                            <li>• Inventory Management</li>
                            <li>• Purchase Orders</li>
                            <li>• Expense Tracking</li>
                            <li>• Financial Reports</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-purple-400">
                          <div className="flex items-center gap-2 mb-2">
                            <Store className="w-5 h-5 text-purple-600" />
                            <h4 className="font-bold text-purple-900">Online Store</h4>
                          </div>
                          <ul className="text-xs space-y-1 text-gray-700">
                            <li>• Product Catalog</li>
                            <li>• Shopping Cart</li>
                            <li>• Online Checkout</li>
                            <li>• Order Tracking</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Connection Arrow */}
                    <div className="flex justify-center">
                      <div className="text-center">
                        <div className="text-4xl text-indigo-600">↓</div>
                        <p className="text-sm font-semibold text-indigo-700">Real-time Data Sync</p>
                      </div>
                    </div>

                    {/* Layer 2: Application Layer */}
                    <div>
                      <h3 className="text-center text-lg font-bold text-indigo-900 mb-4 border-b-2 border-indigo-300 pb-2">
                        APPLICATION LAYER
                      </h3>
                      <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-indigo-400">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                              <Server className="w-4 h-4" />
                              React Frontend (Base44 Platform)
                            </h4>
                            <ul className="text-sm space-y-1 text-gray-700">
                              <li>→ React 18 with Hooks</li>
                              <li>→ TanStack Query (Data Management)</li>
                              <li>→ Tailwind CSS (Styling)</li>
                              <li>→ Shadcn/UI Components</li>
                              <li>→ React Router (Navigation)</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                              <Layers className="w-4 h-4" />
                              Backend Services (Base44 BaaS)
                            </h4>
                            <ul className="text-sm space-y-1 text-gray-700">
                              <li>→ RESTful API Gateway</li>
                              <li>→ Authentication Service</li>
                              <li>→ Database Management</li>
                              <li>→ File Storage Service</li>
                              <li>→ Integration Engine</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connection Arrow */}
                    <div className="flex justify-center">
                      <div className="text-center">
                        <div className="text-4xl text-indigo-600">↓</div>
                        <p className="text-sm font-semibold text-indigo-700">Secure API Calls</p>
                      </div>
                    </div>

                    {/* Layer 3: Data Layer */}
                    <div>
                      <h3 className="text-center text-lg font-bold text-indigo-900 mb-4 border-b-2 border-indigo-300 pb-2">
                        DATA LAYER
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-orange-400">
                          <div className="flex items-center gap-2 mb-2">
                            <Database className="w-5 h-5 text-orange-600" />
                            <h4 className="font-bold text-orange-900">PostgreSQL</h4>
                          </div>
                          <ul className="text-xs space-y-1 text-gray-700">
                            <li>• Transactional Data</li>
                            <li>• Product Catalog</li>
                            <li>• Customer Records</li>
                            <li>• Order History</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-red-400">
                          <div className="flex items-center gap-2 mb-2">
                            <Cloud className="w-5 h-5 text-red-600" />
                            <h4 className="font-bold text-red-900">File Storage</h4>
                          </div>
                          <ul className="text-xs space-y-1 text-gray-700">
                            <li>• Product Images</li>
                            <li>• Receipts</li>
                            <li>• Reports (PDF)</li>
                            <li>• Documents</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-green-400">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-5 h-5 text-green-600" />
                            <h4 className="font-bold text-green-900">Security Layer</h4>
                          </div>
                          <ul className="text-xs space-y-1 text-gray-700">
                            <li>• JWT Authentication</li>
                            <li>• Role-based Access</li>
                            <li>• Data Encryption</li>
                            <li>• Audit Logs</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Layer 4: Integration Layer */}
                    <div>
                      <h3 className="text-center text-lg font-bold text-indigo-900 mb-4 border-b-2 border-indigo-300 pb-2">
                        INTEGRATION LAYER
                      </h3>
                      <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-purple-400">
                        <div className="grid grid-cols-4 gap-3">
                          <div className="text-center">
                            <CreditCard className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                            <p className="text-xs font-semibold">Payment Gateway</p>
                            <p className="text-xs text-gray-600">Stripe/PayPal</p>
                          </div>
                          <div className="text-center">
                            <FileText className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                            <p className="text-xs font-semibold">LLM API</p>
                            <p className="text-xs text-gray-600">AI Features</p>
                          </div>
                          <div className="text-center">
                            <Globe className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                            <p className="text-xs font-semibold">Email Service</p>
                            <p className="text-xs text-gray-600">Notifications</p>
                          </div>
                          <div className="text-center">
                            <Package className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                            <p className="text-xs font-semibold">Barcode API</p>
                            <p className="text-xs text-gray-600">Label Printing</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Flow Diagram */}
            <Card>
              <CardHeader>
                <CardTitle>Integration Flow: POS → ERP → Online Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-6 border">
                  <div className="space-y-4">
                    {/* Flow 1: POS Sale */}
                    <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                      <h4 className="font-bold text-green-900 mb-2">1. POS Sale Transaction</h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>Customer purchases at POS → Sale recorded in database</p>
                        <p className="ml-4">↓ Instant update to:</p>
                        <p className="ml-8">• Inventory (stock reduced)</p>
                        <p className="ml-8">• Financial records (revenue recorded)</p>
                        <p className="ml-8">• ERP dashboard (real-time metrics updated)</p>
                        <p className="ml-8">• Online store (product availability synced)</p>
                      </div>
                    </div>

                    {/* Flow 2: Online Order */}
                    <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                      <h4 className="font-bold text-purple-900 mb-2">2. Online Store Order</h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>Customer orders online → Order created in system</p>
                        <p className="ml-4">↓ Triggers:</p>
                        <p className="ml-8">• Inventory reservation</p>
                        <p className="ml-8">• Order appears in ERP (Orders page)</p>
                        <p className="ml-8">• Delivery management (dispatch tracking)</p>
                        <p className="ml-8">• Stock reduction on delivery</p>
                      </div>
                    </div>

                    {/* Flow 3: Inventory Management */}
                    <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                      <h4 className="font-bold text-blue-900 mb-2">3. Inventory Receiving (ERP)</h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>Purchase order received → Stock updated in ERP</p>
                        <p className="ml-4">↓ Instant sync to:</p>
                        <p className="ml-8">• POS (products available for sale)</p>
                        <p className="ml-8">• Online store (products visible to customers)</p>
                        <p className="ml-8">• Reports (inventory value updated)</p>
                        <p className="ml-8">• Financial statements (asset value adjusted)</p>
                      </div>
                    </div>

                    {/* Flow 4: Reports */}
                    <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                      <h4 className="font-bold text-orange-900 mb-2">4. Financial Reporting</h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>All transactions (POS + Online + Expenses) → Consolidated in real-time</p>
                        <p className="ml-4">↓ Generate:</p>
                        <p className="ml-8">• Profit & Loss Statement</p>
                        <p className="ml-8">• Balance Sheet</p>
                        <p className="ml-8">• Cash Flow Statement</p>
                        <p className="ml-8">• Every figure drills down to source transactions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* UI/UX DESIGN TAB */}
          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>UI/UX Design Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Design Principles */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Design Principles</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                      <h4 className="font-bold text-blue-900 mb-2">Clean & Modern</h4>
                      <p className="text-sm text-gray-700">
                        Minimalist interface with focus on usability. White space for clarity.
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                      <h4 className="font-bold text-green-900 mb-2">Responsive Design</h4>
                      <p className="text-sm text-gray-700">
                        Fully responsive across desktop, tablet, and mobile devices.
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                      <h4 className="font-bold text-purple-900 mb-2">Accessibility First</h4>
                      <p className="text-sm text-gray-700">
                        WCAG 2.1 compliant with keyboard navigation and screen reader support.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Color Palette */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Color Palette</h3>
                  <div className="grid grid-cols-6 gap-4">
                    <div>
                      <div className="w-full h-20 bg-indigo-600 rounded-lg border"></div>
                      <p className="text-xs text-center mt-2 font-mono">#4F46E5</p>
                      <p className="text-xs text-center">Primary</p>
                    </div>
                    <div>
                      <div className="w-full h-20 bg-green-600 rounded-lg border"></div>
                      <p className="text-xs text-center mt-2 font-mono">#10B981</p>
                      <p className="text-xs text-center">Success</p>
                    </div>
                    <div>
                      <div className="w-full h-20 bg-orange-600 rounded-lg border"></div>
                      <p className="text-xs text-center mt-2 font-mono">#F59E0B</p>
                      <p className="text-xs text-center">Warning</p>
                    </div>
                    <div>
                      <div className="w-full h-20 bg-red-600 rounded-lg border"></div>
                      <p className="text-xs text-center mt-2 font-mono">#EF4444</p>
                      <p className="text-xs text-center">Error</p>
                    </div>
                    <div>
                      <div className="w-full h-20 bg-gray-900 rounded-lg border"></div>
                      <p className="text-xs text-center mt-2 font-mono">#111827</p>
                      <p className="text-xs text-center">Text</p>
                    </div>
                    <div>
                      <div className="w-full h-20 bg-gray-100 rounded-lg border"></div>
                      <p className="text-xs text-center mt-2 font-mono">#F9FAFB</p>
                      <p className="text-xs text-center">Background</p>
                    </div>
                  </div>
                </div>

                {/* Typography */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Typography</h3>
                  <div className="space-y-3 bg-gray-50 p-6 rounded-lg border">
                    <div>
                      <p className="text-3xl font-bold">Heading 1 - Inter Bold 30px</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">Heading 2 - Inter Bold 24px</p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold">Heading 3 - Inter Semibold 20px</p>
                    </div>
                    <div>
                      <p className="text-base">Body Text - Inter Regular 16px</p>
                    </div>
                    <div>
                      <p className="text-sm">Small Text - Inter Regular 14px</p>
                    </div>
                  </div>
                </div>

                {/* Component Library */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Component Library</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h4 className="font-semibold mb-3">Buttons</h4>
                      <div className="space-y-2">
                        <Button className="w-full bg-indigo-600">Primary Button</Button>
                        <Button variant="outline" className="w-full">Secondary Button</Button>
                        <Button variant="ghost" className="w-full">Ghost Button</Button>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h4 className="font-semibold mb-3">Cards</h4>
                      <Card className="shadow-lg">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Sample Card</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-indigo-600">£1,234.56</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Wireframe Descriptions */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Page Layouts</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-bold text-gray-900 mb-2">Dashboard Layout</h4>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">
                            <strong>Left Sidebar:</strong> Navigation menu with icons<br/>
                            <strong>Top Bar:</strong> Search, notifications, user profile<br/>
                            <strong>Main Area:</strong> 4-column metrics grid, charts, data tables<br/>
                            <strong>Responsive:</strong> Collapses to hamburger menu on mobile
                          </p>
                        </div>
                        <div className="w-48 bg-gray-100 rounded-lg p-2 border-2">
                          <div className="grid grid-cols-4 gap-1 h-full">
                            <div className="bg-indigo-200 rounded"></div>
                            <div className="col-span-3 space-y-1">
                              <div className="h-4 bg-gray-300 rounded"></div>
                              <div className="grid grid-cols-2 gap-1">
                                <div className="h-8 bg-blue-200 rounded"></div>
                                <div className="h-8 bg-green-200 rounded"></div>
                              </div>
                              <div className="h-12 bg-purple-200 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-bold text-gray-900 mb-2">POS Interface</h4>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">
                            <strong>Left Panel:</strong> Product search and category filter<br/>
                            <strong>Center:</strong> Product grid with images and prices<br/>
                            <strong>Right Panel:</strong> Shopping cart with checkout button<br/>
                            <strong>Features:</strong> Barcode scanner integration, quick payment
                          </p>
                        </div>
                        <div className="w-48 bg-gray-100 rounded-lg p-2 border-2">
                          <div className="grid grid-cols-3 gap-1 h-full">
                            <div className="space-y-1">
                              <div className="h-3 bg-gray-300 rounded"></div>
                              <div className="h-20 bg-blue-200 rounded"></div>
                            </div>
                            <div className="h-full bg-green-200 rounded"></div>
                            <div className="h-full bg-orange-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-bold text-gray-900 mb-2">Online Store</h4>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">
                            <strong>Header:</strong> Logo, navigation, cart icon, search<br/>
                            <strong>Hero:</strong> Banner with promotions<br/>
                            <strong>Content:</strong> Product grid with filters<br/>
                            <strong>Footer:</strong> Contact info, social links, policies
                          </p>
                        </div>
                        <div className="w-48 bg-gray-100 rounded-lg p-2 border-2">
                          <div className="space-y-1 h-full">
                            <div className="h-4 bg-gray-300 rounded"></div>
                            <div className="h-8 bg-purple-200 rounded"></div>
                            <div className="grid grid-cols-3 gap-1 flex-1">
                              <div className="bg-blue-200 rounded"></div>
                              <div className="bg-green-200 rounded"></div>
                              <div className="bg-orange-200 rounded"></div>
                            </div>
                            <div className="h-4 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TECHNICAL STACK TAB */}
          <TabsContent value="technical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-indigo-600" />
                  Technical Stack & Implementation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tech Stack Overview */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Technology Stack</h3>
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border-2 border-indigo-200">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-indigo-900 mb-3">Frontend</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                            <strong>Framework:</strong> React 18.x
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                            <strong>State Management:</strong> TanStack Query (React Query)
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                            <strong>Styling:</strong> Tailwind CSS 3.x
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                            <strong>UI Components:</strong> Shadcn/UI (Radix UI)
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                            <strong>Routing:</strong> React Router 6
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                            <strong>Charts:</strong> Recharts
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                            <strong>Date Handling:</strong> date-fns
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-indigo-900 mb-3">Backend (Base44 Platform)</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <strong>Database:</strong> PostgreSQL (Managed)
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <strong>API:</strong> RESTful API (Node.js)
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <strong>Authentication:</strong> JWT + Session Tokens
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <strong>File Storage:</strong> Cloud Storage (S3-compatible)
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <strong>Hosting:</strong> AWS Infrastructure
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <strong>CDN:</strong> CloudFront
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Integration Method */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Integration Architecture</h3>
                  <div className="bg-gray-50 rounded-lg p-6 border">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-indigo-600">1</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">Real-time Data Synchronization</h4>
                          <p className="text-sm text-gray-700">
                            All modules (POS, ERP, Online Store) connect to a unified database through RESTful APIs. 
                            Changes in one module instantly reflect across all interfaces using React Query's 
                            automatic cache invalidation and refetching mechanisms.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-green-600">2</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">Transaction-based Architecture</h4>
                          <p className="text-sm text-gray-700">
                            Every action (sale, purchase, expense) creates an immutable transaction record with complete 
                            audit trail. All reports and dashboards pull directly from these transactions, ensuring 
                            100% traceability with drill-down capabilities to source data.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-purple-600">3</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">Modular Component Design</h4>
                          <p className="text-sm text-gray-700">
                            System built with reusable React components and shared data models. Each module can be 
                            independently updated without affecting others. Shared utilities and hooks ensure 
                            consistent behavior across the application.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-orange-600">4</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">AI-Powered Features</h4>
                          <p className="text-sm text-gray-700">
                            Integration with LLM APIs for intelligent features: automatic product data extraction from URLs, 
                            natural language queries for reports, and predictive analytics for inventory management.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hosting Infrastructure */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Hosting & Infrastructure</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border-2 border-orange-200">
                      <Cloud className="w-8 h-8 text-orange-600 mb-2" />
                      <h4 className="font-bold text-orange-900 mb-2">Cloud Platform</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Provider:</strong> Amazon Web Services (AWS)
                      </p>
                      <ul className="text-xs space-y-1 text-gray-600">
                        <li>• EC2 for application servers</li>
                        <li>• RDS for managed PostgreSQL</li>
                        <li>• S3 for file storage</li>
                        <li>• CloudFront for CDN</li>
                        <li>• Route 53 for DNS</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
                      <Server className="w-8 h-8 text-blue-600 mb-2" />
                      <h4 className="font-bold text-blue-900 mb-2">Scalability</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Auto-scaling:</strong> Handles traffic spikes
                      </p>
                      <ul className="text-xs space-y-1 text-gray-600">
                        <li>• Load balancing across instances</li>
                        <li>• Database read replicas</li>
                        <li>• CDN edge caching</li>
                        <li>• Horizontal scaling ready</li>
                        <li>• 99.9% uptime SLA</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                      <Shield className="w-8 h-8 text-green-600 mb-2" />
                      <h4 className="font-bold text-green-900 mb-2">Performance</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Optimization:</strong> Fast & responsive
                      </p>
                      <ul className="text-xs space-y-1 text-gray-600">
                        <li>• Code splitting & lazy loading</li>
                        <li>• API response caching</li>
                        <li>• Image optimization</li>
                        <li>• Database query optimization</li>
                        <li>• Gzip compression</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Data Model */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Database Schema Overview</h3>
                  <div className="bg-gray-50 rounded-lg p-6 border">
                    <div className="grid md:grid-cols-2 gap-6 text-sm">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Core Entities</h4>
                        <ul className="space-y-1 text-gray-700">
                          <li>• <strong>Product:</strong> SKU, name, prices, stock, barcode</li>
                          <li>• <strong>Category:</strong> Hierarchical product categories</li>
                          <li>• <strong>Customer:</strong> Contact info, credit limits, balances</li>
                          <li>• <strong>Supplier:</strong> Vendor information, payment terms</li>
                          <li>• <strong>Sale:</strong> POS transactions with payment details</li>
                          <li>• <strong>SaleItem:</strong> Line items for each sale</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">ERP Entities</h4>
                        <ul className="space-y-1 text-gray-700">
                          <li>• <strong>Order:</strong> Online orders with delivery info</li>
                          <li>• <strong>OrderItem:</strong> Order line items</li>
                          <li>• <strong>PurchaseOrder:</strong> Supplier purchase orders</li>
                          <li>• <strong>PurchaseOrderItem:</strong> PO line items</li>
                          <li>• <strong>Expense:</strong> Business expenses by category</li>
                          <li>• <strong>StockAdjustment:</strong> Inventory changes audit</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECURITY TAB */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Security & Compliance Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Authentication */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Authentication & Authorization</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
                      <Lock className="w-8 h-8 text-blue-600 mb-2" />
                      <h4 className="font-bold text-blue-900 mb-2">User Authentication</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• <strong>Method:</strong> JWT (JSON Web Tokens)</li>
                        <li>• <strong>Session:</strong> Secure HTTP-only cookies</li>
                        <li>• <strong>Password:</strong> bcrypt hashing (12 rounds)</li>
                        <li>• <strong>2FA:</strong> Optional two-factor authentication</li>
                        <li>• <strong>SSO:</strong> Single sign-on support</li>
                        <li>• <strong>Token Expiry:</strong> Auto-refresh mechanism</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
                      <Users className="w-8 h-8 text-purple-600 mb-2" />
                      <h4 className="font-bold text-purple-900 mb-2">Role-Based Access Control</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• <strong>Admin:</strong> Full system access</li>
                        <li>• <strong>Manager:</strong> Reports + inventory management</li>
                        <li>• <strong>Cashier:</strong> POS access only</li>
                        <li>• <strong>Delivery:</strong> Order fulfillment access</li>
                        <li>• <strong>Customer:</strong> Online store + order tracking</li>
                        <li>• <strong>Granular:</strong> Permission-level controls</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Data Security */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Data Security Measures</h3>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-bold text-green-900 mb-2">Encryption</h4>
                        <ul className="text-sm space-y-1 text-gray-700">
                          <li>• HTTPS/TLS 1.3 in transit</li>
                          <li>• AES-256 encryption at rest</li>
                          <li>• Database field encryption</li>
                          <li>• Encrypted backups</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-green-900 mb-2">Access Control</h4>
                        <ul className="text-sm space-y-1 text-gray-700">
                          <li>• IP whitelisting option</li>
                          <li>• API rate limiting</li>
                          <li>• Request throttling</li>
                          <li>• CORS policy enforcement</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-green-900 mb-2">Audit & Monitoring</h4>
                        <ul className="text-sm space-y-1 text-gray-700">
                          <li>• Complete audit logs</li>
                          <li>• Real-time intrusion detection</li>
                          <li>• Failed login monitoring</li>
                          <li>• Security event alerts</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compliance */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Compliance & Standards</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                      <h4 className="font-bold text-orange-900 mb-3">Data Protection</h4>
                      <ul className="text-sm space-y-2 text-gray-700">
                        <li>
                          <strong>GDPR Compliance:</strong> Full compliance with EU data protection regulations
                        </li>
                        <li>
                          <strong>UK DPA 2018:</strong> Adherence to UK Data Protection Act
                        </li>
                        <li>
                          <strong>Right to be Forgotten:</strong> Customer data deletion on request
                        </li>
                        <li>
                          <strong>Data Portability:</strong> Export customer data in standard formats
                        </li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                      <h4 className="font-bold text-blue-900 mb-3">Payment Security</h4>
                      <ul className="text-sm space-y-2 text-gray-700">
                        <li>
                          <strong>PCI DSS:</strong> Level 1 compliance for card processing
                        </li>
                        <li>
                          <strong>Tokenization:</strong> No card data stored in system
                        </li>
                        <li>
                          <strong>Payment Gateway:</strong> Stripe/PayPal integration
                        </li>
                        <li>
                          <strong>3D Secure:</strong> Additional fraud protection layer
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Backup & Recovery */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Backup & Disaster Recovery</h3>
                  <div className="bg-gray-50 rounded-lg p-6 border">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Automated Backups</h4>
                        <ul className="text-sm space-y-1 text-gray-700">
                          <li>• Daily full backups</li>
                          <li>• Hourly incremental backups</li>
                          <li>• 30-day retention period</li>
                          <li>• Multi-region replication</li>
                          <li>• Point-in-time recovery</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Disaster Recovery</h4>
                        <ul className="text-sm space-y-1 text-gray-700">
                          <li>• RTO: &lt; 4 hours</li>
                          <li>• RPO: &lt; 1 hour</li>
                          <li>• Hot standby servers</li>
                          <li>• Failover automation</li>
                          <li>• Regular DR testing</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Business Continuity</h4>
                        <ul className="text-sm space-y-1 text-gray-700">
                          <li>• 99.9% uptime guarantee</li>
                          <li>• Load balancer redundancy</li>
                          <li>• Database replication</li>
                          <li>• CDN global distribution</li>
                          <li>• 24/7 monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Testing */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Security Testing & Validation</h3>
                  <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                    <ul className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-1.5"></div>
                        <span><strong>Penetration Testing:</strong> Quarterly security audits by third-party experts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-1.5"></div>
                        <span><strong>Vulnerability Scanning:</strong> Automated daily scans for security issues</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-1.5"></div>
                        <span><strong>Code Review:</strong> Security-focused code reviews before deployment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-1.5"></div>
                        <span><strong>Security Updates:</strong> Automated dependency updates and patching</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}