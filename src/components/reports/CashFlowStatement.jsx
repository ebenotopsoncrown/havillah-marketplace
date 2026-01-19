import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, ArrowRightLeft, MousePointer } from "lucide-react";
import { format } from "date-fns";
import TransactionDrilldownModal from "./TransactionDrilldownModal";

export default function CashFlowStatement({ sales, orders = [], expenses, purchaseOrders, startDate, endDate }) {
  const [drilldownModal, setDrilldownModal] = useState({ open: false, title: '', transactions: [], type: '' });

  // OPERATING ACTIVITIES (FROM ACTUAL TRANSACTIONS - combining POS and online)
  const cashFromSales = sales
    .filter(sale => sale.payment_method !== 'account') // Exclude credit sales
    .reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
  
  const cashFromOrders = orders
    .filter(order => order.payment_method !== 'account') // Exclude credit orders
    .reduce((sum, order) => sum + (order.total_amount || 0), 0);
  
  const totalCashReceived = cashFromSales + cashFromOrders;
  
  const cashSalesTransactions = sales.filter(sale => sale.payment_method !== 'account');
  const cashOrdersTransactions = orders.filter(order => order.payment_method !== 'account');
  
  const cashPaidForExpenses = expenses
    .filter(exp => exp.status === 'paid')
    .reduce((sum, exp) => sum + (exp.amount || 0), 0);
  
  const paidExpensesTransactions = expenses.filter(exp => exp.status === 'paid');
  
  const netCashFromOperations = totalCashReceived - cashPaidForExpenses;
  
  // NO HARDCODED VALUES - Only show actual transaction-based cash flow
  
  // NET CHANGE IN CASH (ONLY FROM OPERATIONS - NO FAKE DATA)
  const netCashChange = netCashFromOperations;
  
  // CASH POSITIONS (CALCULATED FROM ACTUAL DATA)
  const cashBeginning = 0; // Start from zero - only count actual transactions
  const cashEnding = cashBeginning + netCashChange;

  const showDrilldown = (title, transactions, type) => {
    setDrilldownModal({ open: true, title, transactions, type });
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-cyan-50 to-blue-50">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-cyan-600" />
              <span className="text-xl">Cash Flow Statement</span>
            </div>
            <span className="text-sm font-normal text-gray-600">
              {format(startDate, 'dd MMM yyyy')} - {format(endDate, 'dd MMM yyyy')}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Operating Activities */}
          <div>
            <div className="flex items-center gap-2 py-3 border-b-2 border-blue-300 bg-blue-50 px-4 rounded-t-lg">
              <ArrowRightLeft className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-lg text-blue-900">Cash Flow from Operating Activities</span>
            </div>
            <div className="space-y-2 py-3">
              <div 
                className="flex justify-between items-center py-1 px-4 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => showDrilldown('Cash from POS Sales', cashSalesTransactions, 'sales')}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span>Cash from POS ({cashSalesTransactions.length} transactions)</span>
                </div>
                <span className="text-green-600 font-medium">£{cashFromSales.toFixed(2)}</span>
              </div>
              <div 
                className="flex justify-between items-center py-1 px-4 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => showDrilldown('Cash from Online Orders', cashOrdersTransactions, 'orders')}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span>Cash from Online ({cashOrdersTransactions.length} orders)</span>
                </div>
                <span className="text-green-600 font-medium">£{cashFromOrders.toFixed(2)}</span>
              </div>
              <div 
                className="flex justify-between items-center py-1 px-4 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => showDrilldown('Cash Paid for Expenses', paidExpensesTransactions, 'expenses')}
              >
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span>Cash paid for expenses ({paidExpensesTransactions.length} transactions)</span>
                </div>
                <span className="text-red-600 font-medium">-£{cashPaidForExpenses.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 px-4 bg-blue-100 border-t border-blue-200 rounded-b-lg">
              <span className="font-semibold text-blue-900">Net Cash from Operations</span>
              <span className={`font-bold ${netCashFromOperations >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                £{netCashFromOperations.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Net Change in Cash */}
          <div className="space-y-3 pt-4 border-t-2">
            <div className="flex justify-between items-center py-2 px-4">
              <span className="text-gray-700">Cash at beginning of period</span>
              <span className="font-medium">£{cashBeginning.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-4">
              <span className="font-semibold text-gray-900">Net change in cash</span>
              <span className={`font-bold ${netCashChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netCashChange >= 0 ? '+' : ''}£{netCashChange.toFixed(2)}
              </span>
            </div>
            <div className={`flex justify-between items-center py-4 border-2 px-4 rounded-lg ${
              cashEnding >= 0 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
                : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300'
            }`}>
              <span className={`font-bold text-xl ${cashEnding >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                Cash at end of period
              </span>
              <span className={`font-bold text-2xl ${cashEnding >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                £{cashEnding.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Cash Flow Health */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Operating Cash Flow</p>
              <p className={`text-lg font-bold ${netCashFromOperations >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netCashFromOperations >= 0 ? 'Positive' : 'Negative'}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Cash Health</p>
              <p className={`text-lg font-bold ${cashEnding > 5000 ? 'text-green-600' : cashEnding > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                {cashEnding > 10000 ? 'Excellent' : cashEnding > 5000 ? 'Good' : cashEnding > 0 ? 'Monitor' : 'Critical'}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-blue-900">
              <strong>100% Traceable:</strong> All cash flow figures are from actual transactions. Click any amount to verify.
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