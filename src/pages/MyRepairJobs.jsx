import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Clock, Package, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

export default function MyRepairJobs() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {
      base44.auth.redirectToLogin(window.location.pathname);
    });
  }, []);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['myRepairJobs', user?.email],
    queryFn: () => base44.entities.RepairJob.filter({ customer_email: user.email }, '-created_date'),
    enabled: !!user?.email,
  });

  const { data: allUpdates = [] } = useQuery({
    queryKey: ['repairJobUpdates'],
    queryFn: () => base44.entities.RepairJobUpdate.list('-created_date'),
    enabled: jobs.length > 0,
  });

  const confirmCompletionMutation = useMutation({
    mutationFn: async (jobId) => {
      await base44.entities.RepairJob.update(jobId, {
        status: "CUSTOMER_CONFIRMED",
        customer_confirmed_at: new Date().toISOString()
      });

      await base44.entities.RepairJobUpdate.create({
        job_id: jobId,
        updated_by_user_id: user.id,
        update_type: "status_change",
        message: "Customer confirmed device received and repair completed",
        old_status: "COMPLETED",
        new_status: "CUSTOMER_CONFIRMED",
        visible_to_customer: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRepairJobs'] });
      queryClient.invalidateQueries({ queryKey: ['repairJobUpdates'] });
    },
  });

  const getStatusInfo = (status) => {
    const statuses = {
      JOB_CREATED: { label: "Job Created", color: "bg-blue-100 text-blue-800", icon: Package },
      AWAITING_DEVICE: { label: "Awaiting Device", color: "bg-yellow-100 text-yellow-800", icon: Clock },
      DEVICE_RECEIVED: { label: "Device Received", color: "bg-green-100 text-green-800", icon: CheckCircle },
      IN_REPAIR: { label: "In Repair", color: "bg-purple-100 text-purple-800", icon: Package },
      WAITING_PARTS: { label: "Waiting for Parts", color: "bg-orange-100 text-orange-800", icon: Clock },
      READY_FOR_RETURN: { label: "Ready for Return", color: "bg-indigo-100 text-indigo-800", icon: CheckCircle },
      OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "bg-blue-100 text-blue-800", icon: Truck },
      COMPLETED: { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle },
      CUSTOMER_CONFIRMED: { label: "Confirmed", color: "bg-emerald-100 text-emerald-800", icon: CheckCircle },
      CANCELLED: { label: "Cancelled", color: "bg-gray-100 text-gray-800", icon: Clock }
    };
    return statuses[status] || statuses.JOB_CREATED;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link to={createPageUrl("CustomerStore")} className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Repair Jobs</h1>
          <p className="text-gray-600">Track the progress of your active repair jobs</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">Loading your repair jobs...</p>
              </CardContent>
            </Card>
          ) : jobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 mb-4">You don't have any active repair jobs</p>
                <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  <Link to={createPageUrl("RepairService")}>
                    Submit a Repair Request
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => {
              const statusInfo = getStatusInfo(job.status);
              const StatusIcon = statusInfo.icon;
              const jobUpdates = allUpdates.filter(u => u.job_id === job.id && u.visible_to_customer);

              return (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{job.job_number}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          Created {format(new Date(job.created_date), 'dd MMM yyyy')}
                        </p>
                      </div>
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b">
                      <div>
                        <p className="text-sm text-gray-500">Device</p>
                        <p className="font-medium capitalize">
                          {job.device_type} - {job.brand} {job.model}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Cost</p>
                        <p className="font-medium text-lg text-indigo-600">
                          £{job.agreed_total_cost?.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment Status</p>
                        <Badge variant="outline" className={
                          job.payment_status === "PAID" ? "bg-green-50 text-green-700" :
                          job.payment_status === "PARTIALLY_PAID" ? "bg-yellow-50 text-yellow-700" :
                          "bg-red-50 text-red-700"
                        }>
                          {job.payment_status?.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Collection Method</p>
                        <p className="font-medium capitalize">
                          {job.collection_method?.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </div>

                    {/* Timeline */}
                    {jobUpdates.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-3">Progress Updates</h4>
                        <div className="space-y-3">
                          {jobUpdates.slice(0, 3).map((update) => (
                            <div key={update.id} className="flex gap-3 text-sm">
                              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                              <div className="flex-1">
                                <p className="text-gray-900">{update.message}</p>
                                <p className="text-xs text-gray-500">
                                  {format(new Date(update.created_date), 'dd MMM yyyy HH:mm')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Customer Updates */}
                    {job.customer_updates && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-blue-900 mb-1">Latest Update</p>
                        <p className="text-sm text-blue-800">{job.customer_updates}</p>
                      </div>
                    )}

                    {/* Action Required */}
                    {job.status === "COMPLETED" && job.customer_confirmed_at === null && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-green-900 mb-2">
                          ✅ Repair Completed!
                        </p>
                        <p className="text-sm text-green-800 mb-3">
                          Your device has been repaired and is ready. Please confirm once you've received it.
                        </p>
                        <Button
                          size="sm"
                          onClick={() => confirmCompletionMutation.mutate(job.id)}
                          disabled={confirmCompletionMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {confirmCompletionMutation.isPending ? "Confirming..." : "Confirm Receipt"}
                        </Button>
                      </div>
                    )}

                    {job.status === "CUSTOMER_CONFIRMED" && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                        <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-emerald-900">
                          Job Complete! Thank you for choosing our service.
                        </p>
                      </div>
                    )}

                    {job.status === "AWAITING_DEVICE" && job.collection_method === "bring_in" && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-yellow-900 mb-1">
                          📍 Please Bring Your Device
                        </p>
                        <p className="text-sm text-yellow-800">
                          Drop off your device at our service center to begin the repair process.
                        </p>
                      </div>
                    )}

                    {job.pickup_scheduled_at && job.status === "AWAITING_DEVICE" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          🚚 Pickup Scheduled
                        </p>
                        <p className="text-sm text-blue-800">
                          Collection scheduled for: {format(new Date(job.pickup_scheduled_at), 'dd MMM yyyy HH:mm')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}