import Card from '../common/Card';
import Badge from '../common/Badge';
import MetricProgress from './MetricProgress';
import { TrendingUp, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable MetricCard component with localization — FinFootprint v2 Design System
 *
 * Uses neutral warm slate, semantic badge colors, indigo accent.
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
  const { t } = useLanguage();

  const getBadgeVariant = (st) => {
    switch (String(st).toUpperCase()) {
      case 'OPTIMAL':
      case 'HIGH':
        return 'success';
      case 'MEDIUM':
      case 'MODERATE':
        return 'info';
      case 'LOW':
      case 'CAUTION':
        return 'warning';
      case 'CRITICAL':
        return 'danger';
      default:
        return 'primary';
    }
  };

  const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;

  return (
    <Card className={`h-full flex flex-col justify-between ${className}`}>
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            {icon && (
              <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-neutral-950 dark:text-neutral-50 truncate">
                {title}
              </h4>
              {benchmark && (
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                  {benchmark}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {trend && (
              <span className="text-xs font-semibold text-success dark:text-success flex items-center gap-0.5">
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
          <span className="text-3xl font-extrabold text-neutral-950 dark:text-neutral-50 tracking-tight">
            {value}
          </span>
          {typeof value === 'number' && max === 100 && (
            <span className="text-xs font-medium text-neutral-400">/ 100</span>
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
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
            {description}
          </p>
        )}
      </div>

      {/* Factors / Bullet Insights */}
      {factors && factors.length > 0 && (
        <div className="pt-3.5 border-t border-neutral-200 dark:border-neutral-800/80 space-y-1.5 mt-auto">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
            {t('analysis.contributingDrivers')}
          </span>
          {factors.map((factor, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
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