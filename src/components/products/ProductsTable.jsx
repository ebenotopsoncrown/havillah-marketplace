import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, TrendingDown, Barcode, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsTable({ products, isLoading, onEdit, onAdjustStock, onGenerateBarcode, categories }) {
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Uncategorized';
  };

  if (isLoading) {
    return (
      <div className="p-6">
        {Array(10).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-16 mb-3" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg">No products found</p>
        <p className="text-sm mt-2">Add your first product to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>SKU / Barcode</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-gray-400">
                      {product.name?.[0]}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-mono text-sm font-medium">{product.sku}</p>
                  {product.barcode ? (
                    <p className="font-mono text-xs text-gray-600">{product.barcode}</p>
                  ) : (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-orange-500" />
                      <span className="text-xs text-orange-600">No barcode</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{getCategoryName(product.category_id)}</Badge>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-semibold">£{product.retail_price?.toFixed(2)}</p>
                  {product.wholesale_price && (
                    <p className="text-xs text-gray-500">
                      Wholesale: £{product.wholesale_price?.toFixed(2)}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${
                    product.stock_quantity <= (product.reorder_level || 10)
                      ? 'text-red-600'
                      : 'text-gray-900'
                  }`}>
                    {product.stock_quantity}
                  </span>
                  {product.stock_quantity <= (product.reorder_level || 10) && (
                    <Badge variant="destructive" className="text-xs">Low</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {product.is_active ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onGenerateBarcode(product)}
                    className="hover:bg-purple-50 hover:text-purple-700"
                  >
                    <Barcode className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAdjustStock(product)}
                    className="hover:bg-orange-50 hover:text-orange-700"
                  >
                    <TrendingDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(product)}
                    className="hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}