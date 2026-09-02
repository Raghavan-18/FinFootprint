import { Loader2 } from 'lucide-react';

/**
 * Reusable Auth Button Component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button label / content
 * @param {boolean} [props.loading=false] - Loading spinner state
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {'submit'|'button'|'reset'} [props.type='submit'] - Button type
 * @param {'primary'|'secondary'|'outline'|'ghost'} [props.variant='primary'] - Visual style
 * @param {boolean} [props.fullWidth=true] - Full width button
 * @param {React.ReactNode} [props.icon] - Leading icon
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.className=''] - Additional CSS classes
 */
export function AuthButton({
  children,
  loading = false,
  disabled = false,
  type = 'submit',
  variant = 'primary',
  fullWidth = true,
  icon = null,
  onClick,
  className = '',
  ...rest
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-bold text-sm sm:text-base rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none active:scale-[0.99]';

  const variantStyles = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/35 focus:ring-indigo-500 border border-transparent',
    secondary:
      'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 focus:ring-neutral-400 border border-neutral-200 dark:border-neutral-700',
    outline:
      'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 focus:ring-neutral-400',
    ghost:
      'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 focus:ring-neutral-400 border border-transparent',
  };

  const widthStyle = fullWidth ? 'w-full' : '';
  const sizeStyle = 'px-4 py-3 sm:py-3.5 gap-2';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyle} ${
        variantStyles[variant] || variantStyles.primary
      } ${widthStyle} ${className}`}
      {...rest}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}

export default AuthButton;
