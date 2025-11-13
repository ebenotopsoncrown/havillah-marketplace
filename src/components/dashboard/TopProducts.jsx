import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, Package } from "lucide-react";

export default function TopProducts({ sales, products }) {
  const productSales = {};
  
  sales.forEach(sale => {
    const items = sale.items || [];
    items.forEach(item => {
      if (!productSales[item.product_id]) {
        productSales[item.product_id] = {
          name: item.product_name,
          quantity: 0,
          revenue: 0
        };
      }
      productSales[item.product_id].quantity += item.quantity;
      productSales[item.product_id].revenue += item.line_total;
    });
  });

  const topProducts = Object.entries(productSales)
    .sort(([,a], [,b]) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <Card className="shadow-lg border-none">
      <CardHeader className="border-b bg-gradient-to-r from-white to-gray-50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Top Performing Products
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {topProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No product data available yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topProducts.map(([productId, data], index) => (
              <div key={productId} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{data.name}</p>
                  <p className="text-sm text-gray-500">{data.quantity} units sold</p>
                </div>
                <p className="font-bold text-gray-900">£{data.revenue.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}