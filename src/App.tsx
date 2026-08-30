import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import Navbar from './components/layout/Navbar';

// Public pages
import Home from './pages/Home';
import Services from './pages/Services';
import Workers from './pages/Workers';
import WorkerProfile from './pages/WorkerProfile';
import Cooperatives from './pages/Cooperatives';
import HowItWorks from './pages/HowItWorks';
import Notifications from './pages/Notifications';
import Emergency from './pages/Emergency';
import Booking from './pages/Booking';
import Login from './pages/auth/Login';
import WorkerRegister from './pages/auth/WorkerRegister';
import { WorkerProvider } from './context/WorkerContext';
import { ADMIN_EMAIL } from './config/firebase';
import Register from './pages/auth/Register';
import CompleteProfile from './pages/auth/CompleteProfile';
import AdminRegister from './pages/auth/AdminRegister';

// Customer pages
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerBookings from './pages/customer/Bookings';

// Worker pages
import WorkerDashboard from './pages/worker/Dashboard';

// Cooperative pages
import CooperativeDashboard from './pages/cooperative/Dashboard';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  if (role === 'admin' && user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function About() {
  return (
    <PublicLayout>
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
          <h1 className="text-4xl font-extrabold mb-6" style={{ color: 'var(--text-primary)' }}>About CoServe</h1>
          <div className="space-y-6 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
              <strong style={{ color: 'var(--text-primary)' }}>CoServe</strong> is a cooperative-powered digital service ecosystem developed for Smart India Hackathon 2026 (Problem Statement SIH26089).
            </p>
            <p>
              The platform connects households and communities with verified skilled service workers while improving worker opportunities, transparency, trust, welfare, fair earnings and cooperative participation.
            </p>
            <p>
              Unlike generic freelancer marketplaces, CoServe is built on the cooperative model — workers are organized into registered worker cooperatives, providing collective strength, welfare support and shared resources.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {[
                { title: 'Problem Statement', value: 'SIH26089' },
                { title: 'Category', value: 'Cooperative Gig Services' },
                { title: 'Target', value: 'Household & Community Services' },
                { title: 'Tagline', value: 'Cooperative Services. Stronger Communities.' },
              ].map(({ title, value }) => (
                <div key={title} className="p-4 rounded-2xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>{title}</p>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

function ProfilePage() {
  const { user } = useAuth();
  return (
    <PublicLayout>
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>My Profile</h1>
          <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold" style={{ background: 'var(--cs-teal)' }}>
                {user?.avatar}
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{user?.name}</h2>
                <p className="text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>{user?.role} · {user?.city}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
              </div>
            </div>
            <div className="h-2 rounded-full mb-1" style={{ background: 'var(--border)' }}>
              <div className="h-2 rounded-full" style={{ width: '85%', background: 'var(--cs-teal)' }} />
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Profile 85% complete</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

function NotFoundPage() {
  return (
    <PublicLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-6xl font-black mb-4" style={{ color: 'var(--cs-teal)' }}>404</p>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Page Not Found</h1>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>The page you're looking for doesn't exist.</p>
        <a href="/" className="px-6 py-3 rounded-xl text-white font-medium" style={{ background: 'var(--cs-teal)' }}>
          Back to Home
        </a>
      </div>
    </PublicLayout>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
      <Route path="/workers" element={<PublicLayout><Workers /></PublicLayout>} />
      <Route path="/workers/:id" element={<PublicLayout><WorkerProfile /></PublicLayout>} />
      <Route path="/cooperatives" element={<PublicLayout><Cooperatives /></PublicLayout>} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/about" element={<About />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/emergency" element={<PublicLayout><Emergency /></PublicLayout>} />
      <Route path="/booking/:workerId" element={<PublicLayout><Booking /></PublicLayout>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/register" element={<Register />} />
      <Route path="/worker/register" element={<WorkerRegister />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />

      {/* Customer */}
      <Route path="/customer/dashboard" element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/customer/bookings" element={<ProtectedRoute role="customer"><CustomerBookings /></ProtectedRoute>} />
      <Route path="/customer/favorites" element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>} />

      {/* Worker */}
      <Route path="/worker/dashboard" element={<ProtectedRoute role="worker"><WorkerDashboard /></ProtectedRoute>} />
      <Route path="/worker/profile" element={<ProtectedRoute role="worker"><WorkerDashboard /></ProtectedRoute>} />
      <Route path="/worker/requests" element={<ProtectedRoute role="worker"><WorkerDashboard /></ProtectedRoute>} />
      <Route path="/worker/bookings" element={<ProtectedRoute role="worker"><WorkerDashboard /></ProtectedRoute>} />
      <Route path="/worker/earnings" element={<ProtectedRoute role="worker"><WorkerDashboard /></ProtectedRoute>} />
      <Route path="/worker/trust" element={<ProtectedRoute role="worker"><WorkerDashboard /></ProtectedRoute>} />
      <Route path="/worker/welfare" element={<ProtectedRoute role="worker"><WorkerDashboard /></ProtectedRoute>} />
      <Route path="/worker/passport" element={<ProtectedRoute role="worker"><WorkerDashboard /></ProtectedRoute>} />

      {/* Cooperative */}
      <Route path="/cooperative/dashboard" element={<ProtectedRoute role="cooperative"><CooperativeDashboard /></ProtectedRoute>} />
      <Route path="/cooperative/members" element={<ProtectedRoute role="cooperative"><CooperativeDashboard /></ProtectedRoute>} />
      <Route path="/cooperative/analytics" element={<ProtectedRoute role="cooperative"><CooperativeDashboard /></ProtectedRoute>} />
      <Route path="/cooperative/earnings" element={<ProtectedRoute role="cooperative"><CooperativeDashboard /></ProtectedRoute>} />
      <Route path="/cooperative/performance" element={<ProtectedRoute role="cooperative"><CooperativeDashboard /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/verification" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/workers" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/customers" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/cooperatives" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/disputes" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <WorkerProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </WorkerProvider>
  );
}
