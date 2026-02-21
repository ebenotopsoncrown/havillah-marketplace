import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Download, Globe, CheckCircle, AlertCircle, FileText, ExternalLink, Package, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  {
    number: "01",
    title: "Prepare Your Product Feed",
    desc: "Export your product catalog as a CSV or XML file using the tool below. Ensure all products have images, prices, and accurate descriptions.",
    icon: FileText,
    color: "bg-blue-50 text-blue-600",
  },
  {
    number: "02",
    title: "Register as a Merchant",
    desc: "Visit Shopping.com and sign up as a seller/merchant. You'll need your business details, bank account, and VAT number if applicable.",
    icon: Globe,
    color: "bg-purple-50 text-purple-600",
    link: "https://www.shopping.com",
    linkLabel: "Go to Shopping.com →",
  },
  {
    number: "03",
    title: "Upload Your Product Feed",
    desc: "Log into your Shopping.com merchant dashboard and upload the CSV or XML feed. The platform will match your products and list them.",
    icon: Package,
    color: "bg-green-50 text-green-600",
  },
  {
    number: "04",
    title: "Go Live & Get Paid",
    desc: "Once approved, your products appear on Shopping.com. Customers click through to your store. You get paid weekly into your bank account.",
    icon: CheckCircle,
    color: "bg-rose-50 text-rose-600",
  },
];

const FEED_FIELDS = [
  { field: "Product ID / SKU", status: "auto", note: "Pulled from your product SKU" },
  { field: "Title", status: "auto", note: "Product name from your catalog" },
  { field: "Description", status: "auto", note: "Product description" },
  { field: "Category", status: "auto", note: "Mapped from your categories" },
  { field: "Brand", status: "auto", note: "Brand field from product" },
  { field: "GTIN / Barcode", status: "optional", note: "Barcode field if available" },
  { field: "Retail Price (GBP)", status: "auto", note: "Retail price inc. currency" },
  { field: "Sale Price", status: "auto", note: "Wholesale price if set" },
  { field: "Availability", status: "auto", note: "In Stock / Out of Stock" },
  { field: "Product URL", status: "auto", note: "Link to your store product page" },
  { field: "Image URL", status: "auto", note: "First image from product images" },
  { field: "Shipping Info", status: "auto", note: "£4.50 GB standard (XML only)" },
  { field: "Condition", status: "auto", note: "Always 'new'" },
  { field: "Weight", status: "optional", note: "Weight in kg if set" },
];

export default function ProductFeedManager() {
  const [downloading, setDownloading] = useState(false);
  const [format, setFormat] = useState("csv");

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list(),
  });

  const activeProducts = products.filter(p => p.is_active && p.stock_quantity > 0);
  const missingImages = activeProducts.filter(p => !p.image_urls?.length).length;
  const missingDesc = activeProducts.filter(p => !p.description).length;

  const handleExport = async () => {
    setDownloading(true);
    try {
      const response = await base44.functions.invoke('exportProductFeed', { format });
      // The function returns binary, so we need to fetch it directly
      const text = response.data;
      const mimeType = format === 'xml' ? 'application/xml' : 'text/csv';
      const filename = format === 'xml' ? 'havillah-product-feed.xml' : 'havillah-product-feed.csv';
      const blob = new Blob([text], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      alert('Export failed: ' + err.message);
    }
    setDownloading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-6 h-6 text-rose-500" />
            <h1 className="text-2xl font-bold text-gray-900">Product Feed Manager</h1>
          </div>
          <p className="text-gray-500 text-sm">
            Export your product catalog and list it on Shopping.com, Google Shopping, or any comparison engine.
          </p>
        </div>

        {/* Catalog Health */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Active Products</p>
            <p className="text-3xl font-bold text-gray-900">{activeProducts.length}</p>
            <p className="text-xs text-green-600 mt-1">Ready to export</p>
          </div>
          <div className={`bg-white rounded-xl p-4 border shadow-sm ${missingImages > 0 ? 'border-orange-200' : 'border-gray-100'}`}>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Missing Images</p>
            <p className={`text-3xl font-bold ${missingImages > 0 ? 'text-orange-500' : 'text-gray-900'}`}>{missingImages}</p>
            <p className="text-xs text-gray-500 mt-1">{missingImages > 0 ? 'Add images to improve feed quality' : 'All products have images ✓'}</p>
          </div>
          <div className={`bg-white rounded-xl p-4 border shadow-sm ${missingDesc > 0 ? 'border-orange-200' : 'border-gray-100'}`}>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Missing Descriptions</p>
            <p className={`text-3xl font-bold ${missingDesc > 0 ? 'text-orange-500' : 'text-gray-900'}`}>{missingDesc}</p>
            <p className="text-xs text-gray-500 mt-1">{missingDesc > 0 ? 'Descriptions improve search ranking' : 'All products have descriptions ✓'}</p>
          </div>
        </div>

        {/* Export Tool */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Export Product Feed</h2>
          <p className="text-sm text-gray-500 mb-5">Choose a format and download your feed file to upload to any marketplace or comparison engine.</p>

          <div className="flex flex-wrap gap-3 mb-5">
            {["csv", "xml"].map(f => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  format === f
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300'
                }`}
              >
                {f.toUpperCase()} {f === 'csv' ? '(Shopping.com, Google)' : '(Google Shopping, Bing)'}
              </button>
            ))}
          </div>

          {missingImages > 0 && (
            <div className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 text-sm text-orange-700">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span><strong>{missingImages} products</strong> are missing images. Shopping platforms may reject or deprioritise these listings.</span>
            </div>
          )}

          <Button
            onClick={handleExport}
            disabled={downloading || activeProducts.length === 0}
            className="bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Generating...' : `Download ${format.toUpperCase()} Feed (${activeProducts.length} products)`}
          </Button>
        </div>

        {/* Feed Fields Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-1">What's Included in Your Feed</h2>
          <p className="text-sm text-gray-500 mb-4">All fields are automatically populated from your product catalog.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 font-semibold text-gray-600">Field</th>
                  <th className="text-left py-2 font-semibold text-gray-600">Status</th>
                  <th className="text-left py-2 font-semibold text-gray-600">Source</th>
                </tr>
              </thead>
              <tbody>
                {FEED_FIELDS.map(row => (
                  <tr key={row.field} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 font-medium text-gray-800">{row.field}</td>
                    <td className="py-2">
                      <Badge className={row.status === 'auto' ? 'bg-green-100 text-green-700 border-0' : 'bg-gray-100 text-gray-600 border-0'}>
                        {row.status === 'auto' ? '✓ Auto' : 'Optional'}
                      </Badge>
                    </td>
                    <td className="py-2 text-gray-500 text-xs">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step by Step Guide */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-1">How to List on Shopping.com</h2>
          <p className="text-sm text-gray-500 mb-6">Follow these steps to get your products live on the Shopping.com comparison engine.</p>
          <div className="space-y-5">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${step.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-400">STEP {step.number}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    {step.link && (
                      <a href={step.link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-rose-500 hover:text-rose-600">
                        {step.linkLabel} <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-blue-900 text-sm">Tips for Better Results</h3>
          </div>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• <strong>Add high-quality images</strong> to all products — listings without images are often rejected or ranked lower.</li>
            <li>• <strong>Use SEO-friendly product names</strong> e.g. "Tilda Basmati Rice 5kg" rather than just "Rice".</li>
            <li>• <strong>Add barcodes (GTIN/EAN)</strong> where available — this helps match products to existing listings.</li>
            <li>• <strong>Keep prices accurate</strong> — price mismatches between your feed and store can get your account flagged.</li>
            <li>• <strong>Re-export your feed weekly</strong> to keep stock levels and prices up to date.</li>
            <li>• This same feed works for <strong>Google Shopping, Bing Shopping, and PriceRunner</strong>.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}