import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { WorkerProfilePage } from './pages/public/WorkerProfilePage';
import { BookingDetailPage, BookWorkerPage } from './pages/public/BookingDetailPage';
import { PublicWorkerVerifyPage } from './pages/public/PublicWorkerVerifyPage';
import { PublicCertificateVerifyPage } from './pages/public/PublicCertificateVerifyPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Customer Pages
import { CustomerDashboardPage } from './pages/customer/CustomerDashboardPage';
import { CustomerBookingsPage } from './pages/customer/CustomerBookingsPage';
import { CustomerPaymentsPage, CustomerProfilePage } from './pages/customer/CustomerPaymentsPage';

// Worker Pages
import { WorkerDashboardPage } from './pages/worker/WorkerDashboardPage';
import { WorkerJobsPage, WorkerEarningsPage } from './pages/worker/WorkerJobsPage';
import { WorkerSkillsPage, WorkerIdCardPage } from './pages/worker/WorkerSkillsPage';
import { WorkerWelfarePage } from './pages/worker/WorkerWelfarePage';
import { WorkerCertificatesPage, WorkerProfilePageSelf } from './pages/worker/WorkerCertificatesPage';
import { WorkerMobileBottomNav } from './components/worker/WorkerMobileBottomNav';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminWorkersPage } from './pages/admin/AdminWorkersPage';
import { AdminForecastPage } from './pages/admin/AdminForecastPage';
import { AdminFraudPage, AdminAnalyticsPage } from './pages/admin/AdminFraudPage';
import { AdminSocietiesPage, AdminBookingsPage, AdminWelfarePage } from './pages/admin/AdminSocietiesPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            {/* Main Application Shell with Navbar & Footer */}
            <Route element={<PublicLayout />}>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:id" element={<ServicesPage />} />
              <Route path="/worker/:id" element={<WorkerProfilePage />} />
              <Route path="/book/:workerId" element={<BookWorkerPage />} />
              <Route path="/booking/:id" element={<BookingDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Customer Routes */}
              <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
              <Route path="/customer/bookings" element={<CustomerBookingsPage />} />
              <Route path="/customer/payments" element={<CustomerPaymentsPage />} />
              <Route path="/customer/profile" element={<CustomerProfilePage />} />

              {/* Worker Routes */}
              <Route path="/worker/dashboard" element={<><WorkerDashboardPage /><WorkerMobileBottomNav /></>} />
              <Route path="/worker/jobs" element={<><WorkerJobsPage /><WorkerMobileBottomNav /></>} />
              <Route path="/worker/earnings" element={<><WorkerEarningsPage /><WorkerMobileBottomNav /></>} />
              <Route path="/worker/skills" element={<><WorkerSkillsPage /><WorkerMobileBottomNav /></>} />
              <Route path="/worker/certificates" element={<><WorkerCertificatesPage /><WorkerMobileBottomNav /></>} />
              <Route path="/worker/id-card" element={<><WorkerIdCardPage /><WorkerMobileBottomNav /></>} />
              <Route path="/worker/welfare" element={<><WorkerWelfarePage /><WorkerMobileBottomNav /></>} />
              <Route path="/worker/profile" element={<><WorkerProfilePageSelf /><WorkerMobileBottomNav /></>} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/workers" element={<AdminWorkersPage />} />
              <Route path="/admin/forecast" element={<AdminForecastPage />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              <Route path="/admin/fraud" element={<AdminFraudPage />} />
              <Route path="/admin/societies" element={<AdminSocietiesPage />} />
              <Route path="/admin/bookings" element={<AdminBookingsPage />} />
              <Route path="/admin/welfare" element={<AdminWelfarePage />} />
              <Route path="/admin/payments" element={<AdminBookingsPage />} />
              <Route path="/admin/settings" element={<AdminSocietiesPage />} />
            </Route>

            {/* Standalone Public Verification Pages (Zero Auth required) */}
            <Route path="/verify-worker/:token" element={<PublicWorkerVerifyPage />} />
            <Route path="/certificates/verify/:token" element={<PublicCertificateVerifyPage />} />

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
