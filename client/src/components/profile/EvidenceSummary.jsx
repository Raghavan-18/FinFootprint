import Card from '../common/Card';
import Badge from '../common/Badge';
import { ShieldCheck, Database, FileText, Smartphone } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable EvidenceSummary component for user profile with localization
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
      icon: <Database className="w-4 h-4 text-emerald-500" />,
    },
    {
      name: t('profile.sources.gstName'),
      status: t('common.verified'),
      lastSync: t('common.yesterday'),
      type: t('profile.sources.gstType'),
      icon: <FileText className="w-4 h-4 text-indigo-500" />,
    },
    {
      name: t('profile.sources.bbpsName'),
      status: t('common.active'),
      lastSync: 'Mar 15, 2026',
      type: t('profile.sources.bbpsType'),
      icon: <ShieldCheck className="w-4 h-4 text-blue-500" />,
    },
    {
      name: t('profile.sources.smsName'),
      status: t('common.synced'),
      lastSync: t('common.realTime'),
      type: t('profile.sources.smsType'),
      icon: <Smartphone className="w-4 h-4 text-amber-500" />,
    },
  ];

  return (
    <Card
      title={t('profile.connectedSourcesTitle')}
      subtitle={t('profile.connectedSourcesSubtitle')}
      className={className}
    >
      <div className="space-y-3">
        {sources.map((src, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-xs">
                {src.icon}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                  {src.name}
                </h4>
                <p className="text-[11px] text-slate-500">{src.type}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <Badge variant="emerald" size="sm" dot>
                {src.status}
              </Badge>
              <p className="text-[10px] text-slate-400 mt-1">{t('common.sync')}: {src.lastSync}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default EvidenceSummary;
