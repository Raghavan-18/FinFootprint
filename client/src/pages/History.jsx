import { useState, useMemo } from 'react';
import PageHeader from '../components/common/PageHeader';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionList from '../components/transactions/TransactionList';
import TransactionDetailsModal from '../components/transactions/TransactionDetailsModal';
import EvidenceBreakdown from '../components/evidence/EvidenceBreakdown';
import EvidenceInfoModal from '../components/evidence/EvidenceInfoModal';
import Button from '../components/common/Button';
import { PlusCircle } from 'lucide-react';

/**
 * History & Ledger Page
 *
 * Full searchable and auditable ledger of all incoming & outgoing entries.
 */
export function History({
  transactions = [],
  isLoading = false,
  onNavigate,
}) {
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
        title="Activity & Transaction Ledger"
        description="Auditable log of all verified business flows, client payouts, supplier purchases, and self-declarations"
        breadcrumbs={[
          { label: 'Dashboard', onClick: () => onNavigate('dashboard') },
          { label: 'History & Ledger' },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={<PlusCircle className="w-4 h-4" />}
              onClick={() => onNavigate('add-activity')}
            >
              Add Activity
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
          <span>Showing {filteredTransactions.length} recorded events</span>
          <span>Click any record to inspect verifiable audit trail</span>
        </div>

        <TransactionList
          transactions={filteredTransactions}
          isLoading={isLoading}
          onSelectTransaction={(tx) => setSelectedTransaction(tx)}
          emptyTitle="No matching transactions found"
          emptyDescription="Try resetting your search query or selecting a different filter."
          emptyAction={
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Reset Filters
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
