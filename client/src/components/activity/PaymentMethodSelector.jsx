import { Banknote, Smartphone, Building, CreditCard } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable PaymentMethodSelector Component
 *
 * @param {Object} props
 * @param {'CASH'|'UPI'|'BANK_TRANSFER'|'OTHER'|string} props.value
 * @param {Function} props.onChange
 * @param {string} [props.className='']
 */
export function PaymentMethodSelector({ value = 'CASH', onChange, className = '' }) {
  const { t } = useLanguage();

  const options = [
    {
      id: 'CASH',
      label: t('activity.paymentMethods.cash'),
      icon: Banknote,
      help: t('activity.paymentMethodsHelp.cash'),
    },
    {
      id: 'UPI',
      label: t('activity.paymentMethods.upi'),
      icon: Smartphone,
      help: t('activity.paymentMethodsHelp.upi'),
    },
    {
      id: 'BANK_TRANSFER',
      label: t('activity.paymentMethods.bankTransfer'),
      icon: Building,
      help: t('activity.paymentMethodsHelp.bankTransfer'),
    },
    {
      id: 'OTHER',
      label: t('activity.paymentMethods.other'),
      icon: CreditCard,
      help: t('activity.paymentMethodsHelp.other'),
    },
  ];

  const currentOption = options.find((o) => o.id === value) || options[0];

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
        {t('activity.paymentMethodLabel')}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = value === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-semibold text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-surface focus:ring-indigo-500 cursor-pointer select-none ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-400 dark:text-neutral-500'}`} />
              <span className="truncate">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {currentOption?.help && (
        <p className="text-[11px] text-neutral-500 leading-normal mb-1">
          {currentOption.help}
        </p>
      )}
    </div>
  );
}

export default PaymentMethodSelector;