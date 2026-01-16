import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  User,
  Package,
  Mail,
  Phone,
  MapPin,
  LogOut,
  Star,
  Share2,
  Store,
  ArrowLeft,
  Clock,
  CreditCard,
  CheckCircle,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function CustomerAccount() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const { data: orders = [] } = useQuery({
    queryKey: ['customer-orders', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return base44.entities.Order.filter({ customer_email: user.email }, '-created_date');
    },
    enabled: !!user?.email,
  });

  const handleLogout = async () => {
    await base44.auth.logout(createPageUrl('CustomerStore'));
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Coriander Cash & Carry',
      text: 'Shop quality Afro-Asian groceries online!',
      url: window.location.origin + createPageUrl('CustomerStore')
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert('Store link copied to clipboard!');
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    picking: "bg-purple-100 text-purple-800 border-purple-200",
    ready: "bg-indigo-100 text-indigo-800 border-indigo-200",
    dispatched: "bg-orange-100 text-orange-800 border-orange-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200"
  };

  const statusIcons = {
    pending: Clock,
    confirmed: CheckCircle,
    picking: Package,
    ready: CheckCircle,
    dispatched: Truck,
    delivered: CheckCircle,
    cancelled: null
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to view your account</p>
            <Button 
              onClick={() => base44.auth.redirectToLogin(createPageUrl('CustomerAccount'))}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link to={createPageUrl('CustomerStore')}>
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Store
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.full_name || 'Customer'}</h1>
              <p className="text-indigo-100">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to={createPageUrl('CustomerStore')}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-indigo-500">
              <CardContent className="p-6 text-center">
                <Store className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">Continue Shopping</p>
              </CardContent>
            </Card>
          </Link>

          <Card 
            onClick={() => window.open(`mailto:orders@coriander.co.uk?subject=Customer Support&body=Hi, I need help with...`)}
            className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-500"
          >
            <CardContent className="p-6 text-center">
              <Mail className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Contact Us</p>
            </CardContent>
          </Card>

          <Card 
            onClick={() => window.open('https://g.page/r/YOUR_GOOGLE_REVIEW_LINK/review', '_blank')}
            className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-yellow-500"
          >
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Rate Us</p>
            </CardContent>
          </Card>

          <Card 
            onClick={handleShare}
            className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500"
          >
            <CardContent className="p-6 text-center">
              <Share2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Share App</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Full Name</p>
                <p className="text-gray-900 font-semibold">{user.full_name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                <p className="text-gray-900 font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Account Type</p>
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                  Customer
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Member Since</p>
                <p className="text-gray-900 font-semibold">
                  {new Date(user.created_date).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order History
              <Badge className="ml-auto bg-indigo-600">{orders.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No orders yet</p>
                <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
                <Link to={createPageUrl('CustomerStore')}>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Store className="w-5 h-5 mr-2" />
                    Browse Products
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const StatusIcon = statusIcons[order.status];
                  return (
                    <div key={order.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-lg text-gray-900">{order.order_number}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.order_date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <Badge className={`${statusColors[order.status]} border`}>
                          {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                          {order.status}
                        </Badge>
                      </div>

                      <Separator className="my-3" />

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 mb-1">Total Amount</p>
                          <p className="font-bold text-gray-900">£{order.total_amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Delivery Type</p>
                          <p className="font-semibold text-gray-900 capitalize">
                            {order.delivery_type === 'click_and_collect' ? 'Click & Collect' : 'Delivery'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Payment Method</p>
                          <p className="font-semibold text-gray-900 capitalize flex items-center gap-1">
                            <CreditCard className="w-3 h-3" />
                            {order.payment_method}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Payment Status</p>
                          <Badge variant="outline" className={order.payment_status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}>
                            {order.payment_status}
                          </Badge>
                        </div>
                      </div>

                      {order.delivery_type === 'delivery' && order.delivery_address && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
                          <p className="text-sm font-medium text-gray-900 flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                            {order.delivery_address}, {order.delivery_postcode}
                          </p>
                        </div>
                      )}

                      {order.notes && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-500 mb-1">Order Notes</p>
                          <p className="text-sm text-gray-700">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-indigo-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Call Us</p>
                  <p className="text-sm text-gray-600">020 XXXX XXXX</p>
                  <p className="text-xs text-gray-500 mt-1">Mon-Sat: 8AM-8PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Email Us</p>
                  <p className="text-sm text-gray-600">orders@coriander.co.uk</p>
                  <p className="text-xs text-gray-500 mt-1">We reply within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Visit Us</p>
                  <p className="text-sm text-gray-600">846-848 Wimborne Rd</p>
                  <p className="text-sm text-gray-600">Bournemouth BH9 2DS</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}