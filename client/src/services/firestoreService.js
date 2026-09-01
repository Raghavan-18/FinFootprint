/**
 * Firestore Service Layer for FinFootprint
 *
 * Implements user-scoped Firestore data operations:
 * - User Profile: users/{uid}
 * - User Financial Activities: users/{uid}/financialActivities/{activityId}
 * - Dynamic calculations for stats, cashflows, analysis, and lender reports.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { evaluateEvidence } from './evidenceService';
import { calculateEvidenceStats } from '../utils/evidenceUtils';

/**
 * Format Date helper for grouping
 */
const getMonthYearKey = (dateStr) => {
  if (!dateStr) return 'Recent';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Recent';
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

/**
 * Get or create User Profile in Firestore: users/{uid}
 *
 * @param {Object} authUser - Authenticated Firebase User object
 * @returns {Promise<Object>} User profile object
 */
export const getUserProfile = async (authUser) => {
  if (!authUser || !authUser.uid) return null;

  try {
    const userDocRef = doc(db, 'users', authUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      return {
        id: authUser.uid,
        uid: authUser.uid,
        email: authUser.email || data.email || '',
        fullName: authUser.displayName || data.fullName || (authUser.email ? authUser.email.split('@')[0] : 'User'),
        photoURL: authUser.photoURL || data.avatarUrl || null,
        ...data,
      };
    }

    // Default Profile for Brand New User
    const defaultProfile = {
      id: authUser.uid,
      uid: authUser.uid,
      fullName: authUser.displayName || (authUser.email ? authUser.email.split('@')[0] : 'User'),
      businessName: 'My Enterprise',
      businessType: 'Micro-Enterprise & Sole Proprietorship',
      registrationNumber: 'GSTIN: Pending',
      panNumber: 'PAN: Pending',
      phone: authUser.phoneNumber || '',
      email: authUser.email || '',
      city: 'India',
      memberSince: new Date().toISOString().split('T')[0],
      kycStatus: 'PENDING',
      accountAggregatorStatus: 'DISCONNECTED',
      footprintScore: 0,
      footprintScoreMax: 900,
      stabilityScore: 0,
      repaymentDiscipline: 0,
      trustGrade: '—',
      verificationCoverage: 0,
      avatarUrl: authUser.photoURL || null,
      createdAt: new Date().toISOString(),
    };

    await setDoc(userDocRef, defaultProfile, { merge: true });
    return defaultProfile;
  } catch (error) {
    console.error('Error fetching/creating user profile from Firestore:', error);
    // Return graceful fallback without crashing
    return {
      id: authUser.uid,
      uid: authUser.uid,
      fullName: authUser.displayName || (authUser.email ? authUser.email.split('@')[0] : 'User'),
      email: authUser.email || '',
      businessName: 'My Enterprise',
      businessType: 'Micro-Enterprise & Sole Proprietorship',
      city: 'India',
      memberSince: new Date().toISOString().split('T')[0],
      footprintScore: 0,
      trustGrade: '—',
    };
  }
};

/**
 * Update user profile in Firestore
 *
 * @param {string} userId - User UID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (userId, updates) => {
  if (!userId) throw new Error('User ID is required to update profile');
  const userDocRef = doc(db, 'users', userId);
  await setDoc(userDocRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
};

/**
 * Fetch all financial activities for a specific authenticated user: users/{uid}/financialActivities
 *
 * @param {string} userId - User UID
 * @param {Object} [params] - Filter params
 * @returns {Promise<Array<Object>>} List of user's financial activities
 */
export const getFinancialActivities = async (userId, params = {}) => {
  if (!userId) return [];

  try {
    const activitiesRef = collection(db, 'users', userId, 'financialActivities');
    const q = query(activitiesRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);

    let activities = [];
    snapshot.forEach((docSnap) => {
      activities.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });

    // Apply client-side filters if specified
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
    console.error('Error fetching financial activities from Firestore:', error);
    return [];
  }
};

/**
 * Record a new financial activity for an authenticated user: users/{uid}/financialActivities
 *
 * @param {string} userId - User UID
 * @param {Object} activityData - Form data
 * @returns {Promise<Object>} Created financial activity
 */
export const createFinancialActivity = async (userId, activityData) => {
  if (!userId) throw new Error('User ID is required to record activity');

  // Evaluate evidence via evidence engine
  const evidenceAssessment = evaluateEvidence(activityData);

  const newActivity = {
    title: activityData.title || 'Declared Activity',
    type: activityData.type || 'INCOME',
    category: activityData.category || 'General',
    amount: Number(activityData.amount) || 0,
    date: activityData.date || new Date().toISOString().split('T')[0],
    counterparty: activityData.counterparty || '',
    paymentMethod: activityData.paymentMethod || 'CASH',
    reference: activityData.paymentMethod === 'CASH' ? '' : (activityData.reference || activityData.referenceId || ''),
    referenceId: activityData.paymentMethod === 'CASH' ? '' : (activityData.reference || activityData.referenceId || ''),
    proofAttached: Boolean(activityData.proofFileName || activityData.proofDocument),
    proofFileName: activityData.proofFileName || activityData.proofDocument || null,
    proofDocument: activityData.proofFileName || activityData.proofDocument || null,
    invoiceNumber: activityData.invoiceNumber || '',
    notes: activityData.notes || '',
    evidenceStatus: evidenceAssessment.status,
    confidenceScore: evidenceAssessment.confidenceScore,
    evidence: {
      status: evidenceAssessment.status,
      explanation: evidenceAssessment.explanation,
      explanationKey: evidenceAssessment.explanationKey,
      source: 'firestore-evidence-engine',
    },
    metadata: {
      submittedVia: 'FinFootprint Web App',
      paymentChannel: activityData.paymentMethod || 'CASH',
      reconciliationStatus: evidenceAssessment.status === 'VERIFIED' ? 'Verified Online' : 'Pending Verification',
    },
    createdAt: new Date().toISOString(),
  };

  const activitiesRef = collection(db, 'users', userId, 'financialActivities');
  const docRef = await addDoc(activitiesRef, newActivity);

  return {
    id: docRef.id,
    ...newActivity,
  };
};

/**
 * Compute real aggregated financial statistics dynamically from user's activities
 *
 * @param {Array<Object>} activities - User's activities
 * @param {Object} [profile] - User profile
 * @returns {Object} Calculated stats object
 */
export const calculateStatsFromActivities = (activities = []) => {
  if (!activities || activities.length === 0) {
    return {
      monthlyIncomeAvg: 0,
      monthlyExpensesAvg: 0,
      netMonthlyCashflow: 0,
      cashflowRunwayMonths: null,
      totalRecordedTurnover: 0,
      totalIncome: 0,
      totalExpenses: 0,
      activeInflowChannels: 0,
      activeOutflowChannels: 0,
      gstVerifiedTurnoverRatio: null,
      upiVolumeRatio: null,
      monthlyGrowthRate: null,
      totalTransactionsCount: 0,
      observationPeriod: 'Not started',
      observationPeriodDays: 0,
      hasData: false,
    };
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

  // Compute observation period in days
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
    : null;

  let cashflowRunwayMonths = null;
  if (monthlyExpensesAvg > 0 && netMonthlyCashflow > 0) {
    cashflowRunwayMonths = Number(((netMonthlyCashflow * 2) / monthlyExpensesAvg).toFixed(1));
  }

  return {
    monthlyIncomeAvg,
    monthlyExpensesAvg,
    netMonthlyCashflow,
    cashflowRunwayMonths,
    totalRecordedTurnover: totalIncome + totalExpenses,
    totalIncome,
    totalExpenses,
    activeInflowChannels: inflowCategories.size || (totalIncome > 0 ? 1 : 0),
    activeOutflowChannels: outflowCategories.size || (totalExpenses > 0 ? 1 : 0),
    gstVerifiedTurnoverRatio,
    monthlyGrowthRate: null,
    totalTransactionsCount: activities.length,
    observationPeriod,
    observationPeriodDays,
    hasData: true,
  };
};

/**
 * Compute monthly cashflow chart data dynamically from user's activities
 *
 * @param {Array<Object>} activities
 * @returns {Array<Object>} Monthly chart points
 */
export const calculateMonthlyCashflows = (activities = []) => {
  if (!activities || activities.length === 0) {
    return [];
  }

  // Group by YYYY-MM
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

  return sortedMonths;
};

/**
 * Generate Behavioral Analysis and ML Indicators based on user's real activities
 *
 * @param {Array<Object>} activities
 * @param {Object} stats
 * @returns {Object} Analysis data { hasSufficientData, metrics, anomalies }
 */
export const getAnalysisData = (activities = [], stats = null) => {
  if (!activities || activities.length < 3) {
    return {
      hasSufficientData: false,
      metrics: [],
      anomalies: [],
    };
  }

  const evidenceStats = calculateEvidenceStats(activities);
  const totalIncome = stats?.totalIncome || 0;
  const totalExpenses = stats?.totalExpenses || 0;
  const expenseRatio = totalIncome > 0 ? Math.min(Math.round((totalExpenses / totalIncome) * 100), 100) : 50;

  // Derive anomalies from any flagged mismatch activities
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
 * Generate Underwriting Lender Report based on real user data
 *
 * @param {Array<Object>} activities
 * @param {Object} stats
 * @param {Object} profile
 * @returns {Object|null} Lender report data
 */
export const getLenderReportData = (activities = [], stats = null, profile = null) => {
  if (!activities || activities.length < 3 || !stats || stats.totalRecordedTurnover === 0) {
    return null;
  }

  const evidenceStats = calculateEvidenceStats(activities);
  const total = evidenceStats.totalCount || 1;
  const verifiedPct = Math.round((evidenceStats.breakdown.VERIFIED / total) * 100);
  const corroboratedPct = Math.round((evidenceStats.breakdown.CORROBORATED / total) * 100);
  const selfDeclaredPct = Math.round((evidenceStats.breakdown.SELF_DECLARED / total) * 100);
  const mismatchPct = Math.round((evidenceStats.breakdown.MISMATCH / total) * 100);

  const recommendedLimit = Math.max(Math.round((stats.monthlyIncomeAvg || 10000) * 2.5), 25000);

  return {
    applicationId: `APP-FIN-${profile?.uid ? profile.uid.substring(0, 6).toUpperCase() : 'USER'}-${new Date().getFullYear()}`,
    generatedDate: new Date().toISOString(),
    tradeName: profile?.businessName || 'Business Owner',
    borrowerName: profile?.fullName || 'User',
    pan: profile?.panNumber || 'PAN: Pending',
    gstin: profile?.registrationNumber || 'GSTIN: Pending',
    businessVintageYears: stats.observationPeriodDays >= 30 ? (stats.observationPeriodDays / 365).toFixed(1) : 0.5,
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
      `Recorded turnover of ₹${stats.totalRecordedTurnover.toLocaleString('en-IN')}.`,
      `${verifiedPct}% verified digital evidence coverage.`,
      `Active digital financial ledger with ${activities.length} recorded activities.`,
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
  getFinancialActivities,
  createFinancialActivity,
  calculateStatsFromActivities,
  calculateMonthlyCashflows,
  getAnalysisData,
  getLenderReportData,
};
