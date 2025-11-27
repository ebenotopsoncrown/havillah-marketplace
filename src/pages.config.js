import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';
import OnlineStore from './pages/OnlineStore';
import Sales from './pages/Sales';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Reports from './pages/Reports';
import CustomerStore from './pages/CustomerStore';
import Delivery from './pages/Delivery';
import HardwareGuide from './pages/HardwareGuide';
import Purchases from './pages/Purchases';
import Expenses from './pages/Expenses';
import SystemDocumentation from './pages/SystemDocumentation';
import AppSettings from './pages/AppSettings';
import Home from './pages/Home';
import StaffPortal from './pages/StaffPortal';
import AccessControlGuide from './pages/AccessControlGuide';
import ArchitectureDiagram from './pages/ArchitectureDiagram';
import BrandAssets from './pages/BrandAssets';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "POS": POS,
    "Products": Products,
    "OnlineStore": OnlineStore,
    "Sales": Sales,
    "Orders": Orders,
    "Customers": Customers,
    "Suppliers": Suppliers,
    "Reports": Reports,
    "CustomerStore": CustomerStore,
    "Delivery": Delivery,
    "HardwareGuide": HardwareGuide,
    "Purchases": Purchases,
    "Expenses": Expenses,
    "SystemDocumentation": SystemDocumentation,
    "AppSettings": AppSettings,
    "Home": Home,
    "StaffPortal": StaffPortal,
    "AccessControlGuide": AccessControlGuide,
    "ArchitectureDiagram": ArchitectureDiagram,
    "BrandAssets": BrandAssets,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};