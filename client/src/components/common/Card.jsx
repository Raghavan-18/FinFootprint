
/**
 * Reusable Card container component
 *
 * @param {Object} props
 * @param {string|React.ReactNode} [props.title]
 * @param {string|React.ReactNode} [props.subtitle]
 * @param {React.ReactNode} [props.headerAction]
 * @param {React.ReactNode} [props.footer]
 * @param {boolean} [props.hover=false]
 * @param {'none'|'sm'|'md'|'lg'} [props.padding='md']
 * @param {string} [props.className='']
 * @param {React.ReactNode} props.children
 */
export function Card({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  hover = false,
  padding = 'md',
  className = '',
  onClick,
  ...rest
}) {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const hoverStyle = hover
    ? 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer'
    : '';

  const hasHeader = Boolean(title || subtitle || headerAction);

  return (
    <div
      onClick={onClick}
      className={`bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/70 rounded-2xl shadow-lg shadow-black/10 overflow-hidden ${hoverStyle} ${className}`}
      {...rest}
    >
      {hasHeader && (
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100/60 dark:border-slate-800/60 flex items-center justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      <div className={paddingStyles[padding] || paddingStyles.md}>{children}</div>

      {footer && (
        <div className="px-5 py-3.5 sm:px-6 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100/60 dark:border-slate-800/60">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
