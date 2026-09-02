import { useState } from 'react';
import { Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable Password Input Component with visibility toggle
 *
 * @param {Object} props
 * @param {string} props.label - Accessible label
 * @param {string} props.name - Field name
 * @param {string} props.value - Password value
 * @param {Function} props.onChange - Change event handler
 * @param {string} [props.error] - Validation error message
 * @param {string} [props.placeholder] - Placeholder text
 * @param {boolean} [props.required=false] - Whether field is required
 * @param {string} [props.autoComplete='current-password'] - Autocomplete value
 * @param {string} [props.hint] - Optional hint/requirement text
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.id] - Element ID
 * @param {string} [props.className=''] - Additional CSS classes
 */
export function PasswordInput({
  label,
  name,
  value,
  onChange,
  error = '',
  placeholder = '',
  required = false,
  autoComplete = 'current-password',
  hint = '',
  disabled = false,
  id,
  className = '',
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();

  const inputId = id || `password-input-${name}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const hasError = Boolean(error);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
          </span>
        </label>
      )}

      <div className="relative rounded-xl shadow-xs">
        {/* Leading Lock Icon */}
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
          <Lock className="w-4 h-4" />
        </div>

        {/* Input Field */}
        <input
          id={inputId}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder || t('auth.login.passwordPlaceholder')}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : hintId}
          className={`w-full rounded-xl text-sm transition-all duration-150 bg-white dark:bg-neutral-900/90 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 border pl-10 pr-11 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed ${
            hasError
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30'
              : 'border-neutral-300 dark:border-neutral-700/80 hover:border-neutral-400 dark:hover:border-neutral-600 focus:border-indigo-500 focus:ring-indigo-500/20'
          }`}
          {...rest}
        />

        {/* Visibility Toggle Button */}
        <button
          type="button"
          onClick={toggleVisibility}
          disabled={disabled}
          tabIndex={0}
          aria-label={showPassword ? t('auth.common.hidePassword') : t('auth.common.showPassword')}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors focus:outline-none cursor-pointer"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Error Message */}
      {hasError && (
        <p
          id={errorId}
          className="text-xs text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1.5 font-medium animate-in fade-in duration-150"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {/* Helper Requirement Hint */}
      {!hasError && hint && (
        <p id={hintId} className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          {hint}
        </p>
      )}
    </div>
  );
}

export default PasswordInput;
