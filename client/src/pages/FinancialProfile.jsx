import { useState } from 'react';
import { Sparkles, Globe, LogOut, ShieldCheck } from 'lucide-react';
import FinancialProfileForm from '../components/profile/FinancialProfileForm';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../context/AuthContext';
// TEMPORARY DEMO MODE: Switch to '../services/firestoreService' for production Firebase
import dataService from '../services/localDataService';

/**
 * Dedicated Financial Profile Setup Page for New Users / Onboarding
 *
 * @param {Object} props
 * @param {Object} [props.profile] - User profile object
 * @param {Function} props.onComplete - Callback when profile is completed successfully
 * @param {Function} [props.onNavigate] - Navigation handler
 */
export function FinancialProfilePage({
  profile,
  onComplete,
  onNavigate,
}) {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileSubmit = async (formData) => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    setIsSubmitting(true);
    try {
      const updatedProfile = await dataService.saveFinancialProfile(user.uid, formData);
      if (onComplete) {
        await onComplete(updatedProfile);
      } else if (onNavigate) {
        onNavigate('dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      if (onNavigate) onNavigate('login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white relative">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/75 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/25">
            F
          </div>
          <div>
            <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
              {t('common.appName')}
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-400 dark:text-slate-500 ml-2 font-medium">
              | {t('financialProfile.title')}
            </span>
          </div>
        </div>

        {/* Right Actions: Language Switcher & Sign Out */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <div className="flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                language === 'en'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Switch to English"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>EN</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                language === 'ta'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="தமிழுக்கு மாற்றவும்"
            >
              <span>தமிழ்</span>
            </button>
          </div>

          {/* Sign Out */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Page Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/70 via-indigo-900/55 to-slate-950/70 backdrop-blur-xl text-white p-6 sm:p-8 border border-indigo-500/30 shadow-2xl">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>{t('financialProfile.title')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t('financialProfile.title')}
            </h1>
            <p className="text-sm text-indigo-200/80 max-w-2xl leading-relaxed">
              {t('financialProfile.subtitle')}
            </p>
          </div>
        </div>

        {/* The Form */}
        <FinancialProfileForm
          initialData={profile || {}}
          onSubmit={handleProfileSubmit}
          onSkip={handleSkip}
          isSubmitting={isSubmitting}
        />
      </main>

      {/* Footer */}
      <footer className="w-full px-4 py-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-2">
        <div className="inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
          <span>{t('auth.common.secureTrustBadge')}</span>
        </div>
        <span className="hidden sm:inline text-slate-400">•</span>
        <span>© {new Date().getFullYear()} FinFootprint. {t('common.confidential')}.</span>
      </footer>
    </div>
  );
}

export default FinancialProfilePage;
