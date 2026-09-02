/**
 * Evidence tier definitions and helper configurations — FinFootprint v2 Design System
 *
 * Colors now reference the design system semantic tokens:
 * - VERIFIED: Verified green (emerald-based)
 * - CORROBORATED: Corroborated blue (indigo-based)
 * - SELF_DECLARED: Turmeric/amber (commerce warmth)
 * - MISMATCH: Terracotta/red (discrepancy alert)
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
    // Uses CSS variables: bg-verified-bg, text-verified, border-verified-border
    badgeBg: 'bg-verified-bg dark:bg-verified-bg-dark text-verified dark:text-verified border-verified-border dark:border-verified-border-dark',
    dotBg: 'bg-verified',
    iconName: 'ShieldCheck',
    color: 'verified',
    trustLevel: 'High Trust (Grade A)',
  },
  CORROBORATED: {
    status: 'CORROBORATED',
    label: 'Corroborated',
    shortLabel: 'Corroborated',
    description: 'Cross-verified through indirect proofs like SMS receipts, UPI counterparty matching, or client invoices.',
    confidenceScore: 82,
    // Uses CSS variables: bg-corroborated-bg, text-corroborated, border-corroborated-border
    badgeBg: 'bg-corroborated-bg dark:bg-corroborated-bg-dark text-corroborated dark:text-corroborated border-corroborated-border dark:border-corroborated-border-dark',
    dotBg: 'bg-corroborated',
    iconName: 'CheckCheck',
    color: 'corroborated',
    trustLevel: 'Moderate Trust (Grade B+)',
  },
  SELF_DECLARED: {
    status: 'SELF_DECLARED',
    label: 'Self-Declared',
    shortLabel: 'Self Declared',
    description: 'Declared by the user with manual inputs; awaiting supporting digital proofs or corroborating transactions.',
    confidenceScore: 50,
    // Uses CSS variables: bg-self-declared-bg, text-self-declared, border-self-declared-border
    badgeBg: 'bg-self-declared-bg dark:bg-self-declared-bg-dark text-self-declared dark:text-self-declared border-self-declared-border dark:border-self-declared-border-dark',
    dotBg: 'bg-turmeric-500',
    iconName: 'FileText',
    color: 'turmeric',
    trustLevel: 'Unverified (Grade C)',
  },
  MISMATCH: {
    status: 'MISMATCH',
    label: 'Discrepancy / Mismatch',
    shortLabel: 'Mismatch',
    description: 'Inconsistency detected between stated records and financial activity or counterparty statements.',
    confidenceScore: 20,
    // Uses CSS variables: bg-mismatch-bg, text-mismatch, border-mismatch-border
    badgeBg: 'bg-mismatch-bg dark:bg-mismatch-bg-dark text-mismatch dark:text-mismatch border-mismatch-border dark:border-mismatch-border-dark',
    dotBg: 'bg-mismatch',
    iconName: 'AlertTriangle',
    color: 'mismatch',
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