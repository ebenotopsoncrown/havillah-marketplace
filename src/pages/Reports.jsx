import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, DollarSign, Package } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { subDays, format } from "date-fns";

import ProfitLossStatement from "../components/reports/ProfitLossStatement";
import BalanceSheet from "../components/reports/BalanceSheet";
import CashFlowStatement from "../components/reports/CashFlowStatement";
import ExpenseAnalysis from "../components/reports/ExpenseAnalysis";

export default function Reports() {
  const [dateRange, setDateRange] = useState('30days');

  const { data: sales = [] } = useQuery({
    queryKey: ['sales'],
    queryFn: () => base44.entities.Sale.list('-sale_date'),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: () => base44.entities.Order.list(),
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list(),
  });

  const { data: saleItems = [] } = useQuery({
    queryKey: ['sale-items'],
    queryFn: () => base44.entities.SaleItem.list(),
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => base44.entities.Expense.list('-expense_date'),
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list(),
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => base44.entities.Supplier.list(),
  });

  const { data: purchaseOrders = [] } = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: () => base44.entities.PurchaseOrder.list(),
  });

  // Calculate date range
  const endDate = new Date();
  const startDate = dateRange === '30days' 
    ? subDays(endDate, 30) 
    : dateRange === '90days' 
    ? subDays(endDate, 90) 
    : subDays(endDate, 365);

  // Filter data by date range
  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.sale_date);
    return saleDate >= startDate && saleDate <= endDate;
  });

  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.order_date);
    return orderDate >= startDate && orderDate <= endDate && order.status !== 'cancelled';
  });

  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.expense_date);
    return expenseDate >= startDate && expenseDate <= endDate;
  });

  // Calculate key metrics (combining POS sales and online orders)
  const salesRevenue = filteredSales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
  const ordersRevenue = filteredOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const totalRevenue = salesRevenue + ordersRevenue;
  const totalTransactions = filteredSales.length + filteredOrders.length;
  const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  const inventoryValue = products.reduce((sum, product) => {
    return sum + ((product.stock_quantity || 0) * (product.cost_price || 0));
  }, 0);

  // Sales trend data (last 30 days) - combining POS and online orders
  const salesTrendData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const daySales = sales.filter(sale => 
      format(new Date(sale.sale_date), 'yyyy-MM-dd') === dateStr
    );
    const dayOrders = orders.filter(order => 
      format(new Date(order.order_date), 'yyyy-MM-dd') === dateStr && order.status !== 'cancelled'
    );
    const salesRevenue = daySales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
    const ordersRevenue = dayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    return {
      date: format(date, 'MMM dd'),
      revenue: salesRevenue + ordersRevenue,
      transactions: daySales.length + dayOrders.length
    };
  });

  // Top products by revenue
  const productRevenue = {};
  saleItems.forEach(item => {
    const productId = item.product_id;
    if (!productRevenue[productId]) {
      productRevenue[productId] = {
        name: item.product_name,
        revenue: 0,
        quantity: 0
      };
    }
    productRevenue[productId].revenue += item.line_total || 0;
    productRevenue[productId].quantity += item.quantity || 0;
  });

  const topProducts = Object.values(productRevenue)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Payment method distribution (combining POS sales and online orders)
  const paymentMethods = sales.reduce((acc, sale) => {
    const method = sale.payment_method || 'unknown';
    acc[method] = (acc[method] || 0) + (sale.total_amount || 0);
    return acc;
  }, {});
  
  orders.filter(o => o.status !== 'cancelled').forEach(order => {
    const method = order.payment_method || 'unknown';
    paymentMethods[method] = (paymentMethods[method] || 0) + (order.total_amount || 0);
  });

  const paymentData = Object.entries(paymentMethods).map(([method, amount]) => ({
    name: method.charAt(0).toUpperCase() + method.slice(1),
    value: amount
  }));

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive financial statements and performance insights</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setDateRange('30days')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === '30days' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setDateRange('90days')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === '90days' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              90 Days
            </button>
            <button
              onClick={() => setDateRange('365days')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === '365days' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              1 Year
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-indigo-600">£{totalRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{totalTransactions}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Avg Transaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">£{avgTransaction.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Inventory Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">£{inventoryValue.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Reports */}
        <Tabs defaultValue="financial" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="financial">Financial Statements</TabsTrigger>
            <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
            <TabsTrigger value="expenses">Expense Analysis</TabsTrigger>
            <TabsTrigger value="products">Product Performance</TabsTrigger>
            <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          </TabsList>

          {/* Financial Statements Tab */}
          <TabsContent value="financial" className="space-y-6">
            <ProfitLossStatement 
              sales={filteredSales}
              orders={filteredOrders}
              expenses={filteredExpenses}
              startDate={startDate}
              endDate={endDate}
            />
            <BalanceSheet 
              products={products}
              customers={customers}
              suppliers={suppliers}
              sales={filteredSales}
              orders={filteredOrders}
              expenses={filteredExpenses}
              asOfDate={endDate}
            />
            <CashFlowStatement 
              sales={filteredSales}
              orders={filteredOrders}
              expenses={filteredExpenses}
              purchaseOrders={purchaseOrders}
              startDate={startDate}
              endDate={endDate}
            />
          </TabsContent>

          {/* Sales Analytics Tab */}
          <TabsContent value="sales" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="border-b">
                <CardTitle>Sales Trend - Last 30 Days</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} name="Revenue (£)" />
                    <Line type="monotone" dataKey="transactions" stroke="#10B981" strokeWidth={2} name="Transactions" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expense Analysis Tab */}
          <TabsContent value="expenses">
            <ExpenseAnalysis expenses={filteredExpenses} />
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="border-b">
                <CardTitle>Top 10 Products by Revenue</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={topProducts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#4F46E5" name="Revenue (£)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="border-b">
                <CardTitle>Payment Method Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `£${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}