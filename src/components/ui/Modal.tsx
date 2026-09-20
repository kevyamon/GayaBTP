import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  disableBackdropClick?: boolean;
}

const MAX_WIDTH_CLASSES: Record<NonNullable<ModalProps['maxWidth']>, string> = {
  xs: 'max-w-sm',
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-5xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidth = 'md',
  showCloseButton = true,
  className = '',
  headerClassName = '',
  contentClassName = '',
  disableBackdropClick = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disableBackdropClick) return;
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 dark:bg-black/80 backdrop-blur-md animate-backdrop-fade overflow-y-auto overscroll-contain"
      aria-modal="true"
      role="dialog"
      style={{ touchAction: 'auto' }}
    >
      <div
        ref={modalRef}
        className={`relative w-full ${MAX_WIDTH_CLASSES[maxWidth]} my-auto bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-brand-xl sm:rounded-brand-2xl shadow-2xl overflow-hidden animate-modal-pop transform transition-all duration-200 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête de la modale */}
        {(title || showCloseButton) && (
          <div
            className={`flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 backdrop-blur-sm ${headerClassName}`}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 pr-2 min-w-0">
              {icon && (
                <div className="p-2 rounded-brand bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary shrink-0">
                  {icon}
                </div>
              )}
              <div className="min-w-0">
                {title && (
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer active:scale-95"
                aria-label="Fermer la boîte de dialogue"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        )}

        {/* Corps défilable de la modale */}
        <div
          className={`p-4 sm:p-6 max-h-[75vh] overflow-y-auto overscroll-contain ${contentClassName}`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
