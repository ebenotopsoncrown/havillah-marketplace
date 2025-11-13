import React from 'react';
import { Card } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

export default function StatsCard({ title, value, icon: Icon, trend, bgColor }) {
  return (
    <Card className="relative overflow-hidden bg-white border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${bgColor} opacity-10 rounded-full transform translate-x-16 -translate-y-16`} />
      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${bgColor} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4" />
              {trend}
            </div>
          )}
        </div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </Card>
  );
}