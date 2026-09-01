import { useState } from 'react';
import { User, Mail, Phone, ArrowRight, AlertCircle } from 'lucide-react';
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
 * User Sign Up Page (/signup)
 *
 * @param {Object} props
 * @param {Function} props.onNavigate - Navigation handler
 */
export function Signup({ onNavigate }) {
  const { t } = useLanguage();
  const { signup, loginWithGoogle, getAuthErrorKey } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('auth.errors.fullNameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('auth.errors.emailRequired');
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = t('auth.errors.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('auth.errors.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('auth.errors.passwordMinLength');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.confirmPasswordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.passwordsDoNotMatch');
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = t('auth.errors.termsRequired');
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
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      // Redirect to main application dashboard upon successful account creation
      if (onNavigate) {
        onNavigate('dashboard');
      }
    } catch (err) {
      const errorKey = err.translationKey || (getAuthErrorKey ? getAuthErrorKey(err) : 'auth.errors.signupFailed');
      setGeneralError(t(errorKey));
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
        const errorKey = err.translationKey || (getAuthErrorKey ? getAuthErrorKey(err) : 'auth.errors.signupFailed');
        setGeneralError(t(errorKey));
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <AuthLayout maxWidth="max-w-lg" onNavigate={onNavigate}>
      {/* Header */}
      <AuthHeader
        title={t('auth.signup.title')}
        subtitle={t('auth.signup.subtitle')}
      />

      {/* General Error Banner */}
      {generalError && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name */}
        <AuthInput
          label={t('auth.signup.fullName')}
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder={t('auth.signup.fullNamePlaceholder')}
          error={errors.fullName}
          required
          autoComplete="name"
          icon={<User className="w-4 h-4" />}
          disabled={isSubmitting || isGoogleSubmitting}
        />

        {/* Email Address */}
        <AuthInput
          label={t('auth.signup.email')}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder={t('auth.signup.emailPlaceholder')}
          error={errors.email}
          required
          autoComplete="email"
          icon={<Mail className="w-4 h-4" />}
          disabled={isSubmitting || isGoogleSubmitting}
        />

        {/* Phone Number (Optional) */}
        <AuthInput
          label={t('auth.signup.phoneOptional')}
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder={t('auth.signup.phonePlaceholder')}
          autoComplete="tel"
          icon={<Phone className="w-4 h-4" />}
          disabled={isSubmitting || isGoogleSubmitting}
        />

        {/* Password */}
        <PasswordInput
          label={t('auth.signup.password')}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder={t('auth.signup.passwordPlaceholder')}
          error={errors.password}
          required
          autoComplete="new-password"
          hint={t('auth.signup.passwordRequirement')}
          disabled={isSubmitting || isGoogleSubmitting}
        />

        {/* Confirm Password */}
        <PasswordInput
          label={t('auth.signup.confirmPassword')}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder={t('auth.signup.confirmPasswordPlaceholder')}
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
          disabled={isSubmitting || isGoogleSubmitting}
        />

        {/* Terms Agreement Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              disabled={isSubmitting || isGoogleSubmitting}
              className="mt-0.5 w-4 h-4 rounded-md border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 bg-white dark:bg-slate-800 cursor-pointer shrink-0"
            />
            <span className="leading-snug">
              {t('auth.signup.terms')}
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.agreeTerms}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <AuthButton
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting || isGoogleSubmitting}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {isSubmitting ? t('auth.signup.creatingAccount') : t('auth.signup.createAccount')}
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

      {/* Footer link to sign in */}
      <div className="mt-8 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
        <span>{t('auth.signup.haveAccount')} </span>
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('login')}
          disabled={isSubmitting || isGoogleSubmitting}
          className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors cursor-pointer ml-1"
        >
          {t('auth.signup.signIn')}
        </button>
      </div>
    </AuthLayout>
  );
}

export default Signup;
