import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProjectDetailsPage from '../pages/projects/ProjectDetailsPage';
import BillingPage from '../pages/billing/BillingPage';
import SettingsPage from '../pages/settings/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

function MarketingLayout() {
  const location = useLocation();
  const isWarmMarketing =
    location.pathname === '/' || location.pathname.startsWith('/auth');

  return (
    <div
      className={
        isWarmMarketing
          ? 'workspace-shell min-h-screen premium-gradient bg-grid text-sand-900 flex flex-col'
          : 'min-h-screen bg-neutral-950 text-neutral-100 flex flex-col'
      }
    >
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  const isWarmWorkspace =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/billing') ||
    location.pathname.startsWith('/projects');

  return (
    <ProtectedRoute>
      <div
        className={
          isWarmWorkspace
            ? 'workspace-shell min-h-screen premium-gradient bg-grid text-sand-900'
            : 'min-h-screen bg-neutral-950 text-neutral-100'
        }
      >
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
}

const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/auth/login', element: <LoginPage /> },
      { path: '/auth/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/projects/:id', element: <ProjectDetailsPage /> },
      { path: '/billing', element: <BillingPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
  {
    path: '/home',
    element: <Navigate to="/" replace />,
  },
]);

export default router;

