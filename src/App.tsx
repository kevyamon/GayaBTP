import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { BottomNav } from './components/common/BottomNav';

// Pages Sprint 1
import { Home } from './pages/Home';
import { ListingsPage } from './pages/ListingsPage';
import { PortalsHubPage } from './pages/PortalsHubPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-brand-light dark:bg-brand-dark text-slate-800 dark:text-slate-100 transition-colors duration-200">
              
              {/* En-tête officiel */}
              <Header />

              {/* Contenu principal des routes */}
              <main className="flex-1">
                <Routes>
                  {/* SPRINT 1 (Pages 1, 2, 3) */}
                  <Route path="/" element={<Home />} />
                  <Route path="/annonces" element={<ListingsPage />} />
                  <Route path="/verification" element={<PortalsHubPage />} />

                  {/* Redirections douces vers les hubs du Sprint 1 */}
                  <Route path="/pros" element={<Navigate to="/" replace />} />
                  <Route path="/calculateur" element={<Navigate to="/verification" replace />} />
                  <Route path="/emplois" element={<Navigate to="/" replace />} />
                  <Route path="/blog" element={<Navigate to="/" replace />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Pied de page institutionnel */}
              <Footer />

              {/* Barre de navigation inférieure pour PWA / Mobile */}
              <BottomNav />

            </div>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
