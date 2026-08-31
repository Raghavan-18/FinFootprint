import { Fragment } from 'react';

/**
 * Reusable Page Header component
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
        <nav className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
          {breadcrumbs.map((crumb, idx) => (
            <Fragment key={idx}>
              {idx > 0 && <span>/</span>}
              {crumb.onClick ? (
                <button
                  type="button"
                  onClick={crumb.onClick}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className={idx === breadcrumbs.length - 1 ? 'font-medium text-slate-800 dark:text-slate-200' : ''}>
                  {crumb.label}
                </span>
              )}
            </Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
          {description && (
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
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
