import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { GlassmorphismCard } from '../components/ui/GlassmorphismCard';
import { Button } from '../components/ui/Button';
import { useToast } from '../contexts/ToastContext';
import { listingService } from '../services/listing.service';
import { LandTitleType } from '../types';

import { ListingStepperHeader } from '../components/listing-create/ListingStepperHeader';
import { StepPropertyLocation, LocationData } from '../components/listing-create/StepPropertyLocation';
import { StepLegalTitle, LegalTitleData } from '../components/listing-create/StepLegalTitle';
import { StepPricingDetails, PricingDetailsData } from '../components/listing-create/StepPricingDetails';
import { StepPhotosContact, PhotosContactData } from '../components/listing-create/StepPhotosContact';

import { useAuth } from '../contexts/AuthContext';

export const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // État du formulaire réparti par étape
  const [locationData, setLocationData] = useState<LocationData>({
    propertyType: 'terrain',
    transactionType: 'vente',
    city: 'Abidjan',
    district: 'Cocody',
    address: '',
  });

  const [legalData, setLegalData] = useState<LegalTitleData>({
    titleType: 'ACD',
    titleNumber: '',
    hasDocumentUploaded: false,
  });

  const [pricingData, setPricingData] = useState<PricingDetailsData>({
    title: '',
    surfaceM2: 500,
    priceFCFA: 25000000,
    description: '',
    hasWater: true,
    hasElectricity: true,
    hasRoadAccess: true,
    isFenced: false,
  });

  const [photosData, setPhotosData] = useState<PhotosContactData>({
    photos: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
    contactName: '',
    phoneCall: '',
    phoneWhatsApp: '',
  });

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      error('Connexion requise', 'Veuillez vous connecter pour publier votre annonce.');
      navigate('/login?redirect=/publier');
      return;
    }

    setIsSubmitting(true);
    try {
      await listingService.createListing({
        title: pricingData.title,
        description: pricingData.description,
        propertyType: locationData.propertyType,
        transactionType: locationData.transactionType,
        priceFCFA: pricingData.priceFCFA,
        surfaceM2: pricingData.surfaceM2,
        city: locationData.city,
        district: locationData.district,
        address: locationData.address,
        titleType: legalData.titleType as LandTitleType,
        titleNumber: legalData.titleNumber,
        photos: photosData.photos,
        hasWater: pricingData.hasWater,
        hasElectricity: pricingData.hasElectricity,
        hasRoadAccess: pricingData.hasRoadAccess,
        isFenced: pricingData.isFenced,
        contactName: photosData.contactName,
        phoneCall: photosData.phoneCall,
        phoneWhatsApp: photosData.phoneWhatsApp || photosData.phoneCall,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      });

      setIsPublished(true);
      success('Annonce publiée avec succès !', 'Votre bien est immédiatement visible dans le catalogue GayaBTP.');
    } catch {
      error('Une erreur est survenue lors de l’enregistrement de votre annonce.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-36 sm:pb-40 lg:pb-16 space-y-5 sm:space-y-6 overflow-hidden w-full">
      {/* Bouton Retour */}
      <div className="flex items-center justify-between relative z-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-sky-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </button>
      </div>

      {/* Orbes ambiants diffus */}
      <div className="absolute top-12 left-10 w-80 h-80 rounded-full bg-brand-primary/15 dark:bg-brand-primary/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-8 w-80 h-80 rounded-full bg-brand-accent/15 dark:bg-brand-accent/10 blur-3xl pointer-events-none -z-10" />

      {/* En-tête de la page */}
      <div className="text-center max-w-2xl mx-auto space-y-2 relative z-10 px-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-title text-slate-900 dark:text-white">
          Publier une Annonce Foncière ou Immobilière
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Complétez les 4 étapes pour présenter votre bien aux acheteurs et investisseurs qualifiés.
        </p>
      </div>

      {isPublished ? (
        /* Écran de confirmation de publication */
        <GlassmorphismCard intensity="medium" className="p-6 sm:p-8 text-center space-y-6 max-w-lg mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Votre annonce est en ligne !
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              &laquo;&nbsp;{pricingData.title}&nbsp;&raquo; a été validée et indexée dans notre moteur de recherche.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setIsPublished(false);
                setCurrentStep(1);
              }}
            >
              Déposer une autre annonce
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/annonces')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Voir le catalogue d’annonces
            </Button>
          </div>
        </GlassmorphismCard>
      ) : (
        /* Formulaire de publication multi-étapes */
        <div className="space-y-5 sm:space-y-6 relative z-10 w-full">
          {/* Stepper horizontal */}
          <div className="px-0 sm:px-4 w-full">
            <ListingStepperHeader currentStep={currentStep} onStepClick={setCurrentStep} />
          </div>

          {/* Conteneur principal Glassmorphism */}
          <GlassmorphismCard intensity="medium" className="p-4 sm:p-7 shadow-elevated w-full">
            {currentStep === 1 && (
              <StepPropertyLocation
                data={locationData}
                onChange={setLocationData}
                onNext={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && (
              <StepLegalTitle
                data={legalData}
                onChange={setLegalData}
                onNext={() => setCurrentStep(3)}
                onPrev={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <StepPricingDetails
                propertyType={locationData.propertyType}
                data={pricingData}
                onChange={setPricingData}
                onNext={() => setCurrentStep(4)}
                onPrev={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 4 && (
              <StepPhotosContact
                data={photosData}
                onChange={setPhotosData}
                onSubmit={handleSubmit}
                onPrev={() => setCurrentStep(3)}
                isLoading={isSubmitting}
              />
            )}
          </GlassmorphismCard>
        </div>
      )}
    </div>
  );
};
