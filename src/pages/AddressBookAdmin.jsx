import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import AdminGuard from "../components/AdminGuard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Users, Plus, Pencil, Trash2, Mail, Phone, MapPin, CheckCircle, XCircle } from "lucide-react";

const emptyForm = {
  full_name: "", email: "", phone: "", address: "", postcode: "", city: "",
  contact_type: "customer", source: "manual", marketing_consent: false,
  sms_consent: false, tags: [], notes: "", is_active: true
};

export default function AddressBookAdmin() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterConsent, setFilterConsent] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['address-book'],
    queryFn: () => base44.entities.AddressBook.list('-last_order_date'),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editingContact
      ? base44.entities.AddressBook.update(editingContact.id, data)
      : base44.entities.AddressBook.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['address-book'] });
      setShowForm(false);
      setEditingContact(null);
      setFormData(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.AddressBook.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['address-book'] }),
  });

  const filtered = contacts.filter(c => {
    const matchSearch = !search ||
      c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.postcode?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || c.contact_type === filterType;
    const matchConsent = filterConsent === "all"
      || (filterConsent === "marketing" && c.marketing_consent)
      || (filterConsent === "sms" && c.sms_consent)
      || (filterConsent === "none" && !c.marketing_consent && !c.sms_consent);
    return matchSearch && matchType && matchConsent;
  });

  const openAdd = () => { setEditingContact(null); setFormData(emptyForm); setShowForm(true); };
  const openEdit = (c) => { setEditingContact(c); setFormData({ ...emptyForm, ...c }); setShowForm(true); };

  const stats = {
    total: contacts.length,
    marketing: contacts.filter(c => c.marketing_consent).length,
    sms: contacts.filter(c => c.sms_consent).length,
    fromCheckout: contacts.filter(c => c.source === 'checkout').length,
  };

  return (
    <AdminGuard>
      <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Address Book</h1>
              <p className="text-gray-500">Manage customer contacts for marketing & promotions</p>
            </div>
            <Button onClick={openAdd} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" /> Add Contact
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Contacts", value: stats.total, color: "text-indigo-600" },
              { label: "From Checkout", value: stats.fromCheckout, color: "text-green-600" },
              { label: "Marketing Opt-in", value: stats.marketing, color: "text-blue-600" },
              { label: "SMS Opt-in", value: stats.sms, color: "text-purple-600" },
            ].map(s => (
              <Card key={s.label} className="border border-gray-200">
                <CardContent className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, phone, postcode..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterConsent} onValueChange={setFilterConsent}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Consent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contacts</SelectItem>
                    <SelectItem value="marketing">Marketing Opt-in</SelectItem>
                    <SelectItem value="sms">SMS Opt-in</SelectItem>
                    <SelectItem value="none">No Consent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-gray-400 mt-2">{filtered.length} of {contacts.length} contacts</p>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Contact</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Location</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Consent</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Orders</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Source</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={8} className="text-center py-12 text-gray-400">Loading...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-12 text-gray-400">
                      <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      No contacts found
                    </td></tr>
                  ) : filtered.map(c => (
                    <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{c.full_name}</p>
                        {!c.is_active && <span className="text-xs text-red-400">Inactive</span>}
                      </td>
                      <td className="px-4 py-3">
                        <p className="flex items-center gap-1 text-xs text-gray-600"><Mail className="w-3 h-3" />{c.email || '—'}</p>
                        <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5"><Phone className="w-3 h-3" />{c.phone || '—'}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {c.postcode ? <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.postcode}</span> : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="capitalize text-xs">{c.contact_type}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {c.marketing_consent && <Badge className="bg-blue-100 text-blue-700 text-xs">Email</Badge>}
                          {c.sms_consent && <Badge className="bg-purple-100 text-purple-700 text-xs">SMS</Badge>}
                          {!c.marketing_consent && !c.sms_consent && <span className="text-xs text-gray-400">None</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-semibold text-gray-700">{c.total_orders || 0}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="capitalize text-xs">{c.source || 'manual'}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                            <Pencil className="w-4 h-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(c.id)}>
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Add / Edit Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingContact ? 'Edit Contact' : 'Add Contact'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto">
              {[
                { label: "Full Name *", key: "full_name", type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "Phone", key: "phone", type: "tel" },
                { label: "Address", key: "address", type: "text" },
                { label: "Postcode", key: "postcode", type: "text" },
                { label: "City", key: "city", type: "text" },
              ].map(f => (
                <div key={f.key} className="space-y-1">
                  <Label>{f.label}</Label>
                  <Input type={f.type} value={formData[f.key] || ""} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Type</Label>
                  <Select value={formData.contact_type} onValueChange={v => setFormData({ ...formData, contact_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                      <SelectItem value="partner">Partner</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Source</Label>
                  <Select value={formData.source} onValueChange={v => setFormData({ ...formData, source: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="checkout">Checkout</SelectItem>
                      <SelectItem value="import">Import</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.marketing_consent} onChange={e => setFormData({ ...formData, marketing_consent: e.target.checked })} className="w-4 h-4" />
                  <span className="text-sm">Email marketing consent</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.sms_consent} onChange={e => setFormData({ ...formData, sms_consent: e.target.checked })} className="w-4 h-4" />
                  <span className="text-sm">SMS consent</span>
                </label>
              </div>
              <div className="space-y-1">
                <Label>Notes</Label>
                <Input value={formData.notes || ""} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="Internal notes..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button
                onClick={() => saveMutation.mutate(formData)}
                disabled={!formData.full_name || saveMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {saveMutation.isPending ? 'Saving...' : 'Save Contact'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  );
}