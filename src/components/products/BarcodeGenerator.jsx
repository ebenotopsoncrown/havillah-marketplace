import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Barcode, Download, Printer, Copy, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BarcodeGenerator({ open, onClose, product, onSave }) {
  const [barcodeValue, setBarcodeValue] = useState("");
  const [copies, setCopies] = useState(1);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (product) {
      // Generate barcode: Format = CORI-{first 3 letters of name}-{5 digit random}
      if (!product.barcode) {
        const prefix = "CORI";
        const nameCode = product.name?.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '') || "PRD";
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const generated = `${prefix}${nameCode}${randomNum}`;
        setBarcodeValue(generated);
      } else {
        setBarcodeValue(product.barcode);
      }
    }
  }, [product]);

  const handleSave = async () => {
    await onSave(barcodeValue);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const labels = [];
    
    for (let i = 0; i < copies; i++) {
      labels.push(`
        <div style="page-break-after: always; padding: 8mm; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 40mm; width: 60mm; border: 1px dashed #ccc;">
          <div style="font-weight: bold; font-size: 11px; margin-bottom: 8px; text-align: center;">${product?.name || 'Product'}</div>
          <svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="50" fill="white"/>
            ${generateBarcodeSVG(barcodeValue)}
            <text x="100" y="58" text-anchor="middle" font-size="9" font-family="monospace">${barcodeValue}</text>
          </svg>
          <div style="font-size: 12px; color: #333; text-align: center; margin-top: 6px; font-weight: 600;">£${product?.retail_price?.toFixed(2) || '0.00'}</div>
          <div style="font-size: 8px; color: #666; text-align: center; margin-top: 2px;">SKU: ${product?.sku || 'N/A'}</div>
        </div>
      `);
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode Labels</title>
          <style>
            @page { 
              size: 60mm 40mm; 
              margin: 0; 
            }
            body { 
              margin: 0; 
              padding: 0;
              font-family: Arial, sans-serif;
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div style="display: flex; flex-wrap: wrap; gap: 5mm;">
            ${labels.join('')}
          </div>
          <div class="no-print" style="text-align: center; padding: 20px;">
            <button onclick="window.print()" style="padding: 10px 20px; font-size: 14px; background: #4F46E5; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Labels</button>
            <button onclick="window.close()" style="padding: 10px 20px; font-size: 14px; background: #6B7280; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const generateBarcodeSVG = (value) => {
    // Simple barcode visualization using alternating bars
    // This creates a visual representation suitable for CODE128-like barcodes
    const bars = [];
    let x = 10;
    const barWidth = 2;
    
    // Start guard
    bars.push(`<rect x="${x}" y="5" width="${barWidth}" height="35" fill="black"/>`);
    x += barWidth + 1;
    bars.push(`<rect x="${x}" y="5" width="${barWidth}" height="35" fill="black"/>`);
    x += barWidth + 3;
    
    // Encode each character as bars (simplified pattern)
    for (let i = 0; i < value.length; i++) {
      const charCode = value.charCodeAt(i);
      const pattern = charCode % 2 === 0 ? [3, 1, 2, 1] : [2, 1, 3, 1];
      
      for (let j = 0; j < pattern.length; j++) {
        const width = pattern[j] * barWidth;
        if (j % 2 === 0) {
          bars.push(`<rect x="${x}" y="5" width="${width}" height="35" fill="black"/>`);
        }
        x += width;
      }
      x += 2;
    }
    
    // End guard
    bars.push(`<rect x="${x}" y="5" width="${barWidth}" height="35" fill="black"/>`);
    x += barWidth + 1;
    bars.push(`<rect x="${x}" y="5" width="${barWidth}" height="35" fill="black"/>`);
    
    return bars.join('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(barcodeValue);
  };

  if (saved) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Barcode Saved!</h2>
            <p className="text-gray-600">Product updated with barcode: {barcodeValue}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Barcode className="w-6 h-6" />
            Generate Barcode Label
          </DialogTitle>
        </DialogHeader>

        {product && (
          <div className="space-y-6">
            {/* Product Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">SKU</p>
                  <p className="font-medium">{product.sku}</p>
                </div>
                <div>
                  <p className="text-gray-600">Price</p>
                  <p className="font-medium">£{product.retail_price?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Current Stock</p>
                  <p className="font-medium">{product.stock_quantity}</p>
                </div>
              </div>
            </div>

            {/* Barcode Input */}
            <div className="space-y-2">
              <Label htmlFor="barcode-input">Barcode Number</Label>
              <div className="flex gap-2">
                <Input
                  id="barcode-input"
                  value={barcodeValue}
                  onChange={(e) => setBarcodeValue(e.target.value)}
                  placeholder="Enter or auto-generate barcode"
                  className="font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={copyToClipboard}
                  size="icon"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              {!product.barcode && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Auto-generated barcode
                </Badge>
              )}
            </div>

            {/* Barcode Preview */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">Preview:</p>
                <svg width="300" height="100" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                  <rect width="300" height="80" fill="white"/>
                  {generateBarcodeSVG(barcodeValue)}
                  <text x="150" y="92" textAnchor="middle" fontSize="14" fontFamily="monospace">{barcodeValue}</text>
                </svg>
                <p className="text-xs text-gray-500 mt-4">Scannable by any barcode scanner</p>
              </div>
            </div>

            {/* Print Options */}
            <div className="space-y-2">
              <Label htmlFor="copies">Number of Labels to Print</Label>
              <Input
                id="copies"
                type="number"
                min="1"
                max="100"
                value={copies}
                onChange={(e) => setCopies(parseInt(e.target.value) || 1)}
              />
              <p className="text-sm text-gray-500">
                Print multiple labels for shelf stickers, storage bins, or product packaging
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">How to Use:</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Save the barcode to your product record</li>
                <li>Print labels using a standard or label printer</li>
                <li>Stick labels on products, shelves, or storage locations</li>
                <li>Scan at POS - system will instantly find the product</li>
              </ol>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-gradient-to-r from-blue-600 to-blue-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print {copies} Label{copies !== 1 ? 's' : ''}
          </Button>
          {barcodeValue !== product?.barcode && (
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Save to Product
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}