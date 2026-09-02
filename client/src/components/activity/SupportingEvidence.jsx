import PaymentMethodSelector from './PaymentMethodSelector';
import TransactionReferenceField from './TransactionReferenceField';
import ProofUpload from './ProofUpload';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable SupportingEvidence Section Component — FinFootprint v2 Design System
 *
 * Collects payment channel, conditional transaction / UTR reference,
 * optional invoice number, and optional supporting document proof.
 * Uses neutral warm components from v2 DS.
 */
export function SupportingEvidence({
  paymentMethod = 'CASH',
  onPaymentMethodChange,
  reference = '',
  onReferenceChange,
  invoiceNumber = '',
  onInvoiceNumberChange,
  proofFileName = '',
  onProofFileNameChange,
  className = '',
}) {
  const { t } = useLanguage();

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Section Header */}
      <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800/80">
        <h3 className="text-sm font-bold text-neutral-950 dark:text-neutral-50 uppercase tracking-wider">
          {t('activity.supportingEvidenceTitle')}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          {t('activity.supportingEvidenceSubtitle')}
        </p>
      </div>

      {/* 1. Payment Method Selector */}
      <PaymentMethodSelector
        value={paymentMethod}
        onChange={onPaymentMethodChange}
      />

      {/* 2. Conditional Reference Field (Changes dynamically with Payment Method) */}
      <TransactionReferenceField
        paymentMethod={paymentMethod}
        value={reference}
        onChange={onReferenceChange}
      />

      {/* 3. Optional Invoice Number (Separate from payment reference) */}
      <div>
        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
          {t('activity.invoiceNumberLabel')}
        </label>
        <input
          type="text"
          placeholder={t('activity.invoiceNumberPlaceholder')}
          value={invoiceNumber}
          onChange={(e) => onInvoiceNumberChange && onInvoiceNumberChange(e.target.value)}
          className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-neutral-950 dark:text-neutral-50 font-mono placeholder-neutral-400 transition-colors"
        />
        <p className="text-[11px] text-neutral-500 mt-1">
          {t('activity.invoiceNumberHelper')}
        </p>
      </div>

      {/* 4. Optional Digital Proof Upload (Works for all methods including Cash) */}
      <ProofUpload
        fileName={proofFileName}
        onFileChange={onProofFileNameChange}
      />
    </div>
  );
}

export default SupportingEvidence;