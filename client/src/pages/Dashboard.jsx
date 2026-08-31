import { useState } from 'react';
import WelcomeSection from '../components/dashboard/WelcomeSection';
import FinancialStats from '../components/dashboard/FinancialStats';
import FinancialOverview from '../components/dashboard/FinancialOverview';
import EvidenceBreakdown from '../components/evidence/EvidenceBreakdown';
import RecentActivity from '../components/dashboard/RecentActivity';
import TransactionDetailsModal from '../components/transactions/TransactionDetailsModal';
import EvidenceInfoModal from '../components/evidence/EvidenceInfoModal';
import LoadingState from '../components/common/LoadingState';
import { useLanguage } from '../hooks/useLanguage';

/**
 * Dashboard Page
 *
 * Primary landing page composing high-level financial stats,
 * cashflow overview, evidence breakdown, and recent activity ledger.
 */
export function Dashboard({
  profile,
  stats,
  cashflows,
  transactions,
  isLoading,
  onNavigate,
}) {
  const { t } = useLanguage();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

  if (isLoading) {
    return <LoadingState message={t('common.loadingData')} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <WelcomeSection
        profile={profile}
        onAddActivity={() => onNavigate('add-activity')}
        onViewLenderReport={() => onNavigate('lender-report')}
      />

      {/* Primary Financial Metric Cards */}
      <FinancialStats stats={stats} profile={profile} />

      {/* 2-Column Section: Cashflow Overview & Evidence Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <FinancialOverview cashflows={cashflows} stats={stats} />
        </div>
        <div className="lg:col-span-5">
          <EvidenceBreakdown
            transactions={transactions}
            onOpenGuide={() => setIsEvidenceModalOpen(true)}
          />
        </div>
      </div>

      {/* Recent Activity Table / Cards */}
      <RecentActivity
        transactions={transactions}
        isLoading={isLoading}
        onSelectTransaction={(tx) => setSelectedTransaction(tx)}
        onViewAll={() => onNavigate('history')}
      />

      {/* Reusable Modals */}
      <TransactionDetailsModal
        isOpen={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
      />

      <EvidenceInfoModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
      />
    </div>
  );
}

export default Dashboard;
