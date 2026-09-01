import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, Send, AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthHeader from '../../components/auth/AuthHeader';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';

/**
 * Forgot Password Page (/forgot-password)
 *
 * @param {Object} props
 * @param {Function} props.onNavigate - Navigation handler
 */
export function ForgotPassword({ onNavigate }) {
  const { t } = useLanguage();
  const { resetPassword, getAuthErrorKey } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isValidEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
    if (generalError) setGeneralError('');
  };

  const validateForm = () => {
    if (!email.trim()) {
      setError(t('auth.errors.emailRequired'));
      return false;
    }
    if (!isValidEmail(email)) {
      setError(t('auth.errors.emailInvalid'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      const errorKey = err.translationKey || (getAuthErrorKey ? getAuthErrorKey(err) : 'auth.errors.resetFailed');
      setGeneralError(t(errorKey));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout maxWidth="max-w-md" onNavigate={onNavigate}>
      {!isSubmitted ? (
        <>
          {/* Header */}
          <AuthHeader
            title={t('auth.forgotPassword.title')}
            subtitle={t('auth.forgotPassword.subtitle')}
          />

          {/* General Error Banner */}
          {generalError && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <AuthInput
              label={t('auth.forgotPassword.email')}
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder={t('auth.forgotPassword.emailPlaceholder')}
              error={error}
              required
              autoComplete="email"
              icon={<Mail className="w-4 h-4" />}
              disabled={isSubmitting}
            />

            <div className="pt-2">
              <AuthButton
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                icon={<Send className="w-4 h-4" />}
              >
                {isSubmitting ? t('auth.forgotPassword.sendingResetLink') : t('auth.forgotPassword.sendResetLink')}
              </AuthButton>
            </div>
          </form>

          {/* Return to login link */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('login')}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('auth.forgotPassword.backToSignIn')}</span>
            </button>
          </div>
        </>
      ) : (
        /* Success State */
        <div className="text-center py-2 animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-6 shadow-md shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('auth.forgotPassword.checkEmail')}
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
            {t('auth.forgotPassword.checkEmailSubtitle')}
          </p>

          <div className="my-5 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-mono text-slate-800 dark:text-slate-200 break-all">
            <span className="text-slate-400 font-sans block mb-0.5">{t('auth.forgotPassword.emailSentTo')}</span>
            <strong>{email}</strong>
          </div>

          <div className="space-y-3 pt-2">
            <AuthButton
              type="button"
              variant="primary"
              onClick={() => onNavigate && onNavigate('login')}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              {t('auth.forgotPassword.backToSignIn')}
            </AuthButton>

            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('auth.forgotPassword.resendLink')}</span>
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

export default ForgotPassword;
