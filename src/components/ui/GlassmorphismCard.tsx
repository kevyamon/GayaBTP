import React from 'react';

export type GlassIntensity = 'subtle' | 'medium' | 'strong';

export interface GlassmorphismCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  intensity?: GlassIntensity;
  interactive?: boolean;
  hasReflection?: boolean;
  className?: string;
}

/**
 * Composant Fondamental GlassmorphismCard — GayaBTP Design System
 * 
 * Modèle de surface multicouche :
 * 1. Surface de verre dépoli (Backdrop Blur 28px, Saturation 185%, Transparence équilibrée)
 * 2. Bordure lumineuse translucide 1px
 * 3. Double lueur interne (Highlight haut/bas)
 * 4. Couche de réflexion diagonale subtile (Reflet matière vitreuse)
 * 5. Ombre extérieure douce et diffuse (Profondeur & élévation)
 */
export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  intensity = 'medium',
  interactive = false,
  hasReflection = true,
  className = '',
  ...props
}) => {
  const intensityClasses = {
    subtle: 'glassmorphism-subtle',
    medium: 'glassmorphism-medium',
    strong: 'glassmorphism-strong',
  }[intensity];

  const interactiveClass = interactive ? 'glassmorphism-interactive' : '';

  return (
    <div
      className={`relative overflow-hidden rounded-brand-xl ${intensityClasses} ${interactiveClass} ${className}`}
      style={{ isolation: 'isolate' }}
      {...props}
    >
      {/* Couche de reflet lumineux diagonal interne du verre */}
      {hasReflection && <div className="glass-reflection-overlay" aria-hidden="true" />}

      {/* Contenu de la carte (toujours situé au-dessus des reflets et effets visuels) */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
