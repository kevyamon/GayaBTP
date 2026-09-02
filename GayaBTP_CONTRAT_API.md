# CONTRAT D'API OFFICIEL — GAYABTP REST API v1.0
> **Plateforme Nationale de Référence BTP, Foncier & Immobilier en Côte d'Ivoire**  
> **Base URL Production (Render) :** `https://gayabtp-backend.onrender.com/api/v1`

---

## 1. PRINCIPES ARCHITECTURAUX & SÉCURITÉ

### 1.1 Protocole d'Authentification (Double Token)
L'API utilise une stratégie sécurisée **Access Token + Refresh Token** :
* **Access Token** : Durée de vie **15 minutes**. Doit être envoyé dans l'en-tête HTTP de chaque requête protégée :  
  `Authorization: Bearer <access_token>`
* **Refresh Token** : Durée de vie **30 jours**. Stocké de manière 100 % sécurisée dans un cookie **HttpOnly** (`refreshToken`).
* **Intercepteur Axios obligatoire** : En cas de réponse `401 Unauthorized` (token expiré), le frontend doit automatiquement appeler `POST /api/v1/auth/refresh` avec `withCredentials: true` pour obtenir un nouvel `accessToken` sans déconnecter l'utilisateur.

### 1.2 Format Universel des Réponses

#### Réponse avec succès (200 OK / 201 Created)
```json
{
  "success": true,
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 54,
    "totalPages": 3
  }
}
```

#### Réponse en cas d'erreur (400, 401, 403, 404, 409, 422, 500)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Certains champs sont invalides.",
    "details": [
      { "field": "email", "message": "Format d'adresse email invalide." }
    ]
  }
}
```

---

## 2. CATALOGUE EXHAUSTIF DES ENDPOINTS

---

### MODULE 1 : AUTHENTIFICATION (`/api/v1/auth`)

#### `POST /api/v1/auth/register/particulier`
Inscription d'un utilisateur particulier (chercheur de biens, client BTP).
* **Accès** : Public
* **Body (JSON)** :
```json
{
  "name": "Kouassi Jean",
  "email": "kouassi.jean@gmail.com",
  "password": "PasswordSecurise2026!",
  "phone": "+2250700000001"
}
```
* **Réponse 201** :
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "673c8f9a21b34e1234567890",
      "name": "Kouassi Jean",
      "email": "kouassi.jean@gmail.com",
      "phone": "+2250700000001",
      "role": "particulier",
      "status": "active"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

#### `POST /api/v1/auth/register/professionnel`
Inscription d'un acteur BTP (artisan, architecte, cabinet BTP, géomètre).
* **Accès** : Public
* **Body (JSON)** :
```json
{
  "name": "Cabinet BTP Kouamé",
  "email": "contact@btpkouame.ci",
  "password": "PasswordSecurise2026!",
  "accountType": "entreprise",
  "companyName": "BTP Kouamé Ingénierie",
  "specialties": ["Gros oeuvre", "Génie civil", "Architecture"],
  "city": "Abidjan",
  "district": "Cocody",
  "phoneWhatsApp": "+2250708091011",
  "bio": "Cabinet d'expertise BTP et de maîtrise d'oeuvre.",
  "yearsOfExperience": 8
}
```
* **Réponse 201** :
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "673c8f9a21b34e1234567891",
      "name": "Cabinet BTP Kouamé",
      "email": "contact@btpkouame.ci",
      "role": "professionnel",
      "status": "active"
    },
    "proProfile": {
      "_id": "673c8f9a21b34e1234567892",
      "accountType": "entreprise",
      "companyName": "BTP Kouamé Ingénierie",
      "specialties": ["Gros oeuvre", "Génie civil", "Architecture"],
      "city": "Abidjan",
      "district": "Cocody",
      "phoneWhatsApp": "+2250708091011",
      "isVerified": false,
      "verificationStatus": "not_requested"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

#### `POST /api/v1/auth/login`
Connexion par identifiants email et mot de passe.
* **Accès** : Public
* **Body (JSON)** :
```json
{
  "email": "contact@btpkouame.ci",
  "password": "PasswordSecurise2026!"
}
```
* **Réponse 200** : Objet utilisateur, profil pro éventuel, et `accessToken`. Le cookie `refreshToken` est défini automatiquement par le serveur.

#### `POST /api/v1/auth/refresh`
Renouvellement automatique de l'Access Token (invisble pour l'utilisateur).
* **Accès** : Requiert le cookie `httpOnly`
* **Réponse 200** : `{ "success": true, "data": { "accessToken": "..." } }`

#### `GET /api/v1/auth/me`
Récupération de la session utilisateur connectée.
* **Accès** : Protégé (`Authorization: Bearer <accessToken>`)
* **Réponse 200** : Profil utilisateur complet + profil pro associé.

#### `POST /api/v1/auth/logout`
Déconnexion sécurisée (suppression du cookie httpOnly).
* **Accès** : Public / Protégé

---

### MODULE 2 : ANNUAIRE DES PROFESSIONNELS BTP (`/api/v1/pros`)

#### `GET /api/v1/pros`
Recherche paginée et filtrée dans l'annuaire national des artisans et entreprises.
* **Paramètres URL (Query Params)** :
  * `page` (défaut: 1)
  * `limit` (défaut: 20)
  * `specialty` (ex: `Maconnerie`, `Plomberie`, `Electricite`, `Architecture`, `Topographie`)
  * `city` (ex: `Abidjan`, `Bouake`, `Yamoussoukro`, `San-Pedro`, `Korhogo`)
  * `district` (ex: `Cocody`, `Yopougon`, `Plateau`, `Marcory`)
  * `isVerified` (`true` / `false`)
  * `search` (recherche textuelle sur raison sociale, compétences et bio)
* **Réponse 200** : Liste paginée des profils professionnels publics avec leurs services et réalisations.

#### `GET /api/v1/pros/:id`
Fiche détaillée publique d'un professionnel BTP.
* **Réponse 200** : Données complètes, badge vérifié, portfolio, liste des prestations avec tarifs indicatifs, lien de contact direct WhatsApp.

#### `GET /api/v1/pros/me/profile`
Espace d'administration du professionnel connecté avec ses quotas d'abonnement effectifs.
* **Accès** : Protégé (`professionnel`)
* **Réponse 200** : Profil pro + objet `quotas` (`maxServices`, `maxBioChars`, `maxPhotosPerProject`, `visibility`, `hasProBadge`).

#### `PATCH /api/v1/pros/me/profile`
Mise à jour des informations de l'entreprise (bio, coordonnées, adresse).

#### `POST /api/v1/pros/me/services`
Ajout d'une prestation de service BTP.
* **Body** : `{ "title": "Pose de carrelage grand format", "description": "Pose droite et diagonale", "priceStartingAtFCFA": 3500, "unit": "m2" }`

#### `DELETE /api/v1/pros/me/services/:serviceId`
Suppression d'une prestation.

#### `POST /api/v1/pros/me/projects`
Ajout d'un chantier / projet réalisé dans le portfolio.
* **Body** : `{ "title": "Villa duplex Cocody Angré", "description": "Gros oeuvre complet", "completionDate": "2025-11-01", "photos": ["https://cloudinary.../p1.jpg"] }`

#### `DELETE /api/v1/pros/me/projects/:projectId`
Suppression d'un projet du portfolio.

---

### MODULE 3 : IMMOBILIER & TERRAINS SÉCURISÉS (`/api/v1/listings`)

#### `GET /api/v1/listings`
Catalogue public des offres foncières et immobilières.
* **Query Params** :
  * `propertyType` : `terrain` | `maison` | `appartement` | `immeuble` | `commercial`
  * `city` / `district` : Villes et communes de Côte d'Ivoire
  * `titleType` : `ACD` | `CMP` | `approbation` | `bail_emphytéotique` | `autre`
  * `minPrice` / `maxPrice` : Filtres budgétaires en FCFA
  * `minSurface` : Surface minimale en m²
  * `sort` : `recent` | `price_asc` | `price_desc` | `surface_desc`
  * `page` / `limit`

#### `GET /api/v1/listings/:id`
Détail complet d'une annonce (coordonnées GPS, photos, type de titre juridique, contact du vendeur).

#### `POST /api/v1/listings`
Publication d'une annonce (déclenche immédiatement le moteur de matching d'alertes).
* **Accès** : Protégé (`particulier`, `professionnel`, `admin`)
* **Body (JSON)** :
```json
{
  "title": "Terrain viabilisé 500m² avec ACD à Bingerville",
  "description": "Terrain plat en zone résidentielle, eau et électricité disponibles.",
  "propertyType": "terrain",
  "transactionType": "vente",
  "priceFCFA": 18500000,
  "surfaceM2": 500,
  "city": "Abidjan",
  "district": "Bingerville",
  "neighborhood": "Feh Kessé",
  "titleType": "ACD",
  "coordinates": { "latitude": 5.356, "longitude": -3.892 },
  "images": ["https://cloudinary.../terrain1.jpg"],
  "contactPhone": "+2250700000001",
  "contactWhatsApp": "+2250700000001"
}
```

#### `PATCH /api/v1/listings/:id` & `DELETE /api/v1/listings/:id`
Modification et archivage d'annonce par son propriétaire ou un admin.

#### `GET /api/v1/listings/user/my`
Liste des annonces publiées par l'utilisateur connecté.

---

### MODULE 4 : ALERTES BUDGÉTAIRES (`/api/v1/alerts`)

#### `GET /api/v1/alerts`
Liste des critères d'alertes configurés par l'utilisateur (max 20 alertes par compte).

#### `POST /api/v1/alerts`
Création d'une nouvelle veille budgétaire automatique.
* **Body** :
```json
{
  "label": "Terrains Bingerville < 20M FCFA",
  "propertyType": "terrain",
  "city": "Abidjan",
  "district": "Bingerville",
  "maxPriceFCFA": 20000000,
  "minSurfaceM2": 400,
  "titleType": "ACD"
}
```

#### `PATCH /api/v1/alerts/:id/toggle`
Activation / Désactivation instantanée d'une alerte sans la supprimer.

#### `DELETE /api/v1/alerts/:id`
Suppression d'une alerte.

---

### MODULE 5 : EMPLOIS & STAGES BTP (`/api/v1/jobs`)

#### `GET /api/v1/jobs`
Offres d'emploi, stages ouvriers et stages de qualification en Côte d'Ivoire.
* **Query Params** : `type` (`cdi`, `cdd`, `stage`, `freelance`, `journalier`), `specialty`, `city`, `isPaid` (`true`/`false`), `search`.

#### `POST /api/v1/jobs`
Publication d'une offre d'emploi ou de stage.
* **Accès** : Réservé aux acteurs `professionnel` et `admin`.

---

### MODULE 6 : ÉCOLES & LYCÉES TECHNIQUES (`/api/v1/schools`)

#### `GET /api/v1/schools`
Annuaire national des établissements techniques et centres de formation BTP (LTA, INP-HB, CPM, etc.).
* **Query Params** : `city`, `specialty`, `search`, `page`, `limit`.

---

### MODULE 7 : BLOG & GUIDES FONCIERS (`/api/v1/blog`)

#### `GET /api/v1/blog`
Articles juridiques, guides d'achat de terrain et conseils techniques BTP.
* **Query Params** : `category` (`foncier`, `guide_achat`, `btp_technique`, `conseils_juridiques`, `actualites`), `search`, `tag`.

#### `GET /api/v1/blog/:slug`
Lecture d'un article par son slug SEO (incrémente automatiquement le compteur de vues).

#### `GET /api/v1/blog/:slug/similar?category=foncier`
Recommandations d'articles similaires.

---

### MODULE 8 : FAQ ADMINISTRABLE (`/api/v1/faqs`)

#### `GET /api/v1/faqs`
Questions / réponses officielles classées par catégorie (`general`, `foncier`, `btp`, `abonnement`, `certification`).

---

### MODULE 9 : CENTRE DE NOTIFICATIONS IN-APP (`/api/v1/notifications`)

#### `GET /api/v1/notifications`
Récupération des notifications in-app de l'utilisateur avec `unreadCount`.

#### `PATCH /api/v1/notifications/:id/read`
Marquage d'une notification individuelle comme lue.

#### `PATCH /api/v1/notifications/read-all`
Marquage de toutes les notifications comme lues.

---

### MODULE 10 : PORTAILS FONCIERS D'ÉTAT (`/api/v1/verification-portals`)

#### `GET /api/v1/verification-portals`
Hub de liens officiels pour la vérification foncière (IDUFCI, Livre Foncier DGI, MCLU, Service Public CI).

---

### MODULE 11 : CALCULATEUR DE BUDGET TRANSACTIONNEL (`/api/v1/calculator`)

#### `POST /api/v1/calculator/estimate`
Calcul automatique et certifié des frais annexes lors d'un achat foncier.
* **Body** :
```json
{
  "purchasePriceFCFA": 15000000,
  "surfaceM2": 600,
  "zone": "urbaine",
  "requiresTopography": true
}
```
* **Réponse 200** :
```json
{
  "success": true,
  "data": {
    "purchasePriceFCFA": 15000000,
    "notaryFeesEstimateFCFA": 900000,
    "registrationDutyEstimateFCFA": 300000,
    "topographySurveyEstimateFCFA": 250000,
    "acdProcedureEstimateFCFA": 100000,
    "totalEstimatedBudgetFCFA": 16550000,
    "disclaimer": "Les calculs fournis par le simulateur GayaBTP sont des estimations indicatives..."
  }
}
```

---

### MODULE 12 : RÈGLEMENTS & CERTIFICATION (`/api/v1/payments`)

#### `POST /api/v1/payments`
Soumission d'une preuve de règlement pour activation d'un forfait Pro ou Premium.
* **Accès** : Protégé (`professionnel`)
* **Body** : `{ "planSlug": "pro", "paymentMethod": "wave", "transactionReference": "TX-WAVE-89210", "proofImageUrl": "https://cloudinary.../recu.jpg" }`

#### `GET /api/v1/payments/my`
Historique des règlements de l'utilisateur avec leurs statuts (`pending`, `verified`, `rejected`).

#### `POST /api/v1/payments/verification`
Dépôt de dossier pour l'obtention du Badge Vérifié GayaBTP.
* **Accès** : Protégé (`professionnel`)
* **Body** : `{ "idCardUrl": "https://...", "businessRegistryUrl": "https://...", "taxDeclarationUrl": "https://..." }`

---

### MODULE 13 : DASHBOARD ADMINISTRATEUR (`/api/v1/admin`)
*Tous ces endpoints requièrent `authenticate` et `authorize('admin')`.*

* `GET /api/v1/admin/dashboard` : Métriques KPIs en temps réel (utilisateurs, pros, annonces, CA cumulé, alertes actives, etc.).
* `GET /api/v1/admin/users` : Gestion paginée des comptes.
* `PATCH /api/v1/admin/users/:id/status` : Suspension / Réactivation de compte (`status: active | suspended`).
* `PATCH /api/v1/admin/users/:id/role` : Changement de rôle (`particulier | professionnel | admin`).
* `GET /api/v1/admin/listings` & `PATCH /api/v1/admin/listings/:id/moderate` : Modération des annonces (`published | rejected | suspended`).
* `GET /api/v1/admin/payments` & `POST /api/v1/admin/payments/:id/verify` : Validation des règlements et activation des abonnements.
* `GET /api/v1/admin/verifications` & `POST /api/v1/admin/verifications/:id/review` : Examen des dossiers et attribution du Badge Vérifié.
* `GET /api/v1/admin/logs` : Registre infalsifiable de traçabilité des actions administratives (`AuditLog`).
