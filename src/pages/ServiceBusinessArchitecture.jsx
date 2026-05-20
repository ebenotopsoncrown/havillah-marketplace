import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ServiceBusinessArchitecture() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Service Business Application
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Comprehensive Architecture & Design Document
          </p>
          <p className="text-lg text-gray-500">
            Device Repairs + Fashion Design & Alterations Platform
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Badge className="bg-purple-600 text-white text-base px-4 py-2">Device Repair Services</Badge>
            <Badge className="bg-pink-600 text-white text-base px-4 py-2">Fashion Design & Alterations</Badge>
            <Badge className="bg-indigo-600 text-white text-base px-4 py-2">Multi-Service Platform</Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 h-auto p-2 bg-white">
            <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
            <TabsTrigger value="entities" className="text-sm">Data Models</TabsTrigger>
            <TabsTrigger value="repair-flow" className="text-sm">Repair Flow</TabsTrigger>
            <TabsTrigger value="fashion-flow" className="text-sm">Fashion Flow</TabsTrigger>
            <TabsTrigger value="features" className="text-sm">Features</TabsTrigger>
            <TabsTrigger value="pages" className="text-sm">Pages/UI</TabsTrigger>
            <TabsTrigger value="implementation" className="text-sm">Implementation</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardTitle className="text-3xl">Application Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 Business Purpose</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    A unified service management platform combining <strong>Device Repair Services</strong> (phones, laptops, tablets) 
                    with <strong>Fashion Design, Dressmaking & Alterations</strong>. The system handles the complete service lifecycle from 
                    customer request submission through diagnosis/consultation, quotation, job execution, and final delivery.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">👥 User Roles</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                      <h4 className="text-xl font-bold text-blue-900 mb-3">Customers</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Submit repair requests (devices)</li>
                        <li>• Request fashion services</li>
                        <li>• Upload photos/measurements</li>
                        <li>• Review and approve quotes</li>
                        <li>• Track service progress</li>
                        <li>• Confirm completion</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                      <h4 className="text-xl font-bold text-green-900 mb-3">Service Providers</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Engineers (device repairs)</li>
                        <li>• Fashion designers</li>
                        <li>• Tailors/seamstresses</li>
                        <li>• Create quotes</li>
                        <li>• Execute jobs</li>
                        <li>• Provide updates</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                      <h4 className="text-xl font-bold text-purple-900 mb-3">Administrators</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Manage all requests</li>
                        <li>• Assign service providers</li>
                        <li>• Oversee job progress</li>
                        <li>• Handle payments</li>
                        <li>• Generate reports</li>
                        <li>• Manage provider profiles</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">🏗️ Technical Architecture</h3>
                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                    <ul className="space-y-3 text-gray-700 text-lg">
                      <li><strong>Frontend:</strong> React SPA with Tailwind CSS + shadcn/ui components</li>
                      <li><strong>Backend:</strong> Base44 Platform (PostgreSQL + Deno Deploy serverless functions)</li>
                      <li><strong>Authentication:</strong> Base44 built-in auth with role-based access (admin/user)</li>
                      <li><strong>File Storage:</strong> Supabase Storage for photos, measurements, documents</li>
                      <li><strong>Integrations:</strong> Stripe (payments), SendGrid/Base44 Core (emails), Google Maps (address validation)</li>
                      <li><strong>Real-time:</strong> Base44 entity subscriptions for live status updates</li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">🎨 Key Differentiators</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h4 className="text-lg font-bold text-purple-900 mb-3">Device Repairs Module</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>✓ Multi-device support (phones, laptops, tablets)</li>
                        <li>✓ Collection & return service options</li>
                        <li>✓ Parts tracking & cost breakdown</li>
                        <li>✓ Engineer assignment & routing</li>
                        <li>✓ Warranty tracking</li>
                      </ul>
                    </div>
                    <div className="bg-pink-50 p-6 rounded-lg">
                      <h4 className="text-lg font-bold text-pink-900 mb-3">Fashion Design Module</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>✓ Custom design requests with sketches</li>
                        <li>✓ Measurement capture (self or professional)</li>
                        <li>✓ Home visit measurement service</li>
                        <li>✓ Fabric selection & sourcing</li>
                        <li>✓ Alteration services</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ENTITIES TAB */}
          <TabsContent value="entities">
            <div className="space-y-6">
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <CardTitle className="text-3xl">Data Models (Entities)</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  
                  {/* SHARED ENTITIES */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Badge className="bg-gray-600">Shared</Badge>
                      Core Entities
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">ServiceProvider</h4>
                        <p className="text-gray-600 mb-4">Represents engineers, designers, and tailors</p>
                        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "provider_code": "string (unique)",
  "provider_type": "engineer|fashion_designer|tailor",
  "user_id": "string (link to User entity)",
  "full_name": "string",
  "email": "string (email)",
  "phone": "string",
  "specializations": "string (comma-separated)",
  "coverage_areas": "string (postcodes/regions)",
  "hourly_rate": "number",
  "home_visit_fee": "number (for fashion designers)",
  "rating": "number (0-5)",
  "total_jobs_completed": "number",
  "is_active": "boolean",
  "profile_photo_url": "string",
  "bio": "string",
  "certifications": "string",
  "availability_status": "available|busy|unavailable"
}`}
                        </pre>
                      </div>

                      <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Customer</h4>
                        <p className="text-gray-600 mb-4">Extended customer profile (links to User entity)</p>
                        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "user_id": "string (link to User entity)",
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "address_line1": "string",
  "address_line2": "string",
  "city": "string",
  "postcode": "string",
  "preferred_contact_method": "email|phone|whatsapp",
  "body_measurements": "object (for fashion - JSON)",
  "measurement_date": "date",
  "notes": "string",
  "total_service_requests": "number",
  "loyalty_points": "number"
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* REPAIR ENTITIES */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Badge className="bg-purple-600">Repair Module</Badge>
                      Device Repair Entities
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-300">
                        <h4 className="text-xl font-bold text-purple-900 mb-3">RepairRequest</h4>
                        <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "request_number": "string (REQ-000001)",
  "customer_id": "string",
  "customer_name": "string",
  "customer_email": "string",
  "customer_phone": "string",
  "device_type": "phone|laptop|tablet",
  "brand": "string",
  "model": "string",
  "serial_or_imei": "string",
  "issue_description": "string (text)",
  "issue_photos": "array of strings (URLs)",
  "purchase_date": "date",
  "warranty_status": "in_warranty|out_of_warranty|unknown",
  "service_option": "bring_in|collect_and_return",
  "collection_address": "string",
  "collection_postcode": "string",
  "preferred_date": "date",
  "preferred_time_slot": "morning|afternoon|evening",
  "status": "submitted|under_review|diagnosed|quoted|approved|in_repair|completed|collected|cancelled",
  "assigned_engineer_id": "string",
  "priority": "low|normal|high|urgent",
  "admin_notes": "string"
}`}
                        </pre>
                      </div>

                      <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-300">
                        <h4 className="text-xl font-bold text-purple-900 mb-3">RepairQuote</h4>
                        <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "quote_number": "string (QTE-000001)",
  "repair_request_id": "string",
  "engineer_id": "string",
  "diagnosis_summary": "string (text)",
  "proposed_solution": "string (text)",
  "parts_required": "array of objects [{name, cost, quantity}]",
  "labor_cost": "number",
  "parts_total": "number",
  "collection_fee": "number",
  "discount_amount": "number",
  "subtotal": "number",
  "vat_amount": "number",
  "total_cost": "number",
  "estimated_completion_days": "number",
  "warranty_months": "number",
  "terms_conditions": "string",
  "validity_until": "date",
  "status": "draft|sent|viewed|accepted|declined|expired",
  "sent_at": "datetime",
  "customer_response_date": "datetime",
  "customer_comments": "string"
}`}
                        </pre>
                      </div>

                      <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-300">
                        <h4 className="text-xl font-bold text-purple-900 mb-3">RepairJob</h4>
                        <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "job_number": "string (JOB-000001)",
  "repair_request_id": "string",
  "quote_id": "string",
  "customer_id": "string",
  "engineer_id": "string",
  "device_info": "object (brand, model, serial)",
  "agreed_total": "number",
  "status": "pending_device|device_received|in_progress|waiting_parts|quality_check|ready_for_collection|delivered|completed",
  "started_at": "datetime",
  "completed_at": "datetime",
  "collection_scheduled": "datetime",
  "delivery_scheduled": "datetime",
  "actual_delivery": "datetime",
  "payment_status": "unpaid|deposit_paid|paid|refunded",
  "amount_paid": "number",
  "balance_due": "number",
  "payment_method": "card|cash|bank_transfer",
  "stripe_payment_intent_id": "string",
  "quality_check_passed": "boolean",
  "customer_signature": "string (base64)",
  "customer_confirmed_at": "datetime",
  "warranty_expiry_date": "date",
  "parts_used": "array of objects",
  "internal_notes": "string",
  "customer_visible_notes": "string"
}`}
                        </pre>
                      </div>

                      <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-300">
                        <h4 className="text-xl font-bold text-purple-900 mb-3">RepairUpdate</h4>
                        <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "job_id": "string",
  "update_type": "status_change|message|parts_ordered|issue_found|completion",
  "message": "string",
  "old_status": "string",
  "new_status": "string",
  "updated_by_user_id": "string",
  "updated_by_name": "string",
  "photo_urls": "array of strings",
  "visible_to_customer": "boolean",
  "customer_notified": "boolean",
  "notification_sent_at": "datetime"
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* FASHION ENTITIES */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Badge className="bg-pink-600">Fashion Module</Badge>
                      Fashion Design & Alterations Entities
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="bg-pink-50 p-6 rounded-lg border-2 border-pink-300">
                        <h4 className="text-xl font-bold text-pink-900 mb-3">FashionRequest</h4>
                        <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "request_number": "string (FSH-000001)",
  "customer_id": "string",
  "customer_name": "string",
  "customer_email": "string",
  "customer_phone": "string",
  "service_type": "custom_design|alteration|repair",
  "garment_type": "dress|suit|shirt|trousers|traditional_wear|other",
  "description": "string (text)",
  "reference_photos": "array of strings (URLs)",
  "sketch_or_design": "string (URL)",
  "fabric_preference": "string",
  "fabric_provided_by": "customer|designer",
  "color_preferences": "string",
  "style_notes": "string (text)",
  "occasion": "wedding|party|casual|formal|traditional",
  "deadline_date": "date",
  "urgency": "standard|rush|express",
  "measurement_status": "not_provided|self_provided|needs_appointment|completed",
  "measurements": "object (JSON - neck, chest, waist, etc)",
  "measurement_appointment_requested": "boolean",
  "appointment_address": "string",
  "appointment_postcode": "string",
  "appointment_fee": "number",
  "preferred_appointment_date": "date",
  "preferred_appointment_time": "string",
  "status": "submitted|measurement_pending|quoted|approved|in_progress|fitting_ready|alterations_needed|completed|delivered|cancelled",
  "assigned_designer_id": "string",
  "priority": "low|normal|high"
}`}
                        </pre>
                      </div>

                      <div className="bg-pink-50 p-6 rounded-lg border-2 border-pink-300">
                        <h4 className="text-xl font-bold text-pink-900 mb-3">MeasurementAppointment</h4>
                        <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "fashion_request_id": "string",
  "customer_id": "string",
  "designer_id": "string",
  "appointment_type": "measurement|fitting|consultation",
  "scheduled_date": "date",
  "scheduled_time": "string",
  "location_type": "customer_home|studio|shop",
  "address": "string",
  "postcode": "string",
  "travel_fee": "number",
  "status": "scheduled|confirmed|in_progress|completed|cancelled|rescheduled",
  "duration_minutes": "number",
  "arrival_time": "datetime",
  "completion_time": "datetime",
  "measurements_taken": "object (JSON)",
  "photos_taken": "array of strings",
  "notes": "string",
  "customer_signature": "string",
  "designer_notes": "string"
}`}
                        </pre>
                      </div>

                      <div className="bg-pink-50 p-6 rounded-lg border-2 border-pink-300">
                        <h4 className="text-xl font-bold text-pink-900 mb-3">FashionQuote</h4>
                        <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "quote_number": "string (FQT-000001)",
  "fashion_request_id": "string",
  "designer_id": "string",
  "design_description": "string (text)",
  "fabric_details": "string",
  "fabric_cost": "number",
  "labor_cost": "number",
  "accessories_cost": "number",
  "measurement_fee": "number (if applicable)",
  "fitting_sessions": "number",
  "alteration_allowance": "number",
  "discount_amount": "number",
  "subtotal": "number",
  "vat_amount": "number",
  "total_cost": "number",
  "deposit_required": "number",
  "estimated_completion_days": "number",
  "number_of_fittings": "number",
  "terms_conditions": "string",
  "validity_until": "date",
  "status": "draft|sent|viewed|accepted|declined|expired",
  "sent_at": "datetime",
  "customer_response_date": "datetime",
  "customer_comments": "string"
}`}
                        </pre>
                      </div>

                      <div className="bg-pink-50 p-6 rounded-lg border-2 border-pink-300">
                        <h4 className="text-xl font-bold text-pink-900 mb-3">FashionJob</h4>
                        <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "job_number": "string (FJB-000001)",
  "fashion_request_id": "string",
  "quote_id": "string",
  "customer_id": "string",
  "designer_id": "string",
  "garment_type": "string",
  "agreed_total": "number",
  "deposit_paid": "number",
  "balance_due": "number",
  "status": "confirmed|fabric_sourcing|cutting|stitching|first_fitting|alterations|final_fitting|quality_check|ready_for_collection|delivered|completed",
  "started_at": "datetime",
  "first_fitting_date": "date",
  "final_fitting_date": "date",
  "estimated_completion": "date",
  "actual_completion": "datetime",
  "fitting_notes": "array of objects [{date, notes, photos, alterations_needed}]",
  "payment_status": "deposit_paid|balance_due|paid|refunded",
  "payment_method": "card|cash|bank_transfer",
  "stripe_payment_intent_id": "string",
  "collection_method": "pickup|delivery",
  "delivery_address": "string",
  "delivery_fee": "number",
  "customer_satisfaction": "number (1-5)",
  "customer_feedback": "string",
  "customer_signature": "string",
  "photos_final": "array of strings",
  "internal_notes": "string",
  "customer_visible_notes": "string"
}`}
                        </pre>
                      </div>

                      <div className="bg-pink-50 p-6 rounded-lg border-2 border-pink-300">
                        <h4 className="text-xl font-bold text-pink-900 mb-3">FashionUpdate</h4>
                        <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "job_id": "string",
  "update_type": "status_change|message|fitting_scheduled|fabric_arrived|progress_photo|completion",
  "message": "string",
  "old_status": "string",
  "new_status": "string",
  "updated_by_user_id": "string",
  "updated_by_name": "string",
  "photo_urls": "array of strings",
  "visible_to_customer": "boolean",
  "customer_notified": "boolean",
  "notification_sent_at": "datetime"
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* PAYMENT & MISC */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Badge className="bg-green-600">Shared</Badge>
                      Payment & Support Entities
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="bg-green-50 p-6 rounded-lg border-2 border-green-300">
                        <h4 className="text-xl font-bold text-green-900 mb-3">Payment</h4>
                        <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "payment_reference": "string",
  "job_type": "repair|fashion",
  "job_id": "string",
  "customer_id": "string",
  "amount": "number",
  "payment_type": "deposit|balance|full_payment|refund",
  "payment_method": "card|cash|bank_transfer",
  "payment_status": "pending|completed|failed|refunded",
  "stripe_payment_intent_id": "string",
  "stripe_charge_id": "string",
  "stripe_refund_id": "string",
  "transaction_date": "datetime",
  "receipt_url": "string",
  "notes": "string"
}`}
                        </pre>
                      </div>

                      <div className="bg-green-50 p-6 rounded-lg border-2 border-green-300">
                        <h4 className="text-xl font-bold text-green-900 mb-3">Review</h4>
                        <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "job_type": "repair|fashion",
  "job_id": "string",
  "provider_id": "string",
  "customer_id": "string",
  "rating": "number (1-5)",
  "review_text": "string",
  "would_recommend": "boolean",
  "response_from_provider": "string",
  "is_published": "boolean",
  "photos": "array of strings"
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* REPAIR FLOW TAB */}
          <TabsContent value="repair-flow">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <CardTitle className="text-3xl">Device Repair Service Flow</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-8 rounded-xl border-2 border-purple-300">
                  <h3 className="text-2xl font-bold text-purple-900 mb-6">Complete Repair Journey</h3>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">1</div>
                      </div>
                      <div className="flex-1 bg-white p-6 rounded-lg shadow">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Customer Submits Request</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Customer fills out repair request form on public-facing page</li>
                          <li>• Selects device type (phone/laptop/tablet), brand, model</li>
                          <li>• Describes issue in detail</li>
                          <li>• Uploads photos of damaged device</li>
                          <li>• Chooses service option: "Bring In" or "Collect & Return"</li>
                          <li>• If collection: provides address and preferred date/time</li>
                          <li>• Creates account or logs in</li>
                          <li>• Request status: <Badge>SUBMITTED</Badge></li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">2</div>
                      </div>
                      <div className="flex-1 bg-white p-6 rounded-lg shadow">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Admin Reviews & Assigns Engineer</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Admin sees request in "Service Requests" dashboard</li>
                          <li>• Reviews device details and issue description</li>
                          <li>• Assigns an engineer based on specialization and availability</li>
                          <li>• If collection needed: system can suggest nearest engineer based on postcode</li>
                          <li>• Sets priority level (low/normal/high/urgent)</li>
                          <li>• Request status: <Badge className="bg-blue-500">UNDER_REVIEW</Badge></li>
                          <li>• Customer receives email notification: "Your request is being reviewed"</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">3</div>
                      </div>
                      <div className="flex-1 bg-white p-6 rounded-lg shadow">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Engineer Diagnoses & Creates Quote</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Engineer receives notification of assignment</li>
                          <li>• Reviews device photos and customer's description</li>
                          <li>• If "Bring In": customer brings device to shop/workshop</li>
                          <li>• If "Collect": engineer schedules collection visit</li>
                          <li>• Engineer performs diagnosis</li>
                          <li>• Creates detailed quote including:</li>
                          <ul className="ml-6 mt-2 space-y-1 text-sm">
                            <li>- Diagnosis summary</li>
                            <li>- Proposed solution/repair method</li>
                            <li>- Parts required (itemized with costs)</li>
                            <li>- Labor cost</li>
                            <li>- Collection/delivery fee (if applicable)</li>
                            <li>- Estimated completion time (days)</li>
                            <li>- Warranty period</li>
                            <li>- Total cost breakdown</li>
                          </ul>
                          <li>• Quote status: <Badge className="bg-yellow-500">SENT_TO_CUSTOMER</Badge></li>
                          <li>• Customer receives email with quote details and approval link</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">4</div>
                      </div>
                      <div className="flex-1 bg-white p-6 rounded-lg shadow">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Customer Reviews & Approves Quote</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Customer logs in to "My Repair Requests" page</li>
                          <li>• Views detailed quote with breakdown</li>
                          <li>• Can ask questions or request modifications (via notes/messages)</li>
                          <li>• Decides to ACCEPT or DECLINE</li>
                          <li><strong>If DECLINED:</strong> Request status: <Badge className="bg-red-500">DECLINED</Badge></li>
                          <li><strong>If ACCEPTED:</strong> Quote status: <Badge className="bg-green-500">ACCEPTED</Badge></li>
                          <li>• System automatically creates RepairJob entity</li>
                          <li>• Customer proceeds to payment (deposit or full payment via Stripe)</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">5</div>
                      </div>
                      <div className="flex-1 bg-white p-6 rounded-lg shadow">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Repair Job Execution</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• RepairJob is created with job number (JOB-000001)</li>
                          <li>• Engineer begins repair work</li>
                          <li>• Job progresses through statuses:</li>
                          <ul className="ml-6 mt-2 space-y-1 text-sm">
                            <li><Badge className="bg-orange-500">PENDING_DEVICE</Badge> → Waiting for device</li>
                            <li><Badge className="bg-blue-500">DEVICE_RECEIVED</Badge> → Device in workshop</li>
                            <li><Badge className="bg-purple-500">IN_PROGRESS</Badge> → Repair in progress</li>
                            <li><Badge className="bg-yellow-500">WAITING_PARTS</Badge> → Parts on order</li>
                            <li><Badge className="bg-green-500">QUALITY_CHECK</Badge> → Testing & QC</li>
                            <li><Badge className="bg-indigo-500">READY_FOR_COLLECTION</Badge> → Complete</li>
                          </ul>
                          <li>• Engineer creates RepairUpdate entries at each stage</li>
                          <li>• Updates can include photos, messages, and status changes</li>
                          <li>• Customer receives email/SMS notifications for major milestones</li>
                          <li>• Customer can view real-time progress in "My Repair Jobs" page</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">6</div>
                      </div>
                      <div className="flex-1 bg-white p-6 rounded-lg shadow">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Collection/Delivery & Completion</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• When repair is complete: Job status → <Badge className="bg-green-500">READY_FOR_COLLECTION</Badge></li>
                          <li>• Customer receives notification with collection/delivery details</li>
                          <li><strong>If "Bring In":</strong> Customer picks up from shop</li>
                          <li><strong>If "Collect & Return":</strong> Engineer schedules return delivery</li>
                          <li>• Customer pays balance (if not paid upfront)</li>
                          <li>• Customer tests device and signs off</li>
                          <li>• Job status: <Badge className="bg-blue-500">DELIVERED</Badge></li>
                          <li>• Customer clicks "Confirm Completion" in their account</li>
                          <li>• Job status: <Badge className="bg-gray-500">COMPLETED</Badge></li>
                          <li>• Customer is prompted to leave a review (rating + feedback)</li>
                          <li>• Warranty period begins (tracked via warranty_expiry_date)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">🔄 Real-Time Features</h3>
                  <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                    <ul className="space-y-2 text-gray-700">
                      <li>• Customer dashboard shows live status updates using Base44 entity subscriptions</li>
                      <li>• Engineer can upload photos from mobile during repair (progress photos)</li>
                      <li>• Admin dashboard shows all jobs in real-time with color-coded status badges</li>
                      <li>• Automated email notifications at each stage (using Base44 Core SendEmail integration)</li>
                      <li>• SMS notifications for critical updates (optional - using Twilio integration)</li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">💳 Payment Flow</h3>
                  <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                    <ul className="space-y-2 text-gray-700">
                      <li><strong>Option 1:</strong> Full payment upfront when accepting quote (Stripe checkout)</li>
                      <li><strong>Option 2:</strong> Deposit payment (e.g., 50%) upfront, balance on collection</li>
                      <li><strong>Option 3:</strong> Pay on collection (cash/card in-person, or Stripe link)</li>
                      <li>• All payments tracked in Payment entity</li>
                      <li>• Stripe webhooks update payment status automatically</li>
                      <li>• Refunds processed if customer declines quote after diagnosis</li>
                    </ul>
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* FASHION FLOW TAB */}
          <TabsContent value="fashion-flow">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
                <CardTitle className="text-3xl">Fashion Design & Alterations Flow</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                
                <div className="bg-gradient-to-r from-pink-50 to-rose-100 p-8 rounded-xl border-2 border-pink-300">
                  <h3 className="text-2xl font-bold text-pink-900 mb-6">Complete Fashion Service Journey</h3>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xl">1</div>
                      </div>
                      <div className="flex-1 bg-white p-6 rounded-lg shadow">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Customer Submits Fashion Request</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Customer fills out fashion request form on public-facing page</li>
                          <li>• Selects service type: <Badge>Custom Design</Badge> <Badge>Alteration</Badge> <Badge>Repair</Badge></li>
                          <li>• Chooses garment type: dress, suit, traditional wear, etc.</li>
                          <li>• Provides detailed description of desired design/alterations</li>
                          <li>• Uploads reference photos, sketches, or inspiration images</li>
                          <li>• Specifies fabric preference and color choices</li>
                          <li>• Indicates occasion (wedding, party, formal, etc.)</li>
                          <li>• Sets deadline date</li>
                          <li><strong>Measurement Options:</strong></li>
                          <ul className="ml-6 mt-2 space-y-1 text-sm">
                            <li>✓ <strong>I have my measurements</strong> → uploads measurement sheet/photo</li>
                            <li>✓ <strong>I need someone to take my measurements</strong> → requests home visit appointment</li>
                          </ul>
                          <li>• If home visit: provides address and preferred date/time</li>
                          <li>• Request status: <Badge>SUBMITTED</Badge></li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xl">2</div>
                      </div>
                      <div className="flex-1 bg-white p-6 rounded-lg shadow">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Admin Reviews & Assigns Designer</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Admin sees request in "Fashion Requests" dashboard</li>
                          <li>• Reviews design requirements, photos, and deadline</li>
                          <li>• Assigns fashion designer based on:</li>
                          <ul className="ml-6 mt-2 space-y-1 text-sm">
                            <li>- Specialization (e.g., wedding dresses, traditional wear)</li>
                            <li>- Availability and workload</li>
                            <li>- Location (if home visit needed)</li>
                          </ul>
                          <li>• Sets priority level</li>
                          <li>• Request status: <Badge className="bg-blue-500">UNDER_REVIEW</Badge></li>
                          <li>• Customer receives email: "Your request is being reviewed by a designer"</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xl">3</div>
                      </div>
                      <div className="flex-1 bg-white p-6 rounded-lg shadow">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Measurement Collection (If Needed)</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li><strong>Scenario A: Customer has measurements</strong></li>
                          <ul className="ml-6 mt-2 space-y-1 text-sm">
                            <li>• Designer reviews uploaded measurements</li>
                            <li>• Validates measurements for accuracy</li>
                            <li>• Measurement status: <Badge className="bg-green-500">COMPLETED</Badge></li>
                            <li>• Designer proceeds to create quote</li>
                          </ul>
                          <li className="mt-4"><strong>Scenario B: Home visit appointment required</strong></li>
                          <ul className="ml-6 mt-2 space-y-1 text-sm">
                            <li>• System creates MeasurementAppointment entity</li>
                            <li>• Designer confirms appointment date/time</li>
                            <li>• Measurement fee is added to final quote (e.g., £30-50 depending on location)</li>
                            <li>• Appointment status: <Badge className="bg-blue-500">SCHEDULED</Badge></li>
                            <li>• Designer visits customer's address</li>
                            <li>• Takes professional measurements (neck, chest, waist, hips, inseam, etc.)</li>
                            <li>• Takes photos for reference</li>
                            <li>• Customer signs off on appointment</li>
                            <li>• Measurements stored in system</li>
                            <li>• Appointment status: <Badge className="bg-green-500">COMPLETED</Badge></li>
                          </ul>
                          <li>• Request status: <Badge className="bg-purple-500">MEASUREMENT_PENDING</Badge> → <Badge className="bg-green-500">MEASUREMENT_COMPLETED</Badge></li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xl">4</div>
                      </div>
                      <div className="flex-1 bg-white p-6 rounded-lg shadow">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Designer Creates Quote</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Designer reviews request details and measurements</li>
                          <li>• Creates detailed FashionQuote including:</li>
                          <ul className="ml-6 mt-2 space-y-1 text-sm">
                            <li>- Design description and approach</li>
                            <li>- Fabric details (type, color, quantity, cost)</li>
                            <li>- Labor cost (design + stitching + finishing)</li>
                            <li>- Accessories cost (buttons, zippers, embellishments)</li>
                            <li>- Measurement fee (if home visit was done)</li>
                            <li>- Number of fitting sessions included (e.g., 2 fittings)</li>
                            <li>- Alteration allowance (minor adjustments after fittings)</li>
                            <li>- Estimated completion time (days/weeks)</li>
                            <li>- Total cost breakdown with VAT</li>
                            <li>- Deposit required (typically 50%)</li>
                          </ul>
                          <li>• Can attach design sketches or fabric swatches</li>
                          <li>• Quote status: <Badge className="bg-yellow-500">SENT_TO_CUSTOMER</Badge></li>
                          <li>• Customer receives email with quote details and approval link</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xl">5</div>
                      </div>
                      <div className="flex-1 bg-white p-6 rounded-lg shadow">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Customer Reviews & Approves Quote</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Customer logs in to "My Fashion Requests" page</li>
                          <li>• Views detailed quote with design description and cost breakdown</li>
                          <li>• Can request modifications or ask questions via messaging</li>
                          <li>• Decides to ACCEPT or DECLINE</li>
                          <li><strong>If DECLINED:</strong> Request status: <Badge className="bg-red-500">DECLINED</Badge></li>
                          <li><strong>If ACCEPTED:</strong> Quote status: <Badge className="bg-green-500">ACCEPTED</Badge></li>
                          <li>• System automatically creates FashionJob entity</li>
                          <li>• Customer pays deposit (e.g., 50%) via Stripe</li>
                          <li>• Payment confirmation triggers job to start</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xl">6</div>
                      </div>
                      <div className="flex-1 bg-white p-6 rounded-lg shadow">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Fashion Job Execution</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• FashionJob is created with job number (FJB-000001)</li>
                          <li>• Designer begins work on garment</li>
                          <li>• Job progresses through statuses:</li>
                          <ul className="ml-6 mt-2 space-y-1 text-sm">
                            <li><Badge className="bg-blue-500">CONFIRMED</Badge> → Deposit received</li>
                            <li><Badge className="bg-purple-500">FABRIC_SOURCING</Badge> → Purchasing materials</li>
                            <li><Badge className="bg-indigo-500">CUTTING</Badge> → Fabric cutting phase</li>
                            <li><Badge className="bg-orange-500">STITCHING</Badge> → Main construction</li>
                            <li><Badge className="bg-yellow-500">FIRST_FITTING</Badge> → Customer tries on</li>
                            <li><Badge className="bg-pink-500">ALTERATIONS</Badge> → Adjustments after fitting</li>
                            <li><Badge className="bg-rose-500">FINAL_FITTING</Badge> → Last fitting session</li>
                            <li><Badge className="bg-green-500">QUALITY_CHECK</Badge> → Final inspection</li>
                            <li><Badge className="bg-emerald-500">READY_FOR_COLLECTION</Badge> → Complete</li>
                          </ul>
                          <li>• Designer creates FashionUpdate entries at each stage</li>
                          <li>• Updates include progress photos (especially after each stage)</li>
                          <li>• Customer receives notifications for fittings and major milestones</li>
                          <li>• Customer can view real-time progress in "My Fashion Jobs" page</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xl">7</div>
                      </div>
                      <div className="flex-1 bg-white p-6 rounded-lg shadow">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Fitting Sessions</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Designer schedules first fitting (typically halfway through)</li>
                          <li>• Customer visits studio/workshop or designer visits customer (premium service)</li>
                          <li>• Customer tries on partially completed garment</li>
                          <li>• Designer takes notes on adjustments needed (tighter/looser, length, fit)</li>
                          <li>• Takes photos for reference</li>
                          <li>• Fitting details stored in fitting_notes array:</li>
                          <ul className="ml-6 mt-2 space-y-1 text-sm">
                            <li>- Date of fitting</li>
                            <li>- Adjustments required</li>
                            <li>- Photos from fitting</li>
                            <li>- Customer feedback</li>
                          </ul>
                          <li>• Designer makes alterations based on fitting feedback</li>
                          <li>• Process repeats for final fitting (if needed)</li>
                          <li>• Final fitting ensures perfect fit before completion</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xl">8</div>
                      </div>
                      <div className="flex-1 bg-white p-6 rounded-lg shadow">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Completion & Delivery</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• When garment is complete: Job status → <Badge className="bg-green-500">READY_FOR_COLLECTION</Badge></li>
                          <li>• Customer receives notification with photos of finished garment</li>
                          <li>• Customer pays balance (remaining 50%) via Stripe</li>
                          <li><strong>Collection Options:</strong></li>
                          <ul className="ml-6 mt-2 space-y-1 text-sm">
                            <li>✓ <strong>Pickup:</strong> Customer collects from studio</li>
                            <li>✓ <strong>Delivery:</strong> Designer delivers to customer's address (delivery fee applies)</li>
                          </ul>
                          <li>• Customer inspects final garment</li>
                          <li>• Customer signs off and confirms satisfaction</li>
                          <li>• Job status: <Badge className="bg-blue-500">DELIVERED</Badge></li>
                          <li>• Customer clicks "Confirm Completion" in their account</li>
                          <li>• Job status: <Badge className="bg-gray-500">COMPLETED</Badge></li>
                          <li>• Customer rates designer and leaves review</li>
                          <li>• Photos of customer wearing the garment can be added (with permission for portfolio)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">📏 Measurement Details</h3>
                  <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
                    <p className="font-semibold text-gray-900 mb-3">Standard Measurements Captured:</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-bold text-gray-800 mb-2">Upper Body:</p>
                        <ul className="space-y-1 text-gray-700 text-sm">
                          <li>• Neck circumference</li>
                          <li>• Shoulder width</li>
                          <li>• Chest/Bust</li>
                          <li>• Waist</li>
                          <li>• Arm length</li>
                          <li>• Sleeve circumference</li>
                          <li>• Back width</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 mb-2">Lower Body:</p>
                        <ul className="space-y-1 text-gray-700 text-sm">
                          <li>• Hip circumference</li>
                          <li>• Waist to knee</li>
                          <li>• Waist to ankle (full length)</li>
                          <li>• Inseam</li>
                          <li>• Thigh circumference</li>
                          <li>• Knee circumference</li>
                          <li>• Ankle circumference</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4 italic">Measurements stored as JSON object in both Customer.body_measurements and MeasurementAppointment.measurements_taken</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">💰 Payment Structure</h3>
                  <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                    <ul className="space-y-3 text-gray-700">
                      <li><strong>Deposit Payment (50%):</strong> Paid when customer accepts quote → triggers job to start</li>
                      <li><strong>Balance Payment (50%):</strong> Paid when garment is ready for collection</li>
                      <li><strong>Measurement Fee:</strong> Included in quote if home visit was needed (£30-50 typical)</li>
                      <li><strong>Delivery Fee:</strong> Optional charge if customer wants garment delivered</li>
                      <li><strong>Rush Fee:</strong> Additional charge for express/urgent orders (e.g., +30% for rush)</li>
                      <li>• All payments via Stripe (card) or cash/bank transfer in-person</li>
                      <li>• Refund policy: Deposit non-refundable after fabric is cut</li>
                    </ul>
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* FEATURES TAB */}
          <TabsContent value="features">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                <CardTitle className="text-3xl">Key Features & Functionality</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">🌟 Customer-Facing Features</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                      <h4 className="text-lg font-bold text-blue-900 mb-3">For Repair Services</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>✓ Easy request submission with photo upload</li>
                        <li>✓ Real-time quote viewing and approval</li>
                        <li>✓ Live job status tracking with timeline</li>
                        <li>✓ Photo updates from engineer during repair</li>
                        <li>✓ Email/SMS notifications at each stage</li>
                        <li>✓ Secure online payment (Stripe)</li>
                        <li>✓ Digital receipt and warranty certificate</li>
                        <li>✓ Review and rating system</li>
                        <li>✓ Request history and past repairs</li>
                        <li>✓ Collection scheduling</li>
                      </ul>
                    </div>
                    <div className="bg-pink-50 p-6 rounded-lg border-2 border-pink-200">
                      <h4 className="text-lg font-bold text-pink-900 mb-3">For Fashion Services</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>✓ Design request with reference photos</li>
                        <li>✓ Measurement upload or home visit request</li>
                        <li>✓ Real-time quote viewing and approval</li>
                        <li>✓ Progress photos at each stage</li>
                        <li>✓ Fitting appointment scheduling</li>
                        <li>✓ Live job status tracking</li>
                        <li>✓ Secure deposit and balance payment</li>
                        <li>✓ Design consultation messaging</li>
                        <li>✓ Final garment photos before collection</li>
                        <li>✓ Review and rating for designer</li>
                        <li>✓ Order history and measurements on file</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">🛠️ Admin Dashboard Features</h3>
                  <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                    <ul className="space-y-2 text-gray-700">
                      <li>✓ Unified dashboard showing all repair and fashion requests</li>
                      <li>✓ Filter by status, priority, service type, date range</li>
                      <li>✓ Search by customer name, request number, or device/garment</li>
                      <li>✓ Quick assign to service providers (engineers/designers)</li>
                      <li>✓ View and manage all active jobs with visual status indicators</li>
                      <li>✓ Revenue tracking and financial reports</li>
                      <li>✓ Provider performance metrics (completion rate, avg rating, jobs completed)</li>
                      <li>✓ Customer management (contact details, service history, loyalty)</li>
                      <li>✓ Automated email notifications management</li>
                      <li>✓ Payment tracking and reconciliation</li>
                      <li>✓ Generate invoices and receipts</li>
                      <li>✓ Analytics: most common repairs, popular designs, revenue by service type</li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">👨‍🔧 Service Provider Features</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                      <h4 className="text-lg font-bold text-green-900 mb-3">Engineer Portal</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>✓ View assigned repair requests</li>
                        <li>✓ Create and submit quotes with parts breakdown</li>
                        <li>✓ Update job status in real-time</li>
                        <li>✓ Upload progress photos from mobile</li>
                        <li>✓ Track parts inventory</li>
                        <li>✓ Schedule collection/delivery visits</li>
                        <li>✓ View earnings and completed jobs</li>
                        <li>✓ Customer messaging for questions</li>
                        <li>✓ Manage availability status</li>
                      </ul>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
                      <h4 className="text-lg font-bold text-orange-900 mb-3">Designer Portal</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>✓ View assigned fashion requests</li>
                        <li>✓ Schedule measurement appointments</li>
                        <li>✓ Record measurements digitally</li>
                        <li>✓ Create detailed quotes with fabric costs</li>
                        <li>✓ Update job status at each stage</li>
                        <li>✓ Upload progress and final photos</li>
                        <li>✓ Schedule fitting appointments</li>
                        <li>✓ Record fitting notes and adjustments</li>
                        <li>✓ Track earnings and completed designs</li>
                        <li>✓ Portfolio of completed work (with permission)</li>
                        <li>✓ Customer messaging</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">🔐 Security & Compliance</h3>
                  <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
                    <ul className="space-y-2 text-gray-700">
                      <li>✓ Role-based access control (admin/provider/customer)</li>
                      <li>✓ Secure authentication via Base44 auth system</li>
                      <li>✓ PCI-DSS compliant payments via Stripe</li>
                      <li>✓ GDPR compliance: data export, deletion, consent management</li>
                      <li>✓ Encrypted file storage for photos and documents</li>
                      <li>✓ Audit logging for all critical actions</li>
                      <li>✓ Two-factor authentication (optional)</li>
                      <li>✓ Secure customer signature capture</li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">📧 Notification System</h3>
                  <div className="bg-indigo-50 p-6 rounded-lg border-2 border-indigo-200">
                    <p className="font-semibold text-gray-900 mb-3">Automated Notifications (Email/SMS):</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-bold text-gray-800 mb-2">Repair Service Triggers:</p>
                        <ul className="space-y-1 text-gray-700 text-sm">
                          <li>• Request submitted confirmation</li>
                          <li>• Engineer assigned</li>
                          <li>• Quote ready for review</li>
                          <li>• Quote approved/declined</li>
                          <li>• Repair started</li>
                          <li>• Device ready for collection</li>
                          <li>• Warranty expiry reminder</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 mb-2">Fashion Service Triggers:</p>
                        <ul className="space-y-1 text-gray-700 text-sm">
                          <li>• Request submitted confirmation</li>
                          <li>• Designer assigned</li>
                          <li>• Measurement appointment scheduled</li>
                          <li>• Quote ready for review</li>
                          <li>• Deposit payment received</li>
                          <li>• Fitting appointment reminder</li>
                          <li>• Garment ready for collection</li>
                          <li>• Balance payment reminder</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">📊 Reporting & Analytics</h3>
                  <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
                    <ul className="space-y-2 text-gray-700">
                      <li>✓ Revenue by service type (repair vs fashion)</li>
                      <li>✓ Revenue by time period (daily/weekly/monthly)</li>
                      <li>✓ Most requested repairs (by device type and issue)</li>
                      <li>✓ Most requested fashion services (by garment type)</li>
                      <li>✓ Provider performance leaderboard</li>
                      <li>✓ Average turnaround time by service</li>
                      <li>✓ Customer acquisition and retention metrics</li>
                      <li>✓ Quote acceptance rate</li>
                      <li>✓ Average rating per provider</li>
                      <li>✓ Parts inventory tracking (for repairs)</li>
                      <li>✓ Payment collection efficiency</li>
                    </ul>
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* PAGES/UI TAB */}
          <TabsContent value="pages">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <CardTitle className="text-3xl">Pages & User Interface</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">🌐 Public-Facing Pages (No Login Required)</h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-300">
                      <h4 className="text-xl font-bold text-blue-900 mb-3">1. Home / Landing Page</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Hero section with services overview</li>
                        <li>• Two prominent CTAs: "Repair Your Device" + "Design Your Outfit"</li>
                        <li>• Service highlights with icons and descriptions</li>
                        <li>• Customer testimonials/reviews</li>
                        <li>• Featured work (repaired devices + fashion designs)</li>
                        <li>• Contact information and operating hours</li>
                        <li>• Login/Signup links</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border-2 border-purple-300">
                      <h4 className="text-xl font-bold text-purple-900 mb-3">2. Repair Request Form Page</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Multi-step form wizard:</li>
                        <ul className="ml-6 mt-1 space-y-1">
                          <li>- Step 1: Device details (type, brand, model, serial/IMEI)</li>
                          <li>- Step 2: Issue description + photo upload</li>
                          <li>- Step 3: Service option (bring in / collect & return)</li>
                          <li>- Step 4: Contact info and address (if collection)</li>
                          <li>- Step 5: Review and submit</li>
                        </ul>
                        <li>• Progress indicator at top</li>
                        <li>• Real-time form validation</li>
                        <li>• Option to save as draft (for logged-in users)</li>
                        <li>• Success confirmation with request number</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-6 rounded-lg border-2 border-pink-300">
                      <h4 className="text-xl font-bold text-pink-900 mb-3">3. Fashion Request Form Page</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Multi-step form wizard:</li>
                        <ul className="ml-6 mt-1 space-y-1">
                          <li>- Step 1: Service type + garment type</li>
                          <li>- Step 2: Design description + reference photos</li>
                          <li>- Step 3: Fabric preferences + color choices</li>
                          <li>- Step 4: Measurements (upload or request appointment)</li>
                          <li>- Step 5: Deadline + occasion</li>
                          <li>- Step 6: Contact info and address (if appointment)</li>
                          <li>- Step 7: Review and submit</li>
                        </ul>
                        <li>• Visual garment type selector</li>
                        <li>• Measurement guide/chart</li>
                        <li>• Appointment scheduling interface</li>
                        <li>• Success confirmation with request number</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">👤 Customer Portal (Login Required)</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                      <h4 className="text-xl font-bold text-blue-900 mb-3">4. Customer Dashboard</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Overview cards: Active Jobs, Pending Quotes, Completed Services</li>
                        <li>• Quick actions: Submit New Request, View All Jobs, Profile Settings</li>
                        <li>• Recent activity feed</li>
                        <li>• Notifications panel</li>
                        <li>• Quick stats (total spent, services used)</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                      <h4 className="text-xl font-bold text-purple-900 mb-3">5. My Repair Requests</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• List of all repair requests with status badges</li>
                        <li>• Filters: All, Pending Quote, In Progress, Completed</li>
                        <li>• Search by device or request number</li>
                        <li>• Click to view detailed request</li>
                        <li>• Quote review modal (when quote is ready)</li>
                        <li>• Accept/decline quote buttons</li>
                        <li>• Payment gateway integration for deposits</li>
                      </ul>
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-lg border-2 border-indigo-200">
                      <h4 className="text-xl font-bold text-indigo-900 mb-3">6. My Repair Jobs</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• List of active repair jobs</li>
                        <li>• Status timeline/progress tracker for each job</li>
                        <li>• Real-time status updates via subscriptions</li>
                        <li>• View engineer updates and photos</li>
                        <li>• Estimated completion date</li>
                        <li>• Collection/delivery details</li>
                        <li>• Payment status and balance due</li>
                        <li>• Confirm completion button (when ready)</li>
                        <li>• Leave review button (after completion)</li>
                      </ul>
                    </div>

                    <div className="bg-pink-50 p-6 rounded-lg border-2 border-pink-200">
                      <h4 className="text-xl font-bold text-pink-900 mb-3">7. My Fashion Requests</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• List of all fashion requests with status badges</li>
                        <li>• Filters: All, Pending Quote, In Progress, Completed</li>
                        <li>• View detailed design description</li>
                        <li>• Quote review modal with design details</li>
                        <li>• Accept/decline quote buttons</li>
                        <li>• Payment gateway for deposit</li>
                        <li>• View measurement appointment details</li>
                      </ul>
                    </div>

                    <div className="bg-rose-50 p-6 rounded-lg border-2 border-rose-200">
                      <h4 className="text-xl font-bold text-rose-900 mb-3">8. My Fashion Jobs</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• List of active fashion jobs</li>
                        <li>• Status timeline showing each stage</li>
                        <li>• Progress photos from designer</li>
                        <li>• Fitting appointment calendar</li>
                        <li>• View fitting notes and photos</li>
                        <li>• Estimated completion date</li>
                        <li>• Payment status and balance due</li>
                        <li>• Collection/delivery details</li>
                        <li>• Confirm completion + leave review</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                      <h4 className="text-xl font-bold text-green-900 mb-3">9. Profile & Settings</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Personal information (name, email, phone)</li>
                        <li>• Address management</li>
                        <li>• Saved measurements (for fashion services)</li>
                        <li>• Notification preferences (email/SMS)</li>
                        <li>• Payment methods (saved cards)</li>
                        <li>• Service history</li>
                        <li>• Loyalty points/rewards (optional)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">🔧 Admin Dashboard (Admin Only)</h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-100 p-6 rounded-lg border-2 border-purple-300">
                      <h4 className="text-xl font-bold text-purple-900 mb-3">10. Admin Home Dashboard</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• KPI cards: Revenue (today/week/month), Active Jobs, Pending Requests, Completed Today</li>
                        <li>• Split metrics: Repair revenue vs Fashion revenue</li>
                        <li>• Charts: Revenue trend, Jobs by status, Service type distribution</li>
                        <li>• Recent activity feed (all services)</li>
                        <li>• Urgent/priority items requiring attention</li>
                        <li>• Quick actions: View All Requests, Manage Providers, Generate Report</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                      <h4 className="text-xl font-bold text-purple-900 mb-3">11. Repair Requests Management</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Kanban board view by status</li>
                        <li>• Table view with sortable columns</li>
                        <li>• Filters: Status, Priority, Engineer, Date Range</li>
                        <li>• Search by request number, customer name, device</li>
                        <li>• Quick assign engineer dropdown</li>
                        <li>• Bulk actions (assign, change status, export)</li>
                        <li>• Click request to open detailed modal</li>
                        <li>• View customer info, device details, photos</li>
                        <li>• View/edit quotes</li>
                        <li>• Admin notes (internal only)</li>
                      </ul>
                    </div>

                    <div className="bg-pink-50 p-6 rounded-lg border-2 border-pink-200">
                      <h4 className="text-xl font-bold text-pink-900 mb-3">12. Fashion Requests Management</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Kanban board view by status</li>
                        <li>• Table view with sortable columns</li>
                        <li>• Filters: Status, Designer, Deadline, Urgency</li>
                        <li>• Search by request number, customer name, garment</li>
                        <li>• Quick assign designer dropdown</li>
                        <li>• View measurement status indicator</li>
                        <li>• Schedule measurement appointments</li>
                        <li>• View/edit quotes</li>
                        <li>• View design sketches and reference photos</li>
                        <li>• Admin notes</li>
                      </ul>
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-lg border-2 border-indigo-200">
                      <h4 className="text-xl font-bold text-indigo-900 mb-3">13. Active Jobs Management</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Unified view of all active jobs (repair + fashion)</li>
                        <li>• Color-coded by service type</li>
                        <li>• Status badges and progress indicators</li>
                        <li>• Filter by service type, status, provider, date</li>
                        <li>• View job timeline and updates</li>
                        <li>• Payment tracking (deposit/balance status)</li>
                        <li>• Collection/delivery scheduling</li>
                        <li>• Customer communication logs</li>
                        <li>• Mark as completed</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                      <h4 className="text-xl font-bold text-green-900 mb-3">14. Service Providers Management</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• List of all engineers and designers</li>
                        <li>• Filter by type (engineer/designer) and status (active/inactive)</li>
                        <li>• Provider profile cards with key stats:</li>
                        <ul className="ml-6 mt-1 space-y-1">
                          <li>- Total jobs completed</li>
                          <li>- Average rating</li>
                          <li>- Current workload</li>
                          <li>- Specializations</li>
                          <li>- Coverage areas</li>
                        </ul>
                        <li>• Add new provider form</li>
                        <li>• Edit provider details</li>
                        <li>• Activate/deactivate providers</li>
                        <li>• View provider's job history</li>
                        <li>• Assign availability schedule</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
                      <h4 className="text-xl font-bold text-yellow-900 mb-3">15. Customers Management</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Customer list with search and filters</li>
                        <li>• View customer profile:</li>
                        <ul className="ml-6 mt-1 space-y-1">
                          <li>- Contact details</li>
                          <li>- Service history (all requests + jobs)</li>
                          <li>- Total spent</li>
                          <li>- Saved measurements (if any)</li>
                          <li>- Loyalty points</li>
                        </ul>
                        <li>• Export customer list</li>
                        <li>• Send bulk notifications</li>
                        <li>• View customer reviews left</li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
                      <h4 className="text-xl font-bold text-orange-900 mb-3">16. Payments & Billing</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• List of all payments (deposits, balances, refunds)</li>
                        <li>• Filter by payment status, method, date range</li>
                        <li>• View payment details and receipts</li>
                        <li>• Track outstanding balances</li>
                        <li>• Process refunds</li>
                        <li>• Generate invoices</li>
                        <li>• Revenue breakdown by service type</li>
                        <li>• Payment reconciliation reports</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
                      <h4 className="text-xl font-bold text-red-900 mb-3">17. Reports & Analytics</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Revenue reports (daily/weekly/monthly/yearly)</li>
                        <li>• Service-wise breakdown (repair vs fashion)</li>
                        <li>• Provider performance reports</li>
                        <li>• Customer acquisition and retention</li>
                        <li>• Average turnaround time</li>
                        <li>• Quote acceptance rate</li>
                        <li>• Most requested services</li>
                        <li>• Parts inventory report (for repairs)</li>
                        <li>• Export data to CSV/Excel</li>
                        <li>• Custom date range selection</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">🛠️ Service Provider Portals</h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 rounded-lg border-2 border-green-300">
                      <h4 className="text-xl font-bold text-green-900 mb-3">18. Engineer Portal</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• My Assigned Requests (pending diagnosis)</li>
                        <li>• Create Quote form with parts builder</li>
                        <li>• My Active Jobs (in-progress repairs)</li>
                        <li>• Update job status and add notes</li>
                        <li>• Upload progress photos</li>
                        <li>• Schedule collections/deliveries</li>
                        <li>• My Completed Jobs (history)</li>
                        <li>• Earnings dashboard</li>
                        <li>• Customer messages/inquiries</li>
                        <li>• Profile and availability settings</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-amber-100 p-6 rounded-lg border-2 border-orange-300">
                      <h4 className="text-xl font-bold text-orange-900 mb-3">19. Designer Portal</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• My Assigned Requests (new fashion requests)</li>
                        <li>• Measurement Appointments (schedule & manage)</li>
                        <li>• Record Measurements form (digital measurement capture)</li>
                        <li>• Create Quote form with fabric/labor breakdown</li>
                        <li>• My Active Jobs (in-progress designs)</li>
                        <li>• Update job status at each stage</li>
                        <li>• Upload progress and final photos</li>
                        <li>• Schedule Fitting Appointments</li>
                        <li>• Record Fitting Notes</li>
                        <li>• My Completed Jobs (portfolio)</li>
                        <li>• Earnings dashboard</li>
                        <li>• Customer messages</li>
                        <li>• Profile and portfolio management</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* IMPLEMENTATION TAB */}
          <TabsContent value="implementation">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                <CardTitle className="text-3xl">Implementation Guide</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                
                <div className="bg-gradient-to-r from-green-50 to-teal-100 p-8 rounded-xl border-2 border-green-300">
                  <h3 className="text-2xl font-bold text-green-900 mb-6">🚀 Step-by-Step Implementation</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                        <Badge className="bg-blue-600 text-lg px-4 py-2">Phase 1</Badge>
                        Create All Entities
                      </h4>
                      <p className="text-gray-700 mb-3">Create JSON schema files for all entities listed in the Data Models tab. Start with shared entities, then repair-specific, then fashion-specific.</p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="font-semibold text-blue-900 mb-2">Order of creation:</p>
                        <ol className="space-y-1 text-gray-700 text-sm ml-4 list-decimal">
                          <li>ServiceProvider (engineers + designers)</li>
                          <li>Customer (extended profile)</li>
                          <li>RepairRequest</li>
                          <li>RepairQuote</li>
                          <li>RepairJob</li>
                          <li>RepairUpdate</li>
                          <li>FashionRequest</li>
                          <li>MeasurementAppointment</li>
                          <li>FashionQuote</li>
                          <li>FashionJob</li>
                          <li>FashionUpdate</li>
                          <li>Payment</li>
                          <li>Review</li>
                        </ol>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                        <Badge className="bg-purple-600 text-lg px-4 py-2">Phase 2</Badge>
                        Build Public Pages
                      </h4>
                      <p className="text-gray-700 mb-3">Create customer-facing pages that don't require authentication.</p>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <ol className="space-y-1 text-gray-700 text-sm ml-4 list-decimal">
                          <li>Home/Landing page with hero section</li>
                          <li>RepairRequestForm page (multi-step form)</li>
                          <li>FashionRequestForm page (multi-step form)</li>
                          <li>Set up file upload integration (Supabase Storage via Base44 Core)</li>
                          <li>Implement form validation</li>
                          <li>Add success confirmation pages</li>
                        </ol>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                        <Badge className="bg-pink-600 text-lg px-4 py-2">Phase 3</Badge>
                        Build Customer Portal
                      </h4>
                      <p className="text-gray-700 mb-3">Create authenticated customer dashboard and tracking pages.</p>
                      <div className="bg-pink-50 p-4 rounded-lg">
                        <ol className="space-y-1 text-gray-700 text-sm ml-4 list-decimal">
                          <li>CustomerDashboard page with overview cards</li>
                          <li>MyRepairRequests page (list + quote review modal)</li>
                          <li>MyRepairJobs page (job tracking + timeline)</li>
                          <li>MyFashionRequests page (list + quote review modal)</li>
                          <li>MyFashionJobs page (job tracking + fitting schedule)</li>
                          <li>ProfileSettings page</li>
                          <li>Implement Base44 entity subscriptions for real-time updates</li>
                          <li>Create reusable components: StatusBadge, ProgressTimeline, QuoteReviewModal, etc.</li>
                        </ol>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                        <Badge className="bg-indigo-600 text-lg px-4 py-2">Phase 4</Badge>
                        Build Admin Dashboard
                      </h4>
                      <p className="text-gray-700 mb-3">Create comprehensive admin management interface.</p>
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <ol className="space-y-1 text-gray-700 text-sm ml-4 list-decimal">
                          <li>AdminDashboard page with KPI cards and charts</li>
                          <li>RepairRequestsManagement page (table + kanban view)</li>
                          <li>FashionRequestsManagement page</li>
                          <li>ActiveJobsManagement page (unified view)</li>
                          <li>ServiceProvidersManagement page</li>
                          <li>CustomersManagement page</li>
                          <li>PaymentsBilling page</li>
                          <li>ReportsAnalytics page</li>
                          <li>Create admin components: AssignProviderDropdown, QuoteBuilder, JobStatusManager</li>
                        </ol>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                        <Badge className="bg-green-600 text-lg px-4 py-2">Phase 5</Badge>
                        Build Service Provider Portals
                      </h4>
                      <p className="text-gray-700 mb-3">Create interfaces for engineers and designers.</p>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <ol className="space-y-1 text-gray-700 text-sm ml-4 list-decimal">
                          <li>EngineerPortal (dashboard + assigned requests)</li>
                          <li>CreateRepairQuote page/modal (parts builder)</li>
                          <li>EngineerJobsManagement (update status, upload photos)</li>
                          <li>DesignerPortal (dashboard + assigned requests)</li>
                          <li>MeasurementAppointments page (schedule & record)</li>
                          <li>CreateFashionQuote page/modal (fabric/labor breakdown)</li>
                          <li>DesignerJobsManagement (update status, fitting notes)</li>
                          <li>Provider earnings and performance pages</li>
                        </ol>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                        <Badge className="bg-orange-600 text-lg px-4 py-2">Phase 6</Badge>
                        Implement Payment System
                      </h4>
                      <p className="text-gray-700 mb-3">Integrate Stripe for secure payments.</p>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <ol className="space-y-1 text-gray-700 text-sm ml-4 list-decimal">
                          <li>Set up Stripe account and get API keys</li>
                          <li>Store keys in Base44 secrets (STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY)</li>
                          <li>Create backend function: createStripeCheckout (for deposits/full payments)</li>
                          <li>Create backend function: stripeWebhook (handle payment confirmations)</li>
                          <li>Create backend function: processRefund (for declined quotes)</li>
                          <li>Build PaymentModal component (Stripe Elements)</li>
                          <li>Implement payment status tracking in Payment entity</li>
                          <li>Add payment history to customer dashboard</li>
                        </ol>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                        <Badge className="bg-yellow-600 text-lg px-4 py-2">Phase 7</Badge>
                        Implement Notification System
                      </h4>
                      <p className="text-gray-700 mb-3">Set up automated email notifications.</p>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <ol className="space-y-1 text-gray-700 text-sm ml-4 list-decimal">
                          <li>Use Base44 Core SendEmail integration (built-in)</li>
                          <li>Create email templates for each notification type</li>
                          <li>Create backend function: sendNotification (handles all notification logic)</li>
                          <li>Set up Entity Automations to trigger notifications:</li>
                          <ul className="ml-6 mt-2 space-y-1">
                            <li>- RepairRequest creation → send confirmation email</li>
                            <li>- RepairQuote status → "sent" → notify customer</li>
                            <li>- RepairJob status changes → notify customer</li>
                            <li>- FashionRequest creation → send confirmation</li>
                            <li>- MeasurementAppointment scheduled → send reminder</li>
                            <li>- FashionJob fitting dates → send reminders</li>
                          </ul>
                          <li>Optional: Add SMS notifications via Twilio</li>
                        </ol>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                        <Badge className="bg-red-600 text-lg px-4 py-2">Phase 8</Badge>
                        Testing & Quality Assurance
                      </h4>
                      <p className="text-gray-700 mb-3">Thoroughly test all features and workflows.</p>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <ol className="space-y-1 text-gray-700 text-sm ml-4 list-decimal">
                          <li>Test complete repair workflow (request → quote → job → completion)</li>
                          <li>Test complete fashion workflow (request → measurement → quote → job → fittings → completion)</li>
                          <li>Test payment flows (deposits, balances, refunds)</li>
                          <li>Test real-time updates and notifications</li>
                          <li>Test role-based access control (customer/provider/admin)</li>
                          <li>Test file uploads (photos, measurements)</li>
                          <li>Test on mobile devices (responsive design)</li>
                          <li>Security testing (auth, data access)</li>
                          <li>Performance testing (load times, database queries)</li>
                        </ol>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                        <Badge className="bg-gray-600 text-lg px-4 py-2">Phase 9</Badge>
                        Launch & Post-Launch
                      </h4>
                      <p className="text-gray-700 mb-3">Deploy to production and monitor.</p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <ol className="space-y-1 text-gray-700 text-sm ml-4 list-decimal">
                          <li>Deploy to production (Base44 handles deployment)</li>
                          <li>Set up custom domain (optional)</li>
                          <li>Create initial service providers (engineers/designers)</li>
                          <li>Add sample data for testing</li>
                          <li>Train staff on admin dashboard</li>
                          <li>Monitor error logs and fix issues</li>
                          <li>Collect user feedback</li>
                          <li>Iterate and improve based on feedback</li>
                          <li>Set up analytics (Google Analytics, Mixpanel, etc.)</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">🔧 Technical Implementation Notes</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                      <h4 className="text-lg font-bold text-blue-900 mb-3">File Upload Implementation</h4>
                      <pre className="bg-white p-4 rounded-lg overflow-x-auto text-xs">
{`// Use Base44 Core UploadFile integration
import { base44 } from '@/api/base44Client';

const handleFileUpload = async (file) => {
  const { data } = await base44.integrations.Core.UploadFile({ file });
  return data.file_url; // Returns public URL
};

// Multiple files:
const uploadedUrls = await Promise.all(
  files.map(file => handleFileUpload(file))
);`}
                      </pre>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                      <h4 className="text-lg font-bold text-green-900 mb-3">Real-time Updates Implementation</h4>
                      <pre className="bg-white p-4 rounded-lg overflow-x-auto text-xs">
{`// Subscribe to job status updates
import { base44 } from '@/api/base44Client';

useEffect(() => {
  const unsubscribe = base44.entities.RepairJob.subscribe((event) => {
    if (event.type === 'update' && event.data.customer_id === user.id) {
      // Refresh job list or show notification
      queryClient.invalidateQueries(['repairJobs']);
      toast.success(\`Job \${event.data.job_number} status updated!\`);
    }
  });
  
  return unsubscribe;
}, [user]);`}
                      </pre>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                      <h4 className="text-lg font-bold text-purple-900 mb-3">Quote Approval & Job Creation</h4>
                      <pre className="bg-white p-4 rounded-lg overflow-x-auto text-xs">
{`// When customer accepts quote
const handleAcceptQuote = async (quoteId) => {
  // Update quote status
  await base44.entities.RepairQuote.update(quoteId, {
    status: 'accepted',
    accepted_at: new Date().toISOString()
  });
  
  // Get quote and request details
  const quote = await base44.entities.RepairQuote.get(quoteId);
  const request = await base44.entities.RepairRequest.get(quote.repair_request_id);
  
  // Create RepairJob
  const job = await base44.entities.RepairJob.create({
    job_number: \`JOB-\${Date.now()}\`,
    repair_request_id: request.id,
    quote_id: quote.id,
    customer_id: request.customer_id,
    engineer_id: quote.engineer_id,
    agreed_total: quote.total_cost,
    status: 'pending_device',
    payment_status: 'unpaid',
    balance_due: quote.total_cost
  });
  
  // Redirect to payment
  window.location.href = createPageUrl('PaymentCheckout', { jobId: job.id });
};`}
                      </pre>
                    </div>

                    <div className="bg-pink-50 p-6 rounded-lg border-2 border-pink-200">
                      <h4 className="text-lg font-bold text-pink-900 mb-3">Measurement Data Structure</h4>
                      <pre className="bg-white p-4 rounded-lg overflow-x-auto text-xs">
{`// Measurement object schema (stored as JSON)
const measurementsSchema = {
  neck: { value: 15, unit: "inches" },
  shoulder: { value: 18, unit: "inches" },
  chest: { value: 40, unit: "inches" },
  waist: { value: 34, unit: "inches" },
  hips: { value: 38, unit: "inches" },
  arm_length: { value: 24, unit: "inches" },
  sleeve_circumference: { value: 14, unit: "inches" },
  inseam: { value: 32, unit: "inches" },
  outseam: { value: 42, unit: "inches" },
  thigh: { value: 24, unit: "inches" },
  knee: { value: 16, unit: "inches" },
  ankle: { value: 10, unit: "inches" },
  notes: "Customer prefers slightly loose fit",
  measurement_date: "2026-02-04",
  taken_by: "designer_id_123"
};

// Store in Customer.body_measurements or MeasurementAppointment.measurements_taken`}
                      </pre>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">📚 Additional Resources</h3>
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-100 p-6 rounded-lg border-2 border-indigo-300">
                    <ul className="space-y-3 text-gray-700">
                      <li>• <strong>Base44 Documentation:</strong> https://base44.com/docs</li>
                      <li>• <strong>Stripe Integration Guide:</strong> https://stripe.com/docs</li>
                      <li>• <strong>React Query (TanStack):</strong> https://tanstack.com/query/latest</li>
                      <li>• <strong>Tailwind CSS:</strong> https://tailwindcss.com/docs</li>
                      <li>• <strong>shadcn/ui Components:</strong> https://ui.shadcn.com</li>
                      <li>• <strong>Lucide Icons:</strong> https://lucide.dev</li>
                      <li>• <strong>Date-fns (date formatting):</strong> https://date-fns.org</li>
                    </ul>
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

        {/* FOOTER */}
        <div className="mt-12 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Service Business Platform?</h2>
          <p className="text-xl mb-6">
            This comprehensive architecture document provides everything you need to create a professional,<br />
            dual-service platform for device repairs and fashion design services.
          </p>
          <div className="flex justify-center gap-4">
            <Badge className="bg-white text-purple-600 text-lg px-6 py-3">13 Entities</Badge>
            <Badge className="bg-white text-pink-600 text-lg px-6 py-3">19 Pages</Badge>
            <Badge className="bg-white text-indigo-600 text-lg px-6 py-3">Complete Workflows</Badge>
          </div>
          <p className="mt-6 text-purple-100 text-sm">
            Copy this entire page content and use it as your implementation guide.
          </p>
        </div>
      </div>
    </div>
  );
}