import { lazy } from "react";

// Public Pages
const Home = lazy(() => import("../pages/Index"));
const Sitemap = lazy(() => import("../pages/Sitemap"));
const Contact = lazy(() => import("../pages/Contact"));
const Wishlist = lazy(() => import("../components/Wishlist"));
const AboutUs = lazy(() => import("../pages/AboutUs"));
const Shop = lazy(() => import("../pages/Shop"));
const ProductDetails = lazy(() => import("../pages/ProductDetails"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const ShippingPolicy = lazy(() => import("../pages/ShippingPolicy"));
const MyProfile = lazy(() => import("../pages/MyProfile"));
const Checkout = lazy(() => import("../pages/Checkout"));
const OrderConfirmation = lazy(() => import("../pages/OrderConfirmation"));
const OrderTracker = lazy(() => import("../pages/OrderTracker"));

// Auth Routes
const SignUp = lazy(() => import("../pages/SignUp"));
const Login = lazy(() => import("../pages/Login"));

// Admin Routes
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminCategories = lazy(() => import("../pages/admin/AdminCategories"));
const AdminCategoryImage = lazy(() => import("../pages/admin/AdminCategoryImage"));
const AdminOrders = lazy(() => import("../pages/admin/AdminOrders"));
const AdminProducts = lazy(() => import("../pages/admin/AdminProducts"));
const AdminCustomers = lazy(() => import("../pages/admin/AdminCustomers"));
const AdminMedia = lazy(() => import("../pages/admin/AdminMedia"));
const AdminSettings = lazy(() => import("../pages/admin/AdminSettings"));
const AdminContact = lazy(() => import("../pages/admin/AdminContact"));

export const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/sitemap", element: <Sitemap /> },
  { path: "contact", element: <Contact /> },
  { path: "shop", element: <Shop /> },
  { path: "aboutus", element: <AboutUs /> },
  { path: "wishlist", element: <Wishlist /> },
  { path: "checkout", element: <Checkout /> },
  { path: "product/:slug", element: <ProductDetails /> },
  { path: "privacy", element: <PrivacyPolicy /> },
  { path: "shipping-policy", element: <ShippingPolicy /> },
  { path: "myprofile", element: <MyProfile /> },
  { path: "order-confirmation", element: <OrderConfirmation /> },
  { path: "track-order", element: <OrderTracker /> },
];

export const authRoutes = [
  { path: "login", element: <Login /> },
  { path: "signup", element: <SignUp /> },
];

export const adminRoutes = [
  { path: "", element: <Dashboard /> },
  { path: "categories", element: <AdminCategories /> },
  { path: "categoryimages", element: <AdminCategoryImage /> },
  { path: "products", element: <AdminProducts /> },
  { path: "orders", element: <AdminOrders /> },
  { path: "customers", element: <AdminCustomers /> },
  { path: "contact", element: <AdminContact /> },
  { path: "media", element: <AdminMedia /> },
  { path: "settings", element: <AdminSettings /> },
];