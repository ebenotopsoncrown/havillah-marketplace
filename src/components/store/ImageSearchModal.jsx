import React, { useState, useRef } from "react";
import { Camera, X, Upload, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ImageSearchModal({ onClose, onResults }) {
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Identifying product…");
  const [preview, setPreview] = useState(null);
  const [noMatch, setNoMatch] = useState(false);
  const fileRef = useRef();
  const cameraRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setNoMatch(false);
    setLoading(true);
    try {
      // 1. Upload image + fetch products in parallel
      setLoadingMsg("Uploading image…");
      const [{ file_url }, products] = await Promise.all([
        base44.integrations.Core.UploadFile({ file }),
        base44.entities.Product.list()
      ]);

      // 2. Build a compact catalogue list for the LLM
      setLoadingMsg("Matching against your products…");
      const activeProducts = products.filter(p => p.is_active);
      const catalogue = activeProducts.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand || ""
      }));

      const catalogueText = catalogue.map(p => `- ${p.name}${p.brand ? ` (${p.brand})` : ""}`).join("\n");

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a product matching assistant for a grocery store app.

Here is our full product catalogue:
${catalogueText}

Look carefully at the product in the attached image — examine its packaging, label, brand name, colour and any visible text.

Your job is to find the BEST matching product from the catalogue above.
- If you can find a match (even partial — e.g. same brand or same product type), return it.
- Return the shortest search term (1-3 words) that would uniquely find that product from the catalogue.
- If there is absolutely no match at all, return an empty string for best_match.`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            best_match: { type: "string", description: "The product name or brand from the catalogue that best matches the image, or empty string if no match" },
            confidence: { type: "string", enum: ["high", "medium", "low", "none"] }
          }
        }
      });

      const match = (result.best_match || "").trim();
      if (match && result.confidence !== "none") {
        onResults(match);
        onClose();
      } else {
        setNoMatch(true);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-end md:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 text-base">Search by Image</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-8">
            {preview && <img src={preview} className="w-24 h-24 object-cover rounded-xl" alt="preview" />}
            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            <p className="text-sm text-gray-500">Identifying product…</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-500 mb-1">Take a photo or upload an image of the product you're looking for.</p>

            {/* Camera capture (mobile) */}
            <button
              onClick={() => cameraRef.current.click()}
              className="flex items-center gap-3 w-full bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 py-3 font-medium transition-colors"
            >
              <Camera className="w-5 h-5" />
              Open Camera
            </button>
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handleFile(e.target.files[0])} />

            {/* Gallery upload */}
            <button
              onClick={() => fileRef.current.click()}
              className="flex items-center gap-3 w-full border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl px-4 py-3 font-medium transition-colors"
            >
              <Upload className="w-5 h-5" />
              Upload from Gallery
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
          </div>
        )}
      </div>
    </div>
  );
}