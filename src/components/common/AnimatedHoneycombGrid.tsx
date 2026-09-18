import React from 'react';

export const AnimatedHoneycombGrid: React.FC = () => {
  const ROWS = 6;
  const COLS = 15;
  const CELL_SIZE = 68;
  const STEP_DELAY = 0.075;
  const MAX_DISTANCE = (COLS - 1) + (ROWS - 1);
  // La vague aller se termine vers 1.85s ; la vague retour démarre 2s après (3.85s)
  const RETURN_BASE_DELAY = 3.85;

  const cubes = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      // Distance depuis le coin supérieur droit pour la vague aller
      const forwardDist = (COLS - 1 - c) + r;
      // Distance inversée depuis le coin inférieur gauche pour la vague retour
      const returnDist = MAX_DISTANCE - forwardDist;

      const forwardDelay = (forwardDist * STEP_DELAY).toFixed(3);
      const returnDelay = (RETURN_BASE_DELAY + returnDist * STEP_DELAY).toFixed(3);

      const x = c * CELL_SIZE + (r % 2 === 1 ? CELL_SIZE / 2 : 0) + 15;
      const y = r * (CELL_SIZE * 0.72) + 20;

      cubes.push({
        id: `${r}-${c}`,
        x,
        y,
        forwardDelay: `${forwardDelay}s`,
        returnDelay: `${returnDelay}s`,
      });
    }
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 320"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Lignes structurelles de maillage */}
          <pattern
            id="hive-connections"
            width={CELL_SIZE}
            height={CELL_SIZE * 0.72}
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2={CELL_SIZE}
              y2={CELL_SIZE * 0.72}
              stroke="#91C29E"
              strokeOpacity="0.08"
              strokeWidth="1"
            />
            <line
              x1={CELL_SIZE}
              y1="0"
              x2="0"
              y2={CELL_SIZE * 0.72}
              stroke="#91C29E"
              strokeOpacity="0.08"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* Trame de liaison en arrière-plan */}
        <rect width="100%" height="100%" fill="url(#hive-connections)" />

        {/* Rendu des cubes alvéolaires avec vagues aller et retour */}
        {cubes.map((cube) => (
          <g key={cube.id} transform={`translate(${cube.x}, ${cube.y})`}>
            {/* 1. Carré losange statique ambiant */}
            <rect
              x="-14"
              y="-14"
              width="28"
              height="28"
              rx="4"
              transform="rotate(45)"
              fill="rgba(44, 95, 124, 0.2)"
              stroke="#91C29E"
              strokeOpacity="0.32"
              strokeWidth="1.25"
            />

            {/* 2. Nœud central statique ambiant */}
            <circle
              cx="0"
              cy="0"
              r="2.5"
              fill="#91C29E"
              fillOpacity="0.35"
            />

            {/* 3. Lueur dynamique : Vague Aller (Haut-Droit vers Bas-Gauche) */}
            <rect
              x="-14"
              y="-14"
              width="28"
              height="28"
              rx="4"
              fill="rgba(233, 144, 33, 0.15)"
              stroke="#E99021"
              strokeWidth="2.2"
              className="animate-cube-pulse"
              style={{ animationDelay: cube.forwardDelay }}
            />
            <circle
              cx="0"
              cy="0"
              r="2.5"
              fill="#E99021"
              className="animate-node-pulse"
              style={{ animationDelay: cube.forwardDelay }}
            />

            {/* 4. Lueur dynamique : Vague Retour (Bas-Gauche vers Haut-Droit, 2s après) */}
            <rect
              x="-14"
              y="-14"
              width="28"
              height="28"
              rx="4"
              fill="rgba(233, 144, 33, 0.15)"
              stroke="#E99021"
              strokeWidth="2.2"
              className="animate-cube-pulse"
              style={{ animationDelay: cube.returnDelay }}
            />
            <circle
              cx="0"
              cy="0"
              r="2.5"
              fill="#E99021"
              className="animate-node-pulse"
              style={{ animationDelay: cube.returnDelay }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};
