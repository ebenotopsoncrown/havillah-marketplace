import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
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
  BookOpen
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
  
  // Don't show sidebar for CustomerStore page - it's public-facing
  const isCustomerStore = currentPageName === "CustomerStore";
  
  if (isCustomerStore) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary: 221 83% 53%;
          --primary-foreground: 210 40% 98%;
          --background: 35 20% 98%;
        }
      `}</style>
      <div className="min-h-screen flex w-full bg-[#FAFAF9]">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Coriander</h2>
                <p className="text-xs text-gray-500">Business Suite</p>
              </div>
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

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Resources
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={createPageUrl("SystemDocumentation")} 
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-green-50 hover:text-green-700 transition-colors duration-200 rounded-lg"
                      >
                        <BookOpen className="w-5 h-5" />
                        <span>System Documentation</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={createPageUrl("HardwareGuide")} 
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200 rounded-lg"
                      >
                        <HardDrive className="w-5 h-5" />
                        <span>Hardware Guide</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={createPageUrl("CustomerStore")} 
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-green-50 hover:text-green-700 transition-colors duration-200 rounded-lg"
                        target="_blank"
                      >
                        <Store className="w-5 h-5" />
                        <span>View Online Store</span>
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
              <h1 className="text-xl font-semibold">Coriander Business Suite</h1>
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