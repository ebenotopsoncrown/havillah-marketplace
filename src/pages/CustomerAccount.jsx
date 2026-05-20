import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Truck,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CustomerAccount() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const queryClient = useQueryClient();

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

  // Real-time subscription for order status updates
  React.useEffect(() => {
    if (!user?.email) return;

    const unsubscribe = base44.entities.Order.subscribe((event) => {
      // Only update if the order belongs to this customer
      if (event.data?.customer_email === user.email) {
        queryClient.invalidateQueries({ queryKey: ['customer-orders'] });
      }
    });

    return unsubscribe;
  }, [user?.email, queryClient]);

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId) => {
      return base44.functions.invoke('cancelOrder', {
        orderId,
        cancelledBy: user.email,
        reason: 'Cancelled by customer'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-orders'] });
      setCancellingOrder(null);
    },
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
    pending_confirmation: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    picking: "bg-purple-100 text-purple-800 border-purple-200",
    ready: "bg-indigo-100 text-indigo-800 border-indigo-200",
    dispatched: "bg-orange-100 text-orange-800 border-orange-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200"
  };

  const statusIcons = {
    pending_confirmation: Clock,
    confirmed: CheckCircle,
    picking: Package,
    ready: CheckCircle,
    dispatched: Truck,
    delivered: CheckCircle,
    cancelled: XCircle
  };

  const ROSE = "#D88C9A";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8F4F1" }}>
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: "#D88C9A", borderTopColor: "transparent" }}></div>
          <p className="text-gray-500 text-sm">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#F8F4F1" }}>
        <Card className="max-w-md w-full border-rose-100 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#fce8ee" }}>
              <User className="w-8 h-8" style={{ color: ROSE }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
            <p className="text-gray-500 mb-6">Please sign in to view your account</p>
            <Button
              onClick={() => base44.auth.redirectToLogin(createPageUrl('CustomerAccount'))}
              className="w-full rounded-xl"
              style={{ background: ROSE }}
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8F4F1", fontFamily: "'Inter', 'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap'); .playfair { font-family: 'Playfair Display', serif; }`}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2d1a22 0%, #4a2535 100%)" }} className="text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <Link to={createPageUrl('CustomerStore')}>
              <button className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Store
              </button>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(216,140,154,0.3)" }}>
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="playfair text-2xl font-bold text-white">{user.full_name || 'Customer'}</h1>
              <p className="text-sm" style={{ color: "#E8CFCF" }}>{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Continue Shopping", icon: Store, color: ROSE, to: 'CustomerStore' },
            { label: "Contact Us", icon: Mail, color: "#22c55e", action: () => window.open(`mailto:info@havillahmarketplace.com`) },
            { label: "Rate Us", icon: Star, color: "#f59e0b", action: () => window.open('https://g.page/r/YOUR_GOOGLE_REVIEW_LINK/review', '_blank') },
            { label: "Share Store", icon: Share2, color: "#3b82f6", action: handleShare },
          ].map(({ label, icon: Icon, color, to, action }) => {
            const inner = (
              <Card className="hover:shadow-md transition-all cursor-pointer border border-rose-50 bg-white">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: `${color}18` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <p className="font-semibold text-gray-900 text-xs sm:text-sm">{label}</p>
                </CardContent>
              </Card>
            );
            return to ? <Link key={label} to={createPageUrl(to)}>{inner}</Link>
              : <div key={label} onClick={action}>{inner}</div>;
          })}
        </div>

        {/* Profile */}
        <Card className="mb-6 border border-rose-50 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4" style={{ color: ROSE }} /> Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Full Name</p>
                <p className="text-gray-900 font-semibold">{user.full_name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Email Address</p>
                <p className="text-gray-900 font-semibold flex items-center gap-2 text-sm">
                  <Mail className="w-3.5 h-3.5 text-gray-400" /> {user.email}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Account Type</p>
                <Badge variant="outline" className="text-xs" style={{ color: ROSE, borderColor: "#fce8ee", background: "#fdf2f2" }}>Customer</Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Member Since</p>
                <p className="text-gray-900 font-semibold text-sm">
                  {new Date(user.created_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card className="border border-rose-50 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="w-4 h-4" style={{ color: ROSE }} />
              Order History
              <span className="ml-auto text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ background: ROSE }}>{orders.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#fce8ee" }}>
                  <Package className="w-7 h-7" style={{ color: ROSE }} />
                </div>
                <p className="text-gray-600 font-semibold mb-1">No orders yet</p>
                <p className="text-gray-400 text-sm mb-5">Start shopping to see your orders here</p>
                <Link to={createPageUrl('CustomerStore')}>
                  <button className="text-white px-6 py-2.5 rounded-xl text-sm font-semibold" style={{ background: ROSE }}>
                    Browse Products
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const StatusIcon = statusIcons[order.status];
                  return (
                    <div key={order.id} className="border border-rose-100 rounded-2xl p-4 hover:border-rose-300 transition-colors bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-gray-900">{order.order_number}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(order.order_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <Badge className={`${statusColors[order.status]} border text-xs`}>
                          {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                          {order.status}
                        </Badge>
                      </div>
                      <Separator className="my-3" />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-gray-400 text-xs mb-0.5">Total</p>
                          <p className="font-bold" style={{ color: ROSE }}>£{order.total_amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-0.5">Delivery</p>
                          <p className="font-semibold text-gray-800 text-xs">{order.delivery_type === 'click_and_collect' ? 'Click & Collect' : 'Delivery'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-0.5">Payment</p>
                          <p className="font-semibold text-gray-800 text-xs capitalize flex items-center gap-1">
                            <CreditCard className="w-3 h-3" /> {order.payment_method}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-0.5">Status</p>
                          <Badge variant="outline" className={`text-xs ${order.payment_status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                            {order.payment_status}
                          </Badge>
                        </div>
                      </div>
                      {order.delivery_type === 'delivery' && order.delivery_address && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-400 mb-1">Delivery Address</p>
                          <p className="text-xs font-medium text-gray-700 flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 text-gray-400 flex-shrink-0" />
                            {order.delivery_address}, {order.delivery_postcode}
                          </p>
                        </div>
                      )}
                      {!['delivered', 'cancelled', 'dispatched'].includes(order.status) && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <Button onClick={() => setCancellingOrder(order)} variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 text-xs rounded-lg">
                            <XCircle className="w-3.5 h-3.5 mr-1.5" /> Cancel Order
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="mt-6 border border-rose-50 bg-white">
          <CardHeader>
            <CardTitle className="text-base">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: Phone, color: ROSE, label: "Call Us", info: "+44 07389 170996", sub: "Mon–Sat: 8AM–8PM" },
                { icon: Mail, color: "#22c55e", label: "Email Us", info: "info@havillahmarketplace.com", sub: "We reply within 24 hours" },
                { icon: MapPin, color: "#f59e0b", label: "Based In", info: "Bournemouth, UK", sub: "Nationwide delivery" },
              ].map(({ icon: Icon, color, label, info, sub }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-0.5">{label}</p>
                    <p className="text-xs text-gray-600">{info}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={!!cancellingOrder} onOpenChange={() => setCancellingOrder(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel order <strong>{cancellingOrder?.order_number}</strong>?
                {cancellingOrder?.stripe_payment_intent_id && (
                  <span className="block mt-2 text-green-700 font-medium">
                    ✓ A full refund of £{cancellingOrder?.total_amount?.toFixed(2)} will be processed automatically.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Order</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => cancelOrderMutation.mutate(cancellingOrder.id)}
                className="bg-red-600 hover:bg-red-700"
                disabled={cancelOrderMutation.isPending}
              >
                {cancelOrderMutation.isPending ? 'Cancelling...' : 'Yes, Cancel Order'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}