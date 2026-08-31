/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import en from '../locales/en';
import ta from '../locales/ta';

export const LanguageContext = createContext(null);

const STORAGE_KEY = 'finproof-language';

const translations = {
  en,
  ta,
};

/**
 * Global Language Provider Component
 */
export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'ta' || saved === 'en') {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'en';
  });

  const syncDocumentLanguage = useCallback((lang) => {
    try {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
        document.documentElement.classList.remove('lang-en', 'lang-ta');
        document.documentElement.classList.add(`lang-${lang}`);
        if (document.body) {
          document.body.classList.remove('lang-en', 'lang-ta');
          document.body.classList.add(`lang-${lang}`);
        }
      }
    } catch (e) {
      console.warn('Could not sync document language classes:', e);
    }
  }, []);

  const setLanguage = useCallback(
    (newLang) => {
      const validLang = newLang === 'ta' ? 'ta' : 'en';
      setLanguageState(validLang);
      try {
        localStorage.setItem(STORAGE_KEY, validLang);
      } catch (e) {
        console.warn('Could not persist language to localStorage:', e);
      }
      syncDocumentLanguage(validLang);
    },
    [syncDocumentLanguage]
  );

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  }, [language, setLanguage]);

  useEffect(() => {
    syncDocumentLanguage(language);
  }, [language, syncDocumentLanguage]);

  /**
   * Helper function to translate a key path with optional variable interpolation
   * Example: t('history.showingRecords', { count: 15 })
   */
  const t = useCallback(
    (key, params = {}) => {
      if (!key) return '';

      const currentDict = translations[language] || translations.en;
      const fallbackDict = translations.en;

      // Traverse dot notation
      const resolveKey = (dict, path) => {
        const parts = path.split('.');
        let curr = dict;
        for (const part of parts) {
          if (curr && typeof curr === 'object' && part in curr) {
            curr = curr[part];
          } else {
            return undefined;
          }
        }
        return curr;
      };

      let translation = resolveKey(currentDict, key);

      // Fallback to English if missing in target language
      if (translation === undefined) {
        translation = resolveKey(fallbackDict, key);
      }

      // If still missing, return key itself
      if (translation === undefined) {
        return key;
      }

      // If array, return array
      if (Array.isArray(translation)) {
        return translation;
      }

      if (typeof translation !== 'string') {
        return String(translation);
      }

      // Interpolate parameters {param}
      if (params && Object.keys(params).length > 0) {
        return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey] !== undefined ? String(params[paramKey]) : match;
        });
      }

      return translation;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      isTamil: language === 'ta',
    }),
    [language, setLanguage, toggleLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageProvider;
