import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import AdminGuard from "../components/AdminGuard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Banknote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

import ExpenseFormModal from "../components/expenses/ExpenseFormModal";

export default function Expenses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const queryClient = useQueryClient();

  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => base44.entities.Expense.list('-expense_date'),
  });

  const createExpenseMutation = useMutation({
    mutationFn: (data) => base44.entities.Expense.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setShowForm(false);
      setEditingExpense(null);
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Expense.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setShowForm(false);
      setEditingExpense(null);
    },
  });

  const filteredExpenses = expenses.filter(expense =>
    searchTerm === "" ||
    expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.paid_to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.expense_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (data) => {
    if (editingExpense) {
      updateExpenseMutation.mutate({ id: editingExpense.id, data });
    } else {
      createExpenseMutation.mutate(data);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const paidExpenses = expenses.filter(e => e.status === 'paid').reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const pendingExpenses = expenses.filter(e => e.status === 'pending').reduce((sum, exp) => sum + (exp.amount || 0), 0);

  // Get current month expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.expense_date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  }).reduce((sum, exp) => sum + (exp.amount || 0), 0);

  return (
    <AdminGuard>
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Expenses & Payments</h1>
            <p className="text-gray-600">Track operational expenses and overhead costs</p>
          </div>
          <Button
            onClick={() => {
              setEditingExpense(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Record Expense
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">£{totalExpenses.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">£{paidExpenses.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">£{pendingExpenses.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-indigo-600">£{monthExpenses.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Expenses Table */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Banknote className="w-5 h-5" />
                Expense Records
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Date</TableHead>
                    <TableHead>Expense #</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Paid To</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                        <Banknote className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No expenses recorded</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <TableRow key={expense.id} className="hover:bg-gray-50">
                        <TableCell>{format(new Date(expense.expense_date), 'dd MMM yyyy')}</TableCell>
                        <TableCell className="font-mono text-sm">{expense.expense_number}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {expense.category.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{expense.paid_to}</TableCell>
                        <TableCell className="font-semibold">£{expense.amount?.toFixed(2)}</TableCell>
                        <TableCell className="capitalize">{expense.payment_method?.replace('_', ' ')}</TableCell>
                        <TableCell>
                          <Badge
                            variant={expense.status === 'paid' ? 'default' : 'secondary'}
                            className={expense.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
                          >
                            {expense.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(expense)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <ExpenseFormModal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingExpense(null);
        }}
        expense={editingExpense}
        onSave={handleSave}
        processing={createExpenseMutation.isPending || updateExpenseMutation.isPending}
      />
    </div>
  );
}