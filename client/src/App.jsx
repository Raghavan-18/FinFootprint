import { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import AddActivity from './pages/AddActivity';
import History from './pages/History';
import Analysis from './pages/Analysis';
import Profile from './pages/Profile';
import LenderReportPage from './pages/LenderReport';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import FinancialProfilePage from './pages/FinancialProfile';
import { useAuth } from './context/AuthContext';
import firestoreService from './services/firestoreService';

/**
 * Helper to resolve URL path to active tab identifier
 */
const pathToTab = (pathname) => {
  const cleanPath = (pathname || '/').replace(/\/+$/, '') || '/';
  switch (cleanPath) {
    case '/login':
      return 'login';
    case '/signup':
      return 'signup';
    case '/forgot-password':
      return 'forgot-password';
    case '/financial-profile':
    case '/setup-profile':
    case '/onboarding':
      return 'financial-profile';
    case '/add':
    case '/add-activity':
      return 'add-activity';
    case '/history':
      return 'history';
    case '/analysis':
      return 'analysis';
    case '/profile':
      return 'profile';
    case '/lender-report':
      return 'lender-report';
    case '/':
    case '/dashboard':
    default:
      return 'dashboard';
  }
};

/**
 * Helper to convert tab identifier to canonical URL path
 */
const tabToPath = (tab) => {
  switch (tab) {
    case 'login':
      return '/login';
    case 'signup':
      return '/signup';
    case 'forgot-password':
      return '/forgot-password';
    case 'financial-profile':
      return '/financial-profile';
    case 'add-activity':
      return '/add';
    case 'history':
      return '/history';
    case 'analysis':
      return '/analysis';
    case 'profile':
      return '/profile';
    case 'lender-report':
      return '/lender-report';
    case 'dashboard':
    default:
      return '/';
  }
};

export function App() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return pathToTab(window.location.pathname);
    }
    return 'dashboard';
  });

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [cashflows, setCashflows] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [lenderReport, setLenderReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state when browser back/forward buttons are clicked
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(pathToTab(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronized navigation handler that updates URL and view
  const handleNavigate = useCallback((targetTabOrPath) => {
    let tab = targetTabOrPath;
    if (typeof targetTabOrPath === 'string' && targetTabOrPath.startsWith('/')) {
      tab = pathToTab(targetTabOrPath);
    }

    setActiveTab(tab);

    const canonicalPath = tabToPath(tab);
    if (typeof window !== 'undefined' && window.location.pathname !== canonicalPath) {
      window.history.pushState(null, '', canonicalPath);
    }
  }, []);

  // Protected Route Guard: Compute effective tab based on authentication and profile state
  const isAuthRoute = ['login', 'signup', 'forgot-password'].includes(activeTab);
  let effectiveTab = activeTab;
  if (!authLoading) {
    if (!isAuthenticated && !isAuthRoute) {
      // Unauthenticated users accessing protected routes see login
      effectiveTab = 'login';
    } else if (isAuthenticated && isAuthRoute) {
      // Authenticated users accessing login/signup see dashboard or onboarding if profile incomplete
      effectiveTab = profile && profile.profileCompleted === false ? 'financial-profile' : 'dashboard';
    } else if (isAuthenticated && !isLoading && profile && profile.profileCompleted === false && !isAuthRoute) {
      // New users with incomplete profile are guided to financial profile setup
      effectiveTab = 'financial-profile';
    }
  }

  // Synchronize browser URL to match effective route
  useEffect(() => {
    if (authLoading) return;
    const canonicalPath = tabToPath(effectiveTab);
    if (typeof window !== 'undefined' && window.location.pathname !== canonicalPath) {
      window.history.replaceState(null, '', canonicalPath);
    }
  }, [authLoading, effectiveTab]);

  // Load user data dynamically from Firestore based on authenticated user.uid
  useEffect(() => {
    let isCancelled = false;

    async function loadUserData() {
      // If auth is still loading or user is not logged in, reset and exit
      if (authLoading || !user?.uid) {
        setProfile(null);
        setStats(null);
        setCashflows([]);
        setTransactions([]);
        setAnalysisData(null);
        setLenderReport(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch User Profile and User Financial Activities for this specific UID
        const [userProfile, userActivities] = await Promise.all([
          firestoreService.getUserProfile(user),
          firestoreService.getFinancialActivities(user.uid),
        ]);

        if (isCancelled) return;

        // Dynamically compute stats from user's activities
        const computedStats = firestoreService.calculateStatsFromActivities(userActivities, userProfile);
        const computedCashflows = firestoreService.calculateMonthlyCashflows(userActivities);
        const computedAnalysis = firestoreService.getAnalysisData(userActivities, computedStats);
        const computedLenderReport = firestoreService.getLenderReportData(userActivities, computedStats, userProfile);

        setProfile(userProfile);
        setTransactions(userActivities);
        setStats(computedStats);
        setCashflows(computedCashflows);
        setAnalysisData(computedAnalysis);
        setLenderReport(computedLenderReport);
      } catch (err) {
        console.error('Error fetching user data from Firestore:', err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadUserData();

    return () => {
      isCancelled = true;
    };
  }, [user, authLoading]);

  // Effective profile merging Firebase user details into Firestore profile
  const effectiveProfile = useMemo(() => {
    if (!profile) {
      if (user) {
        return {
          id: user.uid,
          uid: user.uid,
          fullName: user.displayName || (user.email ? user.email.split('@')[0] : 'User'),
          email: user.email,
          businessName: 'My Enterprise',
          businessType: 'Micro-Enterprise & Sole Proprietorship',
          city: 'India',
          footprintScore: 0,
          trustGrade: '—',
          verificationCoverage: 0,
          memberSince: new Date().toISOString().split('T')[0],
        };
      }
      return null;
    }
    return profile;
  }, [profile, user]);

  // Handle adding new transaction activity with Firestore persistence
  const handleAddActivity = async (newActivity) => {
    if (!user?.uid) {
      throw new Error('You must be logged in to record an activity.');
    }

    const createdTx = await firestoreService.createFinancialActivity(user.uid, newActivity);

    // Update transactions and re-calculate stats immediately
    setTransactions((prev) => {
      const updatedList = [createdTx, ...prev];
      const updatedStats = firestoreService.calculateStatsFromActivities(updatedList, effectiveProfile);
      const updatedCashflows = firestoreService.calculateMonthlyCashflows(updatedList);
      const updatedAnalysis = firestoreService.getAnalysisData(updatedList, updatedStats);
      const updatedReport = firestoreService.getLenderReportData(updatedList, updatedStats, effectiveProfile);

      setStats(updatedStats);
      setCashflows(updatedCashflows);
      setAnalysisData(updatedAnalysis);
      setLenderReport(updatedReport);

      return updatedList;
    });

    return createdTx;
  };

  // While Firebase authentication state is initializing, display minimal polished loader
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/25 animate-pulse mb-4">
          F
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
          <span>FinFootprint</span>
        </div>
      </div>
    );
  }

  // Auth pages rendered with dedicated standalone AuthLayout
  if (effectiveTab === 'login') {
    return <Login onNavigate={handleNavigate} />;
  }

  if (effectiveTab === 'signup') {
    return <Signup onNavigate={handleNavigate} />;
  }

  if (effectiveTab === 'forgot-password') {
    return <ForgotPassword onNavigate={handleNavigate} />;
  }

  // Financial Profile Setup / Onboarding Flow
  if (effectiveTab === 'financial-profile') {
    return (
      <FinancialProfilePage
        profile={effectiveProfile}
        onComplete={(updatedProfileData) => {
          setProfile((prev) => ({
            ...(prev || {}),
            ...(updatedProfileData || {}),
            profileCompleted: true,
          }));
          handleNavigate('dashboard');
        }}
        onNavigate={handleNavigate}
      />
    );
  }

  // Render current view inside existing main application shell
  const renderCurrentPage = () => {
    switch (effectiveTab) {
      case 'dashboard':
        return (
          <Dashboard
            profile={effectiveProfile}
            stats={stats}
            cashflows={cashflows}
            transactions={transactions}
            isLoading={isLoading}
            onNavigate={handleNavigate}
          />
        );
      case 'add-activity':
        return (
          <AddActivity
            onAddActivity={handleAddActivity}
            onNavigate={handleNavigate}
          />
        );
      case 'history':
        return (
          <History
            transactions={transactions}
            isLoading={isLoading}
            onNavigate={handleNavigate}
          />
        );
      case 'analysis':
        return (
          <Analysis
            analysisData={analysisData}
            transactions={transactions}
            isLoading={isLoading}
            onNavigate={handleNavigate}
          />
        );
      case 'profile':
        return (
          <Profile
            profile={effectiveProfile}
            isLoading={isLoading}
            onNavigate={handleNavigate}
          />
        );
      case 'lender-report':
        return (
          <LenderReportPage
            report={lenderReport}
            profile={effectiveProfile}
            stats={stats}
            isLoading={isLoading}
            onNavigate={handleNavigate}
          />
        );
      default:
        return (
          <Dashboard
            profile={effectiveProfile}
            stats={stats}
            cashflows={cashflows}
            transactions={transactions}
            isLoading={isLoading}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <AppLayout
      activeTab={effectiveTab}
      onSelectTab={handleNavigate}
      profile={effectiveProfile}
      onAddActivity={() => handleNavigate('add-activity')}
    >
      {renderCurrentPage()}
    </AppLayout>
  );
}

export default App;



