import React from 'react';
import { Store, Clock } from "lucide-react";

export default function POSHeader() {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Coriander POS</h1>
            <p className="text-sm text-indigo-200">Terminal 1 • Cashier: Admin User</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-indigo-100">
          <Clock className="w-5 h-5" />
          <div className="text-right">
            <p className="font-semibold">{currentTime.toLocaleTimeString()}</p>
            <p className="text-sm">{currentTime.toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}