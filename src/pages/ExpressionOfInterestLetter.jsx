import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Printer, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6916561b91823be40dc5b5b8/f261a1386_image.png";

const BUSINESS_INFO = {
  name: "Coriander Cash & Carry Ltd",
  address: "846-848, Wimborne Rd, Moordown, Bournemouth BH9 2DS",
  phone: "01202 531940",
  email: "brothersajibournemouth@gmail.com"
};

export default function ExpressionOfInterestLetter() {
  const letterRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const downloadAsPDF = async () => {
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const element = letterRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Expression-of-Interest-Letter-Coriander.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
    setDownloading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 print:p-0 print:bg-white">
      {/* Controls - Hidden when printing */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link to={createPageUrl("BrandAssets")}>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Brand Assets
          </Button>
        </Link>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button 
            onClick={downloadAsPDF} 
            disabled={downloading}
            className="bg-red-600 hover:bg-red-700"
          >
            <Download className="w-4 h-4 mr-2" />
            {downloading ? 'Generating...' : 'Download PDF'}
          </Button>
        </div>
      </div>

      {/* Letter - A4 Size */}
      <div 
        ref={letterRef}
        className="bg-white mx-auto shadow-xl print:shadow-none"
        style={{ 
          width: '210mm', 
          minHeight: '297mm',
          padding: '20mm 25mm',
          boxSizing: 'border-box'
        }}
      >
        {/* Letterhead Header */}
        <div className="flex items-start justify-between border-b-4 border-green-600 pb-5 mb-8">
          <img 
            src={LOGO_URL} 
            alt="Coriander Cash & Carry Ltd" 
            className="h-20 w-auto object-contain"
            crossOrigin="anonymous"
          />
          <div className="text-right text-sm">
            <h1 className="text-xl font-bold text-green-700 mb-1">{BUSINESS_INFO.name}</h1>
            <p className="text-gray-600">{BUSINESS_INFO.address}</p>
            <p className="text-gray-600 mt-1">
              <span className="font-semibold">Tel:</span> {BUSINESS_INFO.phone}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {BUSINESS_INFO.email}
            </p>
          </div>
        </div>

        {/* Letter Content */}
        <div className="text-gray-800 leading-relaxed" style={{ fontSize: '11pt' }}>
          {/* Date */}
          <p className="mb-6">Date: 5th August, 2025</p>

          {/* Title */}
          <h2 className="text-center font-bold text-lg mb-6 underline">
            EXPRESSION OF INTEREST LETTER
          </h2>

          {/* Salutation */}
          <p className="mb-4">To Whom It May Concern,</p>

          {/* Body Paragraphs */}
          <p className="mb-4 text-justify">
            This letter serves as an Expression of Interest from Coriander Cash & Carry, a multicultural 
            grocery and retail store based in Bournemouth, United Kingdom, to collaborate with Mr. Ebenezer 
            James, Lead Software Developer and Solutions Architect at InspiredEdge ICT Solutions, in the 
            design and development of a custom digital Business Suite that will integrate both our in-store 
            and online operations.
          </p>

          <p className="mb-4 text-justify">
            Over the past few months, we have held several detailed discussions regarding the development 
            of a unique system combining a Point-of-Sale (POS) solution, an ERP backend, and an Online 
            Ordering Portal. This integrated platform is intended to improve the efficiency of managing 
            sales, stock control, and financial reporting while also enabling customers to place and track 
            orders online.
          </p>

          <p className="mb-4 text-justify">
            We are particularly interested in the innovative combination of these three components — POS + 
            ERP + Online Ordering — into a single, easy-to-use all-in-one system. The proposed solution 
            will include real-time analytics and support both retail and delivery operations. We are 
            confident that this technology will significantly increase our operational efficiency, enhance 
            customer experience, and expand our market reach.
          </p>

          <p className="mb-4 text-justify">
            We hereby express our firm intention to partner with Mr. Ebenezer James and his team at 
            InspiredEdge ICT Solutions to design, build, and deploy this solution. We understand that the 
            system will be developed as a pilot innovation project, with the potential for wider adoption 
            by other retail businesses across the UK.
          </p>

          <p className="mb-8 text-justify">
            We believe this initiative will contribute meaningfully to our technological growth and to the 
            broader retail community, and we look forward to a productive and impactful partnership.
          </p>

          {/* Closing */}
          <p className="mb-16">Yours faithfully,</p>

          {/* Signature Area */}
          <div className="mt-4">
            <p className="border-b border-gray-400 w-64 mb-2"></p>
            <p className="font-bold">Saji K Skaria</p>
            <p className="text-gray-700">Chief Executive</p>
            <p className="text-gray-700">{BUSINESS_INFO.name}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-4" style={{ marginTop: 'auto' }}>
          <div className="border-t-2 border-green-600 pt-3 text-center text-xs text-gray-500">
            <p className="font-semibold text-gray-700">{BUSINESS_INFO.name}</p>
            <p>{BUSINESS_INFO.address} | Tel: {BUSINESS_INFO.phone} | Email: {BUSINESS_INFO.email}</p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}