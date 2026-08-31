import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext.jsx';

/**
 * Custom Hook to access global language state and translation function
 *
 * @returns {{
 *   language: 'en'|'ta',
 *   setLanguage: (lang: 'en'|'ta') => void,
 *   toggleLanguage: () => void,
 *   t: (key: string, params?: Record<string, any>) => string|any,
 *   isTamil: boolean
 * }}
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default useLanguage;
