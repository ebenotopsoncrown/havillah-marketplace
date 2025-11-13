import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Download, CheckCircle, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function BulkImportModal({ open, onClose, categories, onComplete }) {
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [importing, setImporting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setError(null);

    try {
      // Upload file first
      const { file_url } = await base44.integrations.Core.UploadFile({ file: uploadedFile });

      // Define the schema for product extraction
      const productSchema = {
        type: "array",
        items: {
          type: "object",
          properties: {
            sku: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            brand: { type: "string" },
            retail_price: { type: "number" },
            wholesale_price: { type: "number" },
            cost_price: { type: "number" },
            vat_rate: { type: "number" },
            stock_quantity: { type: "number" },
            reorder_level: { type: "number" },
            category_name: { type: "string" },
            barcode: { type: "string" }
          }
        }
      };

      // Extract data using AI
      const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url: file_url,
        json_schema: productSchema
      });

      if (result.status === "success" && result.output) {
        setExtractedData(result.output);
      } else {
        setError(result.details || "Failed to extract data from file");
      }
    } catch (err) {
      setError("Error processing file. Please ensure it's a valid Excel/CSV file with product data.");
      console.error(err);
    }
  };

  const handleImport = async () => {
    if (!extractedData) return;

    setImporting(true);
    try {
      // Map category names to IDs
      const productsToImport = extractedData.map(product => {
        const category = categories.find(c => 
          c.name.toLowerCase() === product.category_name?.toLowerCase()
        );

        return {
          sku: product.sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          barcode: product.barcode || "",
          name: product.name,
          description: product.description || "",
          category_id: category?.id || "",
          brand: product.brand || "",
          retail_price: product.retail_price || 0,
          wholesale_price: product.wholesale_price || 0,
          cost_price: product.cost_price || 0,
          vat_rate: product.vat_rate || 20,
          stock_quantity: product.stock_quantity || 0,
          reorder_level: product.reorder_level || 10,
          unit_type: "piece",
          is_active: true
        };
      });

      // Bulk create products
      await base44.entities.Product.bulkCreate(productsToImport);

      setCompleted(true);
      setTimeout(() => {
        onComplete();
        handleClose();
      }, 2000);
    } catch (err) {
      setError("Error importing products. Please try again.");
      console.error(err);
    }
    setImporting(false);
  };

  const handleClose = () => {
    setFile(null);
    setExtractedData(null);
    setCompleted(false);
    setError(null);
    onClose();
  };

  const downloadTemplate = () => {
    const template = [
      ["SKU", "Name", "Description", "Brand", "Retail Price", "Wholesale Price", "Cost Price", "VAT Rate", "Stock Quantity", "Reorder Level", "Category Name", "Barcode"],
      ["RICE-001", "Basmati Rice 5kg", "Premium quality basmati rice", "Tilda", "12.99", "10.99", "8.50", "20", "100", "20", "Rice & Flour", "5012345678901"],
      ["OIL-001", "Sunflower Oil 2L", "Pure sunflower cooking oil", "KTC", "5.99", "4.99", "3.50", "20", "50", "10", "Oil & Ghee", "5012345678902"],
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_import_template.csv';
    a.click();
  };

  if (completed) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Successful!</h2>
            <p className="text-gray-600">{extractedData?.length} products imported successfully</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Bulk Import Products</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Download Template */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <FileSpreadsheet className="w-8 h-8 text-blue-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Step 1: Download Template</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Download our Excel template with sample data and required columns
                </p>
                <Button onClick={downloadTemplate} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV Template
                </Button>
              </div>
            </div>
          </div>

          {/* Upload File */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <div className="text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Step 2: Upload Your File</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload Excel (.xlsx, .xls) or CSV file with product data
              </p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
                id="bulk-upload"
              />
              <label htmlFor="bulk-upload">
                <Button asChild>
                  <span className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </span>
                </Button>
              </label>
              {file && (
                <p className="text-sm text-gray-600 mt-3">
                  Selected: <span className="font-medium">{file.name}</span>
                </p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">Import Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Preview Data */}
          {extractedData && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Step 3: Review & Import</h3>
                  <p className="text-sm text-gray-600">
                    {extractedData.length} products found. Review and click import.
                  </p>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-1">
                  {extractedData.length} items
                </Badge>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>SKU</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Retail Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Category</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {extractedData.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm">{product.sku || 'Auto'}</TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.brand}</TableCell>
                          <TableCell>£{product.retail_price?.toFixed(2)}</TableCell>
                          <TableCell>{product.stock_quantity}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category_name}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={importing}>
            Cancel
          </Button>
          {extractedData && (
            <Button
              onClick={handleImport}
              disabled={importing}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700"
            >
              {importing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Importing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Import {extractedData.length} Products
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}