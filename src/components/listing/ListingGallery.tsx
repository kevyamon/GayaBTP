import React, { useState } from 'react';
import { Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { LandTitleType, PropertyType } from '../../types';

interface ListingGalleryProps {
  images: string[];
  title: string;
  titleType: LandTitleType;
  propertyType: PropertyType;
}

export const ListingGallery: React.FC<ListingGalleryProps> = ({
  images,
  title,
  titleType,
  propertyType,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages = images && images.length > 0 ? images : [];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="space-y-3">
      
      {/* Image Principale Grande Vue */}
      <div className="relative h-64 sm:h-96 w-full rounded-brand-xl overflow-hidden bg-slate-900 border border-brand-light-border dark:border-brand-dark-border group">
        {displayImages.length > 0 ? (
          <img
            src={displayImages[selectedIndex]}
            alt={`${title} - Vue ${selectedIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
            <ImageIcon className="w-12 h-12" />
            <span className="text-xs">Aucune image disponible</span>
          </div>
        )}

        {/* Badges de statut foncier */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
          <Badge variant={titleType === 'ACD' || titleType === 'CMP' ? 'verified' : 'secondary'} size="sm" icon>
            Titre : {titleType}
          </Badge>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-slate-900/75 text-white backdrop-blur-sm">
            {propertyType}
          </span>
        </div>

        {/* Flèches de navigation */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Compteur d'images */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-semibold backdrop-blur-sm">
            {selectedIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Miniatures */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative shrink-0 w-20 h-16 rounded-brand overflow-hidden border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-brand-primary scale-95 shadow-sm'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Miniature ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

    </div>
  );
};
