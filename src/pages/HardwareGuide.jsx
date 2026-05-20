import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Printer, 
  Scan, 
  CreditCard, 
  Monitor, 
  Cpu,
  CheckCircle,
  Smartphone,
  Laptop,
  Tablet
} from "lucide-react";

export default function HardwareGuide() {
  const hardwareCategories = [
    {
      title: "Barcode Scanners",
      icon: Scan,
      compatibility: "100% Compatible",
      color: "bg-green-500",
      devices: [
        {
          name: "USB Barcode Scanners",
          status: "Plug & Play",
          description: "Any USB barcode scanner works immediately - acts as keyboard input. No drivers needed.",
          examples: ["Symbol LS2208", "Honeywell Voyager 1200g", "Zebra DS2208", "Any generic USB scanner"]
        },
        {
          name: "Bluetooth Scanners",
          status: "Fully Supported",
          description: "Wireless scanners pair like a Bluetooth keyboard. Perfect for warehouse picking.",
          examples: ["Socket Mobile S700", "Honeywell Voyager 1602g", "Zebra CS4070"]
        },
        {
          name: "2D QR Code Scanners",
          status: "Supported",
          description: "Works with QR codes, Data Matrix, and all 2D barcodes.",
          examples: ["Honeywell Xenon", "Zebra DS9208"]
        }
      ]
    },
    {
      title: "Receipt Printers",
      icon: Printer,
      compatibility: "Multiple Options",
      color: "bg-blue-500",
      devices: [
        {
          name: "Network/Ethernet Printers",
          status: "Recommended",
          description: "Connect via IP address. Best for reliability. Most Epson TM series work perfectly.",
          examples: ["Epson TM-T88VI", "Star TSP143III LAN", "Citizen CT-S310II"]
        },
        {
          name: "USB Thermal Printers",
          status: "Supported",
          description: "Direct USB connection using browser print or WebUSB API.",
          examples: ["Epson TM-T20III", "Star TSP650II", "Bixolon SRP-350plusIII"]
        },
        {
          name: "Bluetooth Printers",
          status: "Supported",
          description: "Wireless receipt printing for mobile POS setups.",
          examples: ["Epson TM-M30", "Star SM-L200", "Bixolon SPP-R200III"]
        },
        {
          name: "Cloud Print Compatible",
          status: "Alternative",
          description: "Any printer accessible via network printing or cloud print services.",
          examples: ["Any network printer", "Google Cloud Print enabled devices"]
        }
      ]
    },
    {
      title: "Payment Terminals",
      icon: CreditCard,
      compatibility: "Integrated & Standalone",
      color: "bg-purple-500",
      devices: [
        {
          name: "Integrated Card Readers (API)",
          status: "API Ready",
          description: "Direct integration with popular UK payment providers via their APIs.",
          examples: ["Stripe Terminal", "SumUp Air", "Zettle by PayPal", "Square Reader", "Worldpay Zinc"]
        },
        {
          name: "Standalone Terminals",
          status: "Fully Compatible",
          description: "Independent card machines. Staff enters amount manually - works with any terminal.",
          examples: ["Any PDQ machine", "Ingenico terminals", "Verifone terminals", "PAX terminals"]
        },
        {
          name: "USB Card Readers",
          status: "Supported",
          description: "Direct USB connection for magstripe and chip readers.",
          examples: ["IDTech Augusta", "MagTek eDynamo", "Cherry SmartTerminal ST-2xxx"]
        }
      ]
    },
    {
      title: "Cash Drawers",
      icon: Monitor,
      compatibility: "Auto-Opens via Printer",
      color: "bg-orange-500",
      devices: [
        {
          name: "RJ11/RJ12 Connected Drawers",
          status: "Standard",
          description: "Connects to receipt printer's cash drawer port. Opens automatically on sale completion.",
          examples: ["APG Vasario", "Star SMD2", "MMF Cash Drawer", "Any RJ11-compatible drawer"]
        },
        {
          name: "USB Cash Drawers",
          status: "Supported",
          description: "Direct USB connection for independent control.",
          examples: ["APG Series 4000", "Star mPOP"]
        }
      ]
    },
    {
      title: "Display Devices",
      icon: Laptop,
      compatibility: "Universal",
      color: "bg-indigo-500",
      devices: [
        {
          name: "Touchscreen All-in-One POS",
          status: "Perfect",
          description: "Professional POS terminals with touchscreen. Our system runs in any browser.",
          examples: ["HP Engage One", "Dell OptiPlex", "Lenovo ThinkCentre Tiny", "POSIFLEX", "Partner Tech"]
        },
        {
          name: "Standard PCs with Touchscreen",
          status: "Perfect",
          description: "Any Windows/Mac computer with a touchscreen monitor works perfectly.",
          examples: ["Any touchscreen monitor", "Generic industrial touch PCs"]
        },
        {
          name: "Tablets (Android/iPad)",
          status: "Optimized",
          description: "Mobile POS solution. Great for market stalls, food trucks, or table service.",
          examples: ["Samsung Galaxy Tab", "iPad Pro", "Any Android tablet", "Amazon Fire tablets"]
        },
        {
          name: "Customer Facing Display",
          status: "Supported",
          description: "Secondary screen shows prices to customers. Use browser's multi-monitor support.",
          examples: ["Any second monitor", "HDMI displays", "USB displays"]
        }
      ]
    },
    {
      title: "Scale/Weight Integration",
      icon: Cpu,
      compatibility: "USB Supported",
      color: "bg-teal-500",
      devices: [
        {
          name: "USB Digital Scales",
          status: "WebUSB Ready",
          description: "For weighed products (meat, produce, bulk items). Direct integration via WebUSB.",
          examples: ["Mettler Toledo Ariva-S", "CAS PD-II", "Ohaus Valor 1000"]
        }
      ]
    }
  ];

  const compatibleBrands = [
    "Epson", "Star Micronics", "Citizen", "Bixolon", "HP", "Dell", "Lenovo",
    "Zebra", "Honeywell", "Symbol", "Datalogic", "Socket Mobile",
    "Stripe", "SumUp", "Zettle", "Square", "Worldpay", "Ingenico", "Verifone",
    "APG Cash Drawer", "MMF", "Samsung", "Apple iPad", "Generic USB devices"
  ];

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">POS Hardware Compatibility Guide</h1>
          <p className="text-gray-600">Our web-based POS works with virtually any hardware - no proprietary equipment needed</p>
        </div>

        {/* Key Advantages */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Why Our System Works Better
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">💰 Lower Cost</h3>
                <p className="text-sm text-gray-700">Use any touchscreen device or existing equipment. No need to buy expensive proprietary POS systems.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🔄 Instant Updates</h3>
                <p className="text-sm text-gray-700">Updates happen in the cloud. All terminals get new features immediately - no manual updates.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🌐 Work Anywhere</h3>
                <p className="text-sm text-gray-700">Browser-based means it works on Windows, Mac, Linux, Android, iOS - any device with a browser.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Device Compatibility by Category */}
        {hardwareCategories.map((category, idx) => (
          <Card key={idx} className="shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{category.compatibility}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Compatible
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {category.devices.map((device, deviceIdx) => (
                  <div key={deviceIdx} className="border-l-4 border-indigo-500 pl-4 py-2">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{device.name}</h3>
                      <Badge variant="outline" className="bg-blue-50">
                        {device.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{device.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {device.examples.map((example, exIdx) => (
                        <Badge key={exIdx} variant="secondary" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Compatible Brands */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle>Verified Compatible Brands</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              {compatibleBrands.map((brand, idx) => (
                <Badge key={idx} variant="outline" className="text-sm py-2 px-4">
                  {brand}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Setup Guide */}
        <Card className="shadow-lg bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <CardHeader>
            <CardTitle>Quick Setup Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Choose Your Device</h3>
                <p className="text-sm text-gray-700">Use any touchscreen PC, tablet, or existing POS terminal. Even smartphones work for mobile sales.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Connect Peripherals</h3>
                <p className="text-sm text-gray-700">Plug in USB barcode scanner, connect network printer, attach cash drawer to printer.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Open Browser & Login</h3>
                <p className="text-sm text-gray-700">Navigate to your Coriander POS URL in Chrome/Edge/Safari. Login and start selling!</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Configure Printer (One-Time)</h3>
                <p className="text-sm text-gray-700">Set printer IP address in settings. Test print. Done! Cash drawer opens automatically.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle>Technical Implementation</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Barcode Scanner Integration</h3>
              <p className="text-sm text-gray-600">USB scanners emulate keyboard input - they just "type" the barcode into the search field. Works instantly with zero configuration.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Receipt Printer Integration</h3>
              <p className="text-sm text-gray-600">Multiple methods: Network printing (ESC/POS protocol), WebUSB API for direct USB access, or browser print dialog. Cash drawer trigger command sent via printer.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Payment Terminal Integration</h3>
              <p className="text-sm text-gray-600">API integration with Stripe Terminal, SumUp, Zettle for seamless card processing. Or use standalone terminals independently.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Offline Capability</h3>
              <p className="text-sm text-gray-600">PWA (Progressive Web App) technology enables offline sales. Transactions sync automatically when internet returns.</p>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Setups */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle>Recommended Complete Setups by Budget</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-5 bg-gray-50">
                <h3 className="font-bold text-lg mb-3 text-green-700">💚 Budget Setup (£300-500)</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ Android tablet (£150-200)</li>
                  <li>✓ Bluetooth barcode scanner (£80)</li>
                  <li>✓ Bluetooth receipt printer (£120)</li>
                  <li>✓ Standalone card terminal (existing)</li>
                </ul>
              </div>
              <div className="border-2 border-indigo-500 rounded-lg p-5 bg-indigo-50">
                <h3 className="font-bold text-lg mb-3 text-indigo-700">⭐ Professional Setup (£800-1200)</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ 15" Touchscreen POS PC (£400-600)</li>
                  <li>✓ USB barcode scanner (£60)</li>
                  <li>✓ Ethernet receipt printer (£200)</li>
                  <li>✓ Cash drawer (£100)</li>
                  <li>✓ Stripe Terminal reader (£50)</li>
                </ul>
              </div>
              <div className="border rounded-lg p-5 bg-gray-50">
                <h3 className="font-bold text-lg mb-3 text-purple-700">💎 Premium Setup (£1500-2500)</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ Commercial POS terminal (£800-1200)</li>
                  <li>✓ 2D barcode scanner (£150)</li>
                  <li>✓ High-speed printer (£300)</li>
                  <li>✓ Heavy-duty cash drawer (£150)</li>
                  <li>✓ Customer display (£200)</li>
                  <li>✓ Integrated card reader (£100)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}