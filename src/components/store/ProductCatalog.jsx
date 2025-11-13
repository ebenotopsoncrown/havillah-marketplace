import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProductCatalog({ products, onAddToCart }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500 text-lg">No products available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-gray-100">
          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl font-bold text-gray-300">{product.name?.[0]}</span>
            )}
          </div>
          
          <div className="p-5">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[3rem]">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 mb-3">{product.sku}</p>
            
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-indigo-600">
                £{(product.wholesale_price || product.retail_price)?.toFixed(2)}
              </span>
              {product.wholesale_price && (
                <span className="text-sm text-gray-500 line-through">
                  £{product.retail_price?.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="text-xs">
                {product.stock_quantity} in stock
              </Badge>
              <span className="text-xs text-gray-500">{product.unit_type}</span>
            </div>

            <Button
              onClick={() => onAddToCart(product)}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}