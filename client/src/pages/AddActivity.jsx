import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import EvidenceBadge from '../components/evidence/EvidenceBadge';
import {
  ArrowDownLeft,
  ArrowUpRight,
  UploadCloud,
  CheckCircle,
} from 'lucide-react';

/**
 * AddActivity Page
 *
 * Log a financial transaction with associated evidence proof
 */
export function AddActivity({ onAddActivity, onNavigate }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'INCOME',
    category: 'Client Services',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    counterparty: '',
    referenceId: '',
    evidenceStatus: 'VERIFIED',
    evidenceType: 'Account Aggregator & Bank API',
    notes: '',
    proofDocument: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

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

  const evidenceOptions = [
    {
      status: 'VERIFIED',
      type: 'Account Aggregator & Bank API',
      label: 'Direct Bank API / GSTN',
      helper: 'Highest trust (98%). Synced directly via bank API or GST QR.',
    },
    {
      status: 'CORROBORATED',
      type: 'UPI SMS & Payment Gateway Match',
      label: 'SMS Receipt / Counterparty Ledger',
      helper: 'High trust (82%). Cross-verified via SMS/client invoice.',
    },
    {
      status: 'SELF_DECLARED',
      type: 'Manual Self-Declaration',
      label: 'Self-Declared Cash Flow',
      helper: 'Moderate trust (50%). Manual cash receipt or voucher.',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      alert('Please provide a title and amount.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (onAddActivity) {
        await onAddActivity({
          ...formData,
          amount: Number(formData.amount),
        });
      }
      setSubmittedSuccess(true);
      setTimeout(() => {
        if (onNavigate) onNavigate('history');
      }, 1200);
    } catch (err) {
      console.error(err);
      alert('Failed to log activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Log Financial Activity"
        description="Record verified inflows, invoice disbursements, or cash declarations to bolster your credit footprint"
        breadcrumbs={[
          { label: 'Dashboard', onClick: () => onNavigate('dashboard') },
          { label: 'Add Activity' },
        ]}
      />

      {submittedSuccess ? (
        <Card className="text-center p-8 border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30">
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
            Activity Logged Successfully!
          </h3>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
            Updating your verifiable footprint score and redirecting to ledger...
          </p>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <div className="space-y-6">
              {/* Type Switcher (Income vs Expense) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Transaction Type
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
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
                    Income / Inflow
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
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4 text-slate-500" />
                    Expense / Outflow
                  </button>
                </div>
              </div>

              {/* Title & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Activity Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Commercial Wiring Stage 2 Payment"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Amount (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g., 18500"
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
                    Category
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
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Date Recorded
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
                    Counterparty / Customer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., TechPark Facility Ltd"
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

              {/* Evidence Tier Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Evidence Verification Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {evidenceOptions.map((opt) => (
                    <div
                      key={opt.status}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          evidenceStatus: opt.status,
                          evidenceType: opt.type,
                        }))
                      }
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        formData.evidenceStatus === opt.status
                          ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <EvidenceBadge status={opt.status} size="sm" />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {opt.helper}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reference ID & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    UTR / UPI / Invoice Reference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., UPI/6087192841/HDFC or INV-8912"
                    value={formData.referenceId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        referenceId: e.target.value,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Notes / Scope Description
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of work delivered"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Upload Proof Document placeholder */}
              <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <UploadCloud className="w-6 h-6 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Attach Digital Proof (PDF, Invoice QR, SMS screenshot)
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Optional but upgrades self-declared records into Corroborated Tier
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      proofDocument: 'invoice_attachment_scan.pdf',
                    }))
                  }
                >
                  {formData.proofDocument ? 'Proof Attached' : 'Attach Proof'}
                </Button>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => onNavigate && onNavigate('dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                >
                  Record & Verify Activity
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
