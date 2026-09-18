import React from 'react';
import { THEME_COLORS } from '../../theme/theme';

export const OrangeHoneycombGrid: React.FC = () => {
  const primaryColor = THEME_COLORS.primary.DEFAULT; // Vivid Orange #E99021
  const ROWS = 4;
  const COLS = 18;
  const CELL_SIZE = 80;

  const cubes = [];
  const centerCol = Math.floor(COLS / 2);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const distance = Math.abs(c - centerCol) + r;
      const delay = (distance * 0.12).toFixed(2);
      const x = c * CELL_SIZE + (r % 2 === 1 ? CELL_SIZE / 2 : 0) + 15;
      const y = r * (CELL_SIZE * 0.7) + 15;

      cubes.push({
        id: `cube-${r}-${c}`,
        x,
        y,
        delay: `${delay}s`,
      });
    }
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0">
      <svg
        className="w-full h-full opacity-70"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 240"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="orange-full-mesh"
            width={CELL_SIZE}
            height={CELL_SIZE * 0.7}
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2={CELL_SIZE}
              y2={CELL_SIZE * 0.7}
              stroke={primaryColor}
              strokeOpacity="0.12"
              strokeWidth="1"
            />
            <line
              x1={CELL_SIZE}
              y1="0"
              x2="0"
              y2={CELL_SIZE * 0.7}
              stroke={primaryColor}
              strokeOpacity="0.12"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* Trame de fond géométrique */}
        <rect width="100%" height="100%" fill="url(#orange-full-mesh)" />

        {/* Nœuds alvéolaires légers */}
        {cubes.map((cube) => (
          <g key={cube.id} transform={`translate(${cube.x}, ${cube.y})`}>
            <rect
              x="-10"
              y="-10"
              width="20"
              height="20"
              rx="3"
              transform="rotate(45)"
              fill="rgba(233, 144, 33, 0.18)"
              stroke={primaryColor}
              strokeWidth="1.4"
              className="animate-orange-pulse"
              style={{ animationDelay: cube.delay }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

