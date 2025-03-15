import React, { Fragment, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AuthGuard from "./components/guards/AuthGuard";
import PublicGuard from "./components/guards/PublicGuard";
import AdminLayout from "../src/layouts/AdminLayout";
import Loading from "./components/loader/Loading";

// Lazy load components
const Dashboard = lazy(() => import("./views/dashboard/Dashboard"));
const SignIn = lazy(() => import("./views/auth/signin/SignIn"));
const SignUp = lazy(() => import("./views/auth/signup/SignUp"));
const Verifying = lazy(() => import("./views/auth/verifying/Verifying"));
const ForgotPassword = lazy(() =>
  import("./views/auth/forgotpassword/ForgotPassword")
);
const ResetPassword = lazy(() =>
  import("./views/auth/resetpassword/ResetPassword")
);
const LogOut = lazy(() => import("./views/auth/logout/LogOut"));
const ClientList = lazy(() => import("./views/clients/ClientList"));
const Invoices = lazy(() => import("./views/billing/invoices/Invoices"));
const InvoiceDashboard = lazy(() => import("./views/billing/Dashboard"));
const Invoice = lazy(() => import("./views/billing/invoices/ClientInvoices"));
const Home = lazy(() => import("./views/home/Home"));
const Profile = lazy(() => import("./views/profile/Profile"));

//
export const renderRoutes = (routes = []) => {
  // console.log("Rendering routes:", routes); // Debugging

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {routes.map((route, i) => {
          // console.log(`Processing route: ${route.path}`);

          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;
          const Element = route.element;

          if (!Element) {
            console.error(`Invalid component for route: ${route.path}`);
            return null;
          }

          return (
            <Route
              key={i}
              path={route.path}
              element={
                <Guard>
                  <Layout>
                    {route.routes ? renderRoutes(route.routes) : <Element />}
                  </Layout>
                </Guard>
              }
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};

// Define Routes
const routes = [
  {
    path: "/",
    element: SignIn,
    // guard: PublicGuard,
  },
  {
    path: "/auth/signin",
    element: SignIn,
  },
  {
    path: "/auth/signup",
    element: SignUp,
  },
  {
    path: "/auth/forgot-password",
    element: ForgotPassword,
  },
  {
    path: "/auth/reset-password/:token",
    element: ResetPassword,
  },
  {
    path: "/auth/verifying/:token",
    element: Verifying,
  },

  {
    path: "*",
    layout: AdminLayout,
    guard: AuthGuard,
    element: Dashboard,

    routes: [
      {
        path: "/dashboard",
        element: Dashboard,
      },
      {
        path: "/home",
        element: Home,
      },
      {
        path: "/logout",
        element: LogOut,
      },

      {
        path: "/clients/client-list",
        element: ClientList,
      },
      {
        path: "/billings/dashboard",
        element: InvoiceDashboard,
      },
      {
        path: "/billings/invoices",
        element: Invoices,
      },
      {
        path: "/invoice",
        element: Invoice,
      },
      {
        path: "/profiles/profile",
        element: Profile,
      },
    ],
  },
];

export default routes;
