import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Image as ImageIcon } from "lucide-react";
import ProductURLScraper from "./ProductURLScraper";

export default function ProductFormModal({ open, onClose, product, categories, onSave, processing }) {
  const [formData, setFormData] = useState({
    sku: "",
    barcode: "",
    name: "",
    description: "",
    category_id: "",
    brand: "",
    retail_price: "",
    wholesale_price: "",
    cost_price: "",
    vat_rate: 20,
    stock_quantity: 0,
    reorder_level: 10,
    unit_type: "piece",
    is_active: true,
    expiry_tracking: false,
    image_urls: [],
    badge: "",
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        image_urls: product.image_urls || (product.image_url ? [product.image_url] : [])
      });
    } else {
      setFormData({
        sku: `SKU-${Date.now()}`,
        barcode: "",
        name: "",
        description: "",
        category_id: "",
        brand: "",
        retail_price: "",
        wholesale_price: "",
        cost_price: "",
        vat_rate: 20,
        stock_quantity: 0,
        reorder_level: 10,
        unit_type: "piece",
        is_active: true,
        expiry_tracking: false,
        image_urls: [],
        badge: "",
      });
    }
  }, [product, open]);

  const handleProductExtracted = (extractedData) => {
    const newImageUrls = extractedData.image_url 
      ? [...(formData.image_urls || []), extractedData.image_url]
      : formData.image_urls;
    
    setFormData({
      ...formData,
      name: extractedData.name || formData.name,
      description: extractedData.description || formData.description,
      brand: extractedData.brand || formData.brand,
      retail_price: extractedData.retail_price || formData.retail_price,
      cost_price: extractedData.cost_price || formData.cost_price,
      unit_type: extractedData.unit_type || formData.unit_type,
      image_urls: newImageUrls,
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(file => 
        base44.integrations.Core.UploadFile({ file })
      );
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(result => result.file_url);
      
      setFormData({ 
        ...formData, 
        image_urls: [...(formData.image_urls || []), ...newUrls]
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    const newUrls = formData.image_urls.filter((_, i) => i !== index);
    setFormData({ ...formData, image_urls: newUrls });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      retail_price: parseFloat(formData.retail_price),
      wholesale_price: formData.wholesale_price ? parseFloat(formData.wholesale_price) : undefined,
      cost_price: formData.cost_price ? parseFloat(formData.cost_price) : undefined,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      reorder_level: parseInt(formData.reorder_level) || 10,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Scraper - Only show for new products */}
          {!product && (
            <ProductURLScraper onProductExtracted={handleProductExtracted} />
          )}

          {/* Product Images Upload */}
          <div className="space-y-2">
            <Label>Product Images</Label>
            
            {/* Image Grid */}
            {formData.image_urls && formData.image_urls.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                {formData.image_urls.map((url, index) => (
                  <div key={index} className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload Area */}
            <div className="w-full h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2" />
                    <p className="text-gray-600 text-sm">Uploading...</p>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-gray-600 font-medium text-sm">Click to upload images</p>
                    <p className="text-xs text-gray-500 mt-1">Select multiple images • PNG, JPG up to 10MB each</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="Leave empty to generate later"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="retail_price">Retail Price (£) *</Label>
              <Input
                id="retail_price"
                type="number"
                step="0.01"
                value={formData.retail_price}
                onChange={(e) => setFormData({ ...formData, retail_price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wholesale_price">Wholesale Price (£)</Label>
              <Input
                id="wholesale_price"
                type="number"
                step="0.01"
                value={formData.wholesale_price}
                onChange={(e) => setFormData({ ...formData, wholesale_price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost_price">Cost Price (£)</Label>
              <Input
                id="cost_price"
                type="number"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vat_rate">VAT Rate</Label>
              <Select
                value={formData.vat_rate.toString()}
                onValueChange={(value) => setFormData({ ...formData, vat_rate: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0% (Zero-rated)</SelectItem>
                  <SelectItem value="5">5% (Reduced)</SelectItem>
                  <SelectItem value="20">20% (Standard)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Initial Stock</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reorder_level">Reorder Level</Label>
              <Input
                id="reorder_level"
                type="number"
                value={formData.reorder_level}
                onChange={(e) => setFormData({ ...formData, reorder_level: e.target.value })}
              />
            </div>
          </div>

          {/* Storefront Badge */}
          <div className="space-y-2">
            <Label htmlFor="badge">Storefront Badge <span className="text-gray-400 font-normal">(shown on product card)</span></Label>
            <Select
              value={formData.badge || ""}
              onValueChange={(value) => setFormData({ ...formData, badge: value === "none" ? "" : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="No badge" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No badge</SelectItem>
                <SelectItem value="Best Seller">Best Seller</SelectItem>
                <SelectItem value="Top Product">Top Product</SelectItem>
                <SelectItem value="Popular">Popular</SelectItem>
                <SelectItem value="Favourites">Favourites</SelectItem>
                <SelectItem value="New Arrival">New Arrival</SelectItem>
                <SelectItem value="Special Offer">Special Offer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <Label htmlFor="is_active" className="cursor-pointer">Active Product</Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={processing || uploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing || uploading} className="bg-gradient-to-r from-indigo-600 to-indigo-700">
              {processing ? "Saving..." : product ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}