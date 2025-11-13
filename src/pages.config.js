import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';
import OnlineStore from './pages/OnlineStore';
import Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "POS": POS,
    "Products": Products,
    "OnlineStore": OnlineStore,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: Layout,
};