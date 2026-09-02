import { useState } from 'react';
import { Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthHeader from '../../components/auth/AuthHeader';
import AuthInput from '../../components/auth/AuthInput';
import PasswordInput from '../../components/auth/PasswordInput';
import AuthButton from '../../components/auth/AuthButton';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';
import AuthDivider from '../../components/auth/AuthDivider';

/**
 * User Login Page (/login)
 *
 * @param {Object} props
 * @param {Function} props.onNavigate - Navigation handler to switch between auth views & dashboard
 */
export function Login({ onNavigate }) {
  const { t } = useLanguage();
  const { login, loginWithGoogle, getAuthErrorKey } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // Email format validator
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear field-specific error upon typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = t('auth.errors.emailRequired');
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = t('auth.errors.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('auth.errors.passwordRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await login(formData.email, formData.password);
      // Navigate to main application dashboard on successful login
      if (onNavigate) {
        onNavigate('dashboard');
      }
    } catch (err) {
      const code = err?.code || '';
      const errorKey = err?.translationKey || (getAuthErrorKey ? getAuthErrorKey(err) : '');

      const isPasswordError =
        code === 'auth/invalid-credential' ||
        code === 'auth/invalid-login-credentials' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found' ||
        errorKey === 'auth.incorrectPassword' ||
        errorKey === 'auth.errors.invalidCredential' ||
        errorKey === 'auth.errors.wrongPassword';

      if (isPasswordError) {
        setErrors((prev) => ({
          ...prev,
          password: t('auth.incorrectPassword'),
        }));
        setGeneralError('');
      } else {
        const fallbackKey = errorKey || 'auth.errors.loginFailed';
        setGeneralError(t(fallbackKey));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGeneralError('');
      setIsGoogleSubmitting(true);
      await loginWithGoogle();
      if (onNavigate) {
        onNavigate('dashboard');
      }
    } catch (err) {
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        const errorKey = err.translationKey || (getAuthErrorKey ? getAuthErrorKey(err) : 'auth.errors.loginFailed');
        setGeneralError(t(errorKey));
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <AuthLayout maxWidth="max-w-md" onNavigate={onNavigate}>
      {/* Header */}
      <AuthHeader
        title={t('auth.login.title')}
        subtitle={t('auth.login.subtitle')}
      />

      {/* Demo Credentials Quick Fill Banner */}
      <div className="mb-4 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs flex items-center justify-between gap-2">
        <span className="text-indigo-800 dark:text-indigo-200 font-medium">
          {t('demo.demoCredentials')}
        </span>
        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              email: 'demo@finfootprint.local',
              password: 'demo12345',
            }))
          }
          className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] shrink-0 transition-colors cursor-pointer"
        >
          {t('demo.fillDemo')}
        </button>
      </div>

      {/* General error message banner */}
      {generalError && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Address */}
        <AuthInput
          label={t('auth.login.email')}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder={t('auth.login.emailPlaceholder')}
          error={errors.email}
          required
          autoComplete="email"
          icon={<Mail className="w-4 h-4" />}
          disabled={isSubmitting || isGoogleSubmitting}
        />

        {/* Password */}
        <PasswordInput
          label={t('auth.login.password')}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder={t('auth.login.passwordPlaceholder')}
          error={errors.password}
          required
          autoComplete="current-password"
          disabled={isSubmitting || isGoogleSubmitting}
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
          <label className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-4 h-4 rounded-md border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 bg-white dark:bg-slate-800 cursor-pointer"
            />
            <span>{t('auth.login.rememberMe')}</span>
          </label>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('forgot-password')}
            disabled={isSubmitting || isGoogleSubmitting}
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors cursor-pointer"
          >
            {t('auth.login.forgotPassword')}
          </button>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <AuthButton
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting || isGoogleSubmitting}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {isSubmitting ? t('auth.login.signingIn') : t('auth.login.signIn')}
          </AuthButton>
        </div>
      </form>

      {/* Divider */}
      <AuthDivider />

      {/* Google Authentication */}
      <GoogleAuthButton
        onClick={handleGoogleSignIn}
        loading={isGoogleSubmitting}
        disabled={isSubmitting || isGoogleSubmitting}
      />

      {/* Footer link to sign up */}
      <div className="mt-8 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
        <span>{t('auth.login.noAccount')} </span>
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('signup')}
          disabled={isSubmitting || isGoogleSubmitting}
          className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors cursor-pointer ml-1"
        >
          {t('auth.login.createAccount')}
        </button>
      </div>
    </AuthLayout>
  );
}

export default Login;
