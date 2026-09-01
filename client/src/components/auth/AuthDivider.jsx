import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable Auth Divider with localized center text (e.g., OR / அல்லது)
 *
 * @param {Object} props
 * @param {string} [props.text] - Optional text override
 * @param {string} [props.className=''] - Additional CSS classes
 */
export function AuthDivider({ text, className = '' }) {
  const { t } = useLanguage();
  const dividerText = text || t('auth.common.or');

  return (
    <div className={`relative flex items-center justify-center my-6 ${className}`}>
      <div className="grow border-t border-slate-200 dark:border-slate-800" />
      <span className="shrink-0 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 rounded-full">
        {dividerText}
      </span>
      <div className="grow border-t border-slate-200 dark:border-slate-800" />
    </div>
  );
}

export default AuthDivider;
