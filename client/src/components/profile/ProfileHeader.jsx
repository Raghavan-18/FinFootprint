import Card from '../common/Card';
import Badge from '../common/Badge';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable ProfileHeader component with localization
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
    <Card className={className}>
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
            <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-900 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {profile.fullName || 'User'}
              </h2>
              <Badge variant={profile.kycStatus === 'VERIFIED' ? 'emerald' : 'default'} size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                {profile.kycStatus === 'VERIFIED' ? t('profile.kycVerified') : 'KYC Pending'}
              </Badge>
              <Badge variant="indigo" size="sm">
                {t('profile.aaActive')}
              </Badge>
            </div>

            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              {profile.businessName || 'Micro-Enterprise'}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2 flex-wrap">
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
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5 w-full md:w-auto">
          <div className="flex justify-between md:justify-start gap-4">
            <span className="text-slate-500 font-medium">{t('profile.gstId')}</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              {profile.registrationNumber}
            </span>
          </div>
          <div className="flex justify-between md:justify-start gap-4">
            <span className="text-slate-500 font-medium">{t('profile.panNumber')}</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              {profile.panNumber}
            </span>
          </div>
          <div className="flex justify-between md:justify-start gap-4">
            <span className="text-slate-500 font-medium">{t('profile.established')}</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {formatDate(profile.memberSince)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProfileHeader;
