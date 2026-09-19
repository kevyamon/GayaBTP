/**
 * Design System Officiel — GayaBTP
 * Règle d'or : Règle des 60 - 30 - 10
 * - 60 % Dominante : Bleu Acier Professionnel (#2C5F7C) & Blanc / Gris technique (#F8FAFC)
 * - 30 % Secondaire : Vert Menthe / Cyan Foncier (#91C29E)
 * - 10 % Accent : Vivid Orange (#E99021) & Terre Battue (#CE6D3C)
 */

export const THEME_COLORS = {
  primary: {
    DEFAULT: '#E99021',
    hover: '#D47F15',
    light: '#FEF3E7',
    name: 'Vivid Orange',
  },
  secondary: {
    DEFAULT: '#2C5F7C',
    hover: '#234C63',
    light: '#EBF3F8',
    name: 'Bleu Acier',
  },
  accent: {
    DEFAULT: '#91C29E',
    hover: '#7EB28C',
    light: '#EEF7F1',
    name: 'Vert Menthe Foncier',
  },
  urgent: {
    DEFAULT: '#CE6D3C',
    hover: '#B85E30',
    name: 'Terre Battue',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    border: '#334155',
    text: '#FFFFFF',
    textMuted: '#94A3B8',
  },
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    border: '#E2E8F0',
    text: '#0F172A',
    textMuted: '#64748B',
  },
} as const;

export const TYPOGRAPHY = {
  titleFont: '"Changa One", Impact, sans-serif',
  bodyFont: '"Open Sans", sans-serif',
} as const;

/**
 * Formatage monétaire standardisé pour la Côte d'Ivoire (FCFA)
 * Espace insécable et séparateur de milliers
 */
export const formatFCFA = (amount: number): string => {
  return `${amount.toLocaleString('fr-FR')} FCFA`;
};

/**
 * Formatage de surface en m²
 */
export const formatSurface = (m2: number): string => {
  return `${m2.toLocaleString('fr-FR')} m²`;
};

/**
 * Communes et Villes Principales de Côte d'Ivoire
 */
export const IVORY_COAST_LOCATIONS = [
  { city: 'Abidjan', districts: ['Cocody', 'Bingerville', 'Yopougon', 'Plateau', 'Marcory', 'Riviera', 'Port-Bouët', 'Koumassi', 'Abobo', 'Attécoubé', 'Treichville'] },
  { city: 'Yamoussoukro', districts: ['Centre-ville', 'Morofé', 'Assabou'] },
  { city: 'Bouaké', districts: ['Commerce', 'Ahougnanssou', 'Koko'] },
  { city: 'San-Pédro', districts: ['Balmer', 'Cité', 'Bardot'] },
  { city: 'Grand-Bassam', districts: ['Quartier France', 'Rosiers', 'Impérial'] },
  { city: 'Assinie', districts: ['Assinie-Mafia', 'Assouindé'] },
  { city: 'Korhogo', districts: ['Centre', 'Koko'] },
] as const;

/**
 * Titres fonciers officiels en Côte d'Ivoire
 */
export const LAND_TITLE_TYPES = [
  { value: 'ACD', label: 'Arrêté de Concession Définitive (ACD)', description: 'Titre de pleine propriété inattaquable émis par le MCLU.', isTopSecurity: true },
  { value: 'CMP', label: 'Certificat de Mutation Propriété (CMP)', description: 'Titre légal constatant le transfert notarié de propriété.', isTopSecurity: true },
  { value: 'approbation', label: 'Lotissement Approuvé', description: 'Attestation villageoise avec arrêté d’approbation ministériel.', isTopSecurity: false },
  { value: 'bail_emphytéotique', label: 'Bail Emphytéotique', description: 'Droit réel de très longue durée (18 à 99 ans).', isTopSecurity: false },
] as const;
