import { Loader2 } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable Loading State Component with localization
 *
 * @param {Object} props
 * @param {'spinner'|'skeleton'|'cards'} [props.type='spinner']
 * @param {string} [props.message]
 * @param {number} [props.count=3]
 * @param {string} [props.className='']
 */
export function LoadingState({
  type = 'spinner',
  message,
  count = 3,
  className = '',
}) {
  const { t } = useLanguage();

  if (type === 'skeleton') {
    return (
      <div className={`space-y-4 animate-pulse ${className}`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="h-16 bg-slate-100 dark:bg-slate-800/60 rounded-xl w-full"
          />
        ))}
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse ${className}`}
      >
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="h-36 bg-slate-100 dark:bg-slate-800/60 rounded-2xl p-5"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-slate-500 dark:text-slate-400 ${className}`}
    >
      <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mb-3" />
      <p className="text-sm font-medium">{message || t('common.loadingData')}</p>
    </div>
  );
}

export default LoadingState;
