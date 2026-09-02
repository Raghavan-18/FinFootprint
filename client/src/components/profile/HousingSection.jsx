import { Home, Key, Phone, ShieldCheck, ShieldAlert, Lock } from 'lucide-react';
import Card from '../common/Card';
import { useLanguage } from '../../hooks/useLanguage';

const OWNERSHIP_OPTIONS = ['FULLY_OWNED', 'MORTGAGED', 'INHERITED'];

/**
 * Reusable Housing Information Section
 *
 * @param {Object} props
 * @param {Object} props.formData - { housing: { status, ownershipStatus, propertyValue, monthlyRent, landlordContact } }
 * @param {Function} props.onChange - (field, value) => void
 * @param {Object} [props.errors]
 */
export function HousingSection({ formData, onChange, errors = {} }) {
  const { t } = useLanguage();
  const housing = formData.housing || { status: 'OWN', ownershipStatus: 'FULLY_OWNED' };
  const isRented = housing.status === 'RENTED';

  const updateHousingField = (field, value) => {
    onChange('housing', {
      ...housing,
      [field]: value,
    });
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Home className="w-4 h-4" />
          </div>
          <span>{t('financialProfile.sections.housing')}</span>
        </div>
      }
      subtitle={t('financialProfile.sections.housingSubtitle')}
      className="transition-all"
    >
      <div className="space-y-6">
        {/* Housing Status Selector */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
            {t('financialProfile.housing.status')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Own Card */}
            <button
              type="button"
              onClick={() => updateHousingField('status', 'OWN')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                !isRented
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                  : 'bg-white/60 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-800'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  !isRented
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                }`}
              >
                <Home className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold">{t('financialProfile.housing.own')}</div>
              </div>
            </button>

            {/* Rented Card */}
            <button
              type="button"
              onClick={() => updateHousingField('status', 'RENTED')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                isRented
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                  : 'bg-white/60 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-800'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isRented
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                }`}
              >
                <Key className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold">{t('financialProfile.housing.rented')}</div>
              </div>
            </button>
          </div>
        </div>

        {/* Conditional Content: OWN */}
        {!isRented && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Ownership Status */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                {t('financialProfile.housing.ownershipStatus')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {OWNERSHIP_OPTIONS.map((status) => {
                  const isSelected = (housing.ownershipStatus || 'FULLY_OWNED') === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateHousingField('ownershipStatus', status)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-500/15 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'bg-white/60 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs">
                        {t(`financialProfile.housing.ownershipOptions.${status}`)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estimated Property Value */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                {t('financialProfile.housing.propertyValue')}{' '}
                <span className="text-xs text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                  ₹
                </div>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={housing.propertyValue ?? ''}
                  onChange={(e) =>
                    updateHousingField('propertyValue', e.target.value === '' ? '' : Number(e.target.value))
                  }
                  placeholder={t('financialProfile.housing.propertyValuePlaceholder')}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Conditional Content: RENTED */}
        {isRented && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Monthly Rent */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                {t('financialProfile.housing.monthlyRent')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                  ₹
                </div>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={housing.monthlyRent ?? ''}
                  onChange={(e) =>
                    updateHousingField('monthlyRent', e.target.value === '' ? '' : Number(e.target.value))
                  }
                  placeholder={t('financialProfile.housing.monthlyRentPlaceholder')}
                  className={`w-full pl-9 pr-4 py-2.5 text-sm bg-white/70 dark:bg-slate-950/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white placeholder-slate-400 transition-all ${
                    errors.monthlyRent
                      ? 'border-rose-500 focus:border-rose-500 ring-rose-500/20'
                      : 'border-slate-200/80 dark:border-slate-800 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.monthlyRent && (
                <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {errors.monthlyRent}
                </p>
              )}
            </div>

            {/* Landlord Contact */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                {t('financialProfile.housing.landlordContact')}{' '}
                <span className="text-xs text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={housing.landlordContact || ''}
                  onChange={(e) => updateHousingField('landlordContact', e.target.value)}
                  placeholder={t('financialProfile.housing.landlordContactPlaceholder')}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white/70 dark:bg-slate-950/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white placeholder-slate-400 transition-all ${
                    errors.landlordContact
                      ? 'border-rose-500 focus:border-rose-500 ring-rose-500/20'
                      : 'border-slate-200/80 dark:border-slate-800 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.landlordContact ? (
                <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {errors.landlordContact}
                </p>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {t('financialProfile.housing.landlordContactHelper')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Security & Privacy Banner */}
        <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-2.5 text-xs text-indigo-800 dark:text-indigo-200">
          <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <p>{t('financialProfile.housing.privacyNotice')}</p>
        </div>
      </div>
    </Card>
  );
}

export default HousingSection;
