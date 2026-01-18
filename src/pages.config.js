import AccessControlGuide from './pages/AccessControlGuide';
import AppSettings from './pages/AppSettings';
import ArchitectureDiagram from './pages/ArchitectureDiagram';
import BrandAssets from './pages/BrandAssets';
import ClickAndCollect from './pages/ClickAndCollect';
import CustomerAccount from './pages/CustomerAccount';
import CustomerStore from './pages/CustomerStore';
import Customers from './pages/Customers';
import Dashboard from './pages/Dashboard';
import Delivery from './pages/Delivery';
import DriverPortal from './pages/DriverPortal';
import Expenses from './pages/Expenses';
import ExpressionOfInterestLetter from './pages/ExpressionOfInterestLetter';
import HardwareGuide from './pages/HardwareGuide';
import Home from './pages/Home';
import MyData from './pages/MyData';
import OnlineStore from './pages/OnlineStore';
import Orders from './pages/Orders';
import POS from './pages/POS';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Products from './pages/Products';
import Purchases from './pages/Purchases';
import Reports from './pages/Reports';
import Sales from './pages/Sales';
import SecurityDashboard from './pages/SecurityDashboard';
import StaffPortal from './pages/StaffPortal';
import StoreQRCode from './pages/StoreQRCode';
import Suppliers from './pages/Suppliers';
import SystemDocumentation from './pages/SystemDocumentation';
import TermsAndConditions from './pages/TermsAndConditions';
import TestGoogleMapsAPI from './pages/TestGoogleMapsAPI';
import StaffLogin from './pages/StaffLogin';
import OrderConfirmation from './pages/OrderConfirmation';
import PickingAndPacking from './pages/PickingAndPacking';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AccessControlGuide": AccessControlGuide,
    "AppSettings": AppSettings,
    "ArchitectureDiagram": ArchitectureDiagram,
    "BrandAssets": BrandAssets,
    "ClickAndCollect": ClickAndCollect,
    "CustomerAccount": CustomerAccount,
    "CustomerStore": CustomerStore,
    "Customers": Customers,
    "Dashboard": Dashboard,
    "Delivery": Delivery,
    "DriverPortal": DriverPortal,
    "Expenses": Expenses,
    "ExpressionOfInterestLetter": ExpressionOfInterestLetter,
    "HardwareGuide": HardwareGuide,
    "Home": Home,
    "MyData": MyData,
    "OnlineStore": OnlineStore,
    "Orders": Orders,
    "POS": POS,
    "PrivacyPolicy": PrivacyPolicy,
    "Products": Products,
    "Purchases": Purchases,
    "Reports": Reports,
    "Sales": Sales,
    "SecurityDashboard": SecurityDashboard,
    "StaffPortal": StaffPortal,
    "StoreQRCode": StoreQRCode,
    "Suppliers": Suppliers,
    "SystemDocumentation": SystemDocumentation,
    "TermsAndConditions": TermsAndConditions,
    "TestGoogleMapsAPI": TestGoogleMapsAPI,
    "StaffLogin": StaffLogin,
    "OrderConfirmation": OrderConfirmation,
    "PickingAndPacking": PickingAndPacking,
}

export const pagesConfig = {
    mainPage: "CustomerStore",
    Pages: PAGES,
    Layout: __Layout,
};