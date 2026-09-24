import React, { useState, useRef } from 'react';
import { X, User, Phone, MapPin, Building, Image, Camera, Loader2, Save, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { uploadService } from '../../services/upload.service';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1590274853856-f22d5ee3d228?auto=format&fit=crop&w=1200&q=80',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, proProfile, updateUserProfile } = useAuth();
  const { success, error } = useToast();
  const isPro = user?.role === 'professionnel';

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || proProfile?.city || 'Abidjan');
  const [bio, setBio] = useState(user?.bio || proProfile?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [coverImage, setCoverImage] = useState(user?.coverImage || proProfile?.coverImage || COVER_PRESETS[0]);

  // Champs pro
  const [companyName, setCompanyName] = useState(proProfile?.companyName || '');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState(proProfile?.phoneWhatsApp || '');
  const [specialties, setSpecialties] = useState(proProfile?.specialties?.join(', ') || '');

  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const result = await uploadService.uploadImage(file, 'gayabtp/avatars');
      setAvatar(result.url);
      success('Photo sélectionnée !', 'Votre photo de profil est prête à être enregistrée.');
    } catch {
      error('Impossible de charger la photo.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const result = await uploadService.uploadImage(file, 'gayabtp/covers');
      setCoverImage(result.url);
      success('Bannière sélectionnée !', 'Votre photo de couverture est prête.');
    } catch {
      error('Impossible de charger la bannière.');
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Le nom est obligatoire.');
      return;
    }

    setIsLoading(true);
    try {
      await updateUserProfile({
        name: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        bio: bio.trim(),
        avatar: avatar.trim(),
        coverImage: coverImage.trim(),
        ...(isPro
          ? {
              companyName: companyName.trim() || name.trim(),
              phoneWhatsApp: phoneWhatsApp.trim() || phone.trim(),
              specialties: specialties.split(',').map((s) => s.trim()).filter(Boolean),
            }
          : {}),
      });

      success('Profil mis à jour !', 'Vos informations ont été enregistrées avec succès.');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la mise à jour.';
      error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-brand-dark-surface rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col border border-brand-light-border dark:border-brand-dark-border shadow-elevated overflow-hidden">
        
        {/* En-tête Modale */}
        <div className="p-4 sm:p-5 border-b border-brand-light-border dark:border-brand-dark-border flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Modifier mes informations personnelles
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps Formulaire */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {/* 1. Photo de Couverture (Galerie + Présélections) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Image className="w-4 h-4 text-brand-primary" />
                <span>Photo de couverture</span>
              </label>

              {/* Bouton Sélection depuis Galerie Cloudinary */}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={isUploadingCover}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary dark:text-sky-300 font-bold text-xs transition-colors cursor-pointer"
              >
                {isUploadingCover ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Téléversement...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choisir depuis la galerie</span>
                  </>
                )}
              </button>
            </div>

            {/* Aperçu de la couverture active */}
            <div className="relative h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800">
              <img src={coverImage} alt="Couverture" className="w-full h-full object-cover" />
            </div>

            {/* Présélections visuelles */}
            <div className="grid grid-cols-4 gap-2">
              {COVER_PRESETS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCoverImage(url)}
                  className={`relative h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    coverImage === url ? 'border-brand-primary ring-2 ring-brand-primary/30 scale-[1.02]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* 2. Photo de Profil (Avatar depuis Galerie) */}
          <div className="space-y-1.5 pt-1">
            <label className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-brand-primary" />
              <span>Photo de profil</span>
            </label>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarFileChange}
              className="hidden"
            />

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 overflow-hidden shrink-0 border-2 border-brand-primary/20 flex items-center justify-center font-bold text-brand-primary text-lg">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  name ? name.slice(0, 2).toUpperCase() : <User className="w-6 h-6" />
                )}
              </div>

              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                {isUploadingAvatar ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Téléversement...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choisir une photo</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3. Nom & Téléphone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-200">Nom et Prénoms *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-brand-primary/50 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-200">Téléphone</label>
              <input
                type="tel"
                placeholder="+225 07 00 00 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-brand-primary/50 focus:outline-none"
              />
            </div>
          </div>

          {/* 4. Ville / Commune */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-200">Ville / Commune (Côte d'Ivoire)</label>
            <input
              type="text"
              placeholder="ex: Abidjan, Cocody Riviera"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-brand-primary/50 focus:outline-none"
            />
          </div>

          {/* 5. Bio / Présentation */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-200">Bio / Présentation</label>
            <textarea
              rows={2}
              placeholder="Présentez votre activité ou vos projets..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-brand-primary/50 focus:outline-none resize-none"
            />
          </div>

          {/* 6. Champs Pro */}
          {isPro && (
            <div className="p-3.5 rounded-xl bg-brand-primary/5 dark:bg-brand-primary/10 border border-brand-primary/20 space-y-2.5">
              <span className="font-bold text-brand-primary dark:text-sky-300 block">Informations Entreprise BTP</span>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-200">Raison Sociale</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-brand-dark focus:ring-2 focus:ring-brand-primary/50 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-200">WhatsApp Professionnel</label>
                <input
                  type="tel"
                  value={phoneWhatsApp}
                  onChange={(e) => setPhoneWhatsApp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-brand-dark focus:ring-2 focus:ring-brand-primary/50 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-200">Spécialités (séparées par des virgules)</label>
                <input
                  type="text"
                  placeholder="Gros oeuvre, Peinture, Architecture..."
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-brand-dark focus:ring-2 focus:ring-brand-primary/50 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading || isUploadingAvatar || isUploadingCover}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading || isUploadingAvatar || isUploadingCover}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary-light transition-colors cursor-pointer disabled:opacity-60 shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Enregistrer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
