/**
 * Evidence tier definitions and helper configurations
 */
export const EVIDENCE_STATUSES = {
  VERIFIED: 'VERIFIED',
  CORROBORATED: 'CORROBORATED',
  SELF_DECLARED: 'SELF_DECLARED',
  MISMATCH: 'MISMATCH',
};

export const EVIDENCE_CONFIG = {
  VERIFIED: {
    status: 'VERIFIED',
    label: 'Verified',
    shortLabel: 'Verified',
    description: 'Confirmed by direct digital trail (Bank API, AA, GSTN, or direct payment gateway).',
    confidenceScore: 98,
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    dotBg: 'bg-emerald-500',
    iconName: 'ShieldCheck',
    color: 'emerald',
    trustLevel: 'High Trust (Grade A)',
  },
  CORROBORATED: {
    status: 'CORROBORATED',
    label: 'Corroborated',
    shortLabel: 'Corroborated',
    description: 'Cross-verified through indirect proofs like SMS receipts, UPI counterparty matching, or client invoices.',
    confidenceScore: 82,
    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    dotBg: 'bg-blue-500',
    iconName: 'CheckCheck',
    color: 'blue',
    trustLevel: 'Moderate Trust (Grade B+)',
  },
  SELF_DECLARED: {
    status: 'SELF_DECLARED',
    label: 'Self-Declared',
    shortLabel: 'Self Declared',
    description: 'Declared by the user with manual inputs; awaiting supporting digital proofs or corroborating transactions.',
    confidenceScore: 50,
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    dotBg: 'bg-amber-500',
    iconName: 'FileText',
    color: 'amber',
    trustLevel: 'Unverified (Grade C)',
  },
  MISMATCH: {
    status: 'MISMATCH',
    label: 'Discrepancy / Mismatch',
    shortLabel: 'Mismatch',
    description: 'Inconsistency detected between stated records and financial activity or counterparty statements.',
    confidenceScore: 20,
    badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    dotBg: 'bg-rose-500',
    iconName: 'AlertTriangle',
    color: 'rose',
    trustLevel: 'High Risk (Grade F)',
  },
};

/**
 * Get evidence configuration by status key
 * @param {string} status
 * @returns {typeof EVIDENCE_CONFIG[keyof typeof EVIDENCE_CONFIG]}
 */
export function getEvidenceConfig(status) {
  const normalized = (status || '').toUpperCase().trim();
  return EVIDENCE_CONFIG[normalized] || EVIDENCE_CONFIG.SELF_DECLARED;
}

/**
 * Calculate overall weighted verification ratio
 * @param {Array<{ evidenceStatus: string, amount: number }>} transactions
 * @returns {{ verifiedPercent: number, breakdown: Object }}
 */
export function calculateEvidenceStats(transactions = []) {
  if (!transactions.length) {
    return {
      verifiedPercent: 0,
      totalCount: 0,
      breakdown: {
        VERIFIED: 0,
        CORROBORATED: 0,
        SELF_DECLARED: 0,
        MISMATCH: 0,
      },
    };
  }

  const counts = {
    VERIFIED: 0,
    CORROBORATED: 0,
    SELF_DECLARED: 0,
    MISMATCH: 0,
  };

  let totalWeightedScore = 0;

  transactions.forEach((tx) => {
    const st = (tx.evidenceStatus || tx.evidence_status || 'SELF_DECLARED').toUpperCase();
    if (counts[st] !== undefined) {
      counts[st] += 1;
    } else {
      counts.SELF_DECLARED += 1;
    }

    const conf = EVIDENCE_CONFIG[st]?.confidenceScore || 50;
    totalWeightedScore += conf;
  });

  const verifiedPercent = Math.round(totalWeightedScore / transactions.length);

  return {
    verifiedPercent,
    totalCount: transactions.length,
    breakdown: counts,
  };
}
