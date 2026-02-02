import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Carrier from "./pages/Carrier";
import Escort from "./pages/Escort";
import Contact from "./pages/Contact";
import ShipperDashboard from "./pages/dashboard/ShipperDashboard";
import CarrierDashboard from "./pages/dashboard/CarrierDashboard";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import EscortDashboard from "./pages/dashboard/EscortDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Profile from "./pages/dashboard/Profile";
import Notifications from "./pages/dashboard/Notifications";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import VerificationPending from "./pages/VerificationPending";
import DriverDashboard from "./pages/dashboard/DriverDashboard";
import DriverRequestDetail from "./pages/dashboard/DriverRequestDetail";
import DriverCompleteDelivery from "./pages/dashboard/DriverCompleteDelivery";

import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/carrier" element={<Carrier />} />
          <Route path="/escort" element={<Escort />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verification-pending" element={<VerificationPending />} />

          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute allowedRoles={['shipper', 'carrier', 'escort', 'admin']}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/notifications"
            element={
              <ProtectedRoute allowedRoles={['shipper', 'carrier', 'escort', 'admin']}>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/shipper"
            element={
              <ProtectedRoute allowedRoles={['shipper']}>
                <ShipperDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/carrier"
            element={
              <ProtectedRoute allowedRoles={['carrier']}>
                <CarrierDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/escort"
            element={
              <ProtectedRoute allowedRoles={['escort']}>
                <EscortDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/driver"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/driver/request/:id"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <DriverRequestDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/driver/complete-delivery"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <DriverCompleteDelivery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
