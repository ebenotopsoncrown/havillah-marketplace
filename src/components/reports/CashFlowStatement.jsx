import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, ArrowRightLeft } from "lucide-react";
import { format } from "date-fns";

export default function CashFlowStatement({ sales, expenses, purchaseOrders, startDate, endDate }) {
  // OPERATING ACTIVITIES
  const cashFromSales = sales
    .filter(sale => sale.payment_method !== 'account') // Exclude credit sales
    .reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
  
  const cashPaidForExpenses = expenses
    .filter(exp => exp.status === 'paid')
    .reduce((sum, exp) => sum + (exp.amount || 0), 0);
  
  const netCashFromOperations = cashFromSales - cashPaidForExpenses;
  
  // INVESTING ACTIVITIES
  // Placeholder - equipment purchases, asset sales, etc.
  const equipmentPurchases = 0;
  const assetSales = 0;
  const netCashFromInvesting = assetSales - equipmentPurchases;
  
  // FINANCING ACTIVITIES
  // Placeholder - loans, owner investments, withdrawals
  const loansReceived = 0;
  const loanRepayments = 0;
  const ownerInvestments = 0;
  const ownerWithdrawals = 0;
  const netCashFromFinancing = loansReceived + ownerInvestments - loanRepayments - ownerWithdrawals;
  
  // NET CHANGE IN CASH
  const netCashChange = netCashFromOperations + netCashFromInvesting + netCashFromFinancing;
  
  // CASH POSITIONS (simplified)
  const cashBeginning = 10000; // Placeholder
  const cashEnding = cashBeginning + netCashChange;

  return (
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
            <div className="flex justify-between items-center py-1 px-4 text-gray-700 hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span>Cash received from customers</span>
              </div>
              <span className="text-green-600 font-medium">£{cashFromSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-1 px-4 text-gray-700 hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span>Cash paid for expenses</span>
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

        {/* Investing Activities */}
        <div>
          <div className="flex items-center gap-2 py-3 border-b-2 border-purple-300 bg-purple-50 px-4 rounded-t-lg">
            <Building2 className="w-5 h-5 text-purple-600" />
            <span className="font-bold text-lg text-purple-900">Cash Flow from Investing Activities</span>
          </div>
          <div className="space-y-2 py-3">
            {equipmentPurchases > 0 && (
              <div className="flex justify-between items-center py-1 px-4 text-gray-700 hover:bg-gray-50">
                <span>Purchase of equipment</span>
                <span className="text-red-600">-£{equipmentPurchases.toFixed(2)}</span>
              </div>
            )}
            {assetSales > 0 && (
              <div className="flex justify-between items-center py-1 px-4 text-gray-700 hover:bg-gray-50">
                <span>Sale of assets</span>
                <span className="text-green-600">£{assetSales.toFixed(2)}</span>
              </div>
            )}
            {equipmentPurchases === 0 && assetSales === 0 && (
              <div className="py-2 px-4 text-gray-500 text-sm italic">
                No investing activities this period
              </div>
            )}
          </div>
          <div className="flex justify-between items-center py-2 px-4 bg-purple-100 border-t border-purple-200 rounded-b-lg">
            <span className="font-semibold text-purple-900">Net Cash from Investing</span>
            <span className={`font-bold ${netCashFromInvesting >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              £{netCashFromInvesting.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Financing Activities */}
        <div>
          <div className="flex items-center gap-2 py-3 border-b-2 border-orange-300 bg-orange-50 px-4 rounded-t-lg">
            <CreditCard className="w-5 h-5 text-orange-600" />
            <span className="font-bold text-lg text-orange-900">Cash Flow from Financing Activities</span>
          </div>
          <div className="space-y-2 py-3">
            {loansReceived > 0 && (
              <div className="flex justify-between items-center py-1 px-4 text-gray-700 hover:bg-gray-50">
                <span>Loans received</span>
                <span className="text-green-600">£{loansReceived.toFixed(2)}</span>
              </div>
            )}
            {ownerInvestments > 0 && (
              <div className="flex justify-between items-center py-1 px-4 text-gray-700 hover:bg-gray-50">
                <span>Owner investments</span>
                <span className="text-green-600">£{ownerInvestments.toFixed(2)}</span>
              </div>
            )}
            {loanRepayments > 0 && (
              <div className="flex justify-between items-center py-1 px-4 text-gray-700 hover:bg-gray-50">
                <span>Loan repayments</span>
                <span className="text-red-600">-£{loanRepayments.toFixed(2)}</span>
              </div>
            )}
            {ownerWithdrawals > 0 && (
              <div className="flex justify-between items-center py-1 px-4 text-gray-700 hover:bg-gray-50">
                <span>Owner withdrawals</span>
                <span className="text-red-600">-£{ownerWithdrawals.toFixed(2)}</span>
              </div>
            )}
            {loansReceived === 0 && ownerInvestments === 0 && loanRepayments === 0 && ownerWithdrawals === 0 && (
              <div className="py-2 px-4 text-gray-500 text-sm italic">
                No financing activities this period
              </div>
            )}
          </div>
          <div className="flex justify-between items-center py-2 px-4 bg-orange-100 border-t border-orange-200 rounded-b-lg">
            <span className="font-semibold text-orange-900">Net Cash from Financing</span>
            <span className={`font-bold ${netCashFromFinancing >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              £{netCashFromFinancing.toFixed(2)}
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
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Operating Cash Flow</p>
            <p className={`text-lg font-bold ${netCashFromOperations >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netCashFromOperations >= 0 ? 'Positive' : 'Negative'}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Cash Runway</p>
            <p className="text-lg font-bold text-gray-900">
              {cashPaidForExpenses > 0 ? Math.floor(cashEnding / (cashPaidForExpenses / 30)) : '∞'}
            </p>
            <p className="text-xs text-gray-500">days</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Cash Health</p>
            <p className={`text-lg font-bold ${cashEnding > 5000 ? 'text-green-600' : 'text-orange-600'}`}>
              {cashEnding > 10000 ? 'Excellent' : cashEnding > 5000 ? 'Good' : 'Monitor'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const Building2 = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const CreditCard = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);