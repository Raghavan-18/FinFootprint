import { useState, useEffect } from 'react';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import AddActivity from './pages/AddActivity';
import History from './pages/History';
import Analysis from './pages/Analysis';
import Profile from './pages/Profile';
import LenderReportPage from './pages/LenderReport';
import apiService from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [cashflows, setCashflows] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [lenderReport, setLenderReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load all initial domain data
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [
          profileRes,
          statsRes,
          cashflowsRes,
          transactionsRes,
          analysisRes,
          lenderRes,
        ] = await Promise.all([
          apiService.getProfile(),
          apiService.getFinancialStats(),
          apiService.getCashflows(),
          apiService.getTransactions(),
          apiService.getAnalysis(),
          apiService.getLenderReport(),
        ]);

        setProfile(profileRes);
        setStats(statsRes);
        setCashflows(cashflowsRes);
        setTransactions(transactionsRes);
        setAnalysisData(analysisRes);
        setLenderReport(lenderRes);
      } catch (err) {
        console.error('Error fetching financial data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Handle adding new transaction activity
  const handleAddActivity = async (newActivity) => {
    const createdTx = await apiService.submitFinancialActivity(newActivity);
    setTransactions((prev) => [createdTx, ...prev]);

    // Recalculate quick stats if applicable
    if (stats) {
      const isIncome = createdTx.type === 'INCOME';
      setStats((prev) => ({
        ...prev,
        totalRecordedTurnover:
          prev.totalRecordedTurnover + (isIncome ? createdTx.amount : 0),
        totalTransactionsCount: prev.totalTransactionsCount + 1,
      }));
    }
    return createdTx;
  };

  // Render current view
  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            profile={profile}
            stats={stats}
            cashflows={cashflows}
            transactions={transactions}
            isLoading={isLoading}
            onNavigate={setActiveTab}
          />
        );
      case 'add-activity':
        return (
          <AddActivity
            onAddActivity={handleAddActivity}
            onNavigate={setActiveTab}
          />
        );
      case 'history':
        return (
          <History
            transactions={transactions}
            isLoading={isLoading}
            onNavigate={setActiveTab}
          />
        );
      case 'analysis':
        return (
          <Analysis
            analysisData={analysisData}
            transactions={transactions}
            isLoading={isLoading}
            onNavigate={setActiveTab}
          />
        );
      case 'profile':
        return (
          <Profile
            profile={profile}
            isLoading={isLoading}
            onNavigate={setActiveTab}
          />
        );
      case 'lender-report':
        return (
          <LenderReportPage
            report={lenderReport}
            profile={profile}
            stats={stats}
            isLoading={isLoading}
            onNavigate={setActiveTab}
          />
        );
      default:
        return (
          <Dashboard
            profile={profile}
            stats={stats}
            cashflows={cashflows}
            transactions={transactions}
            isLoading={isLoading}
            onNavigate={setActiveTab}
          />
        );
    }
  };

  return (
    <AppLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      profile={profile}
      onAddActivity={() => setActiveTab('add-activity')}
    >
      {renderCurrentPage()}
    </AppLayout>
  );
}

export default App;
