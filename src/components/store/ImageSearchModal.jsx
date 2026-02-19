import React, { useState, useRef } from "react";
import { Camera, X, Upload, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ImageSearchModal({ onClose, onResults }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();
  const cameraRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: "Look at this product image. Extract the product name, brand, and any other identifying information visible. Return a short search query (2-5 words) that would best find this product or similar products in a grocery store.",
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            search_query: { type: "string" },
            product_name: { type: "string" }
          }
        }
      });
      onResults(result.search_query || result.product_name || "");
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
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