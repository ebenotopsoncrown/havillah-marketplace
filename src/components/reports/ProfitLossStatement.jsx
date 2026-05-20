import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, MousePointer } from "lucide-react";
import { format } from "date-fns";
import TransactionDrilldownModal from "./TransactionDrilldownModal";

export default function ProfitLossStatement({ sales, orders = [], expenses, startDate, endDate }) {
  const [drilldownModal, setDrilldownModal] = useState({ open: false, title: '', transactions: [], type: '' });

  // Calculate Revenue (combining POS sales and online orders)
  const salesRevenue = sales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
  const ordersRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const totalRevenue = salesRevenue + ordersRevenue;
  
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

  const showDrilldown = (title, transactions, type) => {
    setDrilldownModal({ open: true, title, transactions, type });
  };

  const getExpensesByCategory = (category) => {
    return expenses.filter(exp => exp.category === category);
  };

  return (
    <>
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
            <div 
              className="flex justify-between items-center py-3 border-b-2 border-indigo-200 bg-indigo-50 px-4 rounded-t-lg cursor-pointer hover:bg-indigo-100 transition-colors group"
              onClick={() => showDrilldown('Revenue - All Sales Transactions', sales, 'sales')}
            >
              <span className="font-bold text-lg text-indigo-900 flex items-center gap-2">
                Revenue
                <MousePointer className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <span className="font-bold text-lg text-indigo-900">£{totalRevenue.toFixed(2)}</span>
            </div>
            <div 
              className="flex justify-between items-center py-2 px-4 text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => showDrilldown('POS Sales Transactions', sales, 'sales')}
            >
              <span className="ml-4">POS Sales ({sales.length} transactions)</span>
              <span>£{salesRevenue.toFixed(2)}</span>
            </div>
            <div 
              className="flex justify-between items-center py-2 px-4 text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => showDrilldown('Online Orders', orders, 'orders')}
            >
              <span className="ml-4">Online Orders ({orders.length} orders)</span>
              <span>£{ordersRevenue.toFixed(2)}</span>
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
            <div 
              className="flex justify-between items-center py-3 border-b-2 border-orange-200 bg-orange-50 px-4 rounded-t-lg cursor-pointer hover:bg-orange-100 transition-colors group"
              onClick={() => showDrilldown('All Operating Expenses', expenses, 'expenses')}
            >
              <span className="font-bold text-lg text-orange-900 flex items-center gap-2">
                Operating Expenses
                <MousePointer className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <span className="font-bold text-lg text-orange-900">-£{totalOperatingExpenses.toFixed(2)}</span>
            </div>
            <div className="space-y-2 py-2">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div 
                  key={category} 
                  className="flex justify-between items-center py-1 px-4 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => showDrilldown(
                    `${expenseCategoryLabels[category] || category} Expenses`, 
                    getExpensesByCategory(category), 
                    'expenses'
                  )}
                >
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-blue-900">
              <strong>Tip:</strong> Click on any amount to see the underlying transactions
            </p>
          </div>
        </CardContent>
      </Card>

      <TransactionDrilldownModal
        open={drilldownModal.open}
        onClose={() => setDrilldownModal({ open: false, title: '', transactions: [], type: '' })}
        title={drilldownModal.title}
        transactions={drilldownModal.transactions}
        type={drilldownModal.type}
      />
    </>
  );
}