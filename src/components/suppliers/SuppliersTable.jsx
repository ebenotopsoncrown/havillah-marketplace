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
import { Pencil, TruckIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SuppliersTable({ suppliers, isLoading, onEdit }) {
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
            <TableHead>Supplier Code</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Payment Terms</TableHead>
            <TableHead>Account Balance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                <TruckIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No suppliers found</p>
              </TableCell>
            </TableRow>
          ) : (
            suppliers.map((supplier) => (
              <TableRow key={supplier.id} className="hover:bg-gray-50">
                <TableCell className="font-mono font-medium">{supplier.supplier_code}</TableCell>
                <TableCell className="font-medium">{supplier.company_name}</TableCell>
                <TableCell>{supplier.contact_name}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {supplier.payment_terms || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={supplier.account_balance > 0 ? "text-orange-600 font-semibold" : ""}>
                    £{supplier.account_balance?.toFixed(2) || '0.00'}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={supplier.is_active ? "default" : "secondary"}>
                    {supplier.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(supplier)}
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