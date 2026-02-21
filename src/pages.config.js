/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AccessControlGuide from './pages/AccessControlGuide';
import AppSettings from './pages/AppSettings';
import ArchitectureDiagram from './pages/ArchitectureDiagram';
import BrandAssets from './pages/BrandAssets';
import Categories from './pages/Categories';
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
import HeroManager from './pages/HeroManager';
import Home from './pages/Home';
import MyData from './pages/MyData';
import OnlineStore from './pages/OnlineStore';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import POS from './pages/POS';
import PickingAndPacking from './pages/PickingAndPacking';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProductPage from './pages/ProductPage';
import Products from './pages/Products';
import Purchases from './pages/Purchases';
import Reports from './pages/Reports';
import Sales from './pages/Sales';
import SecurityDashboard from './pages/SecurityDashboard';
import ServiceBusinessArchitecture from './pages/ServiceBusinessArchitecture';
import StaffLogin from './pages/StaffLogin';
import StaffPortal from './pages/StaffPortal';
import StoreQRCode from './pages/StoreQRCode';
import Suppliers from './pages/Suppliers';
import SystemArchitecture from './pages/SystemArchitecture';
import SystemDocumentation from './pages/SystemDocumentation';
import TermsAndConditions from './pages/TermsAndConditions';
import TestGoogleMapsAPI from './pages/TestGoogleMapsAPI';
import appInfographic from './pages/appInfographic';
import ProductFeedManager from './pages/ProductFeedManager';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AccessControlGuide": AccessControlGuide,
    "AppSettings": AppSettings,
    "ArchitectureDiagram": ArchitectureDiagram,
    "BrandAssets": BrandAssets,
    "Categories": Categories,
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
    "HeroManager": HeroManager,
    "Home": Home,
    "MyData": MyData,
    "OnlineStore": OnlineStore,
    "OrderConfirmation": OrderConfirmation,
    "Orders": Orders,
    "POS": POS,
    "PickingAndPacking": PickingAndPacking,
    "PrivacyPolicy": PrivacyPolicy,
    "ProductPage": ProductPage,
    "Products": Products,
    "Purchases": Purchases,
    "Reports": Reports,
    "Sales": Sales,
    "SecurityDashboard": SecurityDashboard,
    "ServiceBusinessArchitecture": ServiceBusinessArchitecture,
    "StaffLogin": StaffLogin,
    "StaffPortal": StaffPortal,
    "StoreQRCode": StoreQRCode,
    "Suppliers": Suppliers,
    "SystemArchitecture": SystemArchitecture,
    "SystemDocumentation": SystemDocumentation,
    "TermsAndConditions": TermsAndConditions,
    "TestGoogleMapsAPI": TestGoogleMapsAPI,
    "appInfographic": appInfographic,
    "ProductFeedManager": ProductFeedManager,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};