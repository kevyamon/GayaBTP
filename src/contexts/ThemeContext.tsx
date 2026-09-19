import React, { createContext, useContext, useLayoutEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Fonction synchrone pour modifier le DOM et éviter tout clignotement ou ralentissement GPU
const applyThemeToDOM = (newTheme: Theme) => {
  const root = document.documentElement;
  root.classList.add('disable-transitions');
  if (newTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem('gayabtp_theme', newTheme);
  // Réactivation fluide après le swap immédiat
  requestAnimationFrame(() => {
    root.classList.remove('disable-transitions');
  });
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('gayabtp_theme') as Theme | null;
    const initialTheme: Theme = saved === 'light' || saved === 'dark' ? saved : 'light';
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return initialTheme;
  });

  useLayoutEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      applyThemeToDOM(next);
      return next;
    });
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    applyThemeToDOM(newTheme);
    setThemeState(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé à l’intérieur d’un ThemeProvider');
  }
  return context;
};
