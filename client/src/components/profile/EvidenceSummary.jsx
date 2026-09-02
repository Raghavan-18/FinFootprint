import Card from '../common/Card';
import Badge from '../common/Badge';
import { ShieldCheck, Database, FileText, Smartphone } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable EvidenceSummary component for user profile with localization — FinFootprint v2 Design System
 *
 * Uses warm slate surfaces, semantic colored badges and icons.
 *
 * @param {Object} props
 * @param {string} [props.className='']
 */
export function EvidenceSummary({ className = '' }) {
  const { t } = useLanguage();

  const sources = [
    {
      name: t('profile.sources.aaName'),
      status: t('common.active'),
      lastSync: `${t('common.today')}, 06:30 AM`,
      type: t('profile.sources.aaType'),
      icon: <Database className="w-4 h-4 text-verified" />,
      statusVariant: 'success',
    },
    {
      name: t('profile.sources.gstName'),
      status: t('common.verified'),
      lastSync: t('common.yesterday'),
      type: t('profile.sources.gstType'),
      icon: <FileText className="w-4 h-4 text-primary" />,
      statusVariant: 'success',
    },
    {
      name: t('profile.sources.bbpsName'),
      status: t('common.active'),
      lastSync: 'Mar 15, 2026',
      type: t('profile.sources.bbpsType'),
      icon: <ShieldCheck className="w-4 h-4 text-info" />,
      statusVariant: 'success',
    },
    {
      name: t('profile.sources.smsName'),
      status: t('common.synced'),
      lastSync: t('common.realTime'),
      type: t('profile.sources.smsType'),
      icon: <Smartphone className="w-4 h-4 text-warning" />,
      statusVariant: 'info',
    },
  ];

  return (
    <Card variant="default" padding="lg" className={className}>
      <div className="space-y-3">
        {sources.map((src, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white dark:bg-neutral-800 shadow-xs">
                {src.icon}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-950 dark:text-neutral-50">
                  {src.name}
                </h4>
                <p className="text-[11px] text-neutral-500">{src.type}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <Badge variant={src.statusVariant} size="sm" dot>
                {src.status}
              </Badge>
              <p className="text-[10px] text-neutral-400 mt-1">{t('common.sync')}: {src.lastSync}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default EvidenceSummary;