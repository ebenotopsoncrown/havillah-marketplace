import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AdminGuard from "../components/AdminGuard";
import {
  Plus, Trash2, Pencil, Eye, EyeOff,
  Image, Settings, ChevronUp, ChevronDown, Save, X, Upload, LayoutGrid
} from 'lucide-react';
import HeroSlider from "../components/store/HeroSlider";

const BG_COLOR_OPTIONS = [
  { label: 'Green', value: 'bg-green-100' },
  { label: 'Orange', value: 'bg-orange-100' },
  { label: 'Purple', value: 'bg-purple-100' },
  { label: 'Blue', value: 'bg-blue-100' },
  { label: 'Pink', value: 'bg-pink-100' },
  { label: 'Yellow', value: 'bg-yellow-100' },
  { label: 'Teal', value: 'bg-teal-100' },
  { label: 'Red', value: 'bg-red-100' },
];

function CategoryIconModal({ category, onSave, onClose }) {
  const [iconUrl, setIconUrl] = useState(category.icon_url || '');
  const [bgColor, setBgColor] = useState(category.bg_color || 'bg-green-100');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setIconUrl(file_url);
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold">Edit Category Icon — {category.name}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-5">
          {/* Preview */}
          <div className="flex justify-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl overflow-hidden ${bgColor}`}>
              {iconUrl ? <img src={iconUrl} alt={category.name} className="w-full h-full object-cover rounded-full" /> : '🛒'}
            </div>
          </div>

          {/* Icon upload/URL */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Icon Image</label>
            <div className="flex gap-2">
              <Input placeholder="Paste image URL..." value={iconUrl} onChange={e => setIconUrl(e.target.value)} className="flex-1" />
              <label className="cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                <Button variant="outline" className="gap-1 pointer-events-none" disabled={uploading}>
                  <Upload className="w-4 h-4" />
                  {uploading ? '...' : 'Upload'}
                </Button>
              </label>
            </div>
            {iconUrl && (
              <button onClick={() => setIconUrl('')} className="text-xs text-red-500 mt-1 hover:underline">Remove image (use emoji)</button>
            )}
          </div>

          {/* Background colour */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Background Colour</label>
            <div className="flex flex-wrap gap-2">
              {BG_COLOR_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setBgColor(opt.value)}
                  className={`w-8 h-8 rounded-full border-2 ${opt.value} ${bgColor === opt.value ? 'border-gray-800 scale-110' : 'border-transparent'} transition-all`}
                  title={opt.label}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="p-5 border-t flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-green-700 hover:bg-green-800" onClick={() => onSave({ icon_url: iconUrl, bg_color: bgColor })}>
            <Save className="w-4 h-4 mr-1" /> Save
          </Button>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_SETTINGS = {
  animation_type: 'fade',
  autoplay: true,
  autoplay_interval: 5000,
  transition_speed: 500,
  show_arrows: true,
  show_dots: true,
  default_overlay_opacity: 0.35
};

function SlideFormModal({ slide, onSave, onClose }) {
  const [form, setForm] = useState(slide || {
    title: '', subtitle: '', image_url: '', cta_text: '', cta_link: '',
    is_active: true, display_order: 0, overlay_opacity: 0.35
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, image_url: file_url }));
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold">{slide ? 'Edit Slide' : 'Add New Slide'}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* Image */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Background Image</label>
            {form.image_url && (
              <img src={form.image_url} className="w-full h-36 object-cover rounded-lg mb-2" alt="preview" />
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Paste image URL..."
                value={form.image_url}
                onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                className="flex-1"
              />
              <label className="cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <Button variant="outline" className="gap-1 pointer-events-none" disabled={uploading}>
                  <Upload className="w-4 h-4" />
                  {uploading ? '...' : 'Upload'}
                </Button>
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Title</label>
            <Input placeholder="Slide headline..." value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Subtitle</label>
            <Input placeholder="Supporting text..." value={form.subtitle || ''} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">CTA Button Text</label>
              <Input placeholder="e.g. Shop Now" value={form.cta_text || ''} onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">CTA Link (URL)</label>
              <Input placeholder="/store or https://..." value={form.cta_link || ''} onChange={e => setForm(f => ({ ...f, cta_link: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Overlay Opacity (0.2 – 0.6)</label>
              <input type="range" min="0.2" max="0.6" step="0.05"
                value={form.overlay_opacity ?? 0.35}
                onChange={e => setForm(f => ({ ...f, overlay_opacity: parseFloat(e.target.value) }))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-0.5">{form.overlay_opacity ?? 0.35}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Display Order</label>
              <Input type="number" value={form.display_order ?? 0} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-700">Active</label>
            <button
              onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
              className={`w-10 h-5 rounded-full transition-colors ${form.is_active ? 'bg-green-500' : 'bg-gray-300'} relative`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.is_active ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
        <div className="p-5 border-t flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-green-700 hover:bg-green-800" onClick={() => onSave(form)} disabled={!form.image_url}>
            <Save className="w-4 h-4 mr-1" /> Save Slide
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function HeroManager() {
  const queryClient = useQueryClient();
  const [editingSlide, setEditingSlide] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [settingsForm, setSettingsForm] = useState(null);

  const { data: slides = [] } = useQuery({
    queryKey: ['hero-slides'],
    queryFn: () => base44.entities.HeroSlide.list('display_order')
  });

  const { data: settingsArr = [] } = useQuery({
    queryKey: ['hero-settings'],
    queryFn: () => base44.entities.HeroSettings.list()
  });

  const settings = settingsArr[0] || DEFAULT_SETTINGS;

  const createSlide = useMutation({
    mutationFn: (data) => base44.entities.HeroSlide.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['hero-slides'] }); setShowForm(false); }
  });

  const updateSlide = useMutation({
    mutationFn: ({ id, data }) => base44.entities.HeroSlide.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['hero-slides'] }); setEditingSlide(null); }
  });

  const deleteSlide = useMutation({
    mutationFn: (id) => base44.entities.HeroSlide.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hero-slides'] })
  });

  const saveSettings = useMutation({
    mutationFn: async (data) => {
      if (settingsArr[0]) return base44.entities.HeroSettings.update(settingsArr[0].id, data);
      return base44.entities.HeroSettings.create(data);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['hero-settings'] }); setSettingsForm(null); }
  });

  const handleSaveSlide = (form) => {
    if (editingSlide?.id) {
      updateSlide.mutate({ id: editingSlide.id, data: form });
    } else {
      createSlide.mutate(form);
    }
  };

  const moveSlide = (slide, dir) => {
    const newOrder = (slide.display_order || 0) + dir;
    updateSlide.mutate({ id: slide.id, data: { ...slide, display_order: newOrder } });
  };

  const sortedSlides = [...slides].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  return (
    <AdminGuard>
      <div className="p-6 lg:p-8 bg-gray-50 min-h-screen max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Homepage Hero Manager</h1>
            <p className="text-gray-500 text-sm mt-1">Manage promotional slides shown on the storefront</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSettingsForm({ ...settings })} className="gap-1">
              <Settings className="w-4 h-4" /> Settings
            </Button>
            <Button className="bg-green-700 hover:bg-green-800 gap-1" onClick={() => { setEditingSlide(null); setShowForm(true); }}>
              <Plus className="w-4 h-4" /> Add Slide
            </Button>
          </div>
        </div>

        {/* Live Preview */}
        <Card className="mb-8 shadow">
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4" /> Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-gray-100 rounded-b-xl">
            <div style={{ maxWidth: '480px', margin: '0 auto' }}>
              <HeroSlider slides={sortedSlides} settings={settings} />
            </div>
          </CardContent>
        </Card>

        {/* Slide List */}
        <Card className="shadow mb-8">
          <CardHeader className="border-b">
            <CardTitle>Slides ({sortedSlides.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {sortedSlides.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Image className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>No slides yet. Add your first slide!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedSlides.map((slide, i) => (
                  <div key={slide.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveSlide(slide, -1)} disabled={i === 0} className="text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                      <button onClick={() => moveSlide(slide, 1)} disabled={i === sortedSlides.length - 1} className="text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                    </div>
                    <img src={slide.image_url} alt={slide.title} className="w-20 h-14 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{slide.title || <span className="text-gray-400 italic">No title</span>}</p>
                      <p className="text-sm text-gray-500 truncate">{slide.subtitle || ''}</p>
                      {slide.cta_text && <Badge className="mt-1 text-xs bg-green-100 text-green-800 hover:bg-green-100">{slide.cta_text}</Badge>}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateSlide.mutate({ id: slide.id, data: { ...slide, is_active: !slide.is_active } })}
                        className={`p-1.5 rounded-lg ${slide.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                        title={slide.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {slide.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button onClick={() => { setEditingSlide(slide); setShowForm(true); }} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteSlide.mutate(slide.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Slide Form Modal */}
        {showForm && (
          <SlideFormModal
            slide={editingSlide}
            onSave={handleSaveSlide}
            onClose={() => { setShowForm(false); setEditingSlide(null); }}
          />
        )}

        {/* Settings Modal */}
        {settingsForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b">
                <h2 className="text-lg font-bold">Hero Slider Settings</h2>
                <button onClick={() => setSettingsForm(null)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="p-5 space-y-5">
                {/* Animation Type */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Animation Type</label>
                  <div className="flex gap-2">
                    {['fade', 'slide'].map(type => (
                      <button key={type} onClick={() => setSettingsForm(f => ({ ...f, animation_type: type }))}
                        className={`flex-1 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${settingsForm.animation_type === type ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600 hover:border-green-400'}`}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggle settings */}
                {[
                  { key: 'autoplay', label: 'Auto Play' },
                  { key: 'show_arrows', label: 'Show Arrows' },
                  { key: 'show_dots', label: 'Show Dots' }
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700">{label}</label>
                    <button onClick={() => setSettingsForm(f => ({ ...f, [key]: !f[key] }))}
                      className={`w-10 h-5 rounded-full transition-colors relative ${settingsForm[key] ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${settingsForm[key] ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}

                {/* Numeric settings */}
                {[
                  { key: 'autoplay_interval', label: 'Auto Play Interval (ms)', min: 2000, max: 15000, step: 500 },
                  { key: 'transition_speed', label: 'Transition Speed (ms)', min: 200, max: 1500, step: 100 }
                ].map(({ key, label, min, max, step }) => (
                  <div key={key}>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">{label}: {settingsForm[key]}</label>
                    <input type="range" min={min} max={max} step={step} value={settingsForm[key]}
                      onChange={e => setSettingsForm(f => ({ ...f, [key]: parseInt(e.target.value) }))}
                      className="w-full" />
                  </div>
                ))}

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Default Overlay Opacity: {settingsForm.default_overlay_opacity}</label>
                  <input type="range" min="0.2" max="0.6" step="0.05"
                    value={settingsForm.default_overlay_opacity}
                    onChange={e => setSettingsForm(f => ({ ...f, default_overlay_opacity: parseFloat(e.target.value) }))}
                    className="w-full" />
                </div>
              </div>
              <div className="p-5 border-t flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setSettingsForm(null)}>Cancel</Button>
                <Button className="bg-green-700 hover:bg-green-800" onClick={() => saveSettings.mutate(settingsForm)}>
                  <Save className="w-4 h-4 mr-1" /> Save Settings
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}