/**
 * API Service Layer for FinFootprint
 *
 * Implements a clean client interface. Currently delivers data from mock storage,
 * with structured latency simulation and easy drop-in replacement for FastAPI endpoints.
 */

import {
  mockProfile,
  mockFinancialStats,
  mockMonthlyCashflows,
  mockTransactions,
  mockAnalysisMetrics,
  mockAnomalies,
  mockLenderReport,
} from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const USE_MOCK = true; // Can be toggled with environment variable VITE_USE_MOCK

// In-memory transaction store for interactive actions (e.g. adding activity)
let inMemoryTransactions = [...mockTransactions];

/**
 * Helper to simulate network latency for responsive UI testing
 */
const simulateLatency = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
  /**
   * Fetch User Profile
   */
  async getProfile() {
    if (USE_MOCK) {
      await simulateLatency();
      return { ...mockProfile };
    }
    const res = await fetch(`${BASE_URL}/profile`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  /**
   * Fetch Aggregate Financial Stats
   */
  async getFinancialStats() {
    if (USE_MOCK) {
      await simulateLatency();
      return { ...mockFinancialStats };
    }
    const res = await fetch(`${BASE_URL}/financial-stats`);
    if (!res.ok) throw new Error('Failed to fetch financial stats');
    return res.json();
  },

  /**
   * Fetch Monthly Cashflows
   */
  async getCashflows() {
    if (USE_MOCK) {
      await simulateLatency();
      return [...mockMonthlyCashflows];
    }
    const res = await fetch(`${BASE_URL}/cashflows`);
    if (!res.ok) throw new Error('Failed to fetch cashflows');
    return res.json();
  },

  /**
   * Fetch All Transactions / Activity Logs
   */
  async getTransactions(params = {}) {
    if (USE_MOCK) {
      await simulateLatency();
      let list = [...inMemoryTransactions];

      if (params.type && params.type !== 'ALL') {
        list = list.filter((tx) => tx.type.toUpperCase() === params.type.toUpperCase());
      }
      if (params.evidenceStatus && params.evidenceStatus !== 'ALL') {
        list = list.filter(
          (tx) => tx.evidenceStatus.toUpperCase() === params.evidenceStatus.toUpperCase()
        );
      }
      if (params.search) {
        const query = params.search.toLowerCase();
        list = list.filter(
          (tx) =>
            tx.title.toLowerCase().includes(query) ||
            tx.counterparty.toLowerCase().includes(query) ||
            tx.category.toLowerCase().includes(query) ||
            (tx.referenceId && tx.referenceId.toLowerCase().includes(query))
        );
      }

      return list;
    }

    const queryParams = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/transactions?${queryParams}`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },

  /**
   * Add a new financial transaction / evidence activity
   */
  async addActivity(payload) {
    if (USE_MOCK) {
      await simulateLatency(250);
      const newTx = {
        id: `tx_${Date.now()}`,
        title: payload.title || 'Declared Activity',
        type: payload.type || 'INCOME',
        category: payload.category || 'General',
        amount: Number(payload.amount) || 0,
        date: payload.date || new Date().toISOString(),
        evidenceStatus: payload.evidenceStatus || 'SELF_DECLARED',
        evidenceType: payload.evidenceType || 'Self-Declared Record',
        referenceId: payload.referenceId || `DECL/${Math.floor(100000 + Math.random() * 900000)}`,
        counterparty: payload.counterparty || 'Self / Counterparty',
        notes: payload.notes || '',
        proofDocument: payload.proofDocument || null,
        confidenceScore: payload.evidenceStatus === 'VERIFIED' ? 98 : payload.evidenceStatus === 'CORROBORATED' ? 82 : 50,
        metadata: {
          submittedVia: 'FinFootprint Web App',
          reconciliationStatus: payload.evidenceStatus === 'VERIFIED' ? 'Verified Online' : 'Pending Verification',
        },
      };

      inMemoryTransactions = [newTx, ...inMemoryTransactions];
      return newTx;
    }

    const res = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to record activity');
    return res.json();
  },

  /**
   * Fetch Analysis Metrics & Behavioral Insights
   */
  async getAnalysis() {
    if (USE_MOCK) {
      await simulateLatency();
      return {
        metrics: [...mockAnalysisMetrics],
        anomalies: [...mockAnomalies],
      };
    }
    const res = await fetch(`${BASE_URL}/analysis`);
    if (!res.ok) throw new Error('Failed to fetch analysis');
    return res.json();
  },

  /**
   * Fetch Lender Underwriting Report
   */
  async getLenderReport() {
    if (USE_MOCK) {
      await simulateLatency();
      return { ...mockLenderReport };
    }
    const res = await fetch(`${BASE_URL}/lender-report`);
    if (!res.ok) throw new Error('Failed to fetch lender report');
    return res.json();
  },
};

export default apiService;
