import { Inbox } from 'lucide-react';

/**
 * Reusable Empty State placeholder component
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.icon]
 * @param {string} [props.title='No records found']
 * @param {string} [props.description='Try adjusting your filters or search terms.']
 * @param {React.ReactNode} [props.action]
 * @param {string} [props.className='']
 */
export function EmptyState({
  icon = null,
  title = 'No records found',
  description = 'Try adjusting your filters or search terms.',
  action = null,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-4">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default EmptyState;
