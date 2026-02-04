import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import QuoteReviewModal from "../components/repairs/QuoteReviewModal";

export default function MyRepairRequests() {
  const [user, setUser] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {
      base44.auth.redirectToLogin(window.location.pathname);
    });
  }, []);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['myServiceRequests', user?.email],
    queryFn: () => base44.entities.ServiceRequest.filter({ customer_email: user.email }, '-created_date'),
    enabled: !!user?.email,
  });

  const getStatusBadge = (status) => {
    const variants = {
      SUBMITTED: { class: "bg-blue-100 text-blue-800", label: "Submitted" },
      UNDER_REVIEW: { class: "bg-yellow-100 text-yellow-800", label: "Under Review" },
      QUOTED: { class: "bg-purple-100 text-purple-800", label: "Quote Ready" },
      WAITING_CUSTOMER_APPROVAL: { class: "bg-orange-100 text-orange-800", label: "Awaiting Your Approval" },
      APPROVED: { class: "bg-green-100 text-green-800", label: "Approved" },
      REJECTED: { class: "bg-red-100 text-red-800", label: "Declined" },
      CONVERTED_TO_JOB: { class: "bg-indigo-100 text-indigo-800", label: "Job Created" },
      CANCELLED: { class: "bg-gray-100 text-gray-800", label: "Cancelled" }
    };
    const variant = variants[status] || { class: "", label: status };
    return <Badge className={variant.class}>{variant.label}</Badge>;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link to={createPageUrl("CustomerStore")} className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Repair Requests</h1>
          <p className="text-gray-600">Track your repair and service requests</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">Loading your requests...</p>
              </CardContent>
            </Card>
          ) : requests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 mb-4">You haven't submitted any repair requests yet</p>
                <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  <Link to={createPageUrl("RepairService")}>
                    Submit a Repair Request
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            requests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{request.request_number}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted {format(new Date(request.created_date), 'dd MMM yyyy')}
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Device</p>
                      <p className="font-medium capitalize">
                        {request.device_type} - {request.brand} {request.model}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Service Option</p>
                      <p className="font-medium capitalize">
                        {request.service_option_preference?.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Issue</p>
                    <p className="text-sm line-clamp-2">{request.issue_description}</p>
                  </div>

                  {(request.status === "QUOTED" || request.status === "WAITING_CUSTOMER_APPROVAL") && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-orange-900 mb-2">
                        🔔 Quote Ready for Review
                      </p>
                      <p className="text-sm text-orange-800 mb-3">
                        Your repair quote is ready. Please review and approve to proceed.
                      </p>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowQuoteModal(true);
                        }}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Review Quote
                      </Button>
                    </div>
                  )}

                  {request.status === "APPROVED" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-green-900 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Quote Approved
                      </p>
                      <p className="text-sm text-green-800 mt-1">
                        Your repair job will be created shortly. You'll be notified about next steps.
                      </p>
                    </div>
                  )}

                  {request.status === "CONVERTED_TO_JOB" && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-indigo-900">
                        Job Order Created
                      </p>
                      <p className="text-sm text-indigo-800 mt-1">
                        Your repair job has been created. Check "My Repair Jobs" for updates.
                      </p>
                      <Button asChild size="sm" variant="outline" className="mt-2">
                        <Link to={createPageUrl("MyRepairJobs")}>
                          View Repair Jobs
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <QuoteReviewModal
        open={showQuoteModal}
        onClose={() => {
          setShowQuoteModal(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
      />
    </div>
  );
}