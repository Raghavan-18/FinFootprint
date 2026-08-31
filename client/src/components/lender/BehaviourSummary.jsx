import Card from '../common/Card';
import { ShieldAlert, Check } from 'lucide-react';

/**
 * Reusable BehaviourSummary component for Lender Underwriting
 *
 * @param {Object} props
 * @param {Object} props.report
 * @param {string} [props.className='']
 */
export function BehaviourSummary({ report, className = '' }) {
  if (!report) return null;

  return (
    <Card
      title="Behavioral Underwriting & Financial Discipline"
      subtitle="Synthesized borrower evaluation across cashflow stability and repayment history"
      className={className}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Key Underwriting Strengths</span>
          </div>
          <div className="space-y-2">
            {report.keyStrengths?.map((str, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                {str}
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors & Mitigants */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-800 dark:text-indigo-400">
            <ShieldAlert className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Risk Observations & Mitigants</span>
          </div>
          <div className="space-y-2">
            {report.riskMitigants?.map((mit, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                {mit}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default BehaviourSummary;
