import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en/translation.json';
import hi from '../locales/hi/translation.json';
import mr from '../locales/mr/translation.json';

const translations = { en, hi, mr };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('agrinova-lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('agrinova-lang', lang);
  }, [lang]);

  // Helper to translate deep object keys like 'nav.brand'
  const t = (path) => {
    const keys = path.split('.');
    let current = translations[lang] || translations['en'];
    
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English translation
        let fallback = translations['en'];
        for (const fKey of keys) {
          if (fallback && fallback[fKey] !== undefined) {
            fallback = fallback[fKey];
          } else {
            return path; // Return the path if key not found
          }
        }
        return fallback;
      }
    }
    
    return typeof current === 'string' ? current : path;
  };

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
