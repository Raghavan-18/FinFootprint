/**
 * Reusable Card container component — FinFootprint v2 Design System
 *
 * Variants:
 * - default: Standard elevated surface
 * - outlined: Border emphasis, no shadow
 * - sunken: Inset/pressed appearance
 * - interactive: Hover/focus states for clickable cards
 *
 * Padding scales: none, sm, md, lg
 *
 * @param {Object} props
 * @param {'default'|'outlined'|'sunken'|'interactive'} [props.variant='default']
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
  variant = 'default',
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

  const variantStyles = {
    default:
      'bg-surface-raised border border-neutral-200 dark:border-neutral-800 shadow-xs dark:shadow-sm',
    outlined:
      'bg-surface-base border border-neutral-300 dark:border-neutral-700 shadow-none',
    sunken:
      'bg-surface-sunken border border-neutral-200 dark:border-neutral-800 shadow-inner',
    interactive:
      'bg-surface-raised border border-neutral-200 dark:border-neutral-800 shadow-xs hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 cursor-pointer',
  };

  const hoverStyle = hover && variant !== 'interactive'
    ? 'hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 cursor-pointer'
    : '';

  const hasHeader = Boolean(title || subtitle || headerAction);

  return (
    <div
      onClick={onClick}
      className={`${variantStyles[variant] || variantStyles.default} ${hoverStyle} rounded-2xl overflow-hidden ${className}`}
      {...rest}
    >
      {hasHeader && (
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-neutral-200 dark:border-neutral-800/60 flex items-center justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-50 leading-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      <div className={paddingStyles[padding] || paddingStyles.md}>{children}</div>

      {footer && (
        <div className="px-5 py-3.5 sm:px-6 bg-neutral-50/70 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800/60">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;