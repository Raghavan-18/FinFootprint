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
 * Reusable FinancialStats component with localization — FinFootprint v2 Design System
 *
 * Uses StatCard variants matching evidence tiers:
 * - Inflows: success (verified green)
 * - Outflows: default (neutral)
 * - Net Surplus: success/warning based on value
 * - Trust Score: primary (indigo)
 *
 * @param {Object} props
 * @param {Object} props.stats - Stats data object
 * @param {Object} [props.profile] - Profile data object
 * @param {string} [props.className='']
 */
export function FinancialStats({ stats, profile, className = '' }) {
  const { t } = useLanguage();
  if (!stats) return null;

  const hasData = Boolean(stats.hasData || (stats.totalTransactionsCount && stats.totalTransactionsCount > 0));
  const netCashflow = stats.netMonthlyCashflow || 0;
  const isPositiveCashflow = netCashflow >= 0;

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 ${className}`}
    >
      <StatCard
        title={t('dashboard.avgMonthlyInflows')}
        value={formatCurrency(stats.monthlyIncomeAvg || 0)}
        description={t('dashboard.inflowsDesc')}
        icon={<Wallet className="w-5 h-5" />}
        variant="success"
        trend={hasData && stats.monthlyGrowthRate ? `+${stats.monthlyGrowthRate}%` : '—'}
        trendDirection={hasData && stats.monthlyGrowthRate ? 'up' : 'neutral'}
        trendLabel={hasData ? t('common.momGrowth') : undefined}
      />

      <StatCard
        title={t('dashboard.avgMonthlyOutflows')}
        value={formatCurrency(stats.monthlyExpensesAvg || 0)}
        description={t('dashboard.outflowsDesc')}
        icon={<ArrowDownRight className="w-5 h-5" />}
        variant="default"
        trend={hasData ? '-2.1%' : '—'}
        trendDirection={hasData ? 'down' : 'neutral'}
        trendLabel={hasData ? t('common.optimized') : undefined}
      />

      <StatCard
        title={t('dashboard.netMonthlySurplus')}
        value={formatCurrency(netCashflow)}
        description={t('dashboard.surplusDesc')}
        icon={<TrendingUp className="w-5 h-5" />}
        variant={isPositiveCashflow ? 'success' : 'warning'}
        badge={
          hasData ? (
            <Badge variant={isPositiveCashflow ? 'success' : 'warning'} size="sm">
              {isPositiveCashflow ? t('common.healthy') : t('common.attention')}
            </Badge>
          ) : undefined
        }
      />

      <StatCard
        title={t('dashboard.trustFootprintScore')}
        value={hasData && profile?.footprintScore ? profile.footprintScore : '—'}
        description={t('dashboard.trustScoreDesc')}
        icon={<ShieldCheck className="w-5 h-5" />}
        variant="default"
        badge={
          hasData && profile?.trustGrade && profile?.trustGrade !== '—' ? (
            <Badge variant="primary" size="sm">
              {t('lenderReport.gradePrefix')} {profile.trustGrade}
            </Badge>
          ) : undefined
        }
        trend={hasData ? '+18 pts' : '—'}
        trendDirection={hasData ? 'up' : 'neutral'}
        trendLabel={hasData ? t('common.thisQuarter') : undefined}
      />
    </div>
  );
}

export default FinancialStats;