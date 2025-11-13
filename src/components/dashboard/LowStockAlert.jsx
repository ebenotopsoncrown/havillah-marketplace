import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LowStockAlert({ products }) {
  return (
    <Card className="shadow-lg border-none bg-gradient-to-br from-orange-50 to-red-50">
      <CardHeader className="border-b border-orange-200">
        <CardTitle className="flex items-center gap-2 text-xl">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Low Stock Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p className="font-medium">✓ All products well stocked</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.slice(0, 6).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sku}</p>
                </div>
                <Badge variant="destructive" className="ml-2">
                  {product.stock_quantity} left
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}