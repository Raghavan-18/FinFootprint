import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable Auth Header component with FinFootprint branding
 *
 * @param {Object} props
 * @param {string} props.title - Page heading title
 * @param {string} [props.subtitle] - Explanatory subtitle
 * @param {boolean} [props.showBadge=false] - Optional trust security badge
 */
export function AuthHeader({ title, subtitle, showBadge = false }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center text-center mb-8">
      {/* Brand Icon & Application Title */}
      <div className="inline-flex items-center gap-2.5 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/25 ring-4 ring-indigo-500/10">
          F
        </div>
        <span className="font-extrabold text-xl sm:text-2xl text-neutral-900 dark:text-white tracking-tight">
          {t('common.appName')}
        </span>
      </div>

      {showBadge && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t('auth.common.secureTrustBadge')}</span>
        </div>
      )}

      {/* Main Page Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
        {title}
      </h1>

      {/* Descriptive Subtitle */}
      {subtitle && (
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2 max-w-sm leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default AuthHeader;
