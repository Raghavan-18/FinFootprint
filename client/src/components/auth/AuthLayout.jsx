import { Globe, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable Auth Layout Wrapper for Login, Signup, and Forgot Password
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page contents
 * @param {string} [props.maxWidth='max-w-md'] - Card maximum width
 * @param {Function} [props.onNavigate] - Navigation handler
 * @param {string} [props.className=''] - Custom container class
 */
export function AuthLayout({
  children,
  maxWidth = 'max-w-md',
  onNavigate,
  className = '',
}) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden transition-colors">
      {/* Background ambient lighting accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/15 blur-[120px] rounded-full" />
        <div className="absolute -bottom-40 right-10 w-[400px] h-[300px] bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] rounded-full" />
      </div>

      {/* Top Header Bar with App Link & Language Switcher */}
      <header className="relative z-10 w-full px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
        {/* Return to App Button */}
        {onNavigate ? (
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('common.appName')}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/20">
              F
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
              {t('common.appName')}
            </span>
          </div>
        )}

        {/* Global Language Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
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
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              language === 'ta'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="தமிழுக்கு மாற்றவும்"
          >
            <span>தமிழ்</span>
          </button>
        </div>
      </header>

      {/* Main Content Area: Centered Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div
          className={`w-full ${maxWidth} bg-white dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-900/5 dark:shadow-black/40 backdrop-blur-xl transition-all ${className}`}
        >
          {children}
        </div>
      </main>

      {/* Bottom Footer Notice */}
      <footer className="relative z-10 w-full px-4 py-4 sm:py-6 text-center text-xs text-slate-500 dark:text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-2">
        <div className="inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
          <span>{t('auth.common.secureTrustBadge')}</span>
        </div>
        <span className="hidden sm:inline text-slate-400 dark:text-slate-600">•</span>
        <span>© {new Date().getFullYear()} FinFootprint. {t('common.confidential')}.</span>
      </footer>
    </div>
  );
}

export default AuthLayout;
