import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Receipt, Package, FileText, CreditCard, ShoppingBag } from "lucide-react";

export default function TransactionDrilldownModal({ open, onClose, title, transactions, type }) {
  if (!transactions || transactions.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8 text-gray-500">
            No transactions found
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const getIcon = () => {
    switch (type) {
      case 'sales':
        return <Receipt className="w-5 h-5 text-green-600" />;
      case 'expenses':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'inventory':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'orders':
        return <ShoppingBag className="w-5 h-5 text-purple-600" />;
      case 'payments':
        return <CreditCard className="w-5 h-5 text-purple-600" />;
      default:
        return <Receipt className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTotalAmount = () => {
    if (type === 'sales') {
      return transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0);
    } else if (type === 'expenses') {
      return transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    } else if (type === 'inventory') {
      return transactions.reduce((sum, t) => sum + ((t.stock_quantity || 0) * (t.cost_price || 0)), 0);
    } else if (type === 'orders') {
      return transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0);
    }
    return 0;
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy HH:mm');
    } catch {
      return 'N/A';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-indigo-600">£{getTotalAmount().toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          {type === 'sales' && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Sale Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((sale) => (
                  <TableRow key={sale.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">{sale.sale_number}</TableCell>
                    <TableCell>{formatDate(sale.sale_date || sale.created_date)}</TableCell>
                    <TableCell>{sale.customer_name || 'Walk-in'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{sale.payment_method}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        sale.status === 'completed' ? 'bg-green-100 text-green-700' :
                        sale.status === 'returned' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {sale.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      £{(sale.total_amount || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {type === 'orders' && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Order Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Delivery Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                    <TableCell>{formatDate(order.order_date || order.created_date)}</TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.delivery_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      £{(order.total_amount || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {type === 'expenses' && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Expense Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Paid To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((expense) => (
                  <TableRow key={expense.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">{expense.expense_number}</TableCell>
                    <TableCell>{formatDate(expense.expense_date || expense.created_date)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{expense.category}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{expense.description}</TableCell>
                    <TableCell>{expense.paid_to}</TableCell>
                    <TableCell>
                      <Badge className={
                        expense.status === 'paid' ? 'bg-green-100 text-green-700' :
                        'bg-orange-100 text-orange-700'
                      }>
                        {expense.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-red-600">
                      £{(expense.amount || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {type === 'inventory' && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Stock Quantity</TableHead>
                  <TableHead>Cost Price</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>{product.stock_quantity || 0}</TableCell>
                    <TableCell>£{(product.cost_price || 0).toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold">
                      £{((product.stock_quantity || 0) * (product.cost_price || 0)).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {type === 'customers' && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Customer</TableHead>
                  <TableHead>Customer Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Credit Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{customer.business_name || customer.contact_name}</TableCell>
                    <TableCell className="font-mono text-sm">{customer.customer_code}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{customer.customer_type}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      £{(customer.credit_balance || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {type === 'suppliers' && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Supplier</TableHead>
                  <TableHead>Supplier Code</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Account Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((supplier) => (
                  <TableRow key={supplier.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{supplier.company_name}</TableCell>
                    <TableCell className="font-mono text-sm">{supplier.supplier_code}</TableCell>
                    <TableCell>{supplier.contact_name}</TableCell>
                    <TableCell className="text-right font-semibold text-red-600">
                      £{(supplier.account_balance || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}