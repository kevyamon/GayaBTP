import { LandTitleType, PropertyType } from '../types';

export interface CalculatorInput {
  purchasePriceFCFA: number;
  propertyType: PropertyType;
  titleType: LandTitleType | 'approbation' | 'bail_emphytéotique';
  hasMortgage: boolean; // Recours à un prêt bancaire avec hypothèque
}

export interface CostItem {
  label: string;
  amountFCFA: number;
  percentage: number;
  description: string;
}

export interface CalculatorResult {
  purchasePriceFCFA: number;
  dgiRegistrationFees: CostItem; // Droits d'enregistrement DGI
  notaryFees: CostItem; // Émoluments réglementés du notaire
  notaryVat: CostItem; // TVA 18% sur émoluments
  administrativeFormalities: CostItem; // Débours, conservation foncière, timbres
  mortgageFees?: CostItem; // Frais d'inscription hypothécaire si applicable
  totalFeesFCFA: number;
  totalBudgetFCFA: number;
  feesPercentageOnPrice: number; // Ratio total des frais par rapport au prix
}

/**
 * Calcul dégressif des émoluments réglementés du notaire
 * Barème officiel de la Chambre des Notaires de Côte d'Ivoire :
 * - De 0 à 10 000 000 FCFA : 5 %
 * - De 10 000 001 à 25 000 000 FCFA : 3 %
 * - De 25 000 001 à 50 000 000 FCFA : 1.5 %
 * - Au-delà de 50 000 000 FCFA : 1 %
 */
export function calculateNotaryFees(price: number): number {
  if (price <= 0) return 0;
  let fees = 0;

  // Tranche 1 (0 à 10M)
  const t1 = Math.min(price, 10000000);
  fees += t1 * 0.05;

  // Tranche 2 (10M à 25M)
  if (price > 10000000) {
    const t2 = Math.min(price - 10000000, 15000000);
    fees += t2 * 0.03;
  }

  // Tranche 3 (25M à 50M)
  if (price > 25000000) {
    const t3 = Math.min(price - 25000000, 25000000);
    fees += t3 * 0.015;
  }

  // Tranche 4 (> 50M)
  if (price > 50000000) {
    const t4 = price - 50000000;
    fees += t4 * 0.01;
  }

  return Math.round(fees);
}

/**
 * Calcul complet des frais d'acquisition foncière et immobilière en Côte d'Ivoire
 */
export function calculateAcquisitionCosts(input: CalculatorInput): CalculatorResult {
  const price = Math.max(0, input.purchasePriceFCFA);

  // 1. Droits d'Enregistrement DGI (5% à 6% selon l'acte)
  const dgiRate = input.titleType === 'ACD' || input.titleType === 'CMP' ? 0.06 : 0.05;
  const dgiAmount = Math.round(price * dgiRate);

  // 2. Émoluments du Notaire
  const notaryAmount = calculateNotaryFees(price);

  // 3. TVA sur émoluments du notaire (18%)
  const vatAmount = Math.round(notaryAmount * 0.18);

  // 4. Débours et formalités de Conservation Foncière
  let formalitiesAmount = 350000;
  if (price > 50000000) formalitiesAmount = 550000;
  else if (price > 20000000) formalitiesAmount = 450000;

  // 5. Frais d'hypothèque éventuels (~1.2% du montant financé)
  let mortgageAmount = 0;
  if (input.hasMortgage) {
    mortgageAmount = Math.round(price * 0.012 + 150000);
  }

  const totalFees = dgiAmount + notaryAmount + vatAmount + formalitiesAmount + mortgageAmount;
  const totalBudget = price + totalFees;
  const percentage = price > 0 ? Number(((totalFees / price) * 100).toFixed(2)) : 0;

  return {
    purchasePriceFCFA: price,
    dgiRegistrationFees: {
      label: 'Droits d’enregistrement DGI (État)',
      amountFCFA: dgiAmount,
      percentage: Number(((dgiRate) * 100).toFixed(1)),
      description: 'Taxe fiscale obligatoire perçue par la Direction Générale des Impôts.',
    },
    notaryFees: {
      label: 'Émoluments réglementés du notaire',
      amountFCFA: notaryAmount,
      percentage: price > 0 ? Number(((notaryAmount / price) * 100).toFixed(2)) : 0,
      description: 'Honoraires légaux dégressifs par tranches fixés par arrêté ministériel.',
    },
    notaryVat: {
      label: 'TVA légale sur honoraires (18%)',
      amountFCFA: vatAmount,
      percentage: 18,
      description: 'Taxe sur la valeur ajoutée appliquée sur les seuls émoluments du notaire.',
    },
    administrativeFormalities: {
      label: 'Conservation foncière & débours',
      amountFCFA: formalitiesAmount,
      percentage: price > 0 ? Number(((formalitiesAmount / price) * 100).toFixed(2)) : 0,
      description: 'Frais de publication, état des droits réels et timbres fiscaux.',
    },
    mortgageFees: input.hasMortgage
      ? {
          label: 'Inscription d’hypothèque bancaire',
          amountFCFA: mortgageAmount,
          percentage: 1.2,
          description: 'Frais d’acte d’affectation hypothécaire et sûreté bancaire.',
        }
      : undefined,
    totalFeesFCFA: totalFees,
    totalBudgetFCFA: totalBudget,
    feesPercentageOnPrice: percentage,
  };
}
