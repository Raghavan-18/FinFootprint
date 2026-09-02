import { Inbox, Plus } from 'lucide-react';
import Button from './Button';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable Empty State placeholder component with localization — FinFootprint v2 Design System
 *
 * Uses warm slate surfaces, indigo brand accents.
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.icon]
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {string} [props.buttonText]
 * @param {Function} [props.onAction]
 * @param {React.ReactNode} [props.action]
 * @param {string} [props.className='']
 */
export function EmptyState({
  icon = null,
  title,
  description,
  buttonText,
  onAction,
  action = null,
  className = '',
}) {
  const { t } = useLanguage();

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 flex items-center justify-center mb-4">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
        {title || t('common.noRecordsFound')}
      </h3>
      <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm">
        {description || t('common.noRecordsDesc')}
      </p>

      {buttonText && onAction && (
        <div className="mt-5">
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={onAction}
          >
            {buttonText}
          </Button>
        </div>
      )}

      {action && !buttonText && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default EmptyState;