/**
 * Reusable Badge component for tags, status indicators, and micro-labels — FinFootprint v2 Design System
 *
 * Variants aligned with evidence tiers + brand:
 * - primary: Indigo (institutional trust)
 * - success: Verified green (evidence VERIFIED)
 * - warning: Turmeric/Amber (evidence SELF_DECLARED)
 * - danger: Mismatch red (evidence MISMATCH)
 * - info: Corroborated blue (evidence CORROBORATED)
 * - neutral: Warm slate (neutral)
 *
 * @param {Object} props
 * @param {'primary'|'success'|'warning'|'danger'|'info'|'neutral'} [props.variant='neutral']
 * @param {'sm'|'md'|'lg'} [props.size='sm']
 * @param {boolean} [props.dot=false]
 * @param {React.ReactNode} [props.icon]
 * @param {string} [props.className='']
 * @param {React.ReactNode} props.children
 */
export function Badge({
  children,
  variant = 'neutral',
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
    // Primary: Indigo — institutional trust, ledger ink
    primary:
      'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60',

    // Success: Verified green — evidence tier VERIFIED
    success:
      'bg-verified-bg dark:bg-verified-bg-dark text-verified dark:text-verified border-verified-border dark:border-verified-border-dark',

    // Warning: Turmeric/Amber — evidence tier SELF_DECLARED
    warning:
      'bg-self-declared-bg dark:bg-self-declared-bg-dark text-self-declared dark:text-self-declared border-self-declared-border dark:border-self-declared-border-dark',

    // Danger: Mismatch red — evidence tier MISMATCH
    danger:
      'bg-mismatch-bg dark:bg-mismatch-bg-dark text-mismatch dark:text-mismatch border-mismatch-border dark:border-mismatch-border-dark',

    // Info: Corroborated blue — evidence tier CORROBORATED
    info:
      'bg-corroborated-bg dark:bg-corroborated-bg-dark text-corroborated dark:text-corroborated border-corroborated-border dark:border-corroborated-border-dark',

    // Neutral: Warm slate — neutral
    neutral:
      'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700',
  };

  const dotStyles = {
    primary: 'bg-indigo-500',
    success: 'bg-verified',
    warning: 'bg-turmeric-500',
    danger: 'bg-mismatch',
    info: 'bg-corroborated',
    neutral: 'bg-neutral-400',
  };

  return (
    <span
      className={`inline-flex items-center leading-none select-none ${sizeStyles[size] || sizeStyles.sm} ${
        variantStyles[variant] || variantStyles.neutral
      } ${className}`}
      {...rest}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[variant] || dotStyles.neutral}`}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

export default Badge;