import {
  Hash,
  User,
  Layers,
  FileCheck2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import EvidenceBadge from '../evidence/EvidenceBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { getEvidenceConfig } from '../../utils/evidenceUtils';

/**
 * Reusable TransactionDetails view component
 *
 * @param {Object} props
 * @param {Object} props.transaction
 */
export function TransactionDetails({ transaction }) {
  if (!transaction) return null;

  const isIncome = (transaction.type || 'INCOME').toUpperCase() === 'INCOME';
  const config = getEvidenceConfig(transaction.evidenceStatus);

  return (
    <div className="space-y-6">
      {/* Top Header & Amount Banner */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {transaction.type} Transaction
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {transaction.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Recorded on {formatDate(transaction.date, { format: 'long' })}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p
            className={`text-2xl sm:text-3xl font-extrabold ${
              isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </p>
          <div className="mt-2">
            <EvidenceBadge status={transaction.evidenceStatus} size="md" />
          </div>
        </div>
      </div>

      {/* Evidence & Confidence Rating Box */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Evidence Tier: {config.label}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {transaction.confidenceScore || config.confidenceScore}% Confidence
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {config.description}
        </p>
        {transaction.evidenceType && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Source Trail:
            </span>
            <span>{transaction.evidenceType}</span>
          </div>
        )}
      </div>

      {/* Metadata Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 flex items-center gap-1.5 mb-1">
            <User className="w-3.5 h-3.5" /> Counterparty / Entity
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {transaction.counterparty || 'Not specified'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 flex items-center gap-1.5 mb-1">
            <Hash className="w-3.5 h-3.5" /> Reference / UTR Number
          </span>
          <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
            {transaction.referenceId || 'N/A'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 flex items-center gap-1.5 mb-1">
            <Layers className="w-3.5 h-3.5" /> Category
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {transaction.category || 'General'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 flex items-center gap-1.5 mb-1">
            <FileCheck2 className="w-3.5 h-3.5" /> Proof Document
          </span>
          <span className="font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            {transaction.proofDocument || 'No digital document attached'}
            {transaction.proofDocument && <ExternalLink className="w-3 h-3" />}
          </span>
        </div>
      </div>

      {/* Notes / Description */}
      {transaction.notes && (
        <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Activity Notes & Audit Log
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {transaction.notes}
          </p>
        </div>
      )}

      {/* Additional Key-Value Metadata */}
      {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Extended Verification Metadata
          </h4>
          <div className="space-y-1.5 text-xs">
            {Object.entries(transaction.metadata).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                <span className="text-slate-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionDetails;
