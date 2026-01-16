import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Store, Truck, MapPin, Package, Printer } from "lucide-react";

export default function DeliveryManifest({ open, onClose, run }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="no-print">
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="w-6 h-6" />
              Delivery Manifest
            </span>
            <Button onClick={handlePrint} variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div id="manifest-content" className="space-y-6">
          {/* Header */}
          <div className="text-center border-b-2 border-gray-900 pb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Store className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Coriander Cash & Carry</h1>
            </div>
            <p className="text-sm text-gray-600">846-848 Wimborne Rd, Bournemouth BH9 2DS</p>
            <p className="text-sm text-gray-600">Tel: 020 XXXX XXXX</p>
          </div>

          {/* Run Details */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Run Number</p>
              <p className="font-bold text-lg">{run.run_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Driver</p>
              <p className="font-bold text-lg">{run.driver_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Start Time</p>
              <p className="font-semibold">{new Date(run.start_time).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Distance</p>
              <p className="font-semibold">{run.total_distance_miles} miles</p>
            </div>
          </div>

          <Separator />

          {/* Delivery Stops */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Delivery Schedule ({run.delivery_stops?.length} stops)
            </h2>

            <div className="space-y-4">
              {run.delivery_stops?.map((stop, index) => (
                <div key={stop.order_id} className="border-2 border-gray-300 rounded-lg p-4 break-inside-avoid">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {stop.sequence}
                    </div>
                    
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Order Number</p>
                          <p className="font-bold text-lg">{stop.order_number}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Customer</p>
                          <p className="font-semibold">{stop.customer_name}</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                        <p className="font-medium flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                          {stop.address}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 p-3 rounded">
                        <div>
                          <p className="text-xs text-gray-500">Est. Duration</p>
                          <p className="font-semibold">{stop.estimated_duration} mins</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Arrival Time</p>
                          <p className="font-semibold">_________</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Completed</p>
                          <p className="font-semibold">_________</p>
                        </div>
                      </div>

                      {/* Signature Box */}
                      <div className="mt-4 border-t pt-3">
                        <p className="text-xs text-gray-500 mb-2">Customer Signature:</p>
                        <div className="border-2 border-dashed border-gray-300 h-16 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 pt-4">
            <p className="font-semibold">Driver Notes & Comments:</p>
            <div className="border-2 border-gray-300 rounded h-24 mt-2 p-2"></div>
            <p className="mt-4">Driver Signature: _________________ Date: _________</p>
          </div>
        </div>

        <style>{`
          @media print {
            .no-print {
              display: none !important;
            }
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            @page {
              size: A4;
              margin: 1cm;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}