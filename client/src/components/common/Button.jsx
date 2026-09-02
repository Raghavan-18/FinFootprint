import { Loader2 } from 'lucide-react';

/**
 * Reusable Button Component supporting multiple variants and states.
 *
 * Design system: FinFootprint v2
 * - Primary: Indigo (institutional trust, ledger ink)
 * - Success: Verified green (evidence tier)
 * - Warning: Turmeric/Amber (self-declared, pending)
 * - Danger: Mismatch red (discrepancy)
 * - Secondary: Warm slate (neutral actions)
 * - Outline: Subtle bordered
 * - Ghost: Minimal, text-only
 *
 * @param {Object} props
 * @param {'primary'|'secondary'|'outline'|'danger'|'ghost'|'success'|'warning'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md']
 * @param {boolean} [props.isLoading=false]
 * @param {React.ReactNode} [props.icon]
 * @param {React.ReactNode} [props.rightIcon]
 * @param {boolean} [props.fullWidth=false]
 * @param {string} [props.className='']
 * @param {React.ReactNode} props.children
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon = null,
  rightIcon = null,
  fullWidth = false,
  className = '',
  type = 'button',
  onClick,
  ...rest
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2.5 gap-2 h-10',
    lg: 'text-base px-6 py-3 gap-2.5 h-12',
    xl: 'text-lg px-8 py-4 gap-3 h-14',
  };

  const variantStyles = {
    // Primary: Indigo — institutional trust, ledger ink
    primary:
      'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-xs hover:shadow-sm focus:ring-indigo-500 border border-transparent dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:active:bg-indigo-800',

    // Success: Verified green — evidence tier VERIFIED
    success:
      'bg-verified hover:bg-verified-dark active:bg-verified-light text-white shadow-xs hover:shadow-sm focus:ring-verified border border-transparent dark:bg-verified dark:hover:bg-verified-dark dark:active:bg-verified-light',

    // Warning: Turmeric/Amber — evidence tier SELF_DECLARED, pending
    warning:
      'bg-turmeric-500 hover:bg-turmeric-600 active:bg-turmeric-700 text-white shadow-xs hover:shadow-sm focus:ring-turmeric-500 border border-transparent dark:bg-turmeric-500 dark:hover:bg-turmeric-600 dark:active:bg-turmeric-700',

    // Danger: Mismatch red — evidence tier MISMATCH
    danger:
      'bg-mismatch hover:bg-mismatch-dark active:bg-mismatch-light text-white shadow-xs hover:shadow-sm focus:ring-mismatch border border-transparent dark:bg-mismatch dark:hover:bg-mismatch-dark dark:active:bg-mismatch-light',

    // Secondary: Warm slate — neutral actions
    secondary:
      'bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 dark:text-neutral-100 shadow-xs focus:ring-neutral-400 border border-neutral-200 dark:border-neutral-700',

    // Outline: Subtle bordered
    outline:
      'bg-transparent hover:bg-neutral-100 active:bg-neutral-200 text-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800/80 dark:active:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:ring-neutral-400',

    // Ghost: Minimal, text-only
    ghost:
      'bg-transparent hover:bg-neutral-100 active:bg-neutral-200 text-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:active:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 focus:ring-neutral-400 border border-transparent',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${widthStyle} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}

export default Button;