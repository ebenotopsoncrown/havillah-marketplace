import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ProductDetailsModal from "./ProductDetailsModal";

export default function ProductCatalog({ products, onAddToCart }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500 text-lg">No products available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {products.map(product => {
        const img = product.image_urls?.[0] || product.image_url;
        const basePrice = product.wholesale_price || product.retail_price;
        const discountPercent = product.discount_percent || 0;
        const price = discountPercent > 0 ? basePrice * (1 - discountPercent / 100) : basePrice;
        const availableStock = product.stock_quantity - (product.reserved_quantity || 0);
        const lowStock = availableStock > 0 && availableStock <= 5;
        return (
        <div
          key={product.id}
          className="group bg-white rounded-2xl overflow-hidden border border-rose-50 cursor-pointer transition-all duration-300 relative"
          style={{ boxShadow: "0 2px 12px rgba(216,140,154,0.08)" }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(216,140,154,0.2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(216,140,154,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
          onClick={() => setSelectedProduct(product)}
        >
          <div className="aspect-[1/0.85] bg-rose-50 flex items-center justify-center overflow-hidden relative">
            {img ? (
              <img src={img} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-3xl sm:text-4xl font-bold" style={{ color: "#E8CFCF" }}>{product.name?.[0]}</span>
            )}
            {product.badge && (
              <div className="absolute top-2 left-2">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{
                    background: product.badge.startsWith("New Arriv") ? "#7c3aed"
                      : discountPercent > 0 ? "#ef4444"
                      : "#f97316"
                  }}
                >
                  {product.badge}
                </span>
              </div>
            )}
          </div>
          
          <div className="p-2 sm:p-3">
            {product.brand && <p className="text-xs font-medium uppercase tracking-wide mb-0.5 hidden sm:block" style={{ color: "#D88C9A" }}>{product.brand}</p>}
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-xs sm:text-sm min-h-[2rem]">
              {product.name}
            </h3>
            
            <div className="flex items-baseline gap-1 mb-2 flex-wrap">
              <span className="text-[10px] sm:text-xs font-bold" style={{ color: "#0e9aa7" }}>
                £{price?.toFixed(2)}
              </span>
              {discountPercent > 0 ? (
                <span className="text-[10px] text-red-400 line-through decoration-double">£{basePrice?.toFixed(2)}</span>
              ) : product.wholesale_price ? (
                <span className="text-[10px] text-gray-400 line-through">£{product.retail_price?.toFixed(2)}</span>
              ) : null}
              {discountPercent > 0 && (
                <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-red-100 text-red-500 leading-none">-{discountPercent}%</span>
              )}
            </div>



            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                className="w-8 sm:flex-1 text-white h-8 sm:h-9 text-xs rounded-lg font-semibold flex items-center justify-center gap-1 transition-opacity hover:opacity-90 px-1.5 sm:px-0"
                style={{ background: "#0e9aa7" }}
              >
                <ShoppingCart className="w-3 h-3 flex-shrink-0" />
                <span className="hidden sm:inline">Add</span>
              </button>
              <Link
                to={createPageUrl(`ProductPage?id=${product.id}`)}
                onClick={(e) => e.stopPropagation()}
                title="View product page"
              >
                <button className="h-8 sm:h-9 px-2 border rounded-lg border-rose-200 hover:bg-rose-50 transition-colors">
                  <Eye className="w-3 h-3" style={{ color: "#D88C9A" }} />
                </button>
              </Link>
            </div>
          </div>
        </div>
        );
      })}

      <ProductDetailsModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={onAddToCart}
      />
    </div>
  );
}