import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, Copy, Check, QrCode, ExternalLink, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import html2canvas from 'html2canvas';

export default function StoreQRCode() {
  const [copied, setCopied] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);
  const qrRef = useRef(null);

  // Get the direct URL to CustomerStore
  const baseUrl = window.location.origin;
  const appPath = window.location.pathname.split('/').slice(0, 3).join('/'); // Get /app/<appId>
  const storeUrl = `${baseUrl}${appPath}/customerstore`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadQRCode = async () => {
    if (!qrRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(qrRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = 'Coriander-Store-QR-Code.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
    setDownloading(false);
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <QrCode className="w-8 h-8 text-green-600" />
              Online Store QR Code
            </h1>
            <p className="text-gray-600">Direct link and QR code for customers to access your online store</p>
          </div>
          <Button onClick={handlePrint} variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>

        {/* Direct URL */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Direct Store Link
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Share this URL with customers</Label>
              <div className="flex gap-2">
                <Input
                  value={storeUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={handleCopyUrl} variant="outline">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <a href={storeUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Quick Access:</strong> Customers can use this direct link to skip the homepage and go straight to shopping.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Display */}
        <Card className="shadow-lg print-area">
          <CardHeader className="border-b">
            <CardTitle>QR Code for Mobile Scanning</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-6">
              {/* QR Code */}
              <div 
                ref={qrRef}
                className="bg-white p-8 rounded-2xl shadow-xl border-4 border-green-600"
              >
                <QRCode
                  value={storeUrl}
                  size={300}
                  level="H"
                  fgColor="#166534"
                />
              </div>

              {/* Store Info */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Store className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Coriander Cash & Carry</h2>
                </div>
                <p className="text-lg font-semibold text-green-700">Scan to Shop Online</p>
                <p className="text-sm text-gray-600 max-w-md">
                  Point your phone camera at this QR code to instantly access our online store
                  and start ordering groceries for delivery or click & collect
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 print-hidden">
                <Button 
                  onClick={downloadQRCode}
                  disabled={downloading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
                <Button onClick={handlePrint} variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-700 text-lg">📱 For Customers</h4>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-green-600">1.</span>
                    Open your phone's camera app
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-green-600">2.</span>
                    Point it at the QR code
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-green-600">3.</span>
                    Tap the notification that appears
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-green-600">4.</span>
                    Start shopping instantly!
                  </li>
                </ol>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-indigo-700 text-lg">🏪 For Your Business</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600">•</span>
                    Print and display at your store entrance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600">•</span>
                    Add to receipts and business cards
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600">•</span>
                    Include in flyers and promotional materials
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600">•</span>
                    Share on social media and messaging apps
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Printable Poster */}
        <Card className="shadow-lg print-area">
          <CardHeader className="border-b">
            <CardTitle>Printable Store Poster (A4)</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div 
              className="bg-gradient-to-br from-green-50 to-white border-4 border-green-600 rounded-2xl p-12"
              style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}
            >
              <div className="text-center space-y-8">
                {/* Header */}
                <div>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Store className="w-12 h-12 text-green-600" />
                    <h1 className="text-5xl font-bold text-gray-900">Coriander</h1>
                  </div>
                  <p className="text-2xl text-gray-700 font-semibold">Cash & Carry</p>
                </div>

                {/* Main Message */}
                <div className="bg-green-600 text-white py-8 px-6 rounded-xl">
                  <h2 className="text-4xl font-bold mb-2">Shop Online Now!</h2>
                  <p className="text-xl">Quality Afro-Asian Groceries Delivered</p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="bg-white p-10 rounded-2xl shadow-2xl">
                    <QRCode
                      value={storeUrl}
                      size={280}
                      level="H"
                      fgColor="#166534"
                    />
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl">
                      📱
                    </div>
                    <p className="text-2xl font-bold text-gray-900">Scan with your phone camera</p>
                  </div>
                  <p className="text-xl text-gray-600">
                    Browse products • Add to cart • Choose delivery or collection
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <p className="text-3xl mb-2">🚚</p>
                    <p className="font-semibold text-gray-900">Free Delivery</p>
                    <p className="text-sm text-gray-600">Orders over £50</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <p className="text-3xl mb-2">🏪</p>
                    <p className="font-semibold text-gray-900">Click & Collect</p>
                    <p className="text-sm text-gray-600">Pick up in store</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <p className="text-3xl mb-2">💳</p>
                    <p className="font-semibold text-gray-900">Easy Payment</p>
                    <p className="text-sm text-gray-600">Card or cash</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t-2 border-green-600 pt-6 mt-8">
                  <p className="text-lg font-semibold text-gray-900">846-848 Wimborne Rd, Moordown, Bournemouth BH9 2DS</p>
                  <p className="text-gray-600">📞 020 XXXX XXXX | 📧 orders@coriander.co.uk</p>
                </div>
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
          .print-hidden {
            display: none !important;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}