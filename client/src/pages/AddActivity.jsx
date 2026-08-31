import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import SupportingEvidence from '../components/activity/SupportingEvidence';
import ProcessingState from '../components/activity/ProcessingState';
import EvidenceAssessmentResult from '../components/activity/EvidenceAssessmentResult';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

/**
 * AddActivity Page
 *
 * Log a financial transaction with supporting information and evidence.
 * The system automatically assesses and classifies the evidence tier upon submission.
 */
export function AddActivity({ onAddActivity, onNavigate }) {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    title: '',
    type: 'INCOME',
    category: 'Client Services',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    counterparty: '',
    paymentMethod: 'UPI',
    reference: '',
    invoiceNumber: '',
    proofFileName: '',
    notes: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);

  const categories = {
    INCOME: [
      'Client Services',
      'Retail Sales',
      'Annual Maintenance Contracts',
      'Consulting',
      'Cash Receipts',
      'Other Income',
    ],
    EXPENSE: [
      'Inventory & Supplies',
      'Rent & Facilities',
      'Utilities',
      'Contractor Expense',
      'Equipment & Maintenance',
      'Taxes & Regulatory',
      'Other Outflow',
    ],
  };

  const handleReset = () => {
    setFormData({
      title: '',
      type: 'INCOME',
      category: 'Client Services',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      counterparty: '',
      paymentMethod: 'UPI',
      reference: '',
      invoiceNumber: '',
      proofFileName: '',
      notes: '',
    });
    setAssessmentResult(null);
    setIsProcessing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      alert(t('validation.requiredFields'));
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare payload for API / mock evidence engine
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        reference: formData.paymentMethod === 'CASH' ? '' : formData.reference,
        referenceId: formData.paymentMethod === 'CASH' ? '' : formData.reference,
        proofDocument: formData.proofFileName,
      };

      // Call parent / API service
      let result = null;
      if (onAddActivity) {
        result = await onAddActivity(payload);
      }

      setTimeout(() => {
        setIsProcessing(false);
        setAssessmentResult(result || payload);
      }, 750);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert(t('validation.failedToAdd'));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title={t('activity.pageTitle')}
        description={t('activity.pageSubtitle')}
        breadcrumbs={[
          { label: t('navigation.dashboard'), onClick: () => onNavigate('dashboard') },
          { label: t('navigation.addActivity') },
        ]}
      />

      {isProcessing ? (
        /* Processing Assessment State */
        <ProcessingState />
      ) : assessmentResult ? (
        /* System Evidence Assessment Result */
        <EvidenceAssessmentResult
          transaction={assessmentResult}
          onViewLedger={() => onNavigate && onNavigate('history')}
          onLogAnother={handleReset}
        />
      ) : (
        /* Main Activity Form */
        <form onSubmit={handleSubmit}>
          <Card>
            <div className="space-y-6">
              {/* STEP 1: Type Switcher (Income vs Expense) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {t('activity.transactionType')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        type: 'INCOME',
                        category: categories.INCOME[0],
                      }))
                    }
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-semibold text-sm transition-all cursor-pointer ${
                      formData.type === 'INCOME'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
                    {t('activity.incomeInflow')}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        type: 'EXPENSE',
                        category: categories.EXPENSE[0],
                      }))
                    }
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-semibold text-sm transition-all cursor-pointer ${
                      formData.type === 'EXPENSE'
                        ? 'bg-slate-100 dark:bg-slate-800 border-slate-400 dark:border-slate-600 text-slate-900 dark:text-white ring-2 ring-slate-400/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4 text-slate-500" />
                    {t('activity.expenseOutflow')}
                  </button>
                </div>
              </div>

              {/* STEP 2: Title & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('activity.activityTitleLabel')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('activity.activityTitlePlaceholder')}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('activity.amountLabel')} (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder={t('activity.amountPlaceholder')}
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, amount: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold"
                  />
                </div>
              </div>

              {/* Category, Date & Counterparty */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('activity.categoryLabel')}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                  >
                    {categories[formData.type].map((cat) => (
                      <option key={cat} value={cat}>
                        {t(`transactions.categories.${cat}`) || cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('activity.dateLabel')}
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('activity.counterpartyLabel')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('activity.counterpartyPlaceholder')}
                    value={formData.counterparty}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        counterparty: e.target.value,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Supporting Evidence Section with Conditional Reference */}
              <SupportingEvidence
                paymentMethod={formData.paymentMethod}
                onPaymentMethodChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentMethod: val,
                    // Clear reference if switching to cash
                    reference: val === 'CASH' ? '' : prev.reference,
                  }))
                }
                reference={formData.reference}
                onReferenceChange={(val) =>
                  setFormData((prev) => ({ ...prev, reference: val }))
                }
                invoiceNumber={formData.invoiceNumber}
                onInvoiceNumberChange={(val) =>
                  setFormData((prev) => ({ ...prev, invoiceNumber: val }))
                }
                proofFileName={formData.proofFileName}
                onProofFileNameChange={(val) =>
                  setFormData((prev) => ({ ...prev, proofFileName: val }))
                }
              />

              {/* Notes / Scope Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('activity.notesLabel')}
                </label>
                <textarea
                  rows={2}
                  placeholder={t('activity.notesPlaceholder')}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => onNavigate && onNavigate('dashboard')}
                >
                  {t('activity.cancelBtn')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                >
                  {t('activity.recordActivityBtn')}
                </Button>
              </div>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
}

export default AddActivity;
