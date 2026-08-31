import Card from '../common/Card';
import { CheckCircle2, ShieldCheck, FileCheck, Building } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable ProfileTimeline component with localization
 *
 * @param {Object} props
 * @param {string} [props.className='']
 */
export function ProfileTimeline({ className = '' }) {
  const { t, isTamil } = useLanguage();

  const milestones = [
    {
      date: isTamil ? 'மார் 2026' : 'Mar 2026',
      title: isTamil
        ? 'பிரைம் அடுக்கு நிதித்தடம் எட்டப்பட்டது (784/900)'
        : 'Achieved Prime Tier Footprint (784/900)',
      description: isTamil
        ? 'தொடர்ந்து 6 மாதங்கள் நிகர நேர்மறை பணப்புழக்கம் மற்றும் >85% டிஜிட்டல் சான்று தடம் பராமரிக்கப்பட்டது.'
        : 'Maintained 6 consecutive months of positive net cashflow and >85% digital evidence trail.',
      type: 'score',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    },
    {
      date: isTamil ? 'ஜன 2026' : 'Jan 2026',
      title: isTamil
        ? 'கணக்கு ஒருங்கிணைப்பாளர் ஒப்புதல் புதுப்பிக்கப்பட்டது'
        : 'Account Aggregator Consent Renewed',
      description: isTamil
        ? 'HDFC வங்கியின் முதன்மை நடப்புக் கணக்கிற்கான தானியங்கி அறிக்கை பெறல் இணைக்கப்பட்டது.'
        : 'Automated statement fetch linked for primary Current Account with HDFC Bank.',
      type: 'integration',
      icon: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
    },
    {
      date: isTamil ? 'ஆக 2025' : 'Aug 2025',
      title: isTamil
        ? '3x நிறுவன பராமரிப்பு ஒப்பந்தங்கள் (AMC) சேர்க்கப்பட்டன'
        : '3x Institutional AMC Retainers Added',
      description: isTamil
        ? 'புனேவில் உள்ள குடியிருப்பு சங்கங்களுடன் முறையான காலாண்டு பராமரிப்பு ஒப்பந்தங்கள் செய்யப்பட்டன.'
        : 'Formalized quarterly maintenance contracts with residential societies in Pune.',
      type: 'commercial',
      icon: <Building className="w-4 h-4 text-blue-500" />,
    },
    {
      date: isTamil ? 'மார் 2024' : 'Mar 2024',
      title: isTamil
        ? 'FinFootprint பதிவு & KYC நிறைவு செய்யப்பட்டது'
        : 'FinFootprint Registered & KYC Completed',
      description: isTamil
        ? 'ஆதார் e-KYC மற்றும் GSTIN சான்றுகளுடன் அடையாளம் சரிபார்க்கப்பட்டது.'
        : 'Identity verified with Aadhaar e-KYC and GSTIN credential check.',
      type: 'kyc',
      icon: <FileCheck className="w-4 h-4 text-slate-500" />,
    },
  ];

  return (
    <Card
      title={t('profile.milestonesTitle')}
      subtitle={t('profile.milestonesSubtitle')}
      className={className}
    >
      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {milestones.map((item, idx) => (
          <div key={idx} className="relative group">
            <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 flex items-center justify-center" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">{item.date}</span>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {item.title}
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default ProfileTimeline;
