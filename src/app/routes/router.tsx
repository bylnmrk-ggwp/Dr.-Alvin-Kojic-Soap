import { lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/app/layouts/RootLayout'
import { AdminRoute } from './AdminRoute'
import { ProtectedRoute } from './ProtectedRoute'
import { RouteErrorBoundary } from './RouteErrorBoundary'

// Every page is code-split; the layout and home hero ship in the first chunk.
const HomePage = lazy(() => import('@/pages/HomePage'))
const ShopPage = lazy(() => import('@/pages/ShopPage'))
const ProductPage = lazy(() => import('@/pages/ProductPage'))
const RegimenPage = lazy(() => import('@/pages/RegimenPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const FaqsPage = lazy(() => import('@/pages/FaqsPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const DistributorPage = lazy(() => import('@/pages/DistributorPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const OrderConfirmationPage = lazy(() => import('@/pages/OrderConfirmationPage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const AccountPage = lazy(() => import('@/pages/account/AccountPage'))
const AccountOverview = lazy(() => import('@/pages/account/AccountOverview'))
const AccountOrders = lazy(() => import('@/pages/account/AccountOrders'))
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'))
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'))
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'))
const AdminInbox = lazy(() => import('@/pages/admin/AdminInbox'))
const LegalPage = lazy(() => import('@/pages/LegalPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'product/:slug', element: <ProductPage /> },
      { path: 'regimen', element: <RegimenPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'faqs', element: <FaqsPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'distributor', element: <DistributorPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'order/:reference', element: <OrderConfirmationPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'privacy', element: <LegalPage document="privacy" /> },
      { path: 'terms', element: <LegalPage document="terms" /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'account',
            element: <AccountPage />,
            children: [
              { index: true, element: <AccountOverview /> },
              { path: 'orders', element: <AccountOrders /> },
            ],
          },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: 'admin',
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="/admin/products" replace /> },
              { path: 'products', element: <AdminProducts /> },
              { path: 'orders', element: <AdminOrders /> },
              { path: 'inbox', element: <AdminInbox /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
