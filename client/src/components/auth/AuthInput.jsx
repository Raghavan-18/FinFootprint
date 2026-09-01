import { AlertCircle } from 'lucide-react';

/**
 * Reusable Authentication Text Input Component
 *
 * @param {Object} props
 * @param {string} props.label - Input label text
 * @param {string} [props.type='text'] - HTML input type
 * @param {string} props.name - Form field name
 * @param {string|number} props.value - Controlled input value
 * @param {Function} props.onChange - Change handler
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.error] - Validation error message
 * @param {boolean} [props.required=false] - Whether field is required
 * @param {string} [props.id] - Element id
 * @param {string} [props.autoComplete] - Autocomplete attribute
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {React.ReactNode} [props.icon] - Leading icon
 * @param {string} [props.helperText] - Supplementary hint text
 * @param {string} [props.className=''] - Additional CSS classes
 */
export function AuthInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  id,
  autoComplete,
  disabled = false,
  icon = null,
  helperText = '',
  className = '',
  ...rest
}) {
  const inputId = id || `auth-input-${name}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const hasError = Boolean(error);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
          </span>
        </label>
      )}

      <div className="relative rounded-xl shadow-xs">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={errorId}
          className={`w-full rounded-xl text-sm transition-all duration-150 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed ${
            icon ? 'pl-10 pr-3.5 py-2.5 sm:py-3' : 'px-3.5 py-2.5 sm:py-3'
          } ${
            hasError
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30'
              : 'border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20'
          }`}
          {...rest}
        />
      </div>

      {hasError && (
        <p
          id={errorId}
          className="text-xs text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1.5 font-medium animate-in fade-in duration-150"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {!hasError && helperText && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{helperText}</p>
      )}
    </div>
  );
}

export default AuthInput;
