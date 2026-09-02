import Card from '../common/Card';
import Badge from '../common/Badge';
import { Building2, Phone, Mail, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable ProfileHeader component with localization — FinFootprint v2 Design System
 *
 * Uses warm slate surfaces, indigo brand accents, semantic badge colors.
 *
 * @param {Object} props
 * @param {Object} props.profile
 * @param {string} [props.className='']
 */
export function ProfileHeader({ profile, className = '' }) {
  const { t } = useLanguage();
  if (!profile) return null;

  const initials = (profile.fullName || 'User')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <Card variant="default" padding="lg" className={className}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Avatar & Identity */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-500/20 overflow-hidden">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-neutral-900 rounded-full border border-neutral-200 dark:border-neutral-800">
              <CheckCircle2 className="w-5 h-5 text-verified fill-verified" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-neutral-50">
                {profile.fullName || 'User'}
              </h2>
              <Badge variant={profile.kycStatus === 'VERIFIED' ? 'success' : 'default'} size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                {profile.kycStatus === 'VERIFIED' ? t('profile.kycVerified') : t('profile.kycPending')}
              </Badge>
              <Badge variant="primary" size="sm">
                {t('profile.aaActive')}
              </Badge>
            </div>

            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mt-1 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-neutral-400" />
              {profile.businessName || t('profile.microEnterprise')}
            </p>

            <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mt-2 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {profile.city || 'India'}
              </span>
              {profile.phone && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> {profile.phone}
                  </span>
                </>
              )}
              {profile.email && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> {profile.email}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Registration badges */}
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1.5 w-full md:w-auto shrink-0">
          <div className="flex justify-between md:justify-start gap-4">
            <span className="text-neutral-500 font-medium">{t('profile.gstId')}</span>
            <span className="font-mono font-semibold text-neutral-950 dark:text-neutral-50">
              {profile.registrationNumber}
            </span>
          </div>
          <div className="flex justify-between md:justify-start gap-4">
            <span className="text-neutral-500 font-medium">{t('profile.panNumber')}</span>
            <span className="font-mono font-semibold text-neutral-950 dark:text-neutral-50">
              {profile.panNumber}
            </span>
          </div>
          <div className="flex justify-between md:justify-start gap-4">
            <span className="text-neutral-500 font-medium">{t('profile.established')}</span>
            <span className="font-semibold text-neutral-950 dark:text-neutral-50">
              {formatDate(profile.memberSince)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProfileHeader;