import { Info } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable TransactionReferenceField Component
 *
 * Dynamically displays contextual information or reference input field
 * based on the selected payment method.
 *
 * @param {Object} props
 * @param {'CASH'|'UPI'|'BANK_TRANSFER'|'OTHER'|string} props.paymentMethod
 * @param {string} props.value
 * @param {Function} props.onChange
 * @param {string} [props.className='']
 */
export function TransactionReferenceField({
  paymentMethod = 'CASH',
  value = '',
  onChange,
  className = '',
}) {
  const { t } = useLanguage();
  const method = (paymentMethod || 'CASH').toUpperCase();

  if (method === 'CASH') {
    return (
      <div className={`animate-in fade-in duration-200 ${className}`}>
        <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-2.5">
          <Info className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
          <span className="leading-relaxed">{t('activity.cashContextualMessage')}</span>
        </div>
      </div>
    );
  }

  const getFieldConfig = () => {
    switch (method) {
      case 'UPI':
        return {
          label: t('activity.upiReferenceLabel'),
          placeholder: t('activity.upiReferencePlaceholder'),
          helper: t('activity.upiReferenceHelper'),
        };
      case 'BANK_TRANSFER':
      case 'BANK':
        return {
          label: t('activity.bankReferenceLabel'),
          placeholder: t('activity.bankReferencePlaceholder'),
          helper: t('activity.bankReferenceHelper'),
        };
      case 'OTHER':
      default:
        return {
          label: t('activity.otherReferenceLabel'),
          placeholder: t('activity.otherReferencePlaceholder'),
          helper: t('activity.otherReferenceHelper'),
        };
    }
  };

  const config = getFieldConfig();

  return (
    <div className={`space-y-1.5 animate-in fade-in duration-200 ${className}`}>
      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
        {config.label}
      </label>
      <input
        type="text"
        placeholder={config.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-neutral-950 dark:text-neutral-50 placeholder-neutral-400 transition-colors"
      />
      <p className="text-[11px] text-neutral-500 mt-1">
        {config.helper}
      </p>
    </div>
  );
}

export default TransactionReferenceField;