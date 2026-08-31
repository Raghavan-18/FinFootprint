import { useState, useMemo } from 'react';
import PageHeader from '../components/common/PageHeader';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionList from '../components/transactions/TransactionList';
import TransactionDetailsModal from '../components/transactions/TransactionDetailsModal';
import EvidenceBreakdown from '../components/evidence/EvidenceBreakdown';
import EvidenceInfoModal from '../components/evidence/EvidenceInfoModal';
import Button from '../components/common/Button';
import { PlusCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

/**
 * History & Ledger Page with localization
 *
 * Full searchable and auditable ledger of all incoming & outgoing entries.
 */
export function History({
  transactions = [],
  isLoading = false,
  onNavigate,
}) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isEvidenceGuideOpen, setIsEvidenceGuideOpen] = useState(false);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type match
      if (selectedType !== 'ALL' && tx.type.toUpperCase() !== selectedType.toUpperCase()) {
        return false;
      }
      // Evidence status match
      if (selectedStatus !== 'ALL' && tx.evidenceStatus.toUpperCase() !== selectedStatus.toUpperCase()) {
        return false;
      }
      // Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = tx.title?.toLowerCase().includes(query);
        const matchParty = tx.counterparty?.toLowerCase().includes(query);
        const matchCat = tx.category?.toLowerCase().includes(query);
        const matchRef = tx.referenceId?.toLowerCase().includes(query);
        if (!matchTitle && !matchParty && !matchCat && !matchRef) return false;
      }
      return true;
    });
  }, [transactions, selectedType, selectedStatus, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedStatus('ALL');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title={t('history.pageTitle')}
        description={t('history.pageSubtitle')}
        breadcrumbs={[
          { label: t('navigation.dashboard'), onClick: () => onNavigate('dashboard') },
          { label: t('navigation.history') },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={<PlusCircle className="w-4 h-4" />}
              onClick={() => onNavigate('add-activity')}
            >
              {t('navbar.addActivityBtn')}
            </Button>
          </div>
        }
      />

      {/* Evidence Breakdown Bar */}
      <EvidenceBreakdown
        transactions={filteredTransactions}
        onOpenGuide={() => setIsEvidenceGuideOpen(true)}
      />

      {/* Filter Controls */}
      <TransactionFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onReset={handleResetFilters}
      />

      {/* Transaction List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1 text-xs text-slate-500 font-medium">
          <span>{t('history.showingRecords', { count: filteredTransactions.length })}</span>
          <span className="hidden sm:inline">{t('history.clickToInspect')}</span>
        </div>

        <TransactionList
          transactions={filteredTransactions}
          isLoading={isLoading}
          onSelectTransaction={(tx) => setSelectedTransaction(tx)}
          emptyTitle={t('history.noMatching')}
          emptyDescription={t('history.noMatchingDesc')}
          emptyAction={
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              {t('common.resetFilters')}
            </Button>
          }
        />
      </div>

      {/* Reusable Modals */}
      <TransactionDetailsModal
        isOpen={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
      />

      <EvidenceInfoModal
        isOpen={isEvidenceGuideOpen}
        onClose={() => setIsEvidenceGuideOpen(false)}
      />
    </div>
  );
}

export default History;
