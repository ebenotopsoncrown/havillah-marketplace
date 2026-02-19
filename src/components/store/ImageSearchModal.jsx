import React, { useState, useRef } from "react";
import { Camera, X, Upload, Loader2, ShoppingCart } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ImageSearchModal({ onClose, onResults, onAddToCart }) {
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Analysing image…");
  const [preview, setPreview] = useState(null);
  const [matches, setMatches] = useState(null); // null = not searched yet
  const [detected, setDetected] = useState(null);
  const fileRef = useRef();
  const cameraRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setMatches(null);
    setLoading(true);

    try {
      setLoadingMsg("Uploading image…");
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      setLoadingMsg("Visually comparing against your products…");
      const response = await base44.functions.invoke('imageSearch', { image_url: file_url });
      const found = response.data?.matches || [];
      setMatches(found);
      setDetected(response.data?.detected || null);
    } catch (e) {
      console.error(e);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setMatches(null);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-end md:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-base">Search by Image</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center gap-3 py-8">
              {preview && <img src={preview} className="w-28 h-28 object-cover rounded-xl shadow" alt="preview" />}
              <Loader2 className="w-6 h-6 animate-spin text-green-600 mt-1" />
              <p className="text-sm text-gray-500 text-center">{loadingMsg}</p>
            </div>
          )}

          {/* Results */}
          {!loading && matches !== null && (
            <div>
              {preview && (
                <div className="flex items-center gap-3 mb-4">
                  <img src={preview} className="w-14 h-14 object-cover rounded-lg shadow flex-shrink-0" alt="your photo" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Your photo</p>
                    <p className="text-xs text-gray-500">{matches.length > 0 ? `${matches.length} match${matches.length > 1 ? 'es' : ''} found` : 'No matches found'}</p>
                  </div>
                </div>
              )}

              {matches.length > 0 ? (
                <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
                  {matches.map((product) => (
                    <div key={product.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-colors">
                      {product.image_urls?.[0] ? (
                        <img src={product.image_urls[0]} alt={product.name} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">No img</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                        {product.brand && <p className="text-xs text-gray-500 truncate">{product.brand}</p>}
                        <p className="text-sm font-bold text-green-700 mt-0.5">£{(product.retail_price || 0).toFixed(2)}</p>
                      </div>
                      {onAddToCart && (
                        <button
                          onClick={() => { onAddToCart(product); onClose(); }}
                          className="flex-shrink-0 w-9 h-9 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-sm text-gray-500">No matching products found. Try a clearer photo showing the label or packaging.</p>
                </div>
              )}

              <button
                onClick={handleReset}
                className="mt-4 w-full border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
              >
                Try Another Image
              </button>
            </div>
          )}

          {/* Initial state - pick source */}
          {!loading && matches === null && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-gray-500 mb-1">Take a photo or upload an image — we'll find exact or similar products.</p>

              <button
                onClick={() => cameraRef.current.click()}
                className="flex items-center gap-3 w-full bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 py-3 font-medium transition-colors"
              >
                <Camera className="w-5 h-5" />
                Open Camera
              </button>
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handleFile(e.target.files[0])} />

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
    </div>
  );
}