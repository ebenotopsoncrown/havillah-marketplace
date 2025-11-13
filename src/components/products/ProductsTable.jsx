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
import { Pencil, Package, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsTable({ products, isLoading, onEdit, onAdjustStock, categories }) {
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Uncategorized";
  };

  if (isLoading) {
    return (
      <div className="p-6">
        {Array(10).fill(0).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-4 border-b">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>SKU</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>VAT Rate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                No products found. Add your first product to get started.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              const isLowStock = product.stock_quantity <= (product.reorder_level || 10);
              
              return (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      {product.brand && (
                        <p className="text-sm text-gray-500">{product.brand}</p>
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
                          Wholesale: £{product.wholesale_price.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {isLowStock && <AlertCircle className="w-4 h-4 text-orange-500" />}
                      <span className={isLowStock ? "text-orange-600 font-semibold" : ""}>
                        {product.stock_quantity || 0}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{product.vat_rate}%</TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAdjustStock(product)}
                      >
                        <Package className="w-4 h-4 mr-1" />
                        Adjust
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(product)}
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}