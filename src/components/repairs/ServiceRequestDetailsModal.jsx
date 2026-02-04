import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, User, MapPin, Phone, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function ServiceRequestDetailsModal({ open, onClose, request, engineers }) {
  const [quoteData, setQuoteData] = useState({
    diagnosis_summary: "",
    proposed_resolution: "",
    parts_required: "",
    estimated_cost_parts: 0,
    estimated_cost_labor: 0,
    collection_fee: 0,
    estimated_days: 1,
  });
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: existingQuotes = [] } = useQuery({
    queryKey: ['serviceQuotes', request?.id],
    queryFn: () => base44.entities.ServiceQuote.filter({ service_request_id: request.id }),
    enabled: !!request?.id,
  });

  const createQuoteMutation = useMutation({
    mutationFn: async (data) => {
      const quote = await base44.entities.ServiceQuote.create({
        ...data,
        service_request_id: request.id,
        engineer_id: request.assigned_engineer_id,
        total_estimated_cost: data.estimated_cost_parts + data.estimated_cost_labor + data.collection_fee,
        status: "DRAFT",
        validity_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      
      await base44.entities.ServiceRequest.update(request.id, { status: "QUOTED" });
      return quote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      queryClient.invalidateQueries({ queryKey: ['serviceQuotes'] });
      setShowQuoteForm(false);
    },
  });

  const sendQuoteMutation = useMutation({
    mutationFn: async (quoteId) => {
      await base44.entities.ServiceQuote.update(quoteId, {
        status: "SENT_TO_CUSTOMER",
        sent_at: new Date().toISOString()
      });
      
      await base44.entities.ServiceRequest.update(request.id, {
        status: "WAITING_CUSTOMER_APPROVAL"
      });

      const quote = existingQuotes.find(q => q.id === quoteId);
      
      // Send email to customer
      await base44.integrations.Core.SendEmail({
        to: request.customer_email,
        subject: `Service Quote Ready - ${request.request_number}`,
        body: `Dear ${request.customer_name},\n\nYour repair quote is ready!\n\nDiagnosis: ${quote.diagnosis_summary}\n\nEstimated Cost: £${quote.total_estimated_cost}\nEstimated Time: ${quote.estimated_days} days\n\nPlease log in to your account to review and approve the quote.\n\nBest regards,\nHavillah Marketplace Service Team`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      queryClient.invalidateQueries({ queryKey: ['serviceQuotes'] });
    },
  });

  if (!request) return null;

  const assignedEngineer = engineers?.find(e => e.id === request.assigned_engineer_id);
  const latestQuote = existingQuotes[0];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Service Request: {request.request_number}
          </DialogTitle>
          <DialogDescription>
            Created on {format(new Date(request.created_date), 'dd MMM yyyy HH:mm')}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Request Details</TabsTrigger>
            <TabsTrigger value="quote">Quote</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Name</Label>
                    <p className="font-medium">{request.customer_name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Email</Label>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {request.customer_email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Phone</Label>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {request.customer_phone}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Preferred Contact</Label>
                    <Badge variant="outline" className="capitalize">
                      {request.preferred_contact_method}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Device Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Device Type</Label>
                    <p className="font-medium capitalize">{request.device_type}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Brand & Model</Label>
                    <p className="font-medium">{request.brand} {request.model}</p>
                  </div>
                  {request.serial_or_imei && (
                    <div>
                      <Label className="text-xs text-gray-500">Serial/IMEI</Label>
                      <p className="font-medium">{request.serial_or_imei}</p>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Issue Description</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded border">{request.issue_description}</p>
                </div>
                {request.attachments && request.attachments.length > 0 && (
                  <div>
                    <Label className="text-xs text-gray-500 mb-2 block">Attachments</Label>
                    <div className="flex gap-2 flex-wrap">
                      {request.attachments.map((url, idx) => (
                        <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} alt={`Attachment ${idx + 1}`} className="w-24 h-24 object-cover rounded border hover:opacity-80" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Service Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <Label className="text-xs text-gray-500">Service Option</Label>
                  <Badge className="capitalize">
                    {request.service_option_preference?.replace(/_/g, ' ')}
                  </Badge>
                </div>
                {request.service_option_preference === "collect_and_return" && request.postcode && (
                  <div>
                    <Label className="text-xs text-gray-500">Collection Address</Label>
                    <p className="text-sm">
                      {request.address_line1}, {request.address_line2 && `${request.address_line2}, `}
                      {request.city}, {request.postcode}
                    </p>
                  </div>
                )}
                {assignedEngineer && (
                  <div>
                    <Label className="text-xs text-gray-500">Assigned Engineer</Label>
                    <p className="font-medium">{assignedEngineer.full_name}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quote" className="space-y-4">
            {latestQuote ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Quote Details</CardTitle>
                    <Badge className={
                      latestQuote.status === "SENT_TO_CUSTOMER" ? "bg-blue-100 text-blue-800" :
                      latestQuote.status === "ACCEPTED" ? "bg-green-100 text-green-800" :
                      latestQuote.status === "DECLINED" ? "bg-red-100 text-red-800" :
                      ""
                    }>
                      {latestQuote.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs text-gray-500">Diagnosis</Label>
                    <p className="text-sm bg-gray-50 p-3 rounded">{latestQuote.diagnosis_summary}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Proposed Resolution</Label>
                    <p className="text-sm bg-gray-50 p-3 rounded">{latestQuote.proposed_resolution}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Parts Required</Label>
                    <p className="text-sm">{latestQuote.parts_required || "None"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div>
                      <Label className="text-xs text-gray-500">Parts Cost</Label>
                      <p className="font-medium">£{latestQuote.estimated_cost_parts?.toFixed(2)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Labor Cost</Label>
                      <p className="font-medium">£{latestQuote.estimated_cost_labor?.toFixed(2)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Collection Fee</Label>
                      <p className="font-medium">£{latestQuote.collection_fee?.toFixed(2)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Estimated Days</Label>
                      <p className="font-medium">{latestQuote.estimated_days} days</p>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <Label className="text-xs text-gray-500">Total Estimated Cost</Label>
                    <p className="text-2xl font-bold text-indigo-600">
                      £{latestQuote.total_estimated_cost?.toFixed(2)}
                    </p>
                  </div>

                  {latestQuote.status === "DRAFT" && (
                    <Button
                      className="w-full"
                      onClick={() => sendQuoteMutation.mutate(latestQuote.id)}
                      disabled={sendQuoteMutation.isPending}
                    >
                      {sendQuoteMutation.isPending ? "Sending..." : "Send Quote to Customer"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : showQuoteForm ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Create Quote</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Diagnosis Summary *</Label>
                    <Textarea
                      rows={3}
                      value={quoteData.diagnosis_summary}
                      onChange={(e) => setQuoteData({ ...quoteData, diagnosis_summary: e.target.value })}
                      placeholder="Describe what's wrong with the device..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Proposed Resolution *</Label>
                    <Textarea
                      rows={3}
                      value={quoteData.proposed_resolution}
                      onChange={(e) => setQuoteData({ ...quoteData, proposed_resolution: e.target.value })}
                      placeholder="Explain how you'll fix it..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Parts Required</Label>
                    <Input
                      value={quoteData.parts_required}
                      onChange={(e) => setQuoteData({ ...quoteData, parts_required: e.target.value })}
                      placeholder="e.g., Screen, Battery"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Parts Cost (£)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={quoteData.estimated_cost_parts}
                        onChange={(e) => setQuoteData({ ...quoteData, estimated_cost_parts: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Labor Cost (£)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={quoteData.estimated_cost_labor}
                        onChange={(e) => setQuoteData({ ...quoteData, estimated_cost_labor: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Collection Fee (£)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={quoteData.collection_fee}
                        onChange={(e) => setQuoteData({ ...quoteData, collection_fee: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Estimated Days</Label>
                      <Input
                        type="number"
                        value={quoteData.estimated_days}
                        onChange={(e) => setQuoteData({ ...quoteData, estimated_days: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <Label>Total: £{(quoteData.estimated_cost_parts + quoteData.estimated_cost_labor + quoteData.collection_fee).toFixed(2)}</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => createQuoteMutation.mutate(quoteData)}
                      disabled={createQuoteMutation.isPending || !quoteData.diagnosis_summary || !quoteData.proposed_resolution}
                    >
                      {createQuoteMutation.isPending ? "Creating..." : "Save Quote"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowQuoteForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No quote created yet</p>
                <Button onClick={() => setShowQuoteForm(true)}>
                  Create Quote
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Admin Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={6}
                  defaultValue={request.admin_notes}
                  placeholder="Add internal notes about this request..."
                  onBlur={(e) => {
                    if (e.target.value !== request.admin_notes) {
                      base44.entities.ServiceRequest.update(request.id, {
                        admin_notes: e.target.value
                      }).then(() => {
                        queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
                      });
                    }
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}