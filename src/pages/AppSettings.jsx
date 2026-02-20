import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserPlus, 
  Users, 
  Copy, 
  CheckCircle, 
  ExternalLink,
  Eye,
  Link as LinkIcon,
  Shield,
  Clock,
  Activity,
  Image
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import StorefrontImagesManager from "../components/settings/StorefrontImagesManager";

export default function AppSettings() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  // Get the current app URL
  const appUrl = window.location.origin;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">App Settings</h1>
          <p className="text-gray-600">Manage users, sharing, and system configuration</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="sharing">App Sharing</TabsTrigger>
            <TabsTrigger value="activity">Activity Monitor</TabsTrigger>
            <TabsTrigger value="storefront">Storefront Images</TabsTrigger>
          </TabsList>

          {/* USER MANAGEMENT TAB */}
          <TabsContent value="users" className="space-y-6">
            <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-900">
                  <UserPlus className="w-5 h-5" />
                  Create New User Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white rounded-lg p-6 border-2 border-indigo-100">
                  <h3 className="font-bold text-gray-900 mb-4">📋 How to Invite Users:</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="font-bold text-indigo-600 text-sm">1</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Access Dashboard</p>
                        <p className="text-sm text-gray-700">
                          Click on <strong>"Dashboard"</strong> in the top navigation menu of the Base44 platform
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="font-bold text-indigo-600 text-sm">2</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Navigate to Users</p>
                        <p className="text-sm text-gray-700">
                          Go to <strong>Dashboard → Data → Users</strong> section
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="font-bold text-indigo-600 text-sm">3</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Invite New User</p>
                        <p className="text-sm text-gray-700 mb-2">
                          Click <strong>"Invite User"</strong> button and fill in the details:
                        </p>
                        <ul className="text-sm text-gray-700 space-y-1 ml-4">
                          <li>• <strong>Email:</strong> User's email address</li>
                          <li>• <strong>Full Name:</strong> User's full name</li>
                          <li>• <strong>Role:</strong> Choose "admin" or "user"</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">User Receives Invitation</p>
                        <p className="text-sm text-gray-700">
                          The invited user will receive an email with login instructions and can access the system immediately
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-900">
                    <strong>💡 Tip:</strong> Users with "admin" role have full access to all features. 
                    Users with "user" role have limited access based on your configuration.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User Roles Explanation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  User Roles & Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border-2 border-indigo-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-indigo-600">Admin</Badge>
                    </div>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>✅ Full system access</li>
                      <li>✅ Manage products & inventory</li>
                      <li>✅ View financial reports</li>
                      <li>✅ Process sales & orders</li>
                      <li>✅ Manage users</li>
                      <li>✅ Access all settings</li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-green-600">User</Badge>
                    </div>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>✅ POS access</li>
                      <li>✅ View products</li>
                      <li>✅ Process sales</li>
                      <li>✅ View orders</li>
                      <li>❌ Limited report access</li>
                      <li>❌ Cannot manage settings</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* APP SHARING TAB */}
          <TabsContent value="sharing" className="space-y-6">
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <LinkIcon className="w-5 h-5" />
                  Share App with Coriander Cash & Carry
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* App URL */}
                <div className="space-y-2">
                  <Label className="text-gray-900 font-semibold">Application URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={appUrl}
                      readOnly
                      className="bg-white border-2 border-green-200 font-mono text-sm"
                    />
                    <Button
                      onClick={() => copyToClipboard(appUrl)}
                      variant="outline"
                      className="flex-shrink-0"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-white rounded-lg p-6 border-2 border-green-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-green-600" />
                    How to Share with Coriander:
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="font-bold text-green-600 text-sm">1</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Create User Account First</p>
                        <p className="text-sm text-gray-700">
                          Go to the <strong>User Management</strong> tab and invite a user with their email address. 
                          Set their role as "admin" for full access or "user" for limited access.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="font-bold text-green-600 text-sm">2</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Share the App URL</p>
                        <p className="text-sm text-gray-700">
                          Copy the URL above and send it to Coriander Cash & Carry via email or message. 
                          This is their access link to the application.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="font-bold text-green-600 text-sm">3</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">They Login & Start Using</p>
                        <p className="text-sm text-gray-700">
                          When they click the link, they'll see a login page. They should use the email 
                          and password they received in their invitation email. After login, they can immediately 
                          start entering transactions, viewing products, and testing all features.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Eye className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Monitor Their Activity</p>
                        <p className="text-sm text-gray-700">
                          Switch to the <strong>Activity Monitor</strong> tab to see all transactions and 
                          changes they make in real-time. Every sale, product update, and order will be 
                          instantly visible to you.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Action Button */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => window.open(appUrl, '_blank')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open App in New Tab
                  </Button>
                  <Button
                    onClick={() => setActiveTab('users')}
                    variant="outline"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create User Account
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-900">
                  <Shield className="w-5 h-5" />
                  Security & Access Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    <strong>🔐 Secure Authentication:</strong> All users must log in with email and password. 
                    No one can access the system without proper credentials.
                  </p>
                  <p>
                    <strong>👥 Role-Based Access:</strong> You control what each user can see and do based on their role.
                  </p>
                  <p>
                    <strong>📊 Complete Audit Trail:</strong> Every action is tracked with user email, timestamp, and details.
                  </p>
                  <p>
                    <strong>🔄 Real-Time Sync:</strong> All changes are synchronized instantly across all logged-in users.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ACTIVITY MONITOR TAB */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Activity className="w-5 h-5" />
                  Real-Time Activity Monitor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white rounded-lg p-6 border-2 border-purple-100">
                  <h3 className="font-bold text-gray-900 mb-4">📡 Monitor User Activity in Real-Time</h3>
                  
                  <div className="space-y-4 text-sm text-gray-700">
                    <p>
                      When Coriander Cash & Carry users are active in the system, you can monitor 
                      their activity through various pages:
                    </p>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <p className="font-semibold text-blue-900 mb-1">📊 Dashboard</p>
                        <p className="text-xs">View today's sales, revenue, and order statistics in real-time</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <p className="font-semibold text-green-900 mb-1">🛒 Sales Page</p>
                        <p className="text-xs">See all POS transactions as they happen</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <p className="font-semibold text-purple-900 mb-1">📦 Products Page</p>
                        <p className="text-xs">Track inventory changes and new products added</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                        <p className="font-semibold text-orange-900 mb-1">🛍️ Orders Page</p>
                        <p className="text-xs">Monitor new online orders and status updates</p>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                      <p className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        All Changes Are Instant!
                      </p>
                      <ul className="space-y-1 text-gray-700 text-sm ml-6">
                        <li>• When they process a sale → Appears instantly in Sales page</li>
                        <li>• When they update stock → Product page updates immediately</li>
                        <li>• When they create an order → Shows up in Orders instantly</li>
                        <li>• When they record an expense → Financial reports update live</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Audit Trail Information
                      </p>
                      <p className="text-xs text-gray-700 mb-2">
                        Every record in the system includes:
                      </p>
                      <ul className="space-y-1 text-gray-700 text-xs ml-4">
                        <li>✓ <strong>created_by:</strong> Email of the user who created it</li>
                        <li>✓ <strong>created_date:</strong> Exact timestamp when it was created</li>
                        <li>✓ <strong>updated_date:</strong> When it was last modified</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Access to Activity Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col items-start"
                    onClick={() => window.location.href = '/Sales'}
                  >
                    <span className="text-lg mb-1">🧾 Sales</span>
                    <span className="text-xs text-gray-600">View all POS transactions</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col items-start"
                    onClick={() => window.location.href = '/Orders'}
                  >
                    <span className="text-lg mb-1">📦 Orders</span>
                    <span className="text-xs text-gray-600">Monitor online orders</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col items-start"
                    onClick={() => window.location.href = '/Products'}
                  >
                    <span className="text-lg mb-1">📊 Products</span>
                    <span className="text-xs text-gray-600">Track inventory changes</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}