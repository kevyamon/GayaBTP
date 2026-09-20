export type JobContractType = 'CDI' | 'CDD' | 'Stage' | 'Freelance' | 'Prestation';

export interface IJobOffer {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  specialty: string;
  contractType: JobContractType;
  city: string;
  district?: string;
  salaryRangeFCFA: string;
  description: string;
  requirements: string[];
  skills: string[];
  postedAt: string;
  deadline?: string;
  isUrgent?: boolean;
}

export interface JobFilterParams {
  search?: string;
  specialty?: string;
  contractType?: string;
  city?: string;
}

export interface JobApplicationPayload {
  jobId: string;
  fullName: string;
  phone: string;
  email?: string;
  yearsOfExperience: string;
  coverNote: string;
  resumeFileName?: string;
}

const MOCK_JOBS: IJobOffer[] = [
  {
    id: 'job-1',
    title: 'Ingénieur Conducteur de Travaux Gros Œuvre',
    companyName: 'BTP Prestige Côte d’Ivoire',
    specialty: 'Gros Œuvre & Bâtiment',
    contractType: 'CDI',
    city: 'Abidjan',
    district: 'Cocody',
    salaryRangeFCFA: '600 000 - 850 000 FCFA / mois',
    description: 'Supervision technique de chantiers résidentiels R+4 à Abidjan, gestion des équipes de coffreurs et suivi du respect des plannings d’exécution.',
    requirements: ['Diplôme d’Ingénieur Génie Civil ou équivalent (Bac+5)', '3 ans d’expérience minimum en suivi de chantier gros œuvre', 'Maîtrise d’AutoCAD et MS Project'],
    skills: ['Béton Armé', 'Gestion de Chantier', 'AutoCAD', 'Management d’équipes'],
    postedAt: 'Il y a 2 jours',
    isUrgent: true,
  },
  {
    id: 'job-2',
    title: 'Géomètre-Topographe de Terrain & Bornage',
    companyName: 'Cabinet Foncier & Topographie Ivoire',
    specialty: 'Topographie & Foncier',
    contractType: 'CDI',
    city: 'Grand-Bassam',
    salaryRangeFCFA: '400 000 - 550 000 FCFA / mois',
    description: 'Réalisation de levés topographiques, implantations de parcelles loties, calculs de surfaces et confection de dossiers techniques pour ACD.',
    requirements: ['BTS ou Licence en Géomètre-Topographe', 'Pratique confirmée des stations totales Leica et GPS différentiel RTK', 'Permis B souhaité'],
    skills: ['GPS RTK', 'Station Totale', 'Covadis', 'Bornage Foncier'],
    postedAt: 'Il y a 3 jours',
  },
  {
    id: 'job-3',
    title: 'Stagiaire Ingénieur Génie Civil / VRD',
    companyName: 'Alliance Travaux Publics CI',
    specialty: 'Voirie & Réseaux Divers (VRD)',
    contractType: 'Stage',
    city: 'Yamoussoukro',
    salaryRangeFCFA: '150 000 - 200 000 FCFA / indemnité',
    description: 'Assistance au chef de projet sur les travaux d’assainissement et de voirie urbaine, contrôle des matériaux et rédaction des procès-verbaux.',
    requirements: ['Étudiant ou jeune diplômé en Licence/Master Génie Civil', 'Rigueur, dynamisme et curiosité technique', 'Disponible immédiatement'],
    skills: ['VRD', 'Assainissement', 'Métré', 'Suivi Qualité'],
    postedAt: 'Il y a 5 jours',
  },
  {
    id: 'job-4',
    title: 'Électricien Bâtiment & Installateur Solaire',
    companyName: 'Solaire & Énergie Plus',
    specialty: 'Électricité & Énergie',
    contractType: 'CDI',
    city: 'San-Pédro',
    salaryRangeFCFA: '350 000 - 450 000 FCFA / mois',
    description: 'Dimensionnement et installation de kits solaires photovoltaïques, câblage de tableaux divisionnaires et raccordement au réseau basse tension.',
    requirements: ['CAP / BT ou BTS en Électrotechnique', 'Expérience démontrée en pose de panneaux solaires et onduleurs', 'Respect strict des normes NFC 15-100'],
    skills: ['Solaire Photovoltaïque', 'Câblage BT', 'Tableaux Divisionnaires', 'Dépannage'],
    postedAt: 'Il y a 1 semaine',
  },
  {
    id: 'job-5',
    title: 'Chef de Chantier Maçonnerie & VRD',
    companyName: 'Bâtir Solide Bouaké',
    specialty: 'Gros Œuvre & Bâtiment',
    contractType: 'CDD',
    city: 'Bouaké',
    salaryRangeFCFA: '300 000 - 400 000 FCFA / mois',
    description: 'Organisation quotidienne du travail des maçons et ferrailleurs, approvisionnement des matériaux (ciment, sable, gravier) et contrôle d’implantation.',
    requirements: ['BT Bâtiment ou expérience probante de plus de 5 ans en maçonnerie', 'Capacité à diriger une équipe de 15 ouvriers', 'Ponctualité et leadership'],
    skills: ['Maçonnerie', 'Ferraillage', 'Lecture de Plans', 'Sécurité Chantier'],
    postedAt: 'Il y a 1 semaine',
  },
];

let cachedJobs: IJobOffer[] = [...MOCK_JOBS];

export const jobService = {
  getCachedJobs(params?: JobFilterParams): IJobOffer[] {
    if (!params) return cachedJobs;
    return cachedJobs.filter((job) => {
      if (params.specialty && params.specialty !== 'all' && job.specialty !== params.specialty) return false;
      if (params.contractType && params.contractType !== 'all' && job.contractType !== params.contractType) return false;
      if (params.city && params.city !== 'all' && job.city !== params.city) return false;
      if (params.search) {
        const q = params.search.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.companyName.toLowerCase().includes(q);
        const matchesDesc = job.description.toLowerCase().includes(q);
        const matchesSkills = job.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesDesc && !matchesSkills) return false;
      }
      return true;
    });
  },

  async getJobs(params?: JobFilterParams): Promise<IJobOffer[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getCachedJobs(params));
      }, 50);
    });
  },

  async applyToJob(_payload: JobApplicationPayload): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 600);
    });
  },
};
