import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ScrollToTop } from './components/common/ScrollToTop';
import { ScrollToUpButton } from './components/common/ScrollToUpButton';

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

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex flex-col min-h-screen bg-brand-light dark:bg-brand-dark text-slate-800 dark:text-slate-100">
      {/* En-tête officiel masqué sur les pages d'authentification immersives */}
      {!isAuthPage && <Header />}

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

          {/* SPRINT 4 (Authentification) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Banc d'essai Glassmorphism */}
          <Route path="/glassmorphism-demo" element={<GlassmorphismDemoPage />} />

          {/* Redirections douces */}
          <Route path="/blog" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Barre de navigation inférieure mobile masquée sur les pages d'authentification */}
      {!isAuthPage && <BottomNav />}

      {/* Bouton retour en haut de page */}
      {!isAuthPage && <ScrollToUpButton />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;

