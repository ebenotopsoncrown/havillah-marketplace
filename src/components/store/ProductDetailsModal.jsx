import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, X, Package, Barcode, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ProductDetailsModal({ product, open, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const price = product.wholesale_price || product.retail_price;
  const availableStock = product.stock_quantity - (product.reserved_quantity || 0);
  
  const images = product.image_urls && product.image_urls.length > 0 
    ? product.image_urls 
    : product.image_url 
    ? [product.image_url] 
    : [];

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              {images.length > 0 ? (
                <>
                  <img src={images[currentImageIndex]} alt={product.name} className="w-full h-full object-cover" />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={previousImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <span className="text-8xl font-bold text-gray-300">{product.name?.[0]}</span>
              )}
            </div>
            
            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? 'border-green-600 shadow-lg' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            {/* Price */}
            <div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-green-600">
                  £{price?.toFixed(2)}
                </span>
                {product.wholesale_price && (
                  <span className="text-xl text-gray-500 line-through">
                    £{product.retail_price?.toFixed(2)}
                  </span>
                )}
              </div>
              {product.wholesale_price && (
                <Badge className="bg-orange-100 text-orange-800">
                  Wholesale Price
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-3 border-t border-b border-gray-200 py-4">
              <div className="flex items-center gap-3 text-sm">
                <Barcode className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">SKU:</span>
                <span className="font-medium">{product.sku}</span>
              </div>
              {product.barcode && (
                <div className="flex items-center gap-3 text-sm">
                  <Barcode className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Barcode:</span>
                  <span className="font-medium">{product.barcode}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Package className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Unit Type:</span>
                <span className="font-medium">{product.unit_type}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Package className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Available Stock:</span>
                <Badge variant="outline" className={availableStock < 10 ? "text-orange-600" : ""}>
                  {availableStock} units
                </Badge>
              </div>
              {product.weight_kg && (
                <div className="flex items-center gap-3 text-sm">
                  <Package className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{product.weight_kg} kg</span>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Brand */}
            {product.brand && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Brand</h3>
                <p className="text-gray-600">{product.brand}</p>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center"
                  min="1"
                  max={availableStock}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  disabled={quantity >= availableStock}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 h-12"
                disabled={availableStock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add {quantity} to Cart
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="h-12"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {availableStock === 0 && (
              <p className="text-red-600 text-sm text-center">Out of stock</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}