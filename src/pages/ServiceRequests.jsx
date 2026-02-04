import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, UserCheck, FileText } from "lucide-react";
import { format } from "date-fns";
import ServiceRequestDetailsModal from "../components/repairs/ServiceRequestDetailsModal";

export default function ServiceRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['serviceRequests'],
    queryFn: () => base44.entities.ServiceRequest.list('-created_date'),
  });

  const { data: engineers = [] } = useQuery({
    queryKey: ['engineers'],
    queryFn: () => base44.entities.EngineerProfile.filter({ is_active: true }),
  });

  const assignEngineerMutation = useMutation({
    mutationFn: ({ requestId, engineerId }) =>
      base44.entities.ServiceRequest.update(requestId, {
        assigned_engineer_id: engineerId,
        status: "UNDER_REVIEW"
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    },
  });

  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchTerm === "" ||
      request.request_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.device_type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const variants = {
      SUBMITTED: "bg-blue-100 text-blue-800",
      UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
      QUOTED: "bg-purple-100 text-purple-800",
      WAITING_CUSTOMER_APPROVAL: "bg-orange-100 text-orange-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      CONVERTED_TO_JOB: "bg-indigo-100 text-indigo-800",
      CANCELLED: "bg-gray-100 text-gray-800"
    };
    return <Badge className={variants[status] || ""}>{status.replace(/_/g, ' ')}</Badge>;
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Requests</h1>
            <p className="text-gray-600">Manage customer repair and service requests</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by request number, customer name, or device..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="QUOTED">Quoted</SelectItem>
                  <SelectItem value="WAITING_CUSTOMER_APPROVAL">Waiting Approval</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="CONVERTED_TO_JOB">Converted to Job</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Requests ({filteredRequests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">Loading requests...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No service requests found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Engineer</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => {
                    const engineer = engineers.find(e => e.id === request.assigned_engineer_id);
                    return (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.request_number}</TableCell>
                        <TableCell>{format(new Date(request.created_date), 'dd MMM yyyy')}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.customer_name}</div>
                            <div className="text-sm text-gray-500">{request.customer_email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium capitalize">{request.device_type}</div>
                            <div className="text-sm text-gray-500">{request.brand} {request.model}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {request.service_option_preference?.replace(/_/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          {engineer ? (
                            <span className="text-sm">{engineer.full_name}</span>
                          ) : request.status === "SUBMITTED" ? (
                            <Select
                              onValueChange={(engineerId) =>
                                assignEngineerMutation.mutate({ requestId: request.id, engineerId })
                              }
                            >
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue placeholder="Assign" />
                              </SelectTrigger>
                              <SelectContent>
                                {engineers.map((eng) => (
                                  <SelectItem key={eng.id} value={eng.id}>
                                    {eng.full_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="text-sm text-gray-400">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowDetails(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <ServiceRequestDetailsModal
        open={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        engineers={engineers}
      />
    </div>
  );
}