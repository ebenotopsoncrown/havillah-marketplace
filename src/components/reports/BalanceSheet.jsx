import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Package, Users, CreditCard } from "lucide-react";
import { format } from "date-fns";

export default function BalanceSheet({ products, customers, suppliers, sales, expenses, asOfDate }) {
  // ASSETS
  // Current Assets - Inventory
  const inventoryValue = products.reduce((sum, product) => {
    const value = (product.stock_quantity || 0) * (product.cost_price || 0);
    return sum + value;
  }, 0);
  
  // Current Assets - Accounts Receivable (Customer credit balances)
  const accountsReceivable = customers.reduce((sum, customer) => {
    return sum + (customer.credit_balance || 0);
  }, 0);
  
  // Current Assets - Cash (Simplified: Total sales revenue - expenses)
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const cashOnHand = totalRevenue - totalExpenses;
  
  const totalCurrentAssets = inventoryValue + accountsReceivable + cashOnHand;
  
  // Fixed Assets (assumed values for demonstration)
  const propertyPlantEquipment = 50000; // Placeholder for shop fixtures, equipment, etc.
  
  const totalAssets = totalCurrentAssets + propertyPlantEquipment;
  
  // LIABILITIES
  // Current Liabilities - Accounts Payable (Amount owed to suppliers)
  const accountsPayable = suppliers.reduce((sum, supplier) => {
    return sum + (supplier.account_balance || 0);
  }, 0);
  
  // Current Liabilities - Unpaid expenses
  const unpaidExpenses = expenses
    .filter(exp => exp.status === 'pending')
    .reduce((sum, exp) => sum + (exp.amount || 0), 0);
  
  const totalCurrentLiabilities = accountsPayable + unpaidExpenses;
  
  // Long-term Liabilities (placeholder)
  const longTermDebt = 20000; // Placeholder
  
  const totalLiabilities = totalCurrentLiabilities + longTermDebt;
  
  // EQUITY
  // Owner's Equity = Assets - Liabilities
  const ownersEquity = totalAssets - totalLiabilities;
  
  return (
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
              <div className="flex justify-between items-center py-1 px-4 ml-4 text-gray-700 hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span>Cash & Bank</span>
                </div>
                <span className="font-medium text-green-600">£{cashOnHand.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-1 px-4 ml-4 text-gray-700 hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Accounts Receivable</span>
                </div>
                <span>£{accountsReceivable.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-1 px-4 ml-4 text-gray-700 hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-indigo-600" />
                  <span>Inventory</span>
                </div>
                <span>£{inventoryValue.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Fixed Assets */}
          <div className="mt-3">
            <div className="flex justify-between items-center py-2 px-4 bg-blue-50 rounded">
              <span className="font-semibold text-blue-800">Fixed Assets</span>
              <span className="font-semibold text-blue-800">£{propertyPlantEquipment.toFixed(2)}</span>
            </div>
            <div className="py-1 px-4 ml-4 text-gray-700">
              <div className="flex justify-between items-center hover:bg-gray-50 py-1">
                <span>Property, Plant & Equipment</span>
                <span>£{propertyPlantEquipment.toFixed(2)}</span>
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
              <div className="flex justify-between items-center py-1 px-4 ml-4 text-gray-700 hover:bg-gray-50">
                <span>Accounts Payable (Suppliers)</span>
                <span className="text-red-600">£{accountsPayable.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-1 px-4 ml-4 text-gray-700 hover:bg-gray-50">
                <span>Unpaid Expenses</span>
                <span className="text-red-600">£{unpaidExpenses.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Long-term Liabilities */}
          <div className="mt-3">
            <div className="flex justify-between items-center py-2 px-4 bg-orange-50 rounded">
              <span className="font-semibold text-orange-800">Long-term Liabilities</span>
              <span className="font-semibold text-orange-800">£{longTermDebt.toFixed(2)}</span>
            </div>
            <div className="py-1 px-4 ml-4 text-gray-700">
              <div className="flex justify-between items-center hover:bg-gray-50 py-1">
                <span>Long-term Debt</span>
                <span className="text-red-600">£{longTermDebt.toFixed(2)}</span>
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
              <span>Retained Earnings</span>
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
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Current Ratio</p>
            <p className="text-lg font-bold text-gray-900">
              {totalCurrentLiabilities > 0 
                ? (totalCurrentAssets / totalCurrentLiabilities).toFixed(2) 
                : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {totalCurrentLiabilities > 0 && (totalCurrentAssets / totalCurrentLiabilities) >= 1.5 
                ? 'Good' 
                : 'Monitor'}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Debt-to-Equity</p>
            <p className="text-lg font-bold text-gray-900">
              {ownersEquity > 0 
                ? (totalLiabilities / ownersEquity).toFixed(2) 
                : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {ownersEquity > 0 && (totalLiabilities / ownersEquity) < 1 
                ? 'Healthy' 
                : 'Monitor'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}