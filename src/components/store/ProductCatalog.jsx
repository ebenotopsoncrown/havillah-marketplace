import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
      {products.map(product => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 scale-[0.6] sm:scale-100 origin-top-left">
          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
            {(product.image_urls && product.image_urls.length > 0) ? (
              <img src={product.image_urls[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl sm:text-4xl font-bold text-gray-300">{product.name?.[0]}</span>
            )}
          </div>
          
          <div className="p-2 sm:p-4">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm sm:text-base min-h-[2rem] sm:min-h-[2.5rem]">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 mb-1 sm:mb-2 hidden sm:block">{product.sku}</p>
            
            <div className="flex items-baseline gap-1 mb-1 sm:mb-2">
              <span className="text-base sm:text-xl font-bold text-indigo-600">
                £{(product.wholesale_price || product.retail_price)?.toFixed(2)}
              </span>
              {product.wholesale_price && (
                <span className="text-xs text-gray-500 line-through">
                  £{product.retail_price?.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <Badge variant="outline" className="text-xs px-1 py-0">
                {product.stock_quantity}
              </Badge>
              <span className="text-xs text-gray-500">{product.unit_type}</span>
            </div>

            <div className="flex gap-1 sm:gap-2">
              <Button
                onClick={() => onAddToCart(product)}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 h-8 sm:h-9 text-xs"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Add</span>
              </Button>
              <Button
                onClick={() => setSelectedProduct(product)}
                variant="outline"
                className="h-8 sm:h-9 px-2"
                title="View details"
              >
                <Eye className="w-3 h-3" />
              </Button>
            </div>

            <button
              onClick={() => setSelectedProduct(product)}
              className="w-full text-xs text-green-600 hover:text-green-700 underline mt-1 sm:mt-2"
            >
              Details
            </button>
          </div>
        </Card>
      ))}

      <ProductDetailsModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={onAddToCart}
      />
    </div>
  );
}