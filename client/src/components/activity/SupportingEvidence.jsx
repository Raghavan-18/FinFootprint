import PaymentMethodSelector from './PaymentMethodSelector';
import TransactionReferenceField from './TransactionReferenceField';
import ProofUpload from './ProofUpload';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable SupportingEvidence Section Component
 *
 * Collects payment channel, conditional transaction / UTR reference,
 * optional invoice number, and optional supporting document proof.
 *
 * @param {Object} props
 * @param {string} props.paymentMethod
 * @param {Function} props.onPaymentMethodChange
 * @param {string} props.reference
 * @param {Function} props.onReferenceChange
 * @param {string} props.invoiceNumber
 * @param {Function} props.onInvoiceNumberChange
 * @param {string|null} props.proofFileName
 * @param {Function} props.onProofFileNameChange
 * @param {string} [props.className='']
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
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          {t('activity.supportingEvidenceTitle')}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          {t('activity.invoiceNumberLabel')}
        </label>
        <input
          type="text"
          placeholder={t('activity.invoiceNumberPlaceholder')}
          value={invoiceNumber}
          onChange={(e) => onInvoiceNumberChange && onInvoiceNumberChange(e.target.value)}
          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono transition-all"
        />
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
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
