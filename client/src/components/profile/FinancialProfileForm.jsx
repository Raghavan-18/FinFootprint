import { useState, useMemo, useCallback } from 'react';
import { ShieldCheck, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import IncomeSection from './IncomeSection';
import HousingSection from './HousingSection';
import LoanSection from './LoanSection';
import ExpenseSection from './ExpenseSection';
import ProfileSummary from './ProfileSummary';
import ProfileProgress from './ProfileProgress';
import Button from '../common/Button';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Main FinancialProfileForm Component
 * Coordinates all profile sections, live calculations, validation, and submission
 *
 * @param {Object} props
 * @param {Object} [props.initialData] - Existing profile if any
 * @param {Function} props.onSubmit - (formData) => Promise<void>
 * @param {Function} [props.onSkip] - () => void
 * @param {boolean} [props.isSubmitting=false]
 */
export function FinancialProfileForm({
  initialData = {},
  onSubmit,
  onSkip,
  isSubmitting = false,
}) {
  const { t } = useLanguage();

  const [formData, setFormData] = useState(() => ({
    monthlyIncome: initialData?.monthlyIncome ?? '',
    incomeType: initialData?.incomeType || 'SALARY',
    incomeStability: initialData?.incomeStability || 'FIXED',
    occupation: initialData?.occupation || '',
    housing: initialData?.housing || {
      status: 'OWN',
      ownershipStatus: 'FULLY_OWNED',
      propertyValue: '',
      monthlyRent: '',
      landlordContact: '',
    },
    loans: Array.isArray(initialData?.loans) ? initialData.loans : [],
    monthlyExpenses: initialData?.monthlyExpenses || {
      food: '',
      rent: '',
      utilities: '',
      transport: '',
      education: '',
      medical: '',
      loanEmi: '',
      other: '',
    },
  }));

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle nested form changes
  const handleFieldChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field-level error
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setSubmitError('');
  }, []);

  // Compute active step based on filled sections
  const currentStep = useMemo(() => {
    if (!formData.monthlyIncome && formData.monthlyIncome !== 0) return 1;
    if (formData.housing?.status === 'RENTED' && !formData.housing?.monthlyRent) return 2;
    if (formData.loans.length === 0) return 3;
    return 4;
  }, [formData]);

  // Validation Logic
  const validateForm = () => {
    const newErrors = {};

    // 1. Monthly Income
    if (formData.monthlyIncome === '' || formData.monthlyIncome === null || formData.monthlyIncome === undefined) {
      newErrors.monthlyIncome = t('financialProfile.validation.incomeRequired');
    } else if (Number(formData.monthlyIncome) < 0) {
      newErrors.monthlyIncome = t('financialProfile.validation.incomePositive');
    }

    // 2. Housing
    if (formData.housing?.status === 'RENTED') {
      if (formData.housing.monthlyRent === '' || formData.housing.monthlyRent === null) {
        newErrors.monthlyRent = t('financialProfile.validation.rentPositive');
      } else if (Number(formData.housing.monthlyRent) < 0) {
        newErrors.monthlyRent = t('financialProfile.validation.rentPositive');
      }

      if (formData.housing.landlordContact && formData.housing.landlordContact.trim()) {
        const cleanPhone = formData.housing.landlordContact.replace(/\D/g, '');
        if (cleanPhone.length < 10 || cleanPhone.length > 13) {
          newErrors.landlordContact = t('financialProfile.validation.phoneInvalid');
        }
      }
    }

    // 3. Loans
    formData.loans.forEach((loan, idx) => {
      const loanErrors = {};
      if (loan.outstandingAmount !== '' && Number(loan.outstandingAmount) < 0) {
        loanErrors.outstandingAmount = t('financialProfile.validation.outstandingPositive');
      }
      if (loan.monthlyEmi !== '' && Number(loan.monthlyEmi) < 0) {
        loanErrors.monthlyEmi = t('financialProfile.validation.emiPositive');
      }
      if (loan.remainingTenureMonths !== '' && Number(loan.remainingTenureMonths) <= 0) {
        loanErrors.remainingTenureMonths = t('financialProfile.validation.tenurePositive');
      }
      if (Object.keys(loanErrors).length > 0) {
        newErrors[`loan_${idx}`] = loanErrors;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSubmitError('');
    setSuccessMessage('');

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(formData);
        setSuccessMessage(t('financialProfile.actions.profileSuccess'));
      }
    } catch (err) {
      console.error('Error saving financial profile:', err);
      setSubmitError(t('financialProfile.actions.saveError'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Header */}
      <ProfileProgress currentStep={currentStep} totalSteps={4} />

      {/* Error Alert Banner */}
      {submitError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center gap-3 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">{submitError}</p>
        </div>
      )}

      {/* Success Alert Banner */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">{successMessage}</p>
        </div>
      )}

      {/* Section 1: Income & Work */}
      <IncomeSection
        formData={formData}
        onChange={handleFieldChange}
        errors={errors}
      />

      {/* Section 2: Housing */}
      <HousingSection
        formData={formData}
        onChange={handleFieldChange}
        errors={errors}
      />

      {/* Section 3: Existing Loans */}
      <LoanSection
        formData={formData}
        onChange={handleFieldChange}
        errors={errors}
      />

      {/* Section 4: Monthly Expenses */}
      <ExpenseSection
        formData={formData}
        onChange={handleFieldChange}
        errors={errors}
      />

      {/* Section 5: Live Summary & Ratios */}
      <ProfileSummary formData={formData} />

      {/* Action Footer */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/70 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>{t('auth.common.secureTrustBadge')}</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-center"
            >
              {t('financialProfile.actions.skipForNow')}
            </button>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            icon={!isSubmitting && <ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-lg shadow-indigo-600/30"
          >
            {isSubmitting
              ? t('financialProfile.actions.savingProfile')
              : t('financialProfile.actions.completeProfile')}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default FinancialProfileForm;
