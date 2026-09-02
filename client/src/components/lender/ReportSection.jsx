

/**
 * Reusable ReportSection component for Lender Reports
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} [props.headerAction]
 * @param {string} [props.className='']
 * @param {React.ReactNode} props.children
 */
export function ReportSection({
  title,
  subtitle,
  headerAction,
  className = '',
  children,
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-xs">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

export default ReportSection;
