import { CreditCard, PlusCircle, Landmark } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import LoanCard from './LoanCard';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable LoanSection Component for managing multiple existing loans
 *
 * @param {Object} props
 * @param {Object} props.formData - { loans: Array<Loan> }
 * @param {Function} props.onChange - (field, value) => void
 * @param {Object} [props.errors] - Validation errors map
 */
export function LoanSection({ formData, onChange, errors = {} }) {
  const { t } = useLanguage();
  const loans = Array.isArray(formData.loans) ? formData.loans : [];

  const handleAddLoan = () => {
    const newLoan = {
      id: `loan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: 'PERSONAL',
      lender: '',
      outstandingAmount: '',
      monthlyEmi: '',
      remainingTenureMonths: '',
    };
    onChange('loans', [...loans, newLoan]);
  };

  const handleUpdateLoan = (index, updatedLoan) => {
    const updated = [...loans];
    updated[index] = updatedLoan;
    onChange('loans', updated);
  };

  const handleRemoveLoan = (index) => {
    const updated = loans.filter((_, idx) => idx !== index);
    onChange('loans', updated);
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <span>{t('financialProfile.sections.loans')}</span>
          {loans.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              {loans.length}
            </span>
          )}
        </div>
      }
      subtitle={t('financialProfile.sections.loansSubtitle')}
      className="transition-all"
    >
      <div className="space-y-4">
        {/* Empty State */}
        {loans.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <Landmark className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {t('financialProfile.loans.noLoans')}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {t('financialProfile.loans.noLoansDesc')}
            </p>
            <div className="mt-4">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={<PlusCircle className="w-4 h-4" />}
                onClick={handleAddLoan}
              >
                {t('financialProfile.loans.addLoan')}
              </Button>
            </div>
          </div>
        ) : (
          /* List of Loans */
          <div className="space-y-3">
            {loans.map((loan, idx) => (
              <LoanCard
                key={loan.id || idx}
                loan={loan}
                index={idx}
                onChange={(updated) => handleUpdateLoan(idx, updated)}
                onRemove={() => handleRemoveLoan(idx)}
                errors={errors[`loan_${idx}`] || {}}
              />
            ))}

            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={<PlusCircle className="w-4 h-4" />}
                onClick={handleAddLoan}
                className="w-full sm:w-auto"
              >
                {t('financialProfile.loans.addAnotherLoan')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default LoanSection;
