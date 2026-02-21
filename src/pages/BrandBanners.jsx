import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Download, Loader2, RefreshCw, Image, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const BANNER_PROMPTS = [
  {
    id: 1,
    title: "Warm Welcome — Nigerian & Indian Groceries",
    theme: "🌍 Authentic Food",
    prompt: `A stunning, ultra-professional retail banner for a UK-based online Afro-Asian grocery store called "Havillah Marketplace". The banner is wide format (16:9), warm and vibrant. The scene shows a beautifully styled flat-lay of authentic Nigerian and Indian groceries: colourful spices in small bowls, yam, palm oil, basmati rice bag, egusi, scotch bonnet peppers, turmeric, lentils and fresh vegetables, all arranged artistically on a rustic wooden surface. Rich warm lighting, deep terracotta and gold tones. In the foreground, clean bold white text reads "Havillah Marketplace – Authentic Afro-Asian Groceries". Bottom text: "Delivering Across the UK". No logos. Photographic realism, magazine quality, high-end food photography style.`,
    color: "from-amber-50 to-orange-50",
    border: "border-orange-200",
  },
  {
    id: 2,
    title: "Premium Storefront — Modern & Elegant",
    theme: "🏪 Brand Identity",
    prompt: `A world-class, high-end brand banner for "Havillah Marketplace", a UK-based Afro-Asian online grocery store. Wide 16:9 format. The image features a beautifully arranged display shelf stocked with colourful authentic African and Indian products — palm oil bottles, spice jars, plantain chips, basmati rice bags, shea butter jars — with warm spotlighting creating a premium supermarket aesthetic. Deep jewel-toned background (deep burgundy/maroon), gold accent lighting. The atmosphere feels like a premium boutique ethnic supermarket. Text overlay: "Havillah Marketplace" in elegant serif font at the top. Subtitle: "Nigeria · India · Caribbean – All in One Place". Clean, luxury, high-fashion retail photography.`,
    color: "from-rose-50 to-pink-50",
    border: "border-rose-200",
  },
  {
    id: 3,
    title: "Community & Culture — People First",
    theme: "👩🏾 Community",
    prompt: `A warm, emotionally engaging retail banner for "Havillah Marketplace", a UK Afro-Asian online grocery and beauty store. Wide 16:9 format. The image shows a joyful British-Nigerian family — a young mother and two children — in a bright, cosy modern UK kitchen, surrounded by colourful African and Indian groceries: packs of yam flour, rice, palm oil, turmeric, fresh peppers. Everyone is smiling warmly. Soft natural window light, warm golden-hour atmosphere. The scene feels authentic, relatable, and community-centred. Text overlay at bottom: "Havillah Marketplace — Taste of Home, Delivered to Your Door". Cinematic photography style, shallow depth of field, magazine cover quality.`,
    color: "from-green-50 to-emerald-50",
    border: "border-green-200",
  },
  {
    id: 4,
    title: "Beauty & Lifestyle — Natural & Radiant",
    theme: "💄 Hair & Beauty",
    prompt: `A stunning, high-fashion beauty and lifestyle banner for "Havillah Marketplace", a UK Afro-Asian online store. Wide 16:9 format. The image features an elegant arrangement of premium natural African beauty products: shea butter jars, black castor oil bottles, natural hair creams, African black soap bars, body oils — all beautifully styled on a white marble surface with tropical leaves and flowers as props. Soft pastel lighting, rose gold and cream colour palette. Professional product photography, ultra clean and luxurious. A young, beautiful Black woman with natural afro hair is visible in the background, blurred (bokeh), smiling. Text: "Natural Hair & Beauty — Havillah Marketplace". Vogue magazine quality, high-end cosmetics brand aesthetic.`,
    color: "from-purple-50 to-fuchsia-50",
    border: "border-purple-200",
  },
];

export default function BrandBanners() {
  const [banners, setBanners] = useState({});
  const [loading, setLoading] = useState({});

  const generateBanner = async (banner) => {
    setLoading(prev => ({ ...prev, [banner.id]: true }));
    try {
      const result = await base44.integrations.Core.GenerateImage({
        prompt: banner.prompt,
      });
      setBanners(prev => ({ ...prev, [banner.id]: result.url }));
    } catch (err) {
      alert("Image generation failed: " + err.message);
    }
    setLoading(prev => ({ ...prev, [banner.id]: false }));
  };

  const generateAll = async () => {
    for (const banner of BANNER_PROMPTS) {
      await generateBanner(banner);
    }
  };

  const downloadImage = async (url, title) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `havillah-banner-${title.toLowerCase().replace(/\s+/g, "-")}.jpg`;
    a.click();
  };

  const anyLoading = Object.values(loading).some(Boolean);
  const generatedCount = Object.values(banners).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Image className="w-6 h-6 text-rose-500" />
            <h1 className="text-2xl font-bold text-gray-900">Google Business Profile Banners</h1>
          </div>
          <p className="text-gray-500 text-sm">
            AI-generated professional banner images for your Google Business Profile & Merchant Centre. Optimised for 16:9 ratio (1024×576px).
          </p>
        </div>

        {/* Stats bar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {generatedCount} of {BANNER_PROMPTS.length} generated
            </span>
            <span className="text-gray-400">•</span>
            <span>16:9 ratio • Google-ready quality</span>
          </div>
          <Button
            onClick={generateAll}
            disabled={anyLoading}
            className="bg-rose-500 hover:bg-rose-600 text-white gap-2"
          >
            {anyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Generate All 4 Banners
          </Button>
        </div>

        {/* Banner Cards */}
        <div className="space-y-6">
          {BANNER_PROMPTS.map((banner) => {
            const imageUrl = banners[banner.id];
            const isLoading = loading[banner.id];
            return (
              <div key={banner.id} className={`bg-white rounded-2xl border ${banner.border} shadow-sm overflow-hidden`}>
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${banner.color} px-5 py-3 flex items-center justify-between`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">{banner.theme}</span>
                      <span className="text-xs text-gray-400">Banner {banner.id}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 font-medium">{banner.title}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateBanner(banner)}
                      disabled={isLoading}
                      className="text-xs gap-1.5"
                    >
                      {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      {imageUrl ? "Regenerate" : "Generate"}
                    </Button>
                    {imageUrl && (
                      <Button
                        size="sm"
                        onClick={() => downloadImage(imageUrl, banner.title)}
                        className="bg-gray-900 hover:bg-gray-800 text-white text-xs gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </Button>
                    )}
                  </div>
                </div>

                {/* Image Area */}
                <div className="aspect-video bg-gray-100 relative">
                  {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
                      <p className="text-sm text-gray-500">Generating your banner… this takes ~10 seconds</p>
                    </div>
                  ) : imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400">
                      <Image className="w-10 h-10 opacity-30" />
                      <p className="text-sm">Click "Generate" to create this banner</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Usage Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <h3 className="font-semibold text-blue-900 text-sm mb-3">📌 How to Use Your Banners</h3>
          <ul className="space-y-1.5 text-sm text-blue-800">
            <li>• <strong>Google Business Profile:</strong> Upload as your Cover Photo (1024×576px, 16:9 ratio)</li>
            <li>• <strong>Google Merchant Centre:</strong> Use as your store banner in the Business Info section</li>
            <li>• <strong>Shopping.com:</strong> Upload in your merchant profile/store banner settings</li>
            <li>• <strong>Social Media:</strong> Also works as a Facebook/Twitter cover photo</li>
            <li>• Generate multiple versions and pick the one that best represents your brand for each platform</li>
          </ul>
        </div>

      </div>
    </div>
  );
}