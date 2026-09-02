import Card from '../common/Card';
import Badge from '../common/Badge';
import { ShieldAlert, Check } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable BehaviourSummary component for Lender Underwriting with localization — FinFootprint v2 Design System
 *
 * Uses warm slate surfaces, semantic colored backgrounds.
 *
 * @param {Object} props
 * @param {Object} props.report
 * @param {string} [props.className='']
 */
export function BehaviourSummary({ report, className = '' }) {
  const { t, isTamil } = useLanguage();
  if (!report) return null;

  const defaultStrengthsTamil = [
    'நிலையான நேர்மறை நிகர மாதாந்திர பணப்புழக்கம் (சராசரியாக ₹22,450/மாதம்).',
    'உயர் சரிபார்க்கப்பட்ட டிஜிட்டல் சான்று கவரேஜ் (AA & GSTN மூலம் 86%).',
    '3 நிறுவன தொடர் பராமரிப்பு ஒப்பந்தங்கள் நிலையான அடிப்படை வரவுகளை வழங்குகின்றன.',
    'கடன் சேவை கவரேஜ் விகிதம் (DSCR) 2.85x என்பது கடன் வழங்குநரின் அடிப்படை தேவையை (1.5x) விட அதிகமாக உள்ளது.',
  ];

  const defaultMitigantsTamil = [
    'ஒரு திறந்த வவுச்சர் முரண்பாடு (₹2,500 வேறுபாடு) கொடியிடப்பட்டு பழமைவாத இடையகங்களில் கணக்கிடப்பட்டுள்ளது.',
    'பருவகால வன்பொருள் கொள்முதல் ஏற்ற இறக்கங்கள் ஒழுக்கமான செயல்பாட்டு மூலதன இருப்பு மூலம் நிர்வகிக்கப்படுகின்றன.',
  ];

  const strengths = isTamil ? defaultStrengthsTamil : report.keyStrengths;
  const mitigants = isTamil ? defaultMitigantsTamil : report.riskMitigants;

  return (
    <Card variant="default" padding="lg" className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-950 dark:text-neutral-50">
            <Badge variant="success" size="xs" icon={<Check className="w-3.5 h-3.5" />}>
              {t('lenderReport.keyStrengths')}
            </Badge>
          </div>
          <div className="space-y-2">
            {strengths?.map((str, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-verified-bg dark:bg-verified-bg-dark border border-verified-border dark:border-verified-border-dark text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed"
              >
                {str}
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors & Mitigants */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-950 dark:text-neutral-50">
            <Badge variant="primary" size="xs" icon={<ShieldAlert className="w-3.5 h-3.5" />}>
              {t('lenderReport.riskMitigants')}
            </Badge>
          </div>
          <div className="space-y-2">
            {mitigants?.map((mit, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-primary-bg dark:bg-primary-bg-dark border border-primary-border dark:border-primary-border-dark text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed"
              >
                {mit}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default BehaviourSummary;