import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, Wrench } from "lucide-react";

export default function QuoteReviewModal({ open, onClose, request }) {
  const [responseNote, setResponseNote] = React.useState("");
  const queryClient = useQueryClient();

  const { data: quotes = [] } = useQuery({
    queryKey: ['serviceQuotes', request?.id],
    queryFn: () => base44.entities.ServiceQuote.filter({ service_request_id: request.id }),
    enabled: !!request?.id,
  });

  const acceptQuoteMutation = useMutation({
    mutationFn: async (quoteId) => {
      const quote = quotes.find(q => q.id === quoteId);
      
      await base44.entities.ServiceQuote.update(quoteId, {
        status: "ACCEPTED",
        accepted_at: new Date().toISOString(),
        customer_response_note: responseNote
      });
      
      await base44.entities.ServiceRequest.update(request.id, {
        status: "APPROVED"
      });

      // Create Job Order
      const allJobs = await base44.entities.RepairJob.list();
      const jobNumber = `JOB-${String(allJobs.length + 1).padStart(6, '0')}`;
      
      await base44.entities.RepairJob.create({
        job_number: jobNumber,
        service_request_id: request.id,
        quote_id: quoteId,
        customer_name: request.customer_name,
        customer_email: request.customer_email,
        customer_phone: request.customer_phone,
        device_type: request.device_type,
        brand: request.brand,
        model: request.model,
        serial_or_imei: request.serial_or_imei,
        agreed_total_cost: quote.total_estimated_cost,
        collection_required: request.service_option_preference === "collect_and_return",
        collection_fee: quote.collection_fee,
        collection_method: request.service_option_preference === "collect_and_return" ? "pickup" : "bring_in",
        pickup_address_line1: request.address_line1,
        pickup_address_line2: request.address_line2,
        pickup_city: request.city,
        pickup_postcode: request.postcode,
        status: "JOB_CREATED",
        payment_status: "UNPAID",
        balance_due: quote.total_estimated_cost,
        engineer_id: request.assigned_engineer_id
      });

      await base44.entities.ServiceRequest.update(request.id, {
        status: "CONVERTED_TO_JOB"
      });

      // Send confirmation email
      await base44.integrations.Core.SendEmail({
        to: request.customer_email,
        subject: `Repair Job Created - ${jobNumber}`,
        body: `Dear ${request.customer_name},\n\nGreat news! Your repair job has been created (${jobNumber}).\n\n${request.service_option_preference === "bring_in" ? "Please bring your device to our service center at your earliest convenience." : "We will contact you shortly to arrange device collection."}\n\nEstimated completion: ${quote.estimated_days} days\nTotal cost: £${quote.total_estimated_cost}\n\nBest regards,\nHavillah Marketplace Service Team`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myServiceRequests'] });
      queryClient.invalidateQueries({ queryKey: ['serviceQuotes'] });
      onClose();
    },
  });

  const declineQuoteMutation = useMutation({
    mutationFn: async (quoteId) => {
      await base44.entities.ServiceQuote.update(quoteId, {
        status: "DECLINED",
        declined_at: new Date().toISOString(),
        customer_response_note: responseNote
      });
      
      await base44.entities.ServiceRequest.update(request.id, {
        status: "REJECTED"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myServiceRequests'] });
      queryClient.invalidateQueries({ queryKey: ['serviceQuotes'] });
      onClose();
    },
  });

  if (!request || quotes.length === 0) return null;

  const quote = quotes[0];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Repair Quote - {request.request_number}
          </DialogTitle>
          <DialogDescription>
            Review the quote and decide whether to proceed
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-blue-900">Device</Label>
                  <p className="font-medium capitalize">{request.device_type} - {request.brand} {request.model}</p>
                </div>
                <div>
                  <Label className="text-xs text-blue-900">Engineer</Label>
                  <p className="font-medium">Assigned Specialist</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold text-gray-900">Diagnosis</Label>
              <p className="text-sm bg-gray-50 p-4 rounded-lg border mt-2">
                {quote.diagnosis_summary}
              </p>
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-900">Proposed Solution</Label>
              <p className="text-sm bg-gray-50 p-4 rounded-lg border mt-2">
                {quote.proposed_resolution}
              </p>
            </div>

            {quote.parts_required && (
              <div>
                <Label className="text-sm font-semibold text-gray-900">Parts Required</Label>
                <p className="text-sm bg-gray-50 p-4 rounded-lg border mt-2">
                  {quote.parts_required}
                </p>
              </div>
            )}
          </div>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Cost Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Parts</span>
                  <span className="font-medium">£{quote.estimated_cost_parts?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Labor</span>
                  <span className="font-medium">£{quote.estimated_cost_labor?.toFixed(2)}</span>
                </div>
                {quote.collection_fee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Collection & Return</span>
                    <span className="font-medium">£{quote.collection_fee?.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-indigo-600">£{quote.total_estimated_cost?.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <Clock className="w-4 h-4" />
            <span>Estimated completion time: <strong>{quote.estimated_days} days</strong></span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="response">Additional Comments (Optional)</Label>
            <Textarea
              id="response"
              rows={3}
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
              placeholder="Any questions or special requests?"
            />
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => acceptQuoteMutation.mutate(quote.id)}
              disabled={acceptQuoteMutation.isPending || declineQuoteMutation.isPending}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {acceptQuoteMutation.isPending ? "Processing..." : "Accept & Proceed"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
              onClick={() => declineQuoteMutation.mutate(quote.id)}
              disabled={acceptQuoteMutation.isPending || declineQuoteMutation.isPending}
            >
              <XCircle className="w-4 h-4 mr-2" />
              {declineQuoteMutation.isPending ? "Processing..." : "Decline Quote"}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Quote valid until {quote.validity_until ? new Date(quote.validity_until).toLocaleDateString() : "7 days"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}