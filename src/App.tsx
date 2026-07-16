import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { DataProvider } from './data/DataContext';
import { AppLayout } from './layouts/AppLayout';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Toaster } from 'react-hot-toast';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Lazy load app pages to reduce bundle size
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const FamilyPage = lazy(() => import('./pages/FamilyPage').then(module => ({ default: module.FamilyPage })));
const ProfileDetailPage = lazy(() => import('./pages/ProfileDetailPage').then(module => ({ default: module.ProfileDetailPage })));
const TimelinePage = lazy(() => import('./pages/TimelinePage').then(module => ({ default: module.TimelinePage })));
const MedicationsPage = lazy(() => import('./pages/MedicationsPage').then(module => ({ default: module.MedicationsPage })));
const VitalsPage = lazy(() => import('./pages/VitalsPage').then(module => ({ default: module.VitalsPage })));
const SymptomsPage = lazy(() => import('./pages/SymptomsPage').then(module => ({ default: module.SymptomsPage })));
const CareLoopsPage = lazy(() => import('./pages/CareLoopsPage').then(module => ({ default: module.CareLoopsPage })));
const RecordsPage = lazy(() => import('./pages/RecordsPage').then(module => ({ default: module.RecordsPage })));
const AssistantPage = lazy(() => import('./pages/AssistantPage').then(module => ({ default: module.AssistantPage })));
const AuditPage = lazy(() => import('./pages/AuditPage').then(module => ({ default: module.AuditPage })));
const DoctorBriefPage = lazy(() => import('./pages/DoctorBriefPage').then(module => ({ default: module.DoctorBriefPage })));
const SharePage = lazy(() => import('./pages/SharePage').then(module => ({ default: module.SharePage })));

function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1F2D42',
              border: '1px solid #FAF5ED',
              boxShadow: '0 4px 12px rgba(27, 43, 75, 0.08)',
              borderRadius: '0.875rem',
              fontWeight: 500
            },
            success: {
              iconTheme: {
                primary: '#4CAF82',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#D4625B',
                secondary: '#fff',
              },
            }
          }} 
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected App Routes */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <DashboardPage />
              </Suspense>
            } />
            <Route path="family" element={
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <FamilyPage />
              </Suspense>
            } />
            <Route path="family/:id" element={
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <ProfileDetailPage />
              </Suspense>
            } />
            <Route path="timeline" element={
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <TimelinePage />
              </Suspense>
            } />
            <Route path="medications" element={
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <MedicationsPage />
              </Suspense>
            } />
            <Route path="vitals" element={
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <VitalsPage />
              </Suspense>
            } />
            <Route path="symptoms" element={
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <SymptomsPage />
              </Suspense>
            } />
            <Route path="care-loops" element={
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <CareLoopsPage />
              </Suspense>
            } />
            <Route path="records" element={
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <RecordsPage />
              </Suspense>
            } />
            <Route path="assistant" element={
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <AssistantPage />
              </Suspense>
            } />
            <Route path="access-history" element={
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <AuditPage />
              </Suspense>
            } />
            <Route path="doctor-brief" element={
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <DoctorBriefPage />
              </Suspense>
            } />
            <Route path="share" element={
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <SharePage />
              </Suspense>
            } />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </DataProvider>
  );
}

export default App;
