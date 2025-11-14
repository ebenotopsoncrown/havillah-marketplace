import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Lock,
  Store,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StaffPortal() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        // User is already logged in, redirect to Dashboard
        navigate(createPageUrl("Dashboard"));
      } else {
        setChecking(false);
      }
    } catch (error) {
      setChecking(false);
    }
  };

  const handleLogin = () => {
    // Redirect to Base44's login page with return URL
    const returnUrl = createPageUrl("Dashboard");
    base44.auth.redirectToLogin(returnUrl);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Coriander Business Suite</h1>
                <p className="text-xs text-gray-600">Staff Portal</p>
              </div>
            </div>
            
            <Link to={createPageUrl("Home")}>
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Store
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Welcome Card */}
          <Card className="border-2 border-indigo-200 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl">Staff Access Portal</CardTitle>
              <p className="text-gray-600 mt-2">
                Authorized personnel only
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  What You Get Access To:
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    <span>Point of Sale (POS) System</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    <span>Inventory Management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    <span>Order Processing & Delivery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    <span>Financial Reports & Analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    <span>Customer & Supplier Management</span>
                  </li>
                </ul>
              </div>

              <Button 
                onClick={handleLogin}
                className="w-full h-12 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Lock className="w-5 h-5 mr-2" />
                Staff Login
              </Button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Need Access?</p>
                    <p>
                      Contact your system administrator to request login credentials. 
                      All access is logged and monitored for security.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-4 text-center">
                <ShieldCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">Secure Access</p>
                <p className="text-xs text-gray-600 mt-1">256-bit encryption</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-4 text-center">
                <Lock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">Role-Based</p>
                <p className="text-xs text-gray-600 mt-1">Permission controls</p>
              </CardContent>
            </Card>
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-gray-500">
            By logging in, you agree to comply with company policies and data protection regulations.
          </p>
        </div>
      </div>
    </div>
  );
}