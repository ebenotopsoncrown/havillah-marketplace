import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Wrench, Smartphone, Laptop, Upload, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function RepairService() {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    preferred_contact_method: "email",
    device_type: "phone",
    brand: "",
    model: "",
    serial_or_imei: "",
    issue_description: "",
    service_option_preference: "bring_in",
    address_line1: "",
    address_line2: "",
    city: "",
    postcode: "",
    attachments: []
  });

  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestNumber, setRequestNumber] = useState("");

  const createRequestMutation = useMutation({
    mutationFn: async (data) => {
      const allRequests = await base44.entities.ServiceRequest.list();
      const requestNum = `SR-${String(allRequests.length + 1).padStart(6, '0')}`;
      
      return base44.entities.ServiceRequest.create({
        ...data,
        request_number: requestNum,
        status: "SUBMITTED",
        created_channel: "storefront"
      });
    },
    onSuccess: (data) => {
      setRequestNumber(data.request_number);
      setSubmitted(true);
      
      // Send notification email
      base44.integrations.Core.SendEmail({
        to: formData.customer_email,
        subject: `Service Request Received - ${data.request_number}`,
        body: `Dear ${formData.customer_name},\n\nThank you for submitting your ${formData.device_type} repair request (${data.request_number}).\n\nOur service engineer will review your request and get back to you within 24 hours.\n\nBest regards,\nHavillah Marketplace Service Team`
      });
    }
  });

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingFiles(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        uploadedUrls.push(file_url);
      }
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...uploadedUrls]
      }));
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createRequestMutation.mutate(formData);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto border-green-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <CardTitle className="text-3xl text-green-900">Request Submitted Successfully!</CardTitle>
              <CardDescription className="text-lg">
                Your service request <strong>{requestNumber}</strong> has been received
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-2">What happens next?</h3>
                <ul className="space-y-2 text-green-800">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Our service engineer will review your request within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>You'll receive a detailed quote with diagnosis and estimated costs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>You can track your request status anytime from your account</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="outline" className="flex-1">
                  <Link to={createPageUrl("CustomerAccount")}>
                    View My Requests
                  </Link>
                </Button>
                <Button asChild className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600">
                  <Link to={createPageUrl("CustomerStore")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Store
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link to={createPageUrl("CustomerStore")} className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Wrench className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Repairs & Service</h1>
              <p className="text-gray-600">Get your phones and laptops repaired by experts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Repair Request</CardTitle>
              <CardDescription>
                Fill out the form below and our service engineer will review your request within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer_name">Full Name *</Label>
                      <Input
                        id="customer_name"
                        required
                        value={formData.customer_name}
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer_email">Email *</Label>
                      <Input
                        id="customer_email"
                        type="email"
                        required
                        value={formData.customer_email}
                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer_phone">Phone Number *</Label>
                      <Input
                        id="customer_phone"
                        type="tel"
                        required
                        value={formData.customer_phone}
                        onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferred_contact">Preferred Contact Method</Label>
                      <Select
                        value={formData.preferred_contact_method}
                        onValueChange={(value) => setFormData({ ...formData, preferred_contact_method: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Device Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Device Information</h3>
                  <div className="space-y-2">
                    <Label>Device Type *</Label>
                    <RadioGroup
                      value={formData.device_type}
                      onValueChange={(value) => setFormData({ ...formData, device_type: value })}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phone" id="phone" />
                        <Label htmlFor="phone" className="flex items-center gap-2 cursor-pointer">
                          <Smartphone className="w-4 h-4" />
                          Phone
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="laptop" id="laptop" />
                        <Label htmlFor="laptop" className="flex items-center gap-2 cursor-pointer">
                          <Laptop className="w-4 h-4" />
                          Laptop
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="tablet" id="tablet" />
                        <Label htmlFor="tablet" className="flex items-center gap-2 cursor-pointer">
                          <Laptop className="w-4 h-4" />
                          Tablet
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand *</Label>
                      <Input
                        id="brand"
                        required
                        placeholder="e.g., Apple, Samsung"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        required
                        placeholder="e.g., iPhone 13, MacBook Pro"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serial_or_imei">Serial / IMEI (Optional)</Label>
                      <Input
                        id="serial_or_imei"
                        placeholder="Serial number"
                        value={formData.serial_or_imei}
                        onChange={(e) => setFormData({ ...formData, serial_or_imei: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Issue Description */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Issue Details</h3>
                  <div className="space-y-2">
                    <Label htmlFor="issue_description">Describe the Issue *</Label>
                    <Textarea
                      id="issue_description"
                      required
                      rows={5}
                      placeholder="Please describe the problem in detail (e.g., Screen is cracked, Device won't turn on, Battery drains quickly)"
                      value={formData.issue_description}
                      onChange={(e) => setFormData({ ...formData, issue_description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="attachments">Upload Photos (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Upload photos of the device or issue (max 5 photos)
                      </p>
                      <Input
                        id="attachments"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploadingFiles || formData.attachments.length >= 5}
                        className="max-w-xs mx-auto"
                      />
                      {uploadingFiles && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
                      {formData.attachments.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                          {formData.attachments.map((url, idx) => (
                            <img key={idx} src={url} alt={`Upload ${idx + 1}`} className="w-20 h-20 object-cover rounded" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Service Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Service Options</h3>
                  <div className="space-y-2">
                    <Label>How would you like to proceed? *</Label>
                    <RadioGroup
                      value={formData.service_option_preference}
                      onValueChange={(value) => setFormData({ ...formData, service_option_preference: value })}
                    >
                      <div className="flex items-start space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="bring_in" id="bring_in" />
                        <Label htmlFor="bring_in" className="cursor-pointer flex-1">
                          <div className="font-semibold">Bring In (Free)</div>
                          <div className="text-sm text-gray-600">Drop off your device at our service center</div>
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="collect_and_return" id="collect_and_return" />
                        <Label htmlFor="collect_and_return" className="cursor-pointer flex-1">
                          <div className="font-semibold">Collection & Return Service</div>
                          <div className="text-sm text-gray-600">We'll collect and return your device (collection fee applies)</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.service_option_preference === "collect_and_return" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                      <p className="text-sm text-blue-900 font-medium">Collection Address</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="address_line1">Address Line 1 *</Label>
                          <Input
                            id="address_line1"
                            required={formData.service_option_preference === "collect_and_return"}
                            value={formData.address_line1}
                            onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address_line2">Address Line 2</Label>
                          <Input
                            id="address_line2"
                            value={formData.address_line2}
                            onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            required={formData.service_option_preference === "collect_and_return"}
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postcode">Postcode *</Label>
                          <Input
                            id="postcode"
                            required={formData.service_option_preference === "collect_and_return"}
                            value={formData.postcode}
                            onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-6 border-t">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={createRequestMutation.isPending}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {createRequestMutation.isPending ? "Submitting..." : "Submit Repair Request"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}