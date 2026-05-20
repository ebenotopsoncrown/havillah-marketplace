import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingDown } from "lucide-react";

export default function ExpenseAnalysis({ expenses }) {
  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category || 'other';
    if (!acc[category]) {
      acc[category] = { total: 0, count: 0, paid: 0, pending: 0 };
    }
    acc[category].total += expense.amount || 0;
    acc[category].count += 1;
    if (expense.status === 'paid') {
      acc[category].paid += expense.amount || 0;
    } else {
      acc[category].pending += expense.amount || 0;
    }
    return acc;
  }, {});

  const categoryLabels = {
    rent: 'Rent',
    utilities: 'Utilities',
    salaries: 'Salaries',
    transport: 'Transport',
    marketing: 'Marketing',
    supplies: 'Supplies',
    maintenance: 'Maintenance',
    insurance: 'Insurance',
    tax: 'Tax',
    other: 'Other'
  };

  // Prepare data for charts
  const pieData = Object.entries(expensesByCategory).map(([category, data]) => ({
    name: categoryLabels[category] || category,
    value: data.total,
    percentage: 0 // Will calculate below
  }));

  const totalExpenses = pieData.reduce((sum, item) => sum + item.value, 0);
  pieData.forEach(item => {
    item.percentage = totalExpenses > 0 ? ((item.value / totalExpenses) * 100).toFixed(1) : 0;
  });

  // Sort by value for bar chart
  const barData = [...pieData].sort((a, b) => b.value - a.value);

  // Colors for categories
  const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#06B6D4', '#6B7280'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label if less than 5%

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12" fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Payment status summary
  const totalPaid = expenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalPending = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">£{totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">£{totalPaid.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">£{totalPending.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-indigo-600">{Object.keys(expensesByCategory).length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              Expense Distribution by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `£${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No expense data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle>Expense Breakdown by Category</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip formatter={(value) => `£${value.toFixed(2)}`} />
                  <Bar dataKey="value" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No expense data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Details Table */}
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Amount</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Paid</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Pending</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Transactions</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(expensesByCategory)
                  .sort(([, a], [, b]) => b.total - a.total)
                  .map(([category, data], index) => (
                    <tr key={category} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{categoryLabels[category] || category}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 font-semibold">£{data.total.toFixed(2)}</td>
                      <td className="text-right py-3 px-4 text-green-600">£{data.paid.toFixed(2)}</td>
                      <td className="text-right py-3 px-4 text-orange-600">£{data.pending.toFixed(2)}</td>
                      <td className="text-right py-3 px-4">{data.count}</td>
                      <td className="text-right py-3 px-4 font-semibold text-indigo-600">
                        {((data.total / totalExpenses) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}