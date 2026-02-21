import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Package, Truck, Users, ShoppingCart, ClipboardList, TruckIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const roleConfig = {
  admin: {
    icon: Shield,
    label: 'Administrator',
    description: 'Full system access',
    redirectTo: 'Dashboard'
  },
  inventory_manager: {
    icon: ClipboardList,
    label: 'Inventory Manager',
    description: 'Manage inventory & confirm orders',
    redirectTo: 'OrderConfirmation'
  },
  picking_and_sorting: {
    icon: Package,
    label: 'Picking & Sorting',
    description: 'Pick and pack orders',
    redirectTo: 'PickingAndPacking'
  },
  dispatcher: {
    icon: TruckIcon,
    label: 'Dispatcher',
    description: 'Dispatch deliveries',
    redirectTo: 'Delivery'
  },
  driver: {
    icon: Truck,
    label: 'Driver',
    description: 'Delivery runs',
    redirectTo: 'DriverPortal'
  },
  store_attendant: {
    icon: ShoppingCart,
    label: 'Store Attendant',
    description: 'Point of Sale',
    redirectTo: 'POS'
  },
  cashier: {
    icon: ShoppingCart,
    label: 'Cashier',
    description: 'Point of Sale',
    redirectTo: 'POS'
  }
};

export default function StaffLogin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      // Auto-redirect if user already has a department
      if (currentUser?.department) {
        const config = roleConfig[currentUser.department];
        if (config) {
          navigate(createPageUrl(config.redirectTo));
        }
      }
    } catch (error) {
      // Not logged in, redirect to login
      base44.auth.redirectToLogin(window.location.href);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role) => {
    const config = roleConfig[role];
    if (config) {
      navigate(createPageUrl(config.redirectTo));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome, {user.full_name}</h1>
          <p className="text-lg text-gray-600">Select your work area to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(roleConfig).map(([role, config]) => {
            const Icon = config.icon;
            const hasAccess = user.role === 'admin' || user.department === role;
            
            if (!hasAccess && user.department) return null;

            return (
              <Card 
                key={role}
                className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                  !hasAccess ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => hasAccess && handleRoleSelect(role)}
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-center">{config.label}</CardTitle>
                  <CardDescription className="text-center">
                    {config.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    disabled={!hasAccess}
                  >
                    {hasAccess ? 'Access' : 'No Access'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {user.role === 'admin' && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl('AppSettings'))}
              className="gap-2"
            >
              <Users className="w-5 h-5" />
              Manage Staff & Roles
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}