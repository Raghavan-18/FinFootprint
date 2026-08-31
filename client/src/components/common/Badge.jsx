
/**
 * Reusable Badge component for tags, status indicators, and micro-labels.
 *
 * @param {Object} props
 * @param {'slate'|'indigo'|'emerald'|'blue'|'amber'|'rose'|'purple'} [props.variant='slate']
 * @param {'sm'|'md'|'lg'} [props.size='sm']
 * @param {boolean} [props.dot=false]
 * @param {React.ReactNode} [props.icon]
 * @param {string} [props.className='']
 * @param {React.ReactNode} props.children
 */
export function Badge({
  children,
  variant = 'slate',
  size = 'sm',
  dot = false,
  icon = null,
  className = '',
  ...rest
}) {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5 font-medium rounded-full',
    md: 'text-xs px-3 py-1 gap-1.5 font-semibold rounded-full',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold rounded-full',
  };

  const variantStyles = {
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    indigo: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60',
    blue: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60',
    amber: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60',
    rose: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60',
    purple: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60',
  };

  const dotStyles = {
    slate: 'bg-slate-400',
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    purple: 'bg-purple-500',
  };

  return (
    <span
      className={`inline-flex items-center leading-none select-none ${sizeStyles[size] || sizeStyles.sm} ${
        variantStyles[variant] || variantStyles.slate
      } ${className}`}
      {...rest}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[variant] || 'bg-slate-400'}`}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
