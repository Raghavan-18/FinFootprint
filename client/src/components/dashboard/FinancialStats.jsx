import StatCard from './StatCard';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  Wallet,
  ArrowDownRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import Badge from '../common/Badge';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable FinancialStats component with localization
 *
 * @param {Object} props
 * @param {Object} props.stats - Stats data object
 * @param {Object} [props.profile] - Profile data object
 * @param {string} [props.className='']
 */
export function FinancialStats({ stats, profile, className = '' }) {
  const { t } = useLanguage();
  if (!stats) return null;

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 ${className}`}
    >
      <StatCard
        title={t('dashboard.avgMonthlyInflows')}
        value={formatCurrency(stats.monthlyIncomeAvg)}
        description={t('dashboard.inflowsDesc')}
        icon={<Wallet className="w-5 h-5" />}
        trend={`+${stats.monthlyGrowthRate || 8.4}%`}
        trendDirection="up"
        trendLabel={t('common.momGrowth')}
      />

      <StatCard
        title={t('dashboard.avgMonthlyOutflows')}
        value={formatCurrency(stats.monthlyExpensesAvg)}
        description={t('dashboard.outflowsDesc')}
        icon={<ArrowDownRight className="w-5 h-5" />}
        trend="-2.1%"
        trendDirection="down"
        trendLabel={t('common.optimized')}
      />

      <StatCard
        title={t('dashboard.netMonthlySurplus')}
        value={formatCurrency(stats.netMonthlyCashflow)}
        description={t('dashboard.surplusDesc')}
        icon={<TrendingUp className="w-5 h-5" />}
        badge={<Badge variant="emerald" size="sm">{t('common.healthy')}</Badge>}
      />

      <StatCard
        title={t('dashboard.trustFootprintScore')}
        value={profile?.footprintScore || 784}
        description={t('dashboard.trustScoreDesc')}
        icon={<ShieldCheck className="w-5 h-5" />}
        badge={<Badge variant="indigo" size="sm">{t('lenderReport.gradePrefix')} {profile?.trustGrade || 'A'}</Badge>}
        trend="+18 pts"
        trendDirection="up"
        trendLabel={t('common.thisQuarter')}
      />
    </div>
  );
}

export default FinancialStats;
