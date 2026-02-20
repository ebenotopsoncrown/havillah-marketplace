import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image, Upload, CheckCircle, Loader2 } from "lucide-react";

const SLOTS = [
  { slot: "hero_main", label: "Hero Main Image", desc: "Large lifestyle image on the homepage" },
  { slot: "collection_women", label: "Women Fashion Collection", desc: "Shop by Collection grid" },
  { slot: "collection_men", label: "Men Fashion Collection", desc: "Shop by Collection grid" },
  { slot: "collection_kids", label: "Kids Fashion Collection", desc: "Shop by Collection grid" },
  { slot: "collection_beauty", label: "Beauty & Skincare Collection", desc: "Shop by Collection grid" },
  { slot: "collection_accessories", label: "Accessories Collection", desc: "Shop by Collection grid" },
];

const DEFAULT_IMAGES = {
  hero_main: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=700&fit=crop&q=85",
  collection_women: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=700&fit=crop&q=85",
  collection_men: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop&q=85",
  collection_kids: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=700&fit=crop&q=85",
  collection_beauty: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=700&fit=crop&q=85",
  collection_accessories: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=700&fit=crop&q=85",
};

function SlotEditor({ slotDef, existingRecord, queryClient }) {
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentImage = existingRecord?.image_url || DEFAULT_IMAGES[slotDef.slot];

  const saveMutation = useMutation({
    mutationFn: async (imageUrl) => {
      if (existingRecord) {
        return base44.entities.StorefrontImage.update(existingRecord.id, { image_url: imageUrl });
      } else {
        return base44.entities.StorefrontImage.create({ slot: slotDef.slot, label: slotDef.label, image_url: imageUrl });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storefront-images'] });
      setSaved(true);
      setUrlInput("");
      setTimeout(() => setSaved(false), 2500);
    }
  });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await saveMutation.mutateAsync(file_url);
    setUploading(false);
  };

  const handleSaveUrl = () => {
    if (urlInput.trim()) saveMutation.mutate(urlInput.trim());
  };

  return (
    <div className="border border-rose-100 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="flex gap-0">
        <div className="w-28 h-28 flex-shrink-0 bg-rose-50 overflow-hidden">
          <img src={currentImage} alt={slotDef.label} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 p-3">
          <p className="font-semibold text-gray-900 text-sm">{slotDef.label}</p>
          <p className="text-xs text-gray-500 mb-2">{slotDef.desc}</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1">
              <Input
                placeholder="Paste image URL..."
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                className="text-xs h-8 border-rose-200"
              />
              <Button size="sm" className="h-8 px-2 text-xs" style={{ background: "#D88C9A" }} onClick={handleSaveUrl} disabled={!urlInput.trim() || saveMutation.isPending}>
                Save
              </Button>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs text-rose-500 hover:text-rose-700 font-medium">
              {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
              {uploading ? "Uploading..." : "Or upload from device"}
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>
        </div>
        {saved && (
          <div className="flex items-center px-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function StorefrontImagesManager() {
  const queryClient = useQueryClient();

  const { data: storefrontImages = [] } = useQuery({
    queryKey: ['storefront-images'],
    queryFn: () => base44.entities.StorefrontImage.list(),
  });

  return (
    <Card className="border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-rose-900">
          <Image className="w-5 h-5" />
          Storefront Images
        </CardTitle>
        <p className="text-sm text-gray-600">Control the hero image and collection photos shown on your homepage.</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {SLOTS.map(slotDef => (
            <SlotEditor
              key={slotDef.slot}
              slotDef={slotDef}
              existingRecord={storefrontImages.find(i => i.slot === slotDef.slot)}
              queryClient={queryClient}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}