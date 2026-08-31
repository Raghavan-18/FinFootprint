import Card from '../common/Card';
import { CheckCircle2, ShieldCheck, FileCheck, Building } from 'lucide-react';

/**
 * Reusable ProfileTimeline component
 *
 * @param {Object} props
 * @param {string} [props.className='']
 */
export function ProfileTimeline({ className = '' }) {
  const milestones = [
    {
      date: 'Mar 2026',
      title: 'Achieved Prime Tier Footprint (784/900)',
      description: 'Maintained 6 consecutive months of positive net cashflow and >85% digital evidence trail.',
      type: 'score',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    },
    {
      date: 'Jan 2026',
      title: 'Account Aggregator Consent Renewed',
      description: 'Automated statement fetch linked for primary Current Account with HDFC Bank.',
      type: 'integration',
      icon: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
    },
    {
      date: 'Aug 2025',
      title: '3x Institutional AMC Retainers Added',
      description: 'Formalized quarterly maintenance contracts with residential societies in Pune.',
      type: 'commercial',
      icon: <Building className="w-4 h-4 text-blue-500" />,
    },
    {
      date: 'Mar 2024',
      title: 'FinFootprint Registered & KYC Completed',
      description: 'Identity verified with Aadhaar e-KYC and GSTIN credential check.',
      type: 'kyc',
      icon: <FileCheck className="w-4 h-4 text-slate-500" />,
    },
  ];

  return (
    <Card
      title="Financial Footprint Milestones"
      subtitle="Chronological track record of digital underwriting verifications and commercial consistency"
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
