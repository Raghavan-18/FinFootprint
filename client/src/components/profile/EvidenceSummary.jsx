import Card from '../common/Card';
import Badge from '../common/Badge';
import { ShieldCheck, Database, FileText, Smartphone } from 'lucide-react';

/**
 * Reusable EvidenceSummary component for user profile
 *
 * @param {Object} props
 * @param {string} [props.className='']
 */
export function EvidenceSummary({ className = '' }) {
  const sources = [
    {
      name: 'Account Aggregator (Setu / Sahamati)',
      status: 'ACTIVE',
      lastSync: 'Today, 06:30 AM',
      type: 'Bank Statements & Balance Trails',
      icon: <Database className="w-4 h-4 text-emerald-500" />,
    },
    {
      name: 'GSTN Invoicing Portal',
      status: 'VERIFIED',
      lastSync: 'Yesterday',
      type: 'B2B Procurement & Outward Supplies',
      icon: <FileText className="w-4 h-4 text-indigo-500" />,
    },
    {
      name: 'Bharat Bill Payment System (BBPS)',
      status: 'ACTIVE',
      lastSync: 'Mar 15, 2026',
      type: 'Commercial Electricity & Utilities',
      icon: <ShieldCheck className="w-4 h-4 text-blue-500" />,
    },
    {
      name: 'UPI SMS Corroboration Engine',
      status: 'SYNCED',
      lastSync: 'Real-time',
      type: 'Retail Customer Micro-Receipts',
      icon: <Smartphone className="w-4 h-4 text-amber-500" />,
    },
  ];

  return (
    <Card
      title="Connected Evidence Data Sources"
      subtitle="Verified digital data pipelines feeding your real-time alternative credit footprint"
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
              <p className="text-[10px] text-slate-400 mt-1">Sync: {src.lastSync}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default EvidenceSummary;
