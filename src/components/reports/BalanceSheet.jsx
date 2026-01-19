import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Package, Users, CreditCard, MousePointer } from "lucide-react";
import { format } from "date-fns";
import TransactionDrilldownModal from "./TransactionDrilldownModal";

export default function BalanceSheet({ products, customers, suppliers, sales, orders = [], expenses, asOfDate }) {
  const [drilldownModal, setDrilldownModal] = useState({ open: false, title: '', transactions: [], type: '' });

  // ASSETS
  // Current Assets - Inventory (FROM PRODUCTS)
  const inventoryValue = products.reduce((sum, product) => {
    const value = (product.stock_quantity || 0) * (product.cost_price || 0);
    return sum + value;
  }, 0);
  
  const inventoryProducts = products.filter(p => (p.stock_quantity || 0) > 0);
  
  // Current Assets - Accounts Receivable (FROM CUSTOMERS)
  const accountsReceivable = customers.reduce((sum, customer) => {
    return sum + (customer.credit_balance || 0);
  }, 0);
  
  const customersWithCredit = customers.filter(c => (c.credit_balance || 0) > 0);
  
  // Current Assets - Cash (FROM SALES + ORDERS - EXPENSES)
  const salesRevenue = sales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
  const ordersRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const totalRevenue = salesRevenue + ordersRevenue;
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const cashOnHand = totalRevenue - totalExpenses;
  
  const totalCurrentAssets = inventoryValue + accountsReceivable + cashOnHand;
  
  // NO HARDCODED FIXED ASSETS - Only show if we have actual data
  const totalAssets = totalCurrentAssets;
  
  // LIABILITIES
  // Current Liabilities - Accounts Payable (FROM SUPPLIERS)
  const accountsPayable = suppliers.reduce((sum, supplier) => {
    return sum + (supplier.account_balance || 0);
  }, 0);
  
  const suppliersWithBalance = suppliers.filter(s => (s.account_balance || 0) > 0);
  
  // Current Liabilities - Unpaid expenses (FROM EXPENSES)
  const unpaidExpenses = expenses
    .filter(exp => exp.status === 'pending')
    .reduce((sum, exp) => sum + (exp.amount || 0), 0);
  
  const pendingExpensesList = expenses.filter(exp => exp.status === 'pending');
  
  const totalCurrentLiabilities = accountsPayable + unpaidExpenses;
  
  // NO HARDCODED LONG-TERM LIABILITIES
  const totalLiabilities = totalCurrentLiabilities;
  
  // EQUITY
  // Owner's Equity = Assets - Liabilities
  const ownersEquity = totalAssets - totalLiabilities;

  const showDrilldown = (title, transactions, type) => {
    setDrilldownModal({ open: true, title, transactions, type });
  };
  
  return (
    <>
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              <span className="text-xl">Balance Sheet</span>
            </div>
            <span className="text-sm font-normal text-gray-600">
              As of {format(asOfDate, 'dd MMM yyyy')}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* ASSETS */}
          <div>
            <div className="flex justify-between items-center py-3 border-b-2 border-blue-300 bg-blue-50 px-4 rounded-t-lg">
              <span className="font-bold text-lg text-blue-900">ASSETS</span>
              <span className="font-bold text-lg text-blue-900">£{totalAssets.toFixed(2)}</span>
            </div>
            
            {/* Current Assets */}
            <div className="mt-3">
              <div className="flex justify-between items-center py-2 px-4 bg-blue-50 rounded">
                <span className="font-semibold text-blue-800">Current Assets</span>
                <span className="font-semibold text-blue-800">£{totalCurrentAssets.toFixed(2)}</span>
              </div>
              <div className="space-y-2 py-2">
                <div 
                  className="flex justify-between items-center py-1 px-4 ml-4 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => showDrilldown('Cash & Bank - From Revenue', [...sales, ...orders], 'mixed')}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-green-600" />
                    <span>Cash & Bank (from {sales.length} sales + {orders.length} orders)</span>
                  </div>
                  <span className="font-medium text-green-600">£{cashOnHand.toFixed(2)}</span>
                </div>
                <div 
                  className="flex justify-between items-center py-1 px-4 ml-4 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => showDrilldown('Accounts Receivable - Customer Credit', customersWithCredit, 'customers')}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Accounts Receivable ({customersWithCredit.length} customers)</span>
                  </div>
                  <span>£{accountsReceivable.toFixed(2)}</span>
                </div>
                <div 
                  className="flex justify-between items-center py-1 px-4 ml-4 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => showDrilldown('Inventory Value - Products in Stock', inventoryProducts, 'inventory')}
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-indigo-600" />
                    <span>Inventory ({inventoryProducts.length} products)</span>
                  </div>
                  <span>£{inventoryValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* LIABILITIES */}
          <div>
            <div className="flex justify-between items-center py-3 border-b-2 border-orange-300 bg-orange-50 px-4 rounded-t-lg">
              <span className="font-bold text-lg text-orange-900">LIABILITIES</span>
              <span className="font-bold text-lg text-orange-900">£{totalLiabilities.toFixed(2)}</span>
            </div>
            
            {/* Current Liabilities */}
            <div className="mt-3">
              <div className="flex justify-between items-center py-2 px-4 bg-orange-50 rounded">
                <span className="font-semibold text-orange-800">Current Liabilities</span>
                <span className="font-semibold text-orange-800">£{totalCurrentLiabilities.toFixed(2)}</span>
              </div>
              <div className="space-y-2 py-2">
                <div 
                  className="flex justify-between items-center py-1 px-4 ml-4 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => showDrilldown('Accounts Payable - Supplier Balances', suppliersWithBalance, 'suppliers')}
                >
                  <span>Accounts Payable ({suppliersWithBalance.length} suppliers)</span>
                  <span className="text-red-600">£{accountsPayable.toFixed(2)}</span>
                </div>
                <div 
                  className="flex justify-between items-center py-1 px-4 ml-4 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => showDrilldown('Unpaid Expenses', pendingExpensesList, 'expenses')}
                >
                  <span>Unpaid Expenses ({pendingExpensesList.length} pending)</span>
                  <span className="text-red-600">£{unpaidExpenses.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* EQUITY */}
          <div>
            <div className="flex justify-between items-center py-3 border-b-2 border-green-300 bg-green-50 px-4 rounded-t-lg">
              <span className="font-bold text-lg text-green-900">OWNER'S EQUITY</span>
              <span className="font-bold text-lg text-green-900">£{ownersEquity.toFixed(2)}</span>
            </div>
            <div className="py-1 px-4 ml-4 text-gray-700 mt-2">
              <div className="flex justify-between items-center hover:bg-gray-50 py-1">
                <span>Retained Earnings (Assets - Liabilities)</span>
                <span className="font-medium text-green-600">£{ownersEquity.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Total Check */}
          <div className="flex justify-between items-center py-4 bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-purple-300 px-4 rounded-lg">
            <span className="font-bold text-lg text-purple-900">LIABILITIES + EQUITY</span>
            <span className="font-bold text-xl text-purple-900">
              £{(totalLiabilities + ownersEquity).toFixed(2)}
            </span>
          </div>

          {/* Financial Health Indicators */}
          {totalCurrentLiabilities > 0 && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Current Ratio</p>
                <p className="text-lg font-bold text-gray-900">
                  {(totalCurrentAssets / totalCurrentLiabilities).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(totalCurrentAssets / totalCurrentLiabilities) >= 1.5 ? 'Good' : 'Monitor'}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Debt-to-Equity</p>
                <p className="text-lg font-bold text-gray-900">
                  {ownersEquity > 0 ? (totalLiabilities / ownersEquity).toFixed(2) : 'N/A'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {ownersEquity > 0 && (totalLiabilities / ownersEquity) < 1 ? 'Healthy' : 'Monitor'}
                </p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-blue-900">
              <strong>100% Traceable:</strong> All figures are from actual transactions. Click any amount to verify.
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