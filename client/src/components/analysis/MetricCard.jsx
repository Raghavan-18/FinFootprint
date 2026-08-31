import Card from '../common/Card';
import Badge from '../common/Badge';
import MetricProgress from './MetricProgress';
import { TrendingUp, CheckCircle } from 'lucide-react';

/**
 * Reusable MetricCard component for financial health & behavioral indicators
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {number|string} props.value
 * @param {number} [props.max=100]
 * @param {'HIGH'|'OPTIMAL'|'MEDIUM'|'LOW'|'CRITICAL'|string} [props.status='HIGH']
 * @param {string} [props.description]
 * @param {string} [props.trend]
 * @param {string} [props.benchmark]
 * @param {Array<string>} [props.factors]
 * @param {React.ReactNode} [props.icon]
 * @param {string} [props.className='']
 */
export function MetricCard({
  title,
  value,
  max = 100,
  status = 'HIGH',
  description,
  trend,
  benchmark,
  factors = [],
  icon = null,
  className = '',
}) {
  const getBadgeVariant = (st) => {
    switch (String(st).toUpperCase()) {
      case 'OPTIMAL':
      case 'HIGH':
        return 'emerald';
      case 'MEDIUM':
      case 'MODERATE':
        return 'blue';
      case 'LOW':
      case 'CAUTION':
        return 'amber';
      case 'CRITICAL':
        return 'rose';
      default:
        return 'indigo';
    }
  };

  const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;

  return (
    <Card className={`h-full flex flex-col justify-between ${className}`}>
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {icon}
              </div>
            )}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {title}
              </h4>
              {benchmark && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {benchmark}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {trend && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                {trend}
              </span>
            )}
            <Badge variant={getBadgeVariant(status)} size="sm">
              {status}
            </Badge>
          </div>
        </div>

        {/* Value Display */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </span>
          {typeof value === 'number' && max === 100 && (
            <span className="text-xs font-medium text-slate-400">/ 100</span>
          )}
        </div>

        {/* Progress Bar */}
        {typeof value === 'number' && (
          <div className="mb-4">
            <MetricProgress value={numValue} max={max} status={status} />
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            {description}
          </p>
        )}
      </div>

      {/* Factors / Bullet Insights */}
      {factors && factors.length > 0 && (
        <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 mt-auto">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Contributing Drivers
          </span>
          {factors.map((factor, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
              <span>{factor}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default MetricCard;
