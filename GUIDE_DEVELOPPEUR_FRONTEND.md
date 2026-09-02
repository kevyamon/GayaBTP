# GUIDE TECHNIQUE POUR LE DÉVELOPPEUR FRONTEND & SON IA — GAYABTP

Bienvenue sur le projet **GayaBTP**. Ce document contient toutes les instructions architecturales, les règles de design et les snippets de code indispensables pour construire le frontend React / PWA en parfaite synchronisation avec le Backend en production.

---

## 1. ENVIRONNEMENT & CONNEXION API

* **API REST Backend (Production)** : `https://gayabtp-backend.onrender.com/api/v1`
* **Variable d'environnement Frontend (`.env`)** :
```env
VITE_API_BASE_URL=https://gayabtp-backend.onrender.com/api/v1
```

---

## 2. GESTION DE L'AUTHENTIFICATION & DU REFRESH TOKEN (ESSENTIEL)

Le Backend fonctionne avec un **double token** pour que l'utilisateur reste connecté des mois sans friction :
1. `accessToken` (15 min) : retourné dans le corps JSON à la connexion/inscription, stocké en mémoire (ex: Zustand/React Context).
2. `refreshToken` (30 jours) : stocké dans un cookie sécurisé **HttpOnly** par le serveur.

### Client Axios prêt à l'emploi (À copier-coller dans `src/services/api.ts`) :

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://gayabtp-backend.onrender.com/api/v1',
  withCredentials: true, // INDISPENSABLE pour envoyer/recevoir le cookie httpOnly refreshToken
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requete : injection automatique de l'Access Token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Intercepteur de reponse : renouvellement transparent du token si 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login' && originalRequest.url !== '/auth/refresh') {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'https://gayabtp-backend.onrender.com/api/v1'}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.data.accessToken;
        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        setAccessToken(null);
        // Rediriger vers /login si le refresh token a expire
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 3. DESIGN SYSTEM & IDENTITÉ VISUELLE GAYABTP

### 3.1 Règle des Couleurs 60 - 30 - 10
Toutes les couleurs doivent impérativement être définies dans `src/theme/theme.ts` ou `tailwind.config.js` :
* **60% (Couleur dominante)** : Bleu Acier Professionnel `#2C5F7C` (Bandes, headers, cartes, structure).
* **30% (Couleur secondaire)** : Vert Citron / Cyan Foncière `#91C29E` (Badges vérifiés, états actifs, accents de confiance).
* **10% (Couleur d'accent)** : Ocre Chantier / Terre Battue `#CE6D3C` (Boutons d'action prioritaires CTA, prix en FCFA, alertes fortes).
* **Fond neutre** : Gris technique très léger `#F8FAFC`, texte `#0F172A`.

### 3.2 Typographies Officielles (Google Fonts)
À importer dans `index.html` :
* **Titres principaux (H1, H2)** : `Changa One` (robuste, impact BTP moderne).
* **Corps de texte, boutons, formulaires** : `Open Sans` (lisibilité maximale et élégance).

### 3.3 Règles de Qualité Strictes
1. **Interdiction de l'alerte native `alert()`** : Utiliser impérativement des composants de Toast et de Modales personnalisés.
2. **Interdiction des émojis bruts dans le code** : Utiliser les icônes vectorielles **Lucide React** (ex: `ShieldCheck`, `MapPin`, `Phone`, `Hammer`, `Building`, `Search`, `Bell`).
3. **Typographie et orthographe soignées** : Veiller aux accents français (*validé*, *téléphone*, *bâtiment*, *établi*).

---

## 4. GESTION DES RÔLES & DES FLUX UTILISATEUR

L'application comporte 3 rôles avec des espaces distincts :

1. **Rôle `particulier`** :
   * Recherche de biens immobiliers et de terrains sécurisés (ACD, CMP).
   * Configuration de veilles d'alertes budgétaires automatiques.
   * Utilisation du simulateur de budget d'acquisition (notaire, DGI, ACD).
   * Publication d'annonces de vente ou location de ses biens.
   * Consultation du hub des portails officiels d'État (IDUFCI, DGI).

2. **Rôle `professionnel`** (Artisans, cabinets BTP, architectes, géomètres) :
   * Espace Pro dédié avec affichage des quotas d'abonnement.
   * Gestion de la vitrine entreprise : services BTP et portfolio de chantiers.
   * Publication d'offres d'emploi et de stages.
   * Dépôt de justificatifs pour l'obtention du **Badge Vérifié**.
   * Paiement et souscription aux forfaits (*Starter, Pro, Premium*) via Wave ou MTN MoMo.

3. **Rôle `admin`** :
   * Tableau de bord avec KPIs en temps réel (chiffre d'affaires cumulé en FCFA, pros inscrits, annonces, alertes).
   * Modération des annonces et suspension/réactivation des utilisateurs.
   * Validation des paiements manuels et attribution du Badge Vérifié.
   * Consultation de l'historique d'audit des actions (`AuditLogs`).

---

## 5. DÉCOUPAGE RECOMMANDÉ DE L'ARBORESCENCE FRONTEND

```text
src/
├── assets/          # Logos et illustrations SVG
├── components/
│   ├── common/      # Header, Footer, BottomNavigation (Mobile PWA)
│   ├── ui/          # Button, Modal, Toast, Input, Select, Badge
│   ├── pro/         # ProCard, ServiceList, ProjectGallery, BadgeVerified
│   ├── listing/     # ListingCard, FilterSidebar, CoordinateMap
│   ├── calculator/  # CalculatorForm, CostBreakdownTable
│   └── admin/       # MetricCard, UserTable, ModerationDrawer
├── contexts/        # AuthContext, NotificationContext, ToastContext
├── hooks/           # useAuth, usePros, useListings, useNotifications
├── pages/
│   ├── Home.tsx
│   ├── ProDirectory.tsx
│   ├── ProDetail.tsx
│   ├── ListingsPage.tsx
│   ├── ListingDetail.tsx
│   ├── CalculatorPage.tsx
│   ├── PortalsHubPage.tsx
│   ├── JobsPage.tsx
│   ├── SchoolsPage.tsx
│   ├── BlogPage.tsx
│   ├── BlogDetail.tsx
│   ├── FaqPage.tsx
│   ├── auth/ (Login.tsx, RegisterParticulier.tsx, RegisterPro.tsx)
│   ├── dashboard/ (ProDashboard.tsx, UserListings.tsx, UserAlerts.tsx)
│   └── admin/ (AdminDashboard.tsx, AdminUsers.tsx, AdminModeration.tsx)
├── services/
│   ├── api.ts       # Client Axios avec intercepteur Refresh
│   ├── auth.service.ts
│   ├── pro.service.ts
│   ├── listing.service.ts
│   ├── alert.service.ts
│   └── payment.service.ts
├── theme/
│   └── theme.ts     # Source unique des tokens de design
└── App.tsx
```

---

## 6. CONFIGURATION PROGRESSIVE WEB APP (PWA)

L'application est pensée pour être installée directement sur smartphone comme une application native :
* Configuration via `vite-plugin-pwa` avec Service Worker en mode `generateSW` ou `injectManifest`.
* Navigation fluide sur mobile avec une barre inférieure (*Bottom Navigation Bar*).
* Prise en charge des états hors ligne (*Offline Fallback*).

---

> Pour toute question relative aux routes, aux paramètres de requêtes et aux formats JSON retournés, consultez directement le fichier **`GayaBTP_CONTRAT_API.md`**.
