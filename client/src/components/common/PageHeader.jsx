import { Fragment } from 'react';

/**
 * Reusable Page Header component — FinFootprint v2 Design System
 *
 * Features:
 * - Breadcrumbs with neutral warm slate
 * - Title with distinctive weight
 * - Optional badge (for status, counts, etc.)
 * - Optional action area (buttons, dropdowns)
 *
 * @param {Object} props
 * @param {string|React.ReactNode} props.title
 * @param {string|React.ReactNode} [props.description]
 * @param {React.ReactNode} [props.badge]
 * @param {React.ReactNode} [props.action]
 * @param {Array<{ label: string, onClick?: () => void }>} [props.breadcrumbs]
 * @param {string} [props.className='']
 */
export function PageHeader({
  title,
  description,
  badge = null,
  action = null,
  breadcrumbs = null,
  className = '',
}) {
  return (
    <div className={`mb-8 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-2 text-xs text-neutral-500 dark:text-neutral-400 mb-3" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, idx) => (
            <Fragment key={idx}>
              {idx > 0 && (
                <span className="text-neutral-400 dark:text-neutral-500" aria-hidden="true">
                  /
                </span>
              )}
              {crumb.onClick ? (
                <button
                  type="button"
                  onClick={crumb.onClick}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer text-neutral-600 dark:text-neutral-400 font-medium"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className={idx === breadcrumbs.length - 1 ? 'font-semibold text-neutral-900 dark:text-neutral-100' : ''}>
                  {crumb.label}
                </span>
              )}
            </Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-neutral-950 dark:text-neutral-50">
              {title}
            </h1>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
          {description && (
            <p className="mt-2 text-base text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
      </div>
    </div>
  );
}

export default PageHeader;