import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";

export default function ProfitLossStatement({ sales, expenses, startDate, endDate }) {
  // Calculate Revenue
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
  
  // Calculate Cost of Goods Sold (from sale items and their cost prices)
  // For simplicity, assuming 60% margin (40% COGS) if cost price not available
  const costOfGoodsSold = totalRevenue * 0.4; // Approximate COGS
  
  const grossProfit = totalRevenue - costOfGoodsSold;
  const grossProfitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue * 100) : 0;
  
  // Operating Expenses by Category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category || 'other';
    acc[category] = (acc[category] || 0) + (expense.amount || 0);
    return acc;
  }, {});
  
  const totalOperatingExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  
  // Calculate Net Profit
  const netProfit = grossProfit - totalOperatingExpenses;
  const netProfitMargin = totalRevenue > 0 ? (netProfit / totalRevenue * 100) : 0;
  
  const expenseCategoryLabels = {
    rent: 'Rent & Premises',
    utilities: 'Utilities',
    salaries: 'Salaries & Wages',
    transport: 'Transport & Delivery',
    marketing: 'Marketing & Advertising',
    supplies: 'Supplies & Materials',
    maintenance: 'Maintenance & Repairs',
    insurance: 'Insurance',
    tax: 'Tax Payments',
    other: 'Other Expenses'
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-blue-50">
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl">Profit & Loss Statement</span>
          <span className="text-sm font-normal text-gray-600">
            {format(startDate, 'dd MMM yyyy')} - {format(endDate, 'dd MMM yyyy')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Revenue Section */}
        <div>
          <div className="flex justify-between items-center py-3 border-b-2 border-indigo-200 bg-indigo-50 px-4 rounded-t-lg">
            <span className="font-bold text-lg text-indigo-900">Revenue</span>
            <span className="font-bold text-lg text-indigo-900">£{totalRevenue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2 px-4 text-gray-700">
            <span className="ml-4">Sales</span>
            <span>£{totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        {/* Cost of Goods Sold */}
        <div>
          <div className="flex justify-between items-center py-3 border-b border-gray-300 px-4">
            <span className="font-bold text-gray-800">Cost of Goods Sold</span>
            <span className="font-bold text-red-600">-£{costOfGoodsSold.toFixed(2)}</span>
          </div>
        </div>

        {/* Gross Profit */}
        <div>
          <div className="flex justify-between items-center py-3 bg-green-50 border-2 border-green-200 px-4 rounded-lg">
            <div>
              <span className="font-bold text-lg text-green-900">Gross Profit</span>
              <span className="block text-sm text-green-700">Margin: {grossProfitMargin.toFixed(1)}%</span>
            </div>
            <span className="font-bold text-lg text-green-900">£{grossProfit.toFixed(2)}</span>
          </div>
        </div>

        {/* Operating Expenses */}
        <div>
          <div className="flex justify-between items-center py-3 border-b-2 border-orange-200 bg-orange-50 px-4 rounded-t-lg">
            <span className="font-bold text-lg text-orange-900">Operating Expenses</span>
            <span className="font-bold text-lg text-orange-900">-£{totalOperatingExpenses.toFixed(2)}</span>
          </div>
          <div className="space-y-2 py-2">
            {Object.entries(expensesByCategory).map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center py-1 px-4 text-gray-700 hover:bg-gray-50">
                <span className="ml-4">{expenseCategoryLabels[category] || category}</span>
                <span className="text-red-600">-£{amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Net Profit */}
        <div className={`flex justify-between items-center py-4 border-2 px-4 rounded-lg ${
          netProfit >= 0 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
            : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300'
        }`}>
          <div>
            <span className={`font-bold text-xl ${netProfit >= 0 ? 'text-green-900' : 'text-red-900'}`}>
              Net Profit
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm font-medium ${netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                Margin: {netProfitMargin.toFixed(1)}%
              </span>
              {netProfit >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
            </div>
          </div>
          <span className={`font-bold text-2xl ${netProfit >= 0 ? 'text-green-900' : 'text-red-900'}`}>
            £{netProfit.toFixed(2)}
          </span>
        </div>

        {/* Key Ratios */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Gross Margin</p>
            <p className="text-lg font-bold text-gray-900">{grossProfitMargin.toFixed(1)}%</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Operating Margin</p>
            <p className="text-lg font-bold text-gray-900">
              {totalRevenue > 0 ? ((grossProfit - totalOperatingExpenses) / totalRevenue * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Net Margin</p>
            <p className="text-lg font-bold text-gray-900">{netProfitMargin.toFixed(1)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}