import Card from '../common/Card';
import { Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

/**
 * Reusable AnalysisExplanation component
 *
 * @param {Object} props
 * @param {string} [props.className='']
 */
export function AnalysisExplanation({ className = '' }) {
  return (
    <Card
      title="Algorithmic Underwriting Analysis Summary"
      subtitle="Synthesized behavioral risk model evaluating cashflow consistency and digital verification depth"
      className={className}
    >
      <div className="space-y-4 text-xs sm:text-sm">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>AI Risk Model Assessment</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            The applicant exhibits <strong>exceptional cashflow discipline</strong> with an average net monthly surplus of ₹22,450. Over 86% of reported transactions are corroborated by bank APIs, BBPS, or GSTN e-invoices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20">
            <h5 className="font-semibold text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> High Underwriting Strengths
            </h5>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Consistent 3-month recurring AMC contract inflows</li>
              <li>• Low reliance on unverified physical cash ledger entries (6%)</li>
              <li>• Strong DSCR ratio (2.85x) for proposed working capital limit</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/30 dark:bg-indigo-950/20">
            <h5 className="font-semibold text-indigo-800 dark:text-indigo-300 text-xs flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Next Steps to Maximize Limit
            </h5>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Resolve open voucher discrepancy for ₹2,500 advance</li>
              <li>• Connect secondary savings account via Account Aggregator</li>
              <li>• Log formal work-order completions on invoice generation</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default AnalysisExplanation;
