import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, Sparkles, CheckCircle, AlertCircle } from "lucide-react";

export default function ProductURLScraper({ onProductExtracted }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const extractProductDetails = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const prompt = `Extract product information from this URL: ${url}

Please provide the following details in JSON format:
- name: Product name
- description: Product description
- brand: Brand name (if available)
- retail_price: Selling price (numeric value only, without currency symbols)
- cost_price: Cost price if mentioned (numeric value only)
- category: Product category
- unit_type: Unit of measurement (piece, kg, litre, pack, carton, box)
- image_url: Main product image URL (full URL)
- specifications: Any key specifications or features

Only return valid JSON. If information is not available, use null for that field.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            brand: { type: "string" },
            retail_price: { type: "number" },
            cost_price: { type: "number" },
            category: { type: "string" },
            unit_type: { type: "string" },
            image_url: { type: "string" },
            specifications: { type: "string" }
          }
        }
      });

      if (response && response.name) {
        // Calculate suggested cost price if not provided (assume 40% margin)
        if (!response.cost_price && response.retail_price) {
          response.cost_price = response.retail_price * 0.6;
        }

        // Set default unit_type if not provided
        if (!response.unit_type) {
          response.unit_type = 'piece';
        }

        onProductExtracted(response);
        setSuccess(true);
        setUrl('');
        
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Could not extract product details. Please check the URL or enter details manually.');
      }
    } catch (err) {
      console.error('Error extracting product:', err);
      setError('Failed to extract product details. Please try again or enter manually.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <Label className="text-lg font-semibold text-purple-900">
          Auto-Fill from Product URL
        </Label>
      </div>
      <p className="text-sm text-gray-600">
        Paste a product URL from any online store to automatically extract details and images
      </p>

      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="https://example-store.com/product/item-name"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            className="h-11"
          />
        </div>
        <Button
          onClick={extractProductDetails}
          disabled={loading || !url.trim()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Extracting...
            </>
          ) : (
            <>
              <Link className="w-4 h-4 mr-2" />
              Extract Details
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Product details extracted successfully! Review and save below.
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-white rounded-lg p-3 border">
        <p className="text-xs text-gray-500 flex items-start gap-2">
          <span>💡</span>
          <span>
            <strong>Tip:</strong> This works with most online stores including Amazon, eBay, African stores, and more. 
            The AI will extract product name, description, price, images, and other details automatically.
          </span>
        </p>
      </div>
    </div>
  );
}