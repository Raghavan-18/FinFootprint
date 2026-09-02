/**
 * Local Data Service Layer for FinFootprint (Demo Mode)
 *
 * Replaces active Firestore dependency with a responsive local storage + FastAPI service layer.
 * Communicates with Python FastAPI Evidence Engine and ML Services when backend is online,
 * with local browser persistence (localStorage) and offline-ready fallbacks.
 *
 * NOTE: TEMPORARY DEMO MODE IS ACTIVE.
 * Firebase Firestore implementation is preserved in firestoreService.js for future production use.
 */

import { apiService } from './api';
import { evaluateEvidence } from './evidenceService';
import { calculateEvidenceStats } from '../utils/evidenceUtils';
import {
  mockProfile,
  mockFinancialStats,
  mockMonthlyCashflows,
  mockTransactions,
} from '../data/mockData';

const getMonthYearKey = (dateStr) => {
  if (!dateStr) return 'Recent';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Recent';
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

/**
 * Get or initialize User Profile in local storage
 *
 * @param {Object} authUser - Current user
 * @returns {Promise<Object>}
 */
export const getUserProfile = async (authUser) => {
  if (!authUser || !authUser.uid) return null;

  const storageKey = `finfootprint_profile_${authUser.uid}`;

  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        ...mockProfile,
        id: authUser.uid,
        uid: authUser.uid,
        email: authUser.email || data.email || mockProfile.email,
        fullName: authUser.displayName || data.fullName || mockProfile.fullName,
        ...data,
      };
    }

    // Default Profile for Demo / New User
    const isDefaultDemoUser = authUser.uid === 'demo-user-001' || authUser.email === 'demo@finfootprint.local';

    const initialProfile = {
      ...mockProfile,
      id: authUser.uid,
      uid: authUser.uid,
      email: authUser.email || mockProfile.email,
      fullName: authUser.displayName || (isDefaultDemoUser ? mockProfile.fullName : (authUser.email ? authUser.email.split('@')[0] : 'User')),
      profileCompleted: isDefaultDemoUser, // Demo user starts completed; newly signed up users start false
      monthlyIncome: isDefaultDemoUser ? 48650 : 0,
      incomeType: isDefaultDemoUser ? 'BUSINESS' : 'SALARY',
      incomeStability: isDefaultDemoUser ? 'MOSTLY_STABLE' : 'FIXED',
      occupation: isDefaultDemoUser ? 'Electrical Services Contractor' : '',
      housing: isDefaultDemoUser
        ? { status: 'OWN', ownershipStatus: 'FULLY_OWNED', propertyValue: 3500000, monthlyRent: 0, landlordContact: '' }
        : { status: 'OWN', ownershipStatus: 'FULLY_OWNED', propertyValue: 0, monthlyRent: 0, landlordContact: '' },
      loans: isDefaultDemoUser
        ? [
            {
              id: 'loan_demo_1',
              type: 'VEHICLE',
              lender: 'HDFC Bank',
              outstandingAmount: 120000,
              monthlyEmi: 4500,
              remainingTenureMonths: 24,
            },
          ]
        : [],
      monthlyExpenses: isDefaultDemoUser
        ? { food: 8000, rent: 0, utilities: 3500, transport: 4200, education: 2000, medical: 1500, loanEmi: 4500, other: 2500 }
        : { food: 0, rent: 0, utilities: 0, transport: 0, education: 0, medical: 0, loanEmi: 0, other: 0 },
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(storageKey, JSON.stringify(initialProfile));
    return initialProfile;
  } catch (error) {
    console.error('Error fetching user profile from local storage:', error);
    return {
      ...mockProfile,
      id: authUser.uid,
      uid: authUser.uid,
      profileCompleted: true,
    };
  }
};

/**
 * Update user profile in local storage
 *
 * @param {string} userId - User UID
 * @param {Object} updates - Fields to update
 */
export const updateUserProfile = async (userId, updates) => {
  if (!userId) throw new Error('User ID is required');
  const storageKey = `finfootprint_profile_${userId}`;
  try {
    const existing = JSON.parse(localStorage.getItem(storageKey) || '{}');
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error updating user profile locally:', err);
  }
};

/**
 * Save complete Financial Profile during onboarding: localStorage
 *
 * @param {string} userId - User UID
 * @param {Object} financialData - Financial profile data payload
 */
export const saveFinancialProfile = async (userId, financialData) => {
  if (!userId) throw new Error('User ID is required');

  const cleanLoans = Array.isArray(financialData.loans)
    ? financialData.loans.map((loan, idx) => ({
        id: loan.id || `loan_${Date.now()}_${idx}`,
        type: loan.type || 'PERSONAL',
        lender: loan.lender ? String(loan.lender).trim() : '',
        outstandingAmount: Number(loan.outstandingAmount) || 0,
        monthlyEmi: Number(loan.monthlyEmi) || 0,
        remainingTenureMonths: Number(loan.remainingTenureMonths) || 0,
      }))
    : [];

  const housingStatus = financialData.housing?.status || 'OWN';
  const monthlyRent = housingStatus === 'RENTED' ? (Number(financialData.housing?.monthlyRent) || 0) : 0;
  const totalLoanEmi = cleanLoans.reduce((sum, l) => sum + (Number(l.monthlyEmi) || 0), 0);

  const cleanExpenses = {
    food: Number(financialData.monthlyExpenses?.food) || 0,
    rent: monthlyRent,
    utilities: Number(financialData.monthlyExpenses?.utilities) || 0,
    transport: Number(financialData.monthlyExpenses?.transport) || 0,
    education: Number(financialData.monthlyExpenses?.education) || 0,
    medical: Number(financialData.monthlyExpenses?.medical) || 0,
    loanEmi: totalLoanEmi > 0 ? totalLoanEmi : (Number(financialData.monthlyExpenses?.loanEmi) || 0),
    other: Number(financialData.monthlyExpenses?.other) || 0,
  };

  const payload = {
    monthlyIncome: Number(financialData.monthlyIncome) || 0,
    incomeType: financialData.incomeType || 'SALARY',
    incomeStability: financialData.incomeStability || 'FIXED',
    occupation: financialData.occupation ? String(financialData.occupation).trim() : '',
    housing: {
      status: housingStatus,
      ownershipStatus: financialData.housing?.ownershipStatus || (housingStatus === 'OWN' ? 'FULLY_OWNED' : ''),
      propertyValue: Number(financialData.housing?.propertyValue) || 0,
      monthlyRent: monthlyRent,
      landlordContact: financialData.housing?.landlordContact ? String(financialData.housing.landlordContact).trim() : '',
    },
    loans: cleanLoans,
    monthlyExpenses: cleanExpenses,
    profileCompleted: true,
    updatedAt: new Date().toISOString(),
  };

  const storageKey = `finfootprint_profile_${userId}`;
  const existing = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const merged = { ...existing, ...payload };
  localStorage.setItem(storageKey, JSON.stringify(merged));

  return merged;
};

/**
 * Fetch all financial activities for an authenticated user
 *
 * @param {string} userId - User UID
 * @param {Object} [params] - Filter params
 * @returns {Promise<Array<Object>>}
 */
export const getFinancialActivities = async (userId, params = {}) => {
  if (!userId) return [];

  const storageKey = `finfootprint_activities_${userId}`;

  try {
    let activities = [];
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      activities = JSON.parse(stored);
    } else {
      // Seed with initial mock transactions on first run
      activities = [...mockTransactions];
      localStorage.setItem(storageKey, JSON.stringify(activities));
    }

    // Apply client filters if specified
    if (params.type && params.type !== 'ALL') {
      activities = activities.filter((tx) => (tx.type || '').toUpperCase() === params.type.toUpperCase());
    }
    if (params.evidenceStatus && params.evidenceStatus !== 'ALL') {
      activities = activities.filter(
        (tx) => (tx.evidenceStatus || '').toUpperCase() === params.evidenceStatus.toUpperCase()
      );
    }
    if (params.search) {
      const queryStr = params.search.toLowerCase().trim();
      activities = activities.filter(
        (tx) =>
          (tx.title && tx.title.toLowerCase().includes(queryStr)) ||
          (tx.counterparty && tx.counterparty.toLowerCase().includes(queryStr)) ||
          (tx.category && tx.category.toLowerCase().includes(queryStr)) ||
          (tx.referenceId && tx.referenceId.toLowerCase().includes(queryStr)) ||
          (tx.reference && tx.reference.toLowerCase().includes(queryStr))
      );
    }

    return activities;
  } catch (error) {
    console.error('Error fetching financial activities from local storage:', error);
    return mockTransactions;
  }
};

/**
 * Record a new financial activity
 * Sends to FastAPI backend for evidence classification, with local persistence
 *
 * @param {string} userId - User UID
 * @param {Object} activityData - Form data
 * @returns {Promise<Object>} Created transaction
 */
export const createFinancialActivity = async (userId, activityData) => {
  if (!userId) throw new Error('User ID is required to record activity');

  let evidenceAssessment = null;

  // 1. Attempt to classify with FastAPI Evidence Engine
  try {
    const backendRes = await apiService.analyzeFinancialActivity(activityData);
    if (backendRes?.success && backendRes?.data?.evidence) {
      evidenceAssessment = backendRes.data.evidence;
    }
  } catch (backendErr) {
    console.warn('FastAPI backend not reachable, using local evidence engine:', backendErr.message);
  }

  // 2. Fallback to local evidence engine if backend is offline
  if (!evidenceAssessment) {
    evidenceAssessment = activityData.evidence || evaluateEvidence(activityData);
  }

  const status = activityData.evidenceStatus || evidenceAssessment.status || 'SELF_DECLARED';
  const confidenceScore =
    activityData.confidenceScore !== undefined
      ? activityData.confidenceScore
      : (evidenceAssessment.confidenceScore !== undefined
          ? evidenceAssessment.confidenceScore
          : (evidenceAssessment.score ? Math.round(evidenceAssessment.score * 100) : 50));

  const newActivity = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: activityData.title || 'Declared Activity',
    type: activityData.type || 'INCOME',
    category: activityData.category || 'General',
    amount: Number(activityData.amount) || 0,
    date: activityData.date || new Date().toISOString().split('T')[0],
    counterparty: activityData.counterparty || '',
    paymentMethod: activityData.paymentMethod || 'CASH',
    reference: activityData.paymentMethod === 'CASH' ? '' : (activityData.reference || activityData.referenceId || ''),
    referenceId: activityData.paymentMethod === 'CASH' ? '' : (activityData.reference || activityData.referenceId || ''),
    proofAttached: Boolean(activityData.proofAttached || activityData.proofFileName || activityData.proofDocument),
    proofFileName: activityData.proofFileName || activityData.proofDocument || null,
    proofDocument: activityData.proofFileName || activityData.proofDocument || null,
    invoiceNumber: activityData.invoiceNumber || '',
    notes: activityData.notes || '',
    evidenceStatus: status,
    confidenceScore: confidenceScore,
    evidence: {
      status: status,
      score: evidenceAssessment.score || Number((confidenceScore / 100).toFixed(2)),
      explanation: evidenceAssessment.explanation || 'Supporting financial information processed.',
      explanationKey: evidenceAssessment.explanationKey || `evidence.assessments.${String(status).toLowerCase()}`,
      source: evidenceAssessment.source || 'finproof-evidence-engine',
    },
    analysis: activityData.analysis || {
      riskLevel: status === 'VERIFIED' || status === 'CORROBORATED' ? 'LOW' : (status === 'SELF_DECLARED' ? 'MEDIUM' : 'HIGH'),
    },
    metadata: {
      submittedVia: 'FinFootprint Web App (Demo Mode)',
      paymentChannel: activityData.paymentMethod || 'CASH',
      reconciliationStatus: status === 'VERIFIED' ? 'Verified Online' : 'Pending Verification',
    },
    createdAt: new Date().toISOString(),
  };

  // 3. Persist to local storage list
  const storageKey = `finfootprint_activities_${userId}`;
  try {
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updated = [newActivity, ...existing];
    localStorage.setItem(storageKey, JSON.stringify(updated));
  } catch (err) {
    console.error('Error persisting activity locally:', err);
  }

  return newActivity;
};

/**
 * Compute real aggregated financial statistics dynamically from user's activities
 */
export const calculateStatsFromActivities = (activities = []) => {
  if (!activities || activities.length === 0) {
    return { ...mockFinancialStats, hasData: false };
  }

  let totalIncome = 0;
  let totalExpenses = 0;
  const inflowCategories = new Set();
  const outflowCategories = new Set();
  const monthsSet = new Set();

  let verifiedTurnover = 0;
  let totalTurnover = 0;
  let minDate = null;
  let maxDate = null;

  activities.forEach((tx) => {
    const amt = Number(tx.amount) || 0;
    const date = tx.date ? new Date(tx.date) : new Date();

    if (!minDate || date < minDate) minDate = date;
    if (!maxDate || date > maxDate) maxDate = date;

    const monthKey = getMonthYearKey(tx.date);
    monthsSet.add(monthKey);

    if (tx.type === 'INCOME') {
      totalIncome += amt;
      totalTurnover += amt;
      if (tx.category) inflowCategories.add(tx.category);
      if (tx.evidenceStatus === 'VERIFIED' || tx.evidenceStatus === 'CORROBORATED') {
        verifiedTurnover += amt;
      }
    } else if (tx.type === 'EXPENSE') {
      totalExpenses += amt;
      if (tx.category) outflowCategories.add(tx.category);
    }
  });

  const monthCount = Math.max(monthsSet.size, 1);
  const monthlyIncomeAvg = Math.round(totalIncome / monthCount);
  const monthlyExpensesAvg = Math.round(totalExpenses / monthCount);
  const netMonthlyCashflow = monthlyIncomeAvg - monthlyExpensesAvg;

  let observationPeriod = '1 Day';
  let observationPeriodDays = 1;
  if (minDate && maxDate) {
    const diffTime = Math.abs(maxDate - minDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    observationPeriodDays = Math.max(diffDays, 1);
    observationPeriod = observationPeriodDays === 1 ? '1 Day' : `${observationPeriodDays} Days`;
  }

  const gstVerifiedTurnoverRatio = totalTurnover > 0
    ? Math.round((verifiedTurnover / totalTurnover) * 100)
    : 72;

  let cashflowRunwayMonths = null;
  if (monthlyExpensesAvg > 0 && netMonthlyCashflow > 0) {
    cashflowRunwayMonths = Number(((netMonthlyCashflow * 2) / monthlyExpensesAvg).toFixed(1));
  }

  return {
    monthlyIncomeAvg: monthlyIncomeAvg || mockFinancialStats.monthlyIncomeAvg,
    monthlyExpensesAvg: monthlyExpensesAvg || mockFinancialStats.monthlyExpensesAvg,
    netMonthlyCashflow: netMonthlyCashflow || mockFinancialStats.netMonthlyCashflow,
    cashflowRunwayMonths: cashflowRunwayMonths || mockFinancialStats.cashflowRunwayMonths,
    totalRecordedTurnover: totalIncome + totalExpenses || mockFinancialStats.totalRecordedTurnover,
    totalIncome,
    totalExpenses,
    activeInflowChannels: inflowCategories.size || mockFinancialStats.activeInflowChannels,
    activeOutflowChannels: outflowCategories.size || mockFinancialStats.activeOutflowChannels,
    gstVerifiedTurnoverRatio,
    upiVolumeRatio: 84,
    monthlyGrowthRate: 8.4,
    totalTransactionsCount: activities.length,
    observationPeriod,
    observationPeriodDays,
    hasData: true,
  };
};

/**
 * Compute monthly cashflow chart data dynamically from user's activities
 */
export const calculateMonthlyCashflows = (activities = []) => {
  if (!activities || activities.length === 0) {
    return mockMonthlyCashflows;
  }

  const monthMap = {};

  activities.forEach((tx) => {
    const dateStr = tx.date || new Date().toISOString().split('T')[0];
    const monthKey = getMonthYearKey(dateStr);

    if (!monthMap[monthKey]) {
      monthMap[monthKey] = {
        month: monthKey,
        income: 0,
        expenses: 0,
        net: 0,
        verifiedCount: 0,
        totalCount: 0,
      };
    }

    const amt = Number(tx.amount) || 0;
    if (tx.type === 'INCOME') {
      monthMap[monthKey].income += amt;
    } else if (tx.type === 'EXPENSE') {
      monthMap[monthKey].expenses += amt;
    }

    monthMap[monthKey].totalCount += 1;
    if (tx.evidenceStatus === 'VERIFIED') {
      monthMap[monthKey].verifiedCount += 1;
    }
  });

  const sortedMonths = Object.values(monthMap).map((m) => ({
    ...m,
    net: m.income - m.expenses,
    verifiedRatio: m.totalCount > 0 ? Math.round((m.verifiedCount / m.totalCount) * 100) : 0,
  }));

  return sortedMonths.length > 0 ? sortedMonths : mockMonthlyCashflows;
};

/**
 * Generate Behavioral Analysis and ML Indicators based on activities
 */
export const getAnalysisData = (activities = [], stats = null) => {
  if (!activities || activities.length === 0) {
    return {
      hasSufficientData: false,
      metrics: [],
      anomalies: [],
    };
  }

  const evidenceStats = calculateEvidenceStats(activities);
  const totalIncome = stats?.totalIncome || 48650;
  const totalExpenses = stats?.totalExpenses || 26200;
  const expenseRatio = totalIncome > 0 ? Math.min(Math.round((totalExpenses / totalIncome) * 100), 100) : 54;

  const anomalies = activities
    .filter((tx) => tx.evidenceStatus === 'MISMATCH')
    .map((tx, idx) => ({
      id: `anom_user_${tx.id || idx}`,
      transactionId: tx.id,
      title: `${tx.title} Evidence Discrepancy`,
      severity: 'MEDIUM',
      date: tx.date || new Date().toISOString(),
      description: tx.notes || `Discrepancy identified in recorded amount of ₹${tx.amount}.`,
      impactScore: -6,
      status: 'PENDING_REVIEW',
      actionRequired: 'Upload signed voucher, GST invoice, or bank debit advice to reconcile record.',
    }));

  const metrics = [
    {
      id: 'metric_income_stability',
      title: 'Income Stability Index',
      value: Math.min(65 + Math.round(evidenceStats.verifiedPercent * 0.25) + activities.length, 95),
      max: 100,
      status: 'OPTIMAL',
      description: 'Measured via verified transaction frequency and digital settlement consistency.',
      trend: '+3.5%',
      benchmark: 'Sector Benchmark: 70',
      factors: [
        `${activities.length} recorded financial activities in your personal ledger.`,
        `${evidenceStats.verifiedPercent}% verified digital evidence footprint.`,
        'Active digital ledger entries provide high underwriting clarity.',
      ],
    },
    {
      id: 'metric_expense_discipline',
      title: 'Expense-to-Income Ratio',
      value: `${expenseRatio}%`,
      status: expenseRatio <= 65 ? 'OPTIMAL' : 'MODERATE',
      description: 'Proportion of recorded revenue utilized for operational outflows and inventory.',
      benchmark: 'Healthy Threshold: < 65%',
      factors: [
        `Operational expense load is currently ${expenseRatio}% of gross recorded inflows.`,
        'Clear separation of business and operational expense streams.',
      ],
    },
    {
      id: 'metric_evidence_authenticity',
      title: 'Evidence Verification Ratio',
      value: `${evidenceStats.verifiedPercent}%`,
      status: evidenceStats.verifiedPercent >= 75 ? 'HIGH' : 'MODERATE',
      description: 'Percentage of recorded activities backed by verifiable digital trails.',
      benchmark: 'Lender Target: > 75%',
      factors: [
        `${evidenceStats.breakdown.VERIFIED} verified entries with direct digital references.`,
        `${evidenceStats.breakdown.CORROBORATED} corroborated entries with supporting documents.`,
      ],
    },
  ];

  return {
    hasSufficientData: true,
    metrics,
    anomalies,
  };
};

/**
 * Generate Underwriting Lender Report based on user data
 */
export const getLenderReportData = (activities = [], stats = null, profile = null) => {
  const safeActivities = activities && activities.length > 0 ? activities : mockTransactions;
  const evidenceStats = calculateEvidenceStats(safeActivities);
  const total = evidenceStats.totalCount || 1;
  const verifiedPct = Math.round((evidenceStats.breakdown.VERIFIED / total) * 100);
  const corroboratedPct = Math.round((evidenceStats.breakdown.CORROBORATED / total) * 100);
  const selfDeclaredPct = Math.round((evidenceStats.breakdown.SELF_DECLARED / total) * 100);
  const mismatchPct = Math.round((evidenceStats.breakdown.MISMATCH / total) * 100);

  const recommendedLimit = Math.max(Math.round((stats?.monthlyIncomeAvg || 48650) * 2.5), 25000);

  return {
    applicationId: `APP-FIN-${profile?.uid ? profile.uid.substring(0, 6).toUpperCase() : 'DEMO'}-${new Date().getFullYear()}`,
    generatedDate: new Date().toISOString(),
    tradeName: profile?.businessName || mockProfile.businessName,
    borrowerName: profile?.fullName || mockProfile.fullName,
    pan: profile?.panNumber || mockProfile.panNumber,
    gstin: profile?.registrationNumber || mockProfile.registrationNumber,
    businessVintageYears: stats?.observationPeriodDays >= 30 ? (stats.observationPeriodDays / 365).toFixed(1) : 2.0,
    recommendedCreditLimit: recommendedLimit,
    recommendedTenureMonths: 12,
    estimatedInterestTier: '12.0% - 14.5% p.a.',
    riskGrade: verifiedPct >= 70 ? 'Low Risk (Grade A-)' : 'Moderate Risk (Grade B)',
    scoreBand: verifiedPct >= 70 ? 'Prime Tier (750 - 850)' : 'Standard Tier (680 - 749)',
    evidenceIntegrityRating: {
      verifiedShare: `${verifiedPct}%`,
      corroboratedShare: `${corroboratedPct}%`,
      selfDeclaredShare: `${selfDeclaredPct}%`,
      mismatchShare: `${mismatchPct}%`,
      grade: verifiedPct >= 70 ? 'A' : 'B',
      confidenceIndex: `${evidenceStats.verifiedPercent}/100`,
    },
    keyStrengths: [
      `Recorded turnover of ₹${(stats?.totalRecordedTurnover || 583800).toLocaleString('en-IN')}.`,
      `${verifiedPct}% verified digital evidence coverage.`,
      `Active digital financial ledger with ${safeActivities.length} recorded activities.`,
    ],
    riskMitigants: [
      'Digital payment trails provide auditable transaction history.',
      'Regular ledger updates support continuous alternative underwriting score computation.',
    ],
  };
};

export default {
  getUserProfile,
  updateUserProfile,
  saveFinancialProfile,
  getFinancialActivities,
  createFinancialActivity,
  calculateStatsFromActivities,
  calculateMonthlyCashflows,
  getAnalysisData,
  getLenderReportData,
};
