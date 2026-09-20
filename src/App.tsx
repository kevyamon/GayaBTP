import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen bg-brand-light dark:bg-brand-dark text-slate-800 dark:text-slate-100">
              
              {/* En-tête officiel */}
              <Header />

              {/* Contenu principal des routes */}
              <main className="flex-1 flex flex-col">
                <Routes>
                  {/* SPRINT 1 (Pages 1, 2, 3) */}
                  <Route path="/" element={<Home />} />
                  <Route path="/annonces" element={<ListingsPage />} />
                  <Route path="/annonces/:id" element={<ListingDetailPage />} />
                  <Route path="/verification" element={<PortalsHubPage />} />

                  {/* SPRINT 2 (Pages 4, 5, 6) */}
                  <Route path="/pros" element={<ProsPage />} />
                  <Route path="/pros/:id" element={<ProDetailPage />} />

                  {/* SPRINT 3 (Outils Métiers & Opportunités) */}
                  <Route path="/calculateur" element={<CalculatorPage />} />

                  {/* Banc d'essai Glassmorphism Design System */}
                  <Route path="/glassmorphism-demo" element={<GlassmorphismDemoPage />} />

                  {/* Redirections douces pour les sprints ultérieurs */}
                  <Route path="/emplois" element={<Navigate to="/" replace />} />
                  <Route path="/blog" element={<Navigate to="/" replace />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Barre de navigation inférieure pour PWA / Mobile */}
              <BottomNav />

              {/* Bouton de retour en haut de page pour Desktop */}
              <ScrollToUpButton />

            </div>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
