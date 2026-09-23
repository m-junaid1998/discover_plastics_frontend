import { Fragment, Suspense } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { adminRoutes, authRoutes, publicRoutes } from "./routelist";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PageNotFound } from "../pages/PageNotFound";
import { AnnouncementBar } from "../pages/AnnouncementBar";
import { PageLoader } from "../pages/PageLoader";
import WhatsAppButton from "../components/WhatsAppButton";
import AdminLayout from "../pages/admin/AdminLayout";
import { useSelector } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

const ProtectedRoutes = ({ children }: { children: React.ReactElement }) => {
  const { token, user } = useSelector((state: any) => state.auth);
  return token && user?.role === "admin" ? (
    children
  ) : (
    <Navigate replace to="/" />
  );
};

const PublicLayout = () => (
  <Fragment>
    <AnnouncementBar />
    <Navbar />
    <main className="flex-1">
      <Outlet />
      <WhatsAppButton />
    </main>
    <Footer />
  </Fragment>
);

const AuthLayout = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Outlet />
    </GoogleOAuthProvider>
  );
};

export default function MainRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          {publicRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
        <Route element={<AuthLayout />}>
          {authRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoutes>
              <AdminLayout />
            </ProtectedRoutes>
          }
        >
          {adminRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}
