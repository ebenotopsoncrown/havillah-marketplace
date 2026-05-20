import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe,
  Lock,
  Users,
  Store,
  LayoutDashboard,
  ShieldCheck,
  Link as LinkIcon,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AccessControlGuide() {
  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Control & Domain Setup Guide</h1>
          <p className="text-gray-600">Professional setup for public store and private business suite</p>
        </div>

        <Tabs defaultValue="flow" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="flow">Access Flow</TabsTrigger>
            <TabsTrigger value="domains">Domain Options</TabsTrigger>
            <TabsTrigger value="security">Security Model</TabsTrigger>
          </TabsList>

          {/* ACCESS FLOW TAB */}
          <TabsContent value="flow" className="space-y-6">
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <Globe className="w-6 h-6" />
                  Current Access Flow (Recommended Setup)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white rounded-lg p-6 border-2 border-green-200">
                  <h3 className="font-bold text-xl text-gray-900 mb-6 text-center">
                    www.corianderbusiness.com
                  </h3>

                  {/* Customer Flow */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-lg text-blue-900">For Customers (Public)</h4>
                    </div>
                    <div className="ml-13 space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">They visit: www.corianderbusiness.com</p>
                          <p className="text-sm text-gray-600">They see the <strong>Public Homepage</strong> with:</p>
                          <ul className="text-sm text-gray-600 mt-2 ml-4 space-y-1">
                            <li>• Hero section with company branding</li>
                            <li>• Featured products showcase</li>
                            <li>• "Shop Now" button → goes to Online Store</li>
                            <li>• Business info, contact details</li>
                            <li>• "Staff Login" button (top right) → for staff access</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">They click "Shop Now"</p>
                          <p className="text-sm text-gray-600">They're taken to the <strong>Online Store</strong> page where they can:</p>
                          <ul className="text-sm text-gray-600 mt-2 ml-4 space-y-1">
                            <li>• Browse products by category</li>
                            <li>• Add items to cart</li>
                            <li>• Place orders with delivery details</li>
                            <li>• No login required for shopping</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Staff Flow */}
                  <div className="border-t-2 border-gray-200 pt-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Lock className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h4 className="font-bold text-lg text-indigo-900">For Staff (Private)</h4>
                    </div>
                    <div className="ml-13 space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">They visit: www.corianderbusiness.com</p>
                          <p className="text-sm text-gray-600">They see the same <strong>Public Homepage</strong> as customers</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">They click "Staff Login" (top right)</p>
                          <p className="text-sm text-gray-600">They're taken to the <strong>Staff Portal</strong> page which shows:</p>
                          <ul className="text-sm text-gray-600 mt-2 ml-4 space-y-1">
                            <li>• Secure login interface</li>
                            <li>• "Staff Login" button</li>
                            <li>• List of what they'll access (POS, Inventory, Reports, etc.)</li>
                            <li>• Security badges and info</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">They click "Staff Login" button</p>
                          <p className="text-sm text-gray-600">The system:</p>
                          <ul className="text-sm text-gray-600 mt-2 ml-4 space-y-1">
                            <li>• Redirects to Base44's secure login page</li>
                            <li>• They enter their email & password</li>
                            <li>• System verifies their credentials</li>
                            <li>• Upon success, redirects to <strong>Dashboard</strong></li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">They're now in the Business Suite</p>
                          <p className="text-sm text-gray-600">Full access to:</p>
                          <ul className="text-sm text-gray-600 mt-2 ml-4 space-y-1">
                            <li>• Dashboard with analytics</li>
                            <li>• POS system for in-store sales</li>
                            <li>• Products & inventory management</li>
                            <li>• Orders, delivery, purchases, expenses</li>
                            <li>• Financial reports</li>
                            <li>• Settings & user management</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Key Point:</p>
                      <p>
                        Both customers and staff visit the <strong>same domain</strong> (www.corianderbusiness.com), 
                        but they see different content based on their actions:
                      </p>
                      <ul className="mt-2 ml-4 space-y-1">
                        <li>• Customers stay on public pages (Home, Store)</li>
                        <li>• Staff click "Staff Login" → Authenticate → Access Business Suite</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visual Flow Diagram */}
            <Card>
              <CardHeader>
                <CardTitle>Visual Access Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-8 border-2">
                  <div className="space-y-6">
                    {/* Entry Point */}
                    <div className="text-center">
                      <div className="inline-block bg-white border-2 border-gray-300 rounded-lg px-6 py-3">
                        <Globe className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        <p className="font-bold text-lg">www.corianderbusiness.com</p>
                        <p className="text-sm text-gray-600">Same entry point for everyone</p>
                      </div>
                    </div>

                    {/* Split */}
                    <div className="flex justify-center">
                      <div className="text-4xl text-gray-400">↓</div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Customer Path */}
                      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                        <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Customer Path
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="bg-white rounded p-3 border border-blue-200">
                            <p className="font-semibold">1. Homepage</p>
                            <p className="text-xs text-gray-600">Public landing page</p>
                          </div>
                          <div className="text-center text-blue-600">↓</div>
                          <div className="bg-white rounded p-3 border border-blue-200">
                            <p className="font-semibold">2. Click "Shop Now"</p>
                            <p className="text-xs text-gray-600">Browse products</p>
                          </div>
                          <div className="text-center text-blue-600">↓</div>
                          <div className="bg-white rounded p-3 border border-blue-200">
                            <p className="font-semibold">3. Online Store</p>
                            <p className="text-xs text-gray-600">Add to cart & checkout</p>
                          </div>
                        </div>
                      </div>

                      {/* Staff Path */}
                      <div className="bg-indigo-50 border-2 border-indigo-300 rounded-lg p-4">
                        <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                          <Lock className="w-5 h-5" />
                          Staff Path
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="bg-white rounded p-3 border border-indigo-200">
                            <p className="font-semibold">1. Homepage</p>
                            <p className="text-xs text-gray-600">Same public page</p>
                          </div>
                          <div className="text-center text-indigo-600">↓</div>
                          <div className="bg-white rounded p-3 border border-indigo-200">
                            <p className="font-semibold">2. Click "Staff Login"</p>
                            <p className="text-xs text-gray-600">Access portal page</p>
                          </div>
                          <div className="text-center text-indigo-600">↓</div>
                          <div className="bg-white rounded p-3 border border-indigo-200">
                            <p className="font-semibold">3. Login Page</p>
                            <p className="text-xs text-gray-600">Enter credentials</p>
                          </div>
                          <div className="text-center text-indigo-600">↓</div>
                          <div className="bg-white rounded p-3 border border-indigo-200">
                            <p className="font-semibold">4. Business Suite</p>
                            <p className="text-xs text-gray-600">POS, Inventory, Reports</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DOMAIN OPTIONS TAB */}
          <TabsContent value="domains" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="w-6 h-6 text-purple-600" />
                  Professional Domain Setup Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Option 1: Current (Recommended) */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-300">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-green-600">RECOMMENDED</Badge>
                    <h3 className="font-bold text-lg text-green-900">Option 1: Single Domain (Current Setup)</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="font-semibold text-gray-900 mb-2">Structure:</p>
                      <ul className="space-y-1 text-gray-700 ml-4">
                        <li>• <strong>www.corianderbusiness.com</strong> → Public homepage</li>
                        <li>• <strong>www.corianderbusiness.com/store</strong> → Online store (automatic)</li>
                        <li>• <strong>www.corianderbusiness.com/staff</strong> → Staff portal (automatic)</li>
                        <li>• After login → Full business suite pages</li>
                      </ul>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <p className="font-semibold text-green-900 mb-2">✅ Pros:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>• Single domain to manage</li>
                          <li>• Professional & simple</li>
                          <li>• Lower cost (one domain)</li>
                          <li>• Easier SEO</li>
                          <li>• Customers & staff same entry</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-green-900 mb-2">❌ Cons:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>• Staff must know to click "Staff Login"</li>
                          <li>• All on same domain certificate</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Option 2: Subdomain */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
                  <h3 className="font-bold text-lg text-blue-900 mb-4">Option 2: Subdomain Separation</h3>
                  <div className="space-y-3 text-sm">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="font-semibold text-gray-900 mb-2">Structure:</p>
                      <ul className="space-y-1 text-gray-700 ml-4">
                        <li>• <strong>www.corianderbusiness.com</strong> → Online store (customers)</li>
                        <li>• <strong>admin.corianderbusiness.com</strong> → Business suite (staff)</li>
                        <li>• <strong>app.corianderbusiness.com</strong> → Alternative for staff</li>
                      </ul>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <p className="font-semibold text-blue-900 mb-2">✅ Pros:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>• Clear separation</li>
                          <li>• Staff have direct URL</li>
                          <li>• Independent SSL certs</li>
                          <li>• More "enterprise" feel</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900 mb-2">❌ Cons:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>• DNS configuration required</li>
                          <li>• Staff must remember subdomain</li>
                          <li>• Slightly more complex</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Option 3: Separate Domains */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
                  <h3 className="font-bold text-lg text-purple-900 mb-4">Option 3: Completely Separate Domains</h3>
                  <div className="space-y-3 text-sm">
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <p className="font-semibold text-gray-900 mb-2">Structure:</p>
                      <ul className="space-y-1 text-gray-700 ml-4">
                        <li>• <strong>www.coriandershop.com</strong> → Online store (customers)</li>
                        <li>• <strong>www.corianderbusiness.com</strong> → Business suite (staff)</li>
                      </ul>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <p className="font-semibold text-purple-900 mb-2">✅ Pros:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>• Complete isolation</li>
                          <li>• Separate branding possible</li>
                          <li>• Maximum security perception</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-purple-900 mb-2">❌ Cons:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>• Two domains to purchase</li>
                          <li>• Two SSL certificates</li>
                          <li>• More maintenance</li>
                          <li>• Split SEO authority</li>
                          <li>• Higher cost</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-900">
                    <strong>💡 Recommendation:</strong> Start with <strong>Option 1 (Single Domain)</strong>. 
                    It's professional, cost-effective, and what most modern SaaS applications use. 
                    You can always migrate to subdomains later if needed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECURITY MODEL TAB */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                  Security & Access Control Model
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
                  <h3 className="font-bold text-lg text-green-900 mb-4">How Security Works:</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-2">1. Public Pages (No Authentication)</h4>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4">
                        <li>• <strong>Home</strong> - Public landing page (everyone can see)</li>
                        <li>• <strong>CustomerStore</strong> - Online shop (everyone can see)</li>
                        <li>• <strong>StaffPortal</strong> - Login interface (everyone can see, but can't access suite)</li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-2">2. Protected Pages (Authentication Required)</h4>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4">
                        <li>• <strong>Dashboard, POS, Products, Sales, Orders, etc.</strong></li>
                        <li>• Requires valid login session</li>
                        <li>• If not logged in → Redirected to login page</li>
                        <li>• After login → Access granted based on role</li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-2">3. Role-Based Permissions</h4>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4">
                        <li>• <strong>Admin:</strong> Full access to all pages</li>
                        <li>• <strong>User:</strong> Limited access (POS, basic operations)</li>
                        <li>• Permissions checked on every page load</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-base">Session Management</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 space-y-2">
                      <p>✓ JWT tokens with HTTP-only cookies</p>
                      <p>✓ Auto token refresh</p>
                      <p>✓ Secure session storage</p>
                      <p>✓ Automatic logout on inactivity</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-base">Audit & Monitoring</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 space-y-2">
                      <p>✓ All actions tracked with user email</p>
                      <p>✓ Timestamp on every transaction</p>
                      <p>✓ Complete audit trail</p>
                      <p>✓ Real-time activity monitoring</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}