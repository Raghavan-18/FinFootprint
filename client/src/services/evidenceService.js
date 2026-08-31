/**
 * Mock Evidence Evaluation Service
 *
 * Temporary frontend simulation. Replace with FastAPI evidence engine.
 *
 * Evaluates submitted financial transaction data, payment channels,
 * counterparty identifiers, and attached supporting documents to determine
 * the appropriate evidence tier.
 */

export function evaluateEvidence(transaction) {
  const paymentMethod = (transaction.paymentMethod || 'CASH').toUpperCase();
  const ref = (transaction.reference || transaction.referenceId || '').trim();
  const hasRef = Boolean(ref);
  const proof = transaction.proofFileName || transaction.proofDocument;
  const hasProof = Boolean(proof && String(proof).trim());

  // Check for explicit mismatch simulation trigger in testing
  if (ref.toLowerCase().includes('mismatch') || (transaction.title && transaction.title.toLowerCase().includes('mismatch'))) {
    return {
      status: 'MISMATCH',
      explanationKey: 'evidence.assessments.mismatch',
      explanation: 'The available evidence does not match the information provided.',
      confidenceScore: 20,
      source: 'mock-evidence-engine',
    };
  }

  // Tier 1: Verified (UPI / Bank Transfer with verifiable reference ID and digital proof)
  if ((paymentMethod === 'UPI' || paymentMethod === 'BANK_TRANSFER' || paymentMethod === 'BANK') && hasRef && hasProof) {
    return {
      status: 'VERIFIED',
      explanationKey: 'evidence.assessments.verified',
      explanation: 'Supporting financial information is consistent with the recorded activity.',
      confidenceScore: 98,
      source: 'mock-evidence-engine',
    };
  }

  // Tier 2: Corroborated (Supporting proof is available, or digital transaction channel with reference)
  if (hasProof || ((paymentMethod === 'UPI' || paymentMethod === 'BANK_TRANSFER' || paymentMethod === 'BANK') && hasRef)) {
    return {
      status: 'CORROBORATED',
      explanationKey: 'evidence.assessments.corroborated',
      explanation: 'Additional supporting proof is available, but independent verification is not complete.',
      confidenceScore: 82,
      source: 'mock-evidence-engine',
    };
  }

  // Tier 3: Self-Declared (Cash or uncorroborated manual entry without independent proof)
  return {
    status: 'SELF_DECLARED',
    explanationKey: 'evidence.assessments.selfDeclared',
    explanation: 'No independent supporting evidence is currently available.',
    confidenceScore: 50,
    source: 'mock-evidence-engine',
  };
}

export default evaluateEvidence;
