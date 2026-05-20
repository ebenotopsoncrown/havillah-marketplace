import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomersTable({ customers, isLoading, onEdit }) {
  if (isLoading) {
    return (
      <div className="p-6">
        {Array(10).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-16 mb-4" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Customer Code</TableHead>
            <TableHead>Business Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Pricing Tier</TableHead>
            <TableHead>Credit Balance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No customers found</p>
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-gray-50">
                <TableCell className="font-mono font-medium">{customer.customer_code}</TableCell>
                <TableCell>
                  <p className="font-medium">{customer.business_name || '-'}</p>
                </TableCell>
                <TableCell>{customer.contact_name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {customer.customer_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className="capitalize">
                    {customer.pricing_tier}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={customer.credit_balance > 0 ? "text-orange-600 font-semibold" : ""}>
                    £{customer.credit_balance?.toFixed(2) || '0.00'}
                  </span>
                  {customer.credit_limit > 0 && (
                    <p className="text-xs text-gray-500">Limit: £{customer.credit_limit.toFixed(2)}</p>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={customer.is_active ? "default" : "secondary"}>
                    {customer.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(customer)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}