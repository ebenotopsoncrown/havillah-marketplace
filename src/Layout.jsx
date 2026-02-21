import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  ShoppingBag,
  Users,
  TruckIcon,
  BarChart3,
  Settings,
  Store,
  Receipt,
  HardDrive,
  ClipboardList,
  Banknote,
  BookOpen,
  UserPlus,
  Shield,
  Globe,
  QrCode,
  Layers,
  SlidersHorizontal,
  Rss
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "POS",
    url: createPageUrl("POS"),
    icon: ShoppingCart,
  },
  {
    title: "Products",
    url: createPageUrl("Products"),
    icon: Package,
  },
  {
    title: "Categories",
    url: createPageUrl("Categories"),
    icon: LayoutDashboard,
  },
  {
    title: "Sales",
    url: createPageUrl("Sales"),
    icon: Receipt,
  },
  {
    title: "Orders",
    url: createPageUrl("Orders"),
    icon: ShoppingBag,
  },
  {
    title: "Delivery",
    url: createPageUrl("Delivery"),
    icon: TruckIcon,
  },
  {
    title: "Click & Collect",
    url: createPageUrl("ClickAndCollect"),
    icon: Store,
  },

  {
    title: "Purchases",
    url: createPageUrl("Purchases"),
    icon: ClipboardList,
  },
  {
    title: "Expenses",
    url: createPageUrl("Expenses"),
    icon: Banknote,
  },
  {
    title: "Customers",
    url: createPageUrl("Customers"),
    icon: Users,
  },
  {
    title: "Suppliers",
    url: createPageUrl("Suppliers"),
    icon: TruckIcon,
  },
  {
    title: "Reports",
    url: createPageUrl("Reports"),
    icon: BarChart3,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  
  // Pages without sidebar (public-facing)
  const publicPages = ["CustomerStore", "Home", "StaffPortal", "CustomerAccount", "HeroManager"];
  const isPublicPage = publicPages.includes(currentPageName);
  
  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <style>{`
        :root {
              --primary: 142 71% 45%;
              --primary-foreground: 0 0% 100%;
              --background: 35 20% 98%;
            }
      `}</style>
      <div className="min-h-screen flex w-full bg-[#FAFAF9]">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978a8de9be83b8a34f67a8d/49e6f5db7_HavillahMarketplacelogo.jpg" 
                alt="Havillah Marketplace" 
                className="h-12 w-auto"
              />
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Main Menu
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 rounded-lg mb-1 ${
                          location.pathname === item.url ? 'bg-indigo-50 text-indigo-700 font-medium' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Settings Section with Collapsible Menu */}
            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                System
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full hover:bg-gray-100 transition-colors duration-200 rounded-lg mb-1">
                          <div className="flex items-center justify-between w-full px-3 py-2.5">
                            <div className="flex items-center gap-3">
                              <Settings className="w-5 h-5" />
                              <span>Settings</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="ml-4 mt-1 space-y-1">
                          <SidebarMenuButton asChild>
                            <Link 
                              to={createPageUrl("AppSettings")} 
                              className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200 rounded-lg text-sm"
                            >
                              <UserPlus className="w-4 h-4" />
                              <span>User Management</span>
                            </Link>
                          </SidebarMenuButton>
                          <SidebarMenuButton asChild>
                            <Link 
                              to={createPageUrl("AccessControlGuide")} 
                              className="flex items-center gap-3 px-3 py-2 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200 rounded-lg text-sm"
                            >
                              <Globe className="w-4 h-4" />
                              <span>Access Control</span>
                            </Link>
                          </SidebarMenuButton>
                          <SidebarMenuButton asChild>
                            <Link 
                              to={createPageUrl("ArchitectureDiagram")} 
                              className="flex items-center gap-3 px-3 py-2 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 rounded-lg text-sm"
                            >
                              <BookOpen className="w-4 h-4" />
                              <span>Architecture Diagram</span>
                            </Link>
                          </SidebarMenuButton>
                          <SidebarMenuButton asChild>
                            <Link 
                              to={createPageUrl("BrandAssets")} 
                              className="flex items-center gap-3 px-3 py-2 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200 rounded-lg text-sm"
                            >
                              <Store className="w-4 h-4" />
                              <span>Brand & Logo</span>
                            </Link>
                          </SidebarMenuButton>
                          <SidebarMenuButton asChild>
                            <Link 
                              to={createPageUrl("StoreQRCode")} 
                              className="flex items-center gap-3 px-3 py-2 hover:bg-green-50 hover:text-green-700 transition-colors duration-200 rounded-lg text-sm"
                            >
                              <QrCode className="w-4 h-4" />
                              <span>Store QR Code</span>
                            </Link>
                          </SidebarMenuButton>
                          <SidebarMenuButton asChild>
                            <Link 
                              to={createPageUrl("SystemArchitecture")} 
                              className="flex items-center gap-3 px-3 py-2 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 rounded-lg text-sm"
                            >
                              <Layers className="w-4 h-4" />
                              <span>System Architecture</span>
                            </Link>
                          </SidebarMenuButton>
                          <SidebarMenuButton asChild>
                            <Link 
                              to={createPageUrl("SystemDocumentation")} 
                              className="flex items-center gap-3 px-3 py-2 hover:bg-green-50 hover:text-green-700 transition-colors duration-200 rounded-lg text-sm"
                            >
                              <BookOpen className="w-4 h-4" />
                              <span>Full Documentation</span>
                            </Link>
                          </SidebarMenuButton>
                          <SidebarMenuButton asChild>
                            <Link 
                              to={createPageUrl("ServiceBusinessArchitecture")} 
                              className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200 rounded-lg text-sm"
                            >
                              <Layers className="w-4 h-4" />
                              <span>Service Business Architecture</span>
                            </Link>
                          </SidebarMenuButton>
                          <SidebarMenuButton asChild>
                            <Link 
                              to={createPageUrl("HardwareGuide")} 
                              className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 rounded-lg text-sm"
                            >
                              <HardDrive className="w-4 h-4" />
                              <span>Hardware Setup</span>
                            </Link>
                          </SidebarMenuButton>
                          <SidebarMenuButton asChild>
                            <Link 
                              to={createPageUrl("SecurityDashboard")} 
                              className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 rounded-lg text-sm"
                            >
                              <Shield className="w-4 h-4" />
                              <span>Security Dashboard</span>
                            </Link>
                          </SidebarMenuButton>
                          <SidebarMenuButton asChild>
                            <Link 
                              to={createPageUrl("HeroManager")} 
                              className="flex items-center gap-3 px-3 py-2 hover:bg-green-50 hover:text-green-700 transition-colors duration-200 rounded-lg text-sm"
                            >
                              <SlidersHorizontal className="w-4 h-4" />
                              <span>Hero Slider Manager</span>
                            </Link>
                          </SidebarMenuButton>
                          <SidebarMenuButton asChild>
                            <Link 
                              to={createPageUrl("ProductFeedManager")} 
                              className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 rounded-lg text-sm"
                            >
                              <Rss className="w-4 h-4" />
                              <span>Product Feed / Shopping.com</span>
                            </Link>
                          </SidebarMenuButton>
                          <SidebarMenuButton asChild>
                            <Link 
                              to={createPageUrl("BrandBanners")} 
                              className="flex items-center gap-3 px-3 py-2 hover:bg-fuchsia-50 hover:text-fuchsia-700 transition-colors duration-200 rounded-lg text-sm"
                            >
                              <Image className="w-4 h-4" />
                              <span>Brand Banners</span>
                            </Link>
                          </SidebarMenuButton>
                        </div>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={createPageUrl("Home")} 
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-green-50 hover:text-green-700 transition-colors duration-200 rounded-lg"
                        target="_blank"
                      >
                        <Store className="w-5 h-5" />
                        <span>View Storefront</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={createPageUrl("DriverPortal")} 
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 rounded-lg"
                        target="_blank"
                      >
                        <TruckIcon className="w-5 h-5" />
                        <span>Driver Portal</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">Store Manager</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4 lg:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-semibold">Havillah Marketplace</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}