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
      <div className="grow border-t border-neutral-200 dark:border-neutral-800" />
      <span className="shrink-0 px-4 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 bg-white dark:bg-neutral-900 rounded-full">
        {dividerText}
      </span>
      <div className="grow border-t border-neutral-200 dark:border-neutral-800" />
    </div>
  );
}

export default AuthDivider;
