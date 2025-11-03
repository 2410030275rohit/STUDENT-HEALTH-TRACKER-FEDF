import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      // Check localStorage for saved theme preference
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme !== null) {
        return JSON.parse(savedTheme);
      }
    } catch (_) {
      // ignore and fallback
    }
    try {
      // Default to system preference (guarded)
      return typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (_) {
      return false;
    }
  });

  useEffect(() => {
    try {
      // Apply theme to document
      if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      // Save preference to localStorage
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    } catch (_) {
      // ignore storage errors
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};