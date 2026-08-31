/**
 * Format ISO date string or Date object into human-readable strings with locale awareness.
 *
 * @param {string|Date} dateInput
 * @param {Object} options
 * @param {string} [options.format='medium'] - 'short', 'medium', 'long', 'relative'
 * @returns {string}
 */
export function formatDate(dateInput, options = {}) {
  if (!dateInput) return '—';

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  const isTamil = typeof document !== 'undefined' && document.documentElement.lang === 'ta';
  const locale = isTamil ? 'ta-IN' : 'en-IN';

  const { format = 'medium' } = options;

  if (format === 'relative') {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 30) {
      return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
    }
    if (isTamil) {
      if (diffDay > 0) return `${diffDay} நாளுக்கு முன்`;
      if (diffHour > 0) return `${diffHour} மணிநேரம் முன்`;
      if (diffMin > 0) return `${diffMin} நிமிடம் முன்`;
      return 'இப்போதுதான்';
    }

    if (diffDay > 0) return `${diffDay}d ago`;
    if (diffHour > 0) return `${diffHour}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return 'Just now';
  }

  if (format === 'short') {
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  }

  if (format === 'long') {
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Default 'medium'
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default formatDate;
