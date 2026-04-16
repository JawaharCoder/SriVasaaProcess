export const fmt = (n) => '₹' + Math.round(n || 0).toLocaleString('en-IN');
export const fmtDate = (d) => {
  if (!d) return '–';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
export const fmtShort = (n) => {
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L';
  if (n >= 1000) return '₹' + (n / 1000).toFixed(1) + 'K';
  return fmt(n);
};
export const today = () => new Date().toISOString().split('T')[0];
export const initials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

export const AVATAR_COLORS = [
  { bg: '#dbeafe', text: '#1e40af' },
  { bg: '#d1fae5', text: '#065f46' },
  { bg: '#ede9fe', text: '#5b21b6' },
  { bg: '#fef3c7', text: '#92400e' },
  { bg: '#fee2e2', text: '#991b1b' },
  { bg: '#f0fdf4', text: '#166534' },
];
