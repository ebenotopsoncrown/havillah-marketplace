import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Package, ShoppingCart, Users } from "lucide-react";

import StatsCard from "../components/dashboard/StatsCard";
import RecentSales from "../components/dashboard/RecentSales";
import TopProducts from "../components/dashboard/TopProducts";
import LowStockAlert from "../components/dashboard/LowStockAlert";
import SalesChart from "../components/dashboard/SalesChart";
import TransactionDrilldownModal from "../components/reports/TransactionDrilldownModal";

export default function Dashboard() {
  const [drilldownModal, setDrilldownModal] = useState({ open: false, title: '', transactions: [], type: '' });

  const { data: sales = [] } = useQuery({
    queryKey: ['sales'],
    queryFn: () => base44.entities.Sale.list('-created_date', 100),
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list(),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 50),
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list(),
  });

  // Today's sales
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.created_date);
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  });

  // Calculate from actual transactions
  const totalRevenue = todaySales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
  const activeOrders = orders.filter(o => o.status !== 'cancelled' && o.status !== 'delivered');
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const productsInStock = products.filter(p => (p.stock_quantity || 0) > 0);
  const inventoryValue = productsInStock.reduce((sum, p) => sum + ((p.stock_quantity || 0) * (p.cost_price || 0)), 0);

  const showDrilldown = (title, transactions, type) => {
    setDrilldownModal({ open: true, title, transactions, type });
  };

  return (
    <>
      <div className="p-6 lg:p-8 bg-gradient-to-br from-[#FAFAF9] to-gray-50 min-h-screen">
        <div className="max-w-[1600px] mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Dashboard</h1>
            <p className="text-gray-600">Real-time overview of your retail operations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Today's Revenue"
              value={`£${totalRevenue.toFixed(2)}`}
              icon={TrendingUp}
              trend={`${todaySales.length} sales today`}
              bgColor="from-indigo-500 to-indigo-600"
              transactions={todaySales}
              transactionType="sales"
            />
            <StatsCard
              title="Total Sales"
              value={todaySales.length}
              icon={ShoppingCart}
              trend={`${sales.length} all-time`}
              bgColor="from-green-500 to-green-600"
              transactions={todaySales}
              transactionType="sales"
            />
            <StatsCard
              title="Active Orders"
              value={activeOrders.length}
              icon={Package}
              trend={`${pendingOrders.length} pending`}
              bgColor="from-purple-500 to-purple-600"
              onClick={() => showDrilldown('Active Orders', activeOrders, 'orders')}
            />
            <StatsCard
              title="Inventory Value"
              value={`£${inventoryValue.toFixed(0)}`}
              icon={Users}
              trend={`${productsInStock.length} products in stock`}
              bgColor="from-orange-500 to-orange-600"
              transactions={productsInStock}
              transactionType="inventory"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SalesChart sales={sales} />
            </div>
            <div>
              <LowStockAlert products={products.filter(p => p.stock_quantity <= (p.reorder_level || 10))} />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <RecentSales sales={todaySales} />
            <TopProducts sales={sales} products={products} />
          </div>
        </div>
      </div>

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