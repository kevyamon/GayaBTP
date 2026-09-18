import React from 'react';
import { THEME_COLORS } from '../../theme/theme';

export const OrangeCornerGrid: React.FC = () => {
  const primaryColor = THEME_COLORS.primary.DEFAULT; // Vivid Orange #E99021
  const ROWS = 4;
  const COLS = 6;
  const CELL_SIZE = 46;

  const cubes = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      // Priorité aux cubes proches de l'angle supérieur droit
      if (c + (ROWS - r) < 2) continue; // Crée un profil diagonal naturel
      
      const distance = (COLS - 1 - c) + r;
      const delay = (distance * 0.22).toFixed(2);
      const x = c * CELL_SIZE + (r % 2 === 1 ? CELL_SIZE / 2 : 0) + 16;
      const y = r * (CELL_SIZE * 0.72) + 14;

      cubes.push({
        id: `orange-cube-${r}-${c}`,
        x,
        y,
        delay: `${delay}s`,
      });
    }
  }

  return (
    <div className="absolute top-0 right-0 w-64 h-48 sm:w-80 sm:h-56 pointer-events-none select-none overflow-hidden z-0">
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 200"
        preserveAspectRatio="xMaxYMin meet"
      >
        <defs>
          {/* Lignes de trame fines en orange institutionnel */}
          <pattern
            id="orange-mesh"
            width={CELL_SIZE}
            height={CELL_SIZE * 0.72}
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2={CELL_SIZE}
              y2={CELL_SIZE * 0.72}
              stroke={primaryColor}
              strokeOpacity="0.07"
              strokeWidth="0.8"
            />
            <line
              x1={CELL_SIZE}
              y1="0"
              x2="0"
              y2={CELL_SIZE * 0.72}
              stroke={primaryColor}
              strokeOpacity="0.07"
              strokeWidth="0.8"
            />
          </pattern>

          {/* Dégradé de fondu doux vers la gauche et le bas */}
          <linearGradient id="fade-mask" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="65%" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>

          <mask id="corner-mask">
            <rect width="100%" height="100%" fill="url(#fade-mask)" />
          </mask>
        </defs>

        <g mask="url(#corner-mask)">
          {/* Trame de liaison */}
          <rect width="100%" height="100%" fill="url(#orange-mesh)" />

          {/* Rendu des cubes alvéolaires orange avec pulsation subtile */}
          {cubes.map((cube) => (
            <g key={cube.id} transform={`translate(${cube.x}, ${cube.y})`}>
              {/* Carré diamant pivoté à 45° */}
              <rect
                x="-10"
                y="-10"
                width="20"
                height="20"
                rx="3"
                transform="rotate(45)"
                fill="rgba(233, 144, 33, 0.08)"
                stroke={primaryColor}
                strokeWidth="1.2"
                className="animate-orange-pulse"
                style={{ animationDelay: cube.delay }}
              />

              {/* Nœud lumineux central */}
              <circle
                cx="0"
                cy="0"
                r="1.8"
                fill={primaryColor}
                className="animate-orange-pulse"
                style={{ animationDelay: cube.delay }}
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};
