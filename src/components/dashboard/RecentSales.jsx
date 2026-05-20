import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Receipt } from "lucide-react";

export default function RecentSales({ sales }) {
  return (
    <Card className="shadow-lg border-none">
      <CardHeader className="border-b bg-gradient-to-r from-white to-gray-50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Receipt className="w-5 h-5 text-indigo-600" />
          Recent Sales Today
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {sales.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Receipt className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No sales recorded today yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sales.slice(0, 8).map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{sale.sale_number}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(sale.created_date), 'HH:mm')} • {sale.payment_method}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">£{sale.total_amount?.toFixed(2)}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {sale.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}