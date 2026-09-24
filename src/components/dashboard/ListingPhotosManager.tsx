import React, { useRef } from 'react';
import { Image, Upload, Loader2, Trash2 } from 'lucide-react';
import { uploadService } from '../../services/upload.service';
import { useToast } from '../../contexts/ToastContext';

interface ListingPhotosManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
}

export const ListingPhotosManager: React.FC<ListingPhotosManagerProps> = ({
  images,
  onChange,
  isUploading,
  setIsUploading,
}) => {
  const { success, error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadService.uploadImage(file, 'gayabtp/listings');
      onChange([...images, res.url]);
      success('Image ajoutée !', 'La photo a été téléversée.');
    } catch {
      error('Échec du téléversement de la photo.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <Image className="w-4 h-4 text-brand-primary" />
          <span>Photos ({images.length})</span>
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAddImage}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary dark:text-sky-300 font-bold text-xs cursor-pointer"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Téléversement...</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span>Ajouter une photo</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {images.map((img, idx) => (
          <div key={idx} className="relative h-16 rounded-xl overflow-hidden group border border-slate-200 dark:border-white/10">
            <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveImage(idx)}
              className="absolute inset-0 bg-black/60 text-rose-400 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              title="Supprimer la photo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
