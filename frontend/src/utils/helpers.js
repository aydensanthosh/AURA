/**
 * Format a date string into a readable format.
 * @param {string|Date} date
 * @param {object} options - Intl.DateTimeFormat options
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
};

/**
 * Format a number as a currency string.
 * @param {number} amount
 * @param {string} currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Calculate the current and longest streak from an array of check-in dates.
 * @param {string[]} checkIns - array of ISO date strings
 * @returns {{ currentStreak: number, longestStreak: number }}
 */
export const calculateStreak = (checkIns = []) => {
  if (!checkIns.length) return { currentStreak: 0, longestStreak: 0 };

  const sortedDates = [...new Set(
    checkIns.map((d) => new Date(d).setHours(0, 0, 0, 0))
  )].sort((a, b) => b - a);

  const DAY = 86400000;
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = today - DAY;

  let currentStreak = 0;
  if (sortedDates[0] === today || sortedDates[0] === yesterday) {
    let checkDate = sortedDates[0];
    for (const d of sortedDates) {
      if (d === checkDate) { currentStreak++; checkDate -= DAY; }
      else break;
    }
  }

  let longestStreak = 0;
  let temp = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    if (sortedDates[i - 1] - sortedDates[i] === DAY) { temp++; }
    else { temp = 1; }
    if (temp > longestStreak) longestStreak = temp;
  }
  if (sortedDates.length === 1) longestStreak = 1;

  return { currentStreak, longestStreak: Math.max(longestStreak, currentStreak) };
};

/**
 * Truncate a string to a max length, appending "…" if needed.
 */
export const truncate = (str, max = 100) => {
  if (!str || str.length <= max) return str;
  return str.slice(0, max) + '…';
};

/**
 * Return a relative time string like "2 days ago".
 */
export const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  const intervals = [
    { label: 'year', secs: 31536000 },
    { label: 'month', secs: 2592000 },
    { label: 'week', secs: 604800 },
    { label: 'day', secs: 86400 },
    { label: 'hour', secs: 3600 },
    { label: 'minute', secs: 60 },
  ];
  for (const { label, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count !== 1 ? 's' : ''} ago`;
  }
  return 'just now';
};
