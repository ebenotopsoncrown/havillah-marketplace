import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MousePointer } from "lucide-react";
import TransactionDrilldownModal from "../reports/TransactionDrilldownModal";

export default function StatsCard({ title, value, icon: Icon, trend, bgColor, transactions, transactionType, onClick }) {
  const [showDrilldown, setShowDrilldown] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (transactions) {
      setShowDrilldown(true);
    }
  };

  return (
    <>
      <Card 
        className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group" 
        onClick={handleClick}
      >
        <CardContent className="p-0">
          <div className={`bg-gradient-to-r ${bgColor} p-6 text-white relative`}>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <MousePointer className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium opacity-90">{title}</p>
              <p className="text-3xl font-bold mt-1">{value}</p>
              {trend && (
                <p className="text-sm mt-2 opacity-80">{trend}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {transactions && transactionType && (
        <TransactionDrilldownModal
          open={showDrilldown}
          onClose={() => setShowDrilldown(false)}
          title={`${title} - Transactions`}
          transactions={transactions}
          type={transactionType}
        />
      )}
    </>
  );
}