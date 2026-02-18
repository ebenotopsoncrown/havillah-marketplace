import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import AdminGuard from "../components/AdminGuard";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search, Receipt, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Sales() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: () => base44.entities.Sale.list('-created_date'),
  });

  const { data: saleItems = [] } = useQuery({
    queryKey: ['sale-items'],
    queryFn: () => base44.entities.SaleItem.list(),
  });

  const filteredSales = sales.filter(sale =>
    searchTerm === "" ||
    sale.sale_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.created_date);
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  });
  const todayRevenue = todaySales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);

  const getSaleItems = (saleId) => {
    return saleItems.filter(item => item.sale_id === saleId);
  };

  return (
    <AdminGuard>
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales History</h1>
          <p className="text-gray-600">View and manage all POS transactions</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{sales.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-indigo-600">£{totalRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Today's Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{todaySales.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Today's Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">£{todayRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by receipt number or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6">
                {Array(8).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-16 mb-4" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Receipt #</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead>VAT</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Cashier</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                          <Receipt className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No sales transactions found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSales.map((sale) => (
                        <TableRow 
                          key={sale.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedSale(sale)}
                        >
                          <TableCell className="font-mono font-medium">{sale.sale_number}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{format(new Date(sale.created_date), 'dd MMM yyyy')}</p>
                              <p className="text-sm text-gray-500">{format(new Date(sale.created_date), 'HH:mm:ss')}</p>
                            </div>
                          </TableCell>
                          <TableCell>{sale.customer_name || 'Walk-in'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {sale.payment_method}
                            </Badge>
                          </TableCell>
                          <TableCell>£{sale.subtotal?.toFixed(2)}</TableCell>
                          <TableCell>£{sale.vat_amount?.toFixed(2)}</TableCell>
                          <TableCell className="font-bold">£{sale.total_amount?.toFixed(2)}</TableCell>
                          <TableCell>{sale.cashier_name}</TableCell>
                          <TableCell>
                            <Badge variant={sale.status === 'completed' ? 'default' : 'destructive'}>
                              {sale.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedSale && (
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Sale Details</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{selectedSale.sale_number}</p>
                </div>
                <Button variant="outline" onClick={() => setSelectedSale(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-3">Transaction Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{format(new Date(selectedSale.created_date), 'dd MMM yyyy HH:mm')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cashier:</span>
                      <span className="font-medium">{selectedSale.cashier_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Terminal:</span>
                      <span className="font-medium">{selectedSale.terminal_id}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Payment Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-medium capitalize">{selectedSale.payment_method}</span>
                    </div>
                    {selectedSale.cash_paid > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cash Paid:</span>
                          <span className="font-medium">£{selectedSale.cash_paid?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Change:</span>
                          <span className="font-medium">£{selectedSale.change_given?.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Items Sold</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getSaleItems(selectedSale.id).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.product_name}</TableCell>
                        <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>£{item.unit_price?.toFixed(2)}</TableCell>
                        <TableCell className="font-semibold">£{item.line_total?.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="space-y-2 max-w-md ml-auto">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">£{selectedSale.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT:</span>
                    <span className="font-medium">£{selectedSale.vat_amount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-indigo-600">£{selectedSale.total_amount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}