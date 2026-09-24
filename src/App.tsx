import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ScrollToTop } from './components/common/ScrollToTop';
import { ScrollToUpButton } from './components/common/ScrollToUpButton';
import { AdminAuthModal } from './components/admin/auth/AdminAuthModal';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminAuthGuard } from './components/admin/layout/AdminAuthGuard';

// Pages Sprint 1
import { Home } from './pages/Home';
import { ListingsPage } from './pages/ListingsPage';
import { PortalsHubPage } from './pages/PortalsHubPage';

// Pages Sprint 2
import { ProsPage } from './pages/ProsPage';
import { ProDetailPage } from './pages/ProDetailPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { GlassmorphismDemoPage } from './pages/GlassmorphismDemoPage';

// Pages Sprint 3
import { CalculatorPage } from './pages/CalculatorPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { JobsPage } from './pages/JobsPage';

// Pages Sprint 4 (Authentification & Espace Utilisateur)
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AuthGuard } from './components/auth/AuthGuard';

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isAdminDashboard = location.pathname.startsWith('/cockpit-system') || location.pathname.startsWith('/admin');

  // Écouteur global de l'événement secret pour ouvrir la modale admin
  useEffect(() => {
    const handleOpenAdmin = () => {
      setIsAdminModalOpen(true);
    };

    window.addEventListener('gayabtp:open-admin-auth', handleOpenAdmin);
    return () => window.removeEventListener('gayabtp:open-admin-auth', handleOpenAdmin);
  }, []);

  const handleAdminSuccess = () => {
    setIsAdminModalOpen(false);
    navigate('/cockpit-system');
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-light dark:bg-brand-dark text-slate-800 dark:text-slate-100">
      {/* En-tête officiel masqué sur les pages d'authentification et dans le cockpit admin */}
      {!isAuthPage && !isAdminDashboard && <Header />}

      {/* Contenu principal des routes */}
      <main className="flex-1 flex flex-col">
        <Routes>
          {/* SPRINT 1 */}
          <Route path="/" element={<Home />} />
          <Route path="/annonces" element={<ListingsPage />} />
          <Route path="/annonces/:id" element={<ListingDetailPage />} />
          <Route path="/verification" element={<PortalsHubPage />} />

          {/* SPRINT 2 */}
          <Route path="/pros" element={<ProsPage />} />
          <Route path="/pros/:id" element={<ProDetailPage />} />

          {/* SPRINT 3 */}
          <Route path="/calculateur" element={<CalculatorPage />} />
          <Route path="/publier" element={<CreateListingPage />} />
          <Route path="/emplois" element={<JobsPage />} />

          {/* SPRINT 4 (Authentification & Espace Personnel) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <UserDashboardPage />
              </AuthGuard>
            }
          />
          <Route path="/mon-compte" element={<Navigate to="/dashboard" replace />} />

          {/* SPRINT 8 (Back-Office Administrateur Forteresse & Protection 404) */}
          <Route path="/cockpit-system" element={<AdminDashboardPage />} />
          <Route
            path="/admin"
            element={
              <AdminAuthGuard>
                <Navigate to="/cockpit-system" replace />
              </AdminAuthGuard>
            }
          />
          <Route
            path="/dashboard-admin"
            element={
              <AdminAuthGuard>
                <Navigate to="/cockpit-system" replace />
              </AdminAuthGuard>
            }
          />

          {/* Banc d'essai Glassmorphism */}
          <Route path="/glassmorphism-demo" element={<GlassmorphismDemoPage />} />

          {/* Redirections douces */}
          <Route path="/blog" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Modale d'authentification secrète */}
      <AdminAuthModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      {/* Barre de navigation inférieure mobile */}
      {!isAuthPage && !isAdminDashboard && <BottomNav />}

      {/* Bouton retour en haut de page */}
      {!isAuthPage && !isAdminDashboard && <ScrollToUpButton />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <BrowserRouter>
              <ScrollToTop />
              <AppContent />
            </BrowserRouter>
          </AdminAuthProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
