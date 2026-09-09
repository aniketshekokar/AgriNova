import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('agri_theme') || 'emerald';
  });

  const [easyRead, setEasyRead] = useState(() => {
    return localStorage.getItem('agri_easy_read') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('agri_theme', theme);
    const body = document.body;
    body.classList.remove('theme-emerald', 'theme-harvest', 'theme-dark');
    body.classList.add(`theme-${theme}`);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('agri_easy_read', easyRead);
    const body = document.body;
    if (easyRead) {
      body.classList.add('easy-read-mode');
    } else {
      body.classList.remove('easy-read-mode');
    }
  }, [easyRead]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const toggleEasyRead = () => {
    setEasyRead(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: toggleTheme, easyRead, toggleEasyRead }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
