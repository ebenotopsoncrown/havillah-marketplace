import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import AdminGuard from "../components/AdminGuard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, AlertTriangle, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import ProductsTable from "../components/products/ProductsTable";
import ProductFormModal from "../components/products/ProductFormModal";
import StockAdjustmentModal from "../components/products/StockAdjustmentModal";
import BulkImportModal from "../components/products/BulkImportModal";
import BarcodeGenerator from "../components/products/BarcodeGenerator";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showStockAdjust, setShowStockAdjust] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showBarcodeGen, setShowBarcodeGen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [adjustingProduct, setAdjustingProduct] = useState(null);
  const [barcodeProduct, setBarcodeProduct] = useState(null);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list(),
  });

  const createProductMutation = useMutation({
    mutationFn: (data) => base44.entities.Product.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowForm(false);
      setEditingProduct(null);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Product.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowForm(false);
      setEditingProduct(null);
      setShowBarcodeGen(false);
      setBarcodeProduct(null);
    },
  });

  const adjustStockMutation = useMutation({
    mutationFn: async (data) => {
      await base44.entities.StockAdjustment.create(data.adjustment);
      await base44.entities.Product.update(data.productId, {
        stock_quantity: data.newQuantity
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowStockAdjust(false);
      setAdjustingProduct(null);
    },
  });

  const filteredProducts = products.filter(product =>
    searchTerm === "" ||
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveProduct = (data) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAdjustStock = (product) => {
    setAdjustingProduct(product);
    setShowStockAdjust(true);
  };

  const handleGenerateBarcode = (product) => {
    setBarcodeProduct(product);
    setShowBarcodeGen(true);
  };

  const handleSaveBarcode = async (barcodeValue) => {
    if (barcodeProduct) {
      await updateProductMutation.mutateAsync({
        id: barcodeProduct.id,
        data: { ...barcodeProduct, barcode: barcodeValue }
      });
    }
  };

  const handleBulkImportComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    setShowBulkImport(false);
  };

  const lowStockCount = products.filter(p => {
    const category = categories.find(c => c.id === p.category_id);
    const minStock = category?.minimum_stock_level || p.reorder_level || 10;
    return p.stock_quantity <= minStock;
  }).length;
  const noBarcodeCount = products.filter(p => !p.barcode).length;

  return (
    <AdminGuard>
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
            <p className="text-gray-600">Manage your product catalog and inventory</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowBulkImport(true)}
              variant="outline"
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Bulk Import
            </Button>
            <Button
              onClick={() => {
                setEditingProduct(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {(lowStockCount > 0 || noBarcodeCount > 0) && (
          <div className="flex gap-4">
            {lowStockCount > 0 && (
              <div className="flex-1 bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <p className="text-orange-900">
                  <strong>{lowStockCount}</strong> product{lowStockCount !== 1 ? 's' : ''} running low on stock
                </p>
              </div>
            )}
            {noBarcodeCount > 0 && (
              <div className="flex-1 bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-purple-600" />
                <p className="text-purple-900">
                  <strong>{noBarcodeCount}</strong> product{noBarcodeCount !== 1 ? 's' : ''} without barcode
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search products by name, SKU, or barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          <ProductsTable
            products={filteredProducts}
            isLoading={isLoading}
            onEdit={handleEdit}
            onAdjustStock={handleAdjustStock}
            onGenerateBarcode={handleGenerateBarcode}
            categories={categories}
          />
        </div>
      </div>

      <ProductFormModal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        categories={categories}
        onSave={handleSaveProduct}
        processing={createProductMutation.isPending || updateProductMutation.isPending}
      />

      <StockAdjustmentModal
        open={showStockAdjust}
        onClose={() => {
          setShowStockAdjust(false);
          setAdjustingProduct(null);
        }}
        product={adjustingProduct}
        onSave={(data) => adjustStockMutation.mutate(data)}
        processing={adjustStockMutation.isPending}
      />

      <BulkImportModal
        open={showBulkImport}
        onClose={() => setShowBulkImport(false)}
        categories={categories}
        onComplete={handleBulkImportComplete}
      />

      <BarcodeGenerator
        open={showBarcodeGen}
        onClose={() => {
          setShowBarcodeGen(false);
          setBarcodeProduct(null);
        }}
        product={barcodeProduct}
        onSave={handleSaveBarcode}
      />
    </div>
    </AdminGuard>
  );
}