import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, FileText, Copy, Check } from "lucide-react";
import CorianderLogo, { LetterheadLogo, DocumentFooter } from "../components/branding/CorianderLogo";

export default function BrandAssets() {
  const [copied, setCopied] = React.useState(false);
  const letterheadRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const copyColors = () => {
    const colors = `Primary Green: #166534\nAccent Gold: #B45309\nText Dark: #1F2937`;
    navigator.clipboard.writeText(colors);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Brand Assets & Logo</h1>
            <p className="text-gray-600">Official logos and branding materials for business use</p>
          </div>
          <Button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700">
            <Printer className="w-4 h-4 mr-2" />
            Print Assets
          </Button>
        </div>

        {/* Logo Variants */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle>Logo Variants</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Full Logo */}
              <div className="text-center">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-3 flex items-center justify-center min-h-[140px]">
                  <CorianderLogo variant="full" size="medium" />
                </div>
                <p className="text-sm font-medium text-gray-700">Full Logo</p>
                <p className="text-xs text-gray-500">Primary use</p>
              </div>

              {/* Horizontal */}
              <div className="text-center">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-3 flex items-center justify-center min-h-[140px]">
                  <CorianderLogo variant="horizontal" size="medium" />
                </div>
                <p className="text-sm font-medium text-gray-700">Horizontal</p>
                <p className="text-xs text-gray-500">Headers & documents</p>
              </div>

              {/* Stacked */}
              <div className="text-center">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-3 flex items-center justify-center min-h-[140px]">
                  <CorianderLogo variant="stacked" size="medium" />
                </div>
                <p className="text-sm font-medium text-gray-700">Stacked</p>
                <p className="text-xs text-gray-500">Social media & signage</p>
              </div>

              {/* Icon Only */}
              <div className="text-center">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-3 flex items-center justify-center min-h-[140px]">
                  <CorianderLogo variant="icon" size="large" />
                </div>
                <p className="text-sm font-medium text-gray-700">Icon Only</p>
                <p className="text-xs text-gray-500">Favicon & app icons</p>
              </div>
            </div>

            {/* Dark Mode Variants */}
            <div className="mt-10 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-6">Dark Background Variants</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-gray-900 border-2 border-gray-700 rounded-xl p-6 mb-3 flex items-center justify-center min-h-[140px]">
                    <CorianderLogo variant="full" size="medium" darkMode />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Full (Dark)</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-900 border-2 border-gray-700 rounded-xl p-6 mb-3 flex items-center justify-center min-h-[140px]">
                    <CorianderLogo variant="horizontal" size="medium" darkMode />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Horizontal (Dark)</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-900 border-2 border-gray-700 rounded-xl p-6 mb-3 flex items-center justify-center min-h-[140px]">
                    <CorianderLogo variant="stacked" size="medium" darkMode />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Stacked (Dark)</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-900 border-2 border-gray-700 rounded-xl p-6 mb-3 flex items-center justify-center min-h-[140px]">
                    <CorianderLogo variant="icon" size="large" darkMode />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Icon (Dark)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Size Variations */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle>Size Variations</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-wrap items-end gap-8">
              <div className="text-center">
                <CorianderLogo variant="horizontal" size="small" />
                <p className="text-xs text-gray-500 mt-2">Small</p>
              </div>
              <div className="text-center">
                <CorianderLogo variant="horizontal" size="medium" />
                <p className="text-xs text-gray-500 mt-2">Medium</p>
              </div>
              <div className="text-center">
                <CorianderLogo variant="horizontal" size="large" />
                <p className="text-xs text-gray-500 mt-2">Large</p>
              </div>
              <div className="text-center">
                <CorianderLogo variant="horizontal" size="xlarge" />
                <p className="text-xs text-gray-500 mt-2">X-Large</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Colors */}
        <Card className="shadow-lg">
          <CardHeader className="border-b flex flex-row items-center justify-between">
            <CardTitle>Brand Colors</CardTitle>
            <Button variant="outline" size="sm" onClick={copyColors}>
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy Colors'}
            </Button>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="h-24 rounded-lg bg-[#166534] mb-3 shadow-md"></div>
                <p className="font-semibold text-gray-900">Primary Green</p>
                <p className="text-sm text-gray-600">#166534</p>
                <p className="text-xs text-gray-500">RGB: 22, 101, 52</p>
              </div>
              <div>
                <div className="h-24 rounded-lg bg-[#B45309] mb-3 shadow-md"></div>
                <p className="font-semibold text-gray-900">Accent Gold</p>
                <p className="text-sm text-gray-600">#B45309</p>
                <p className="text-xs text-gray-500">RGB: 180, 83, 9</p>
              </div>
              <div>
                <div className="h-24 rounded-lg bg-[#1F2937] mb-3 shadow-md"></div>
                <p className="font-semibold text-gray-900">Text Dark</p>
                <p className="text-sm text-gray-600">#1F2937</p>
                <p className="text-xs text-gray-500">RGB: 31, 41, 55</p>
              </div>
              <div>
                <div className="h-24 rounded-lg bg-[#15803D] mb-3 shadow-md"></div>
                <p className="font-semibold text-gray-900">Secondary Green</p>
                <p className="text-sm text-gray-600">#15803D</p>
                <p className="text-xs text-gray-500">RGB: 21, 128, 61</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Letterhead Preview */}
        <Card className="shadow-lg" ref={letterheadRef}>
          <CardHeader className="border-b flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Letterhead Template
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 shadow-inner">
              <LetterheadLogo />
              
              <div className="mt-12 space-y-4 text-gray-700">
                <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="mt-6">Dear Valued Customer,</p>
                <p className="text-gray-600 leading-relaxed">
                  This is a sample letterhead template for official business correspondence. 
                  The header includes our company logo, address, and contact information in a 
                  professional layout suitable for invoices, quotes, and formal letters.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                  quis nostrud exercitation ullamco laboris.
                </p>
                <div className="mt-8">
                  <p>Kind regards,</p>
                  <p className="mt-4 font-semibold">The Coriander Team</p>
                </div>
              </div>

              <DocumentFooter />
            </div>
          </CardContent>
        </Card>

        {/* Usage Guidelines */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle>Usage Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-green-700 mb-3">✓ Do</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Use the horizontal logo for document headers</li>
                  <li>• Maintain clear space around the logo</li>
                  <li>• Use dark mode logo on dark backgrounds</li>
                  <li>• Keep the logo proportions consistent</li>
                  <li>• Use official brand colors only</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-700 mb-3">✗ Don't</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Stretch or distort the logo</li>
                  <li>• Change the logo colors</li>
                  <li>• Add effects like shadows or gradients</li>
                  <li>• Place logo on busy backgrounds</li>
                  <li>• Use low-resolution versions for print</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
        }
      `}</style>
    </div>
  );
}