import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ShoppingCart, ChevronLeft, ChevronRight, Package, Barcode, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function ProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);

  useEffect(() => {
    if (!productId) { setLoading(false); return; }
    base44.entities.Product.filter({ id: productId }).then(results => {
      setProduct(results[0] || null);
      setLoading(false);
    });
  }, [productId]);

  const addToCart = () => {
    // Store cart in sessionStorage so CustomerStore can pick it up
    const existing = JSON.parse(sessionStorage.getItem("havillah_cart") || "[]");
    const price = product.wholesale_price || product.retail_price;
    const idx = existing.findIndex(i => i.product_id === product.id);
    if (idx >= 0) {
      existing[idx].quantity += quantity;
      existing[idx].line_total = existing[idx].unit_price * existing[idx].quantity * (1 + existing[idx].vat_rate / 100);
    } else {
      existing.push({
        product_id: product.id,
        product_name: product.name,
        sku: product.sku,
        quantity,
        unit_price: price,
        vat_rate: product.vat_rate || 20,
        line_total: price * quantity * (1 + (product.vat_rate || 20) / 100)
      });
    }
    sessionStorage.setItem("havillah_cart", JSON.stringify(existing));
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] gap-4">
        <Package className="w-16 h-16 text-gray-300" />
        <p className="text-gray-500 text-lg">Product not found</p>
        <Link to={createPageUrl("CustomerStore")}>
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back to Store</Button>
        </Link>
      </div>
    );
  }

  const images = product.image_urls?.length > 0 ? product.image_urls : product.image_url ? [product.image_url] : [];
  const price = product.wholesale_price || product.retail_price;
  const availableStock = product.stock_quantity - (product.reserved_quantity || 0);

  const slugName = (product.name || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to={createPageUrl("CustomerStore")}>
            <button className="flex items-center gap-1.5 text-gray-600 hover:text-green-700 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </button>
          </Link>
          <span className="text-gray-300">|</span>
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978a8de9be83b8a34f67a8d/49e6f5db7_HavillahMarketplacelogo.jpg"
            alt="Havillah Marketplace"
            className="h-8 w-8 rounded-md object-cover"
          />
          <span className="font-bold text-gray-900 text-sm">Havillah Marketplace</span>
        </div>
      </header>

      {/* Product Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">

            {/* Images */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[currentImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {images.length > 1 && (
                      <>
                        <button onClick={() => setCurrentImageIndex(p => (p - 1 + images.length) % images.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={() => setCurrentImageIndex(p => (p + 1) % images.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl font-bold text-gray-300">{product.name?.[0]}</span>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setCurrentImageIndex(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === currentImageIndex ? "border-green-600" : "border-gray-200"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 space-y-5">
              {product.brand && <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">{product.brand}</p>}
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-green-600">£{price?.toFixed(2)}</span>
                {product.wholesale_price && (
                  <span className="text-lg text-gray-400 line-through">£{product.retail_price?.toFixed(2)}</span>
                )}
              </div>

              {product.description && (
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              )}

              <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Barcode className="w-4 h-4" />
                  <span>SKU: <span className="font-medium text-gray-900">{product.sku}</span></span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Package className="w-4 h-4" />
                  <span>Unit: <span className="font-medium text-gray-900">{product.unit_type}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={availableStock < 10 ? "text-orange-600 border-orange-300" : "text-green-700 border-green-300"}>
                    {availableStock > 0 ? `${availableStock} in stock` : "Out of stock"}
                  </Badge>
                </div>
              </div>

              {/* Quantity + Add to Cart */}
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>-</Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                    min="1"
                    max={availableStock}
                  />
                  <Button variant="outline" size="sm" onClick={() => setQuantity(Math.min(availableStock, quantity + 1))} disabled={quantity >= availableStock}>+</Button>
                </div>

                <Button
                  onClick={addToCart}
                  className="w-full bg-green-600 hover:bg-green-700 h-12 text-base"
                  disabled={availableStock === 0}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {addedMsg ? "Added to cart!" : `Add ${quantity} to Cart`}
                </Button>

                <Link to={createPageUrl("CustomerStore")}>
                  <Button variant="outline" className="w-full h-10">Continue Shopping</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}