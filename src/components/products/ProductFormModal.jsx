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
    image_url: "",
  });

  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (product) {
      setFormData(product);
      setImagePreview(product.image_url || "");
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
        image_url: "",
      });
      setImagePreview("");
    }
  }, [product, open]);

  const handleProductExtracted = (extractedData) => {
    setFormData({
      ...formData,
      name: extractedData.name || formData.name,
      description: extractedData.description || formData.description,
      brand: extractedData.brand || formData.brand,
      retail_price: extractedData.retail_price || formData.retail_price,
      cost_price: extractedData.cost_price || formData.cost_price,
      unit_type: extractedData.unit_type || formData.unit_type,
      image_url: extractedData.image_url || formData.image_url,
    });
    
    if (extractedData.image_url) {
      setImagePreview(extractedData.image_url);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, image_url: file_url });
      setImagePreview(file_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
    setUploading(false);
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image_url: "" });
    setImagePreview("");
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

          {/* Product Image Upload */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            {imagePreview ? (
              <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                <img src={imagePreview} alt="Product" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
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
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-3" />
                      <p className="text-gray-600">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="text-gray-600 font-medium">Click to upload product image</p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                    </>
                  )}
                </label>
              </div>
            )}
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