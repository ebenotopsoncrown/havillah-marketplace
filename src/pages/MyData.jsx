import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Download, 
  Trash2, 
  Shield, 
  AlertTriangle,
  FileDown,
  CheckCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function MyData() {
  const [user, setUser] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };
    loadUser();
  }, []);

  const { data: orders = [] } = useQuery({
    queryKey: ['my-orders', user?.email],
    queryFn: () => base44.entities.Order.filter({ customer_email: user.email }),
    enabled: !!user?.email,
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      await base44.functions.invoke('deleteCustomerData', {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      base44.auth.logout();
    },
  });

  const handleExportData = async () => {
    const exportData = {
      personal_information: {
        name: user.full_name,
        email: user.email,
        account_created: user.created_date,
      },
      orders: orders.map(order => ({
        order_number: order.order_number,
        date: order.order_date,
        total: order.total_amount,
        status: order.status,
        items: order.items || []
      })),
      export_date: new Date().toISOString(),
      export_format: 'JSON'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coriander-data-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  };

  const handleDeleteAccount = () => {
    if (deleteConfirm === 'DELETE') {
      deleteAccountMutation.mutate();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to access your data</p>
            <Button 
              onClick={() => base44.auth.redirectToLogin(window.location.pathname)}
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Data & Privacy</h1>
          </div>

          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              Under UK GDPR, you have the right to access, export, and delete your personal data. 
              Use this page to exercise your data protection rights.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Your Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold">{user.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Created</p>
                    <p className="font-semibold">
                      {new Date(user.created_date).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="font-semibold">{orders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Stored */}
            <Card>
              <CardHeader>
                <CardTitle>Data We Store About You</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Account information (name, email)</li>
                  <li>Order history ({orders.length} orders)</li>
                  <li>Delivery addresses from past orders</li>
                  <li>Payment transaction records (no card details stored)</li>
                  <li>Communication preferences</li>
                </ul>
              </CardContent>
            </Card>

            {/* Export Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileDown className="w-5 h-5" />
                  Export Your Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Download a copy of all your personal data in JSON format. 
                  This includes your account details, order history, and all associated information.
                </p>
                <Button 
                  onClick={handleExportData}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export My Data (JSON)
                </Button>
              </CardContent>
            </Card>

            {/* Delete Account */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  Delete My Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4 bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-900">
                    <strong>Warning:</strong> This action is permanent and cannot be undone. 
                    All your personal data will be deleted, except order records required for 
                    legal/accounting purposes (retained for 7 years as per UK law).
                  </AlertDescription>
                </Alert>
                
                <p className="text-gray-700 mb-4">
                  When you delete your account:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4 ml-4">
                  <li>Your account will be permanently closed</li>
                  <li>Personal information will be anonymized</li>
                  <li>You will lose access to order history</li>
                  <li>You cannot recover your account</li>
                </ul>

                <Button 
                  onClick={() => setShowDeleteDialog(true)}
                  variant="destructive"
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete My Account
                </Button>
              </CardContent>
            </Card>

            {/* Privacy Policy Link */}
            <div className="text-center text-sm text-gray-600">
              <p>
                For more information about how we handle your data, read our{' '}
                <a href="/PrivacyPolicy" className="text-indigo-600 underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-6 h-6" />
              Confirm Account Deletion
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. To confirm, please type <strong>DELETE</strong> below.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteConfirm('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== 'DELETE' || deleteAccountMutation.isPending}
            >
              {deleteAccountMutation.isPending ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}