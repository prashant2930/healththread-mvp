import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { DataProvider } from './data/DataContext';
import { AppLayout } from './layouts/AppLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { NotFoundPage } from './pages/NotFoundPage';

// App Pages
import { DashboardPage } from './pages/DashboardPage';
import { FamilyPage } from './pages/FamilyPage';
import { ProfileDetailPage } from './pages/ProfileDetailPage';
import { TimelinePage } from './pages/TimelinePage';
import { MedicationsPage } from './pages/MedicationsPage';
import { VitalsPage } from './pages/VitalsPage';
import { CareLoopsPage } from './pages/CareLoopsPage';
import { RecordsPage } from './pages/RecordsPage';
import { AssistantPage } from './pages/AssistantPage';
import { AuditPage } from './pages/AuditPage';
import { DoctorBriefPage } from './pages/DoctorBriefPage';
import { SharePage } from './pages/SharePage';

function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected App Routes */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="family" element={<FamilyPage />} />
            <Route path="family/:id" element={<ProfileDetailPage />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="medications" element={<MedicationsPage />} />
            <Route path="vitals" element={<VitalsPage />} />
            <Route path="care-loops" element={<CareLoopsPage />} />
            <Route path="records" element={<RecordsPage />} />
            <Route path="assistant" element={<AssistantPage />} />
            <Route path="access-history" element={<AuditPage />} />
            <Route path="doctor-brief" element={<DoctorBriefPage />} />
            <Route path="share" element={<SharePage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </DataProvider>
  );
}

export default App;
