import { Trash2, Landmark, ShieldAlert, Clock } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const LOAN_TYPES = [
  'PERSONAL',
  'HOME',
  'VEHICLE',
  'BUSINESS',
  'EDUCATION',
  'GOLD',
  'OTHER',
];

/**
 * Reusable LoanCard Component for managing an individual loan
 *
 * @param {Object} props
 * @param {Object} props.loan - Loan record object
 * @param {number} props.index - 0-based index
 * @param {Function} props.onChange - (updatedLoan) => void
 * @param {Function} props.onRemove - () => void
 * @param {Object} [props.errors] - Field-level error messages
 */
export function LoanCard({
  loan,
  index,
  onChange,
  onRemove,
  errors = {},
}) {
  const { t } = useLanguage();

  const handleFieldChange = (field, value) => {
    onChange({
      ...loan,
      [field]: value,
    });
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 transition-all">
      {/* Header: Loan Number, Badge, Remove Button */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
            #{index + 1}
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {t('financialProfile.loans.loanNumber')} {index + 1}
          </span>
          {loan.type && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              {t(`financialProfile.loans.types.${loan.type}`)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
          title={t('financialProfile.loans.remove')}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t('financialProfile.loans.remove')}</span>
        </button>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Loan Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t('financialProfile.loans.loanType')}
          </label>
          <select
            value={loan.type || 'PERSONAL'}
            onChange={(e) => handleFieldChange('type', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white cursor-pointer"
          >
            {LOAN_TYPES.map((lt) => (
              <option key={lt} value={lt}>
                {t(`financialProfile.loans.types.${lt}`)}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Lender Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t('financialProfile.loans.lenderName')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Landmark className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={loan.lender || ''}
              onChange={(e) => handleFieldChange('lender', e.target.value)}
              placeholder={t('financialProfile.loans.lenderNamePlaceholder')}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* 3. Outstanding Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t('financialProfile.loans.outstandingAmount')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
              ₹
            </div>
            <input
              type="number"
              min="0"
              step="1000"
              value={loan.outstandingAmount ?? ''}
              onChange={(e) =>
                handleFieldChange(
                  'outstandingAmount',
                  e.target.value === '' ? '' : Number(e.target.value)
                )
              }
              placeholder={t('financialProfile.loans.outstandingPlaceholder')}
              className={`w-full pl-8 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white placeholder-slate-400 ${
                errors.outstandingAmount
                  ? 'border-rose-500'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            />
          </div>
          {errors.outstandingAmount && (
            <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
              <ShieldAlert className="w-3 h-3" />
              {errors.outstandingAmount}
            </p>
          )}
        </div>

        {/* 4. Monthly EMI */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t('financialProfile.loans.monthlyEmi')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
              ₹
            </div>
            <input
              type="number"
              min="0"
              step="100"
              value={loan.monthlyEmi ?? ''}
              onChange={(e) =>
                handleFieldChange(
                  'monthlyEmi',
                  e.target.value === '' ? '' : Number(e.target.value)
                )
              }
              placeholder={t('financialProfile.loans.monthlyEmiPlaceholder')}
              className={`w-full pl-8 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white placeholder-slate-400 ${
                errors.monthlyEmi
                  ? 'border-rose-500'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            />
          </div>
          {errors.monthlyEmi && (
            <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
              <ShieldAlert className="w-3 h-3" />
              {errors.monthlyEmi}
            </p>
          )}
        </div>

        {/* 5. Remaining Tenure */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t('financialProfile.loans.remainingTenure')} ({t('financialProfile.loans.months')})
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <input
              type="number"
              min="1"
              step="1"
              value={loan.remainingTenureMonths ?? ''}
              onChange={(e) =>
                handleFieldChange(
                  'remainingTenureMonths',
                  e.target.value === '' ? '' : Number(e.target.value)
                )
              }
              placeholder={t('financialProfile.loans.tenurePlaceholder')}
              className={`w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white placeholder-slate-400 ${
                errors.remainingTenureMonths
                  ? 'border-rose-500'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            />
          </div>
          {errors.remainingTenureMonths && (
            <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
              <ShieldAlert className="w-3 h-3" />
              {errors.remainingTenureMonths}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoanCard;
