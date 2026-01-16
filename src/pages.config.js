import AccessControlGuide from './pages/AccessControlGuide';
import AppSettings from './pages/AppSettings';
import ArchitectureDiagram from './pages/ArchitectureDiagram';
import BrandAssets from './pages/BrandAssets';
import ClickAndCollect from './pages/ClickAndCollect';
import CustomerStore from './pages/CustomerStore';
import Customers from './pages/Customers';
import Dashboard from './pages/Dashboard';
import Delivery from './pages/Delivery';
import Expenses from './pages/Expenses';
import ExpressionOfInterestLetter from './pages/ExpressionOfInterestLetter';
import HardwareGuide from './pages/HardwareGuide';
import Home from './pages/Home';
import OnlineStore from './pages/OnlineStore';
import Orders from './pages/Orders';
import POS from './pages/POS';
import Products from './pages/Products';
import Purchases from './pages/Purchases';
import Reports from './pages/Reports';
import Sales from './pages/Sales';
import StaffPortal from './pages/StaffPortal';
import Suppliers from './pages/Suppliers';
import SystemDocumentation from './pages/SystemDocumentation';
import StoreQRCode from './pages/StoreQRCode';
import CustomerAccount from './pages/CustomerAccount';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AccessControlGuide": AccessControlGuide,
    "AppSettings": AppSettings,
    "ArchitectureDiagram": ArchitectureDiagram,
    "BrandAssets": BrandAssets,
    "ClickAndCollect": ClickAndCollect,
    "CustomerStore": CustomerStore,
    "Customers": Customers,
    "Dashboard": Dashboard,
    "Delivery": Delivery,
    "Expenses": Expenses,
    "ExpressionOfInterestLetter": ExpressionOfInterestLetter,
    "HardwareGuide": HardwareGuide,
    "Home": Home,
    "OnlineStore": OnlineStore,
    "Orders": Orders,
    "POS": POS,
    "Products": Products,
    "Purchases": Purchases,
    "Reports": Reports,
    "Sales": Sales,
    "StaffPortal": StaffPortal,
    "Suppliers": Suppliers,
    "SystemDocumentation": SystemDocumentation,
    "StoreQRCode": StoreQRCode,
    "CustomerAccount": CustomerAccount,
}

export const pagesConfig = {
    mainPage: "CustomerStore",
    Pages: PAGES,
    Layout: __Layout,
};