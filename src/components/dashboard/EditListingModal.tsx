import React, { useState, useEffect } from 'react';
import { X, Trash2, Save, Loader2, Tag } from 'lucide-react';
import { IListing, LandTitleType, PropertyType } from '../../types';
import { listingService } from '../../services/listing.service';
import { useToast } from '../../contexts/ToastContext';
import { ListingPhotosManager } from './ListingPhotosManager';

interface EditListingModalProps {
  listing: IListing | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updated: IListing) => void;
  onDeleted: (id: string) => void;
}

const TITLE_TYPES: LandTitleType[] = ['ACD', 'CMP', 'Lettre d’Attribution', 'Approbation', 'Titre Foncier'];

export const EditListingModal: React.FC<EditListingModalProps> = ({
  listing,
  isOpen,
  onClose,
  onUpdated,
  onDeleted,
}) => {
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [priceFCFA, setPriceFCFA] = useState<number>(0);
  const [surfaceM2, setSurfaceM2] = useState<number>(0);
  const [titleType, setTitleType] = useState<LandTitleType>('ACD');
  const [propertyType, setPropertyType] = useState<PropertyType>('terrain');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState<'published' | 'pending_review' | 'sold'>('published');
  const [contactPhone, setContactPhone] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (listing) {
      setTitle(listing.title || '');
      setPriceFCFA(listing.priceFCFA || 0);
      setSurfaceM2(listing.surfaceM2 || 0);
      setTitleType((listing.titleType as LandTitleType) || 'ACD');
      setPropertyType(listing.propertyType || 'terrain');
      setCity(listing.city || '');
      setDistrict(listing.district || '');
      setDescription(listing.description || '');
      setImages(listing.images || []);
      setStatus(
        listing.status === 'pending_review' || listing.status === 'pending'
          ? 'pending_review'
          : listing.status === 'sold'
          ? 'sold'
          : 'published'
      );
      setContactPhone(listing.contactPhone || listing.contactWhatsApp || '');
    }
  }, [listing]);

  if (!isOpen || !listing) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || priceFCFA <= 0) {
      error('Veuillez renseigner un titre et un prix valides.');
      return;
    }

    setIsLoading(true);
    try {
      const updated = await listingService.updateListing(listing._id, {
        title: title.trim(),
        priceFCFA,
        surfaceM2,
        titleType,
        propertyType,
        city: city.trim(),
        district: district.trim(),
        description: description.trim(),
        images,
        status,
        contactPhone: contactPhone.trim(),
      });

      success('Annonce mise à jour !', 'Les modifications ont été enregistrées.');
      onUpdated(updated);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la mise à jour.';
      error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;

    setIsDeleting(true);
    try {
      await listingService.deleteListing(listing._id);
      success('Annonce supprimée', 'L’annonce a été retirée du catalogue.');
      onDeleted(listing._id);
      onClose();
    } catch {
      error('Impossible de supprimer l’annonce.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-brand-dark-surface rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col border border-brand-light-border dark:border-brand-dark-border shadow-elevated overflow-hidden">
        
        {/* En-tête */}
        <div className="p-4 sm:p-5 border-b border-brand-light-border dark:border-brand-dark-border flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-brand-primary" />
            <span>Modifier l’annonce</span>
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

        {/* Formulaire */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {/* Titre */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-200">Titre de l’annonce *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-brand-primary/50 focus:outline-none"
            />
          </div>

          {/* Prix, Surface et Statut */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-200">Prix (FCFA) *</label>
              <input
                type="number"
                required
                min={0}
                value={priceFCFA}
                onChange={(e) => setPriceFCFA(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-brand-primary/50 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-200">Surface (m²)</label>
              <input
                type="number"
                min={0}
                value={surfaceM2}
                onChange={(e) => setSurfaceM2(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-brand-primary/50 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-200">Statut</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'published' | 'pending_review' | 'sold')}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-brand-primary/50 focus:outline-none"
              >
                <option value="published">En ligne (Actif)</option>
                <option value="pending_review">En examen</option>
                <option value="sold">Vendu / Loué</option>
              </select>
            </div>
          </div>

          {/* Titre Foncier & Localisation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-200">Titre Foncier</label>
              <select
                value={titleType}
                onChange={(e) => setTitleType(e.target.value as LandTitleType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-brand-primary/50 focus:outline-none"
              >
                {TITLE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-200">Ville</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-brand-primary/50 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-200">Commune / Quartier</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-brand-primary/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Photos (Upload Cloudinary Galerie) */}
          <ListingPhotosManager
            images={images}
            onChange={setImages}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />

          {/* Description */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-200">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-brand-primary/50 focus:outline-none resize-none"
            />
          </div>

          {/* Téléphone de Contact */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-200">Téléphone de contact</label>
            <input
              type="tel"
              placeholder="+225 07 00 00 00 00"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-brand-primary/50 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isDeleting ? 'Suppression...' : 'Supprimer'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer text-xs"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading || isUploading}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary-light transition-colors cursor-pointer disabled:opacity-60 shadow-md text-xs sm:text-sm"
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
          </div>
        </form>
      </div>
    </div>
  );
};
