/**
 * Format numerical amounts into formatted currency strings (INR ₹ default).
 *
 * @param {number} amount - Numerical value
 * @param {Object} options - Formatting options
 * @param {string} [options.currency='INR'] - Currency code
 * @param {boolean} [options.compact=false] - If true, formats as 12.5k / 2.4L
 * @param {boolean} [options.showSign=false] - If true, prepends + for positive numbers
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, options = {}) {
  const { currency = 'INR', compact = false, showSign = false } = options;

  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₹0';
  }

  const num = Number(amount);
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  if (compact) {
    let formattedCompact;
    if (absNum >= 10000000) {
      formattedCompact = `₹${(absNum / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
    } else if (absNum >= 100000) {
      formattedCompact = `₹${(absNum / 100000).toFixed(2).replace(/\.00$/, '')} L`;
    } else if (absNum >= 1000) {
      formattedCompact = `₹${(absNum / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    } else {
      formattedCompact = `₹${absNum.toLocaleString('en-IN')}`;
    }

    if (isNegative) return `-${formattedCompact}`;
    if (showSign && num > 0) return `+${formattedCompact}`;
    return formattedCompact;
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(absNum);

  if (isNegative) {
    return `-${formatted}`;
  }
  if (showSign && num > 0) {
    return `+${formatted}`;
  }
  return formatted;
}

export default formatCurrency;
