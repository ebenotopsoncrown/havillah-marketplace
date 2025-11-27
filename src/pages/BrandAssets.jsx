import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, FileText, Copy, Check, Image, File } from "lucide-react";
import CorianderLogo, { LetterheadLogo, DocumentFooter, LOGO_URL, BUSINESS_INFO } from "../components/branding/CorianderLogo";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function BrandAssets() {
  const [copied, setCopied] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);
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

  const downloadAsJPG = async () => {
    if (!letterheadRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(letterheadRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true
      });
      const link = document.createElement('a');
      link.download = 'Coriander-Letterhead.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch (error) {
      console.error('Error generating JPG:', error);
    }
    setDownloading(false);
  };

  const downloadAsPDF = async () => {
    if (!letterheadRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(letterheadRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Coriander-Letterhead.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
    setDownloading(false);
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

        {/* Official Logo */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle>Official Logo</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Light Background */}
              <div className="text-center">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-3 flex items-center justify-center min-h-[180px]">
                  <img src={LOGO_URL} alt="Coriander Cash & Carry Ltd" className="h-32 w-auto" />
                </div>
                <p className="text-sm font-medium text-gray-700">Light Background</p>
                <p className="text-xs text-gray-500">Primary use</p>
              </div>

              {/* Dark Background */}
              <div className="text-center">
                <div className="bg-gray-900 border-2 border-gray-700 rounded-xl p-8 mb-3 flex items-center justify-center min-h-[180px]">
                  <img src={LOGO_URL} alt="Coriander Cash & Carry Ltd" className="h-32 w-auto" />
                </div>
                <p className="text-sm font-medium text-gray-700">Dark Background</p>
                <p className="text-xs text-gray-500">Alternative use</p>
              </div>
            </div>

            {/* Size Variations */}
            <div className="mt-10 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-6">Size Variations</h3>
              <div className="flex flex-wrap items-end justify-center gap-8 bg-gray-50 rounded-xl p-8">
                <div className="text-center">
                  <img src={LOGO_URL} alt="Small" className="h-10 w-auto mx-auto" />
                  <p className="text-xs text-gray-500 mt-2">Small (40px)</p>
                </div>
                <div className="text-center">
                  <img src={LOGO_URL} alt="Medium" className="h-16 w-auto mx-auto" />
                  <p className="text-xs text-gray-500 mt-2">Medium (64px)</p>
                </div>
                <div className="text-center">
                  <img src={LOGO_URL} alt="Large" className="h-24 w-auto mx-auto" />
                  <p className="text-xs text-gray-500 mt-2">Large (96px)</p>
                </div>
                <div className="text-center">
                  <img src={LOGO_URL} alt="X-Large" className="h-32 w-auto mx-auto" />
                  <p className="text-xs text-gray-500 mt-2">X-Large (128px)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Company Name</p>
                  <p className="text-lg text-gray-900">{BUSINESS_INFO.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Address</p>
                  <p className="text-lg text-gray-900">{BUSINESS_INFO.address}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Phone</p>
                  <p className="text-lg text-gray-900">{BUSINESS_INFO.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Email</p>
                  <p className="text-lg text-gray-900">{BUSINESS_INFO.email}</p>
                </div>
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
        <Card className="shadow-lg">
          <CardHeader className="border-b flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Professional Letterhead
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadAsJPG}
                disabled={downloading}
              >
                <Image className="w-4 h-4 mr-2" />
                Download JPG
              </Button>
              <Button 
                size="sm" 
                onClick={downloadAsPDF}
                disabled={downloading}
                className="bg-red-600 hover:bg-red-700"
              >
                <File className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div 
              ref={letterheadRef}
              className="bg-white border-2 border-gray-200 rounded-xl shadow-inner"
              style={{ width: '210mm', minHeight: '297mm', padding: '20mm', margin: '0 auto' }}
            >
              {/* Letterhead Header */}
              <div className="flex items-start justify-between border-b-4 border-green-600 pb-6 mb-8">
                <img 
                  src={LOGO_URL} 
                  alt="Coriander Cash & Carry Ltd" 
                  className="h-24 w-auto object-contain"
                  crossOrigin="anonymous"
                />
                <div className="text-right">
                  <h1 className="text-2xl font-bold text-green-700 mb-2">{BUSINESS_INFO.name}</h1>
                  <p className="text-gray-600">{BUSINESS_INFO.address}</p>
                  <p className="text-gray-600 mt-2">
                    <span className="font-semibold">Tel:</span> {BUSINESS_INFO.phone}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Email:</span> {BUSINESS_INFO.email}
                  </p>
                </div>
              </div>
              
              {/* Letter Content Area */}
              <div className="space-y-6 text-gray-700 min-h-[180mm]">
                <p className="text-sm text-gray-500">
                  Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                
                <div className="mt-8">
                  <p className="mb-4">[Recipient Name]</p>
                  <p className="mb-4">[Recipient Address]</p>
                </div>

                <p className="mt-8">Dear [Recipient],</p>
                
                <p className="text-gray-600 leading-relaxed mt-4">
                  [Your letter content goes here. This professional letterhead template 
                  can be used for official business correspondence, invoices, quotations, 
                  and formal communications.]
                </p>
                
                <p className="text-gray-600 leading-relaxed">
                  [Continue your letter content here...]
                </p>
                
                <div className="mt-16">
                  <p>Yours sincerely,</p>
                  <div className="mt-12">
                    <p className="font-semibold">[Signatory Name]</p>
                    <p className="text-gray-600">[Position/Title]</p>
                    <p className="text-gray-600">{BUSINESS_INFO.name}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t-2 border-green-600 pt-4 mt-8 text-center text-xs text-gray-500">
                <p className="font-semibold text-gray-700">{BUSINESS_INFO.name}</p>
                <p>{BUSINESS_INFO.address}</p>
                <p>Tel: {BUSINESS_INFO.phone} | Email: {BUSINESS_INFO.email}</p>
              </div>
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