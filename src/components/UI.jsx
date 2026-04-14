import React from 'react';

// ── Pill / Badge ─────────────────────────────────────────────
const pillColors = {
  green:  { bg: '#d1fae5', color: '#065f46' },
  amber:  { bg: '#fef3c7', color: '#92400e' },
  red:    { bg: '#fee2e2', color: '#991b1b' },
  blue:   { bg: '#dbeafe', color: '#1e40af' },
  purple: { bg: '#ede9fe', color: '#5b21b6' },
  gray:   { bg: '#f3f4f6', color: '#374151' },
};
export function Pill({ label, color = 'gray' }) {
  const c = pillColors[color] || pillColors.gray;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
      borderRadius: 20, fontSize: 11, fontWeight: 600,
      background: c.bg, color: c.color,
    }}>{label}</span>
  );
}

// ── Metric Card ──────────────────────────────────────────────
export function MetricCard({ label, value, sub, accent = '#3b82f6' }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '18px 20px',
      border: '1px solid #e5e7eb', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 56, height: 56,
        borderRadius: '0 12px 0 56px', background: accent, opacity: 0.1,
      }} />
      <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────
export function Card({ children, style }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb',
      marginBottom: 20, overflow: 'hidden', ...style,
    }}>{children}</div>
  );
}

export function CardHeader({ title, right }) {
  return (
    <div style={{
      padding: '14px 20px', borderBottom: '1px solid #f3f4f6',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{title}</div>
      {right && <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>{right}</div>}
    </div>
  );
}

// ── Button ───────────────────────────────────────────────────
export function Btn({ children, onClick, variant = 'outline', size = 'md', type = 'button', disabled }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none',
    borderRadius: 8, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1, transition: 'all 0.15s',
  };
  const sizes = { sm: { padding: '5px 12px', fontSize: 12 }, md: { padding: '8px 16px', fontSize: 13 } };
  const variants = {
    primary: { background: '#e94560', color: '#fff' },
    outline: { background: 'transparent', border: '1px solid #e5e7eb', color: '#1a1a2e' },
    green:   { background: '#10b981', color: '#fff' },
    danger:  { background: '#ef4444', color: '#fff' },
    ghost:   { background: 'transparent', color: '#6b7280' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant] }}>
      {children}
    </button>
  );
}

// ── Table ────────────────────────────────────────────────────
export function Table({ headers, children }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{
                padding: '10px 14px', textAlign: h.right ? 'right' : 'left',
                fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.5px', color: '#6b7280', background: '#f9fafb',
                borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap',
              }}>{h.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Tr({ children, onClick }) {
  return (
    <tr onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
      onMouseLeave={e => e.currentTarget.style.background = ''}>
      {children}
    </tr>
  );
}

export function Td({ children, right, bold, muted, style: s }) {
  return (
    <td style={{
      padding: '10px 14px', borderBottom: '1px solid #f3f4f6',
      textAlign: right ? 'right' : 'left',
      fontWeight: bold ? 600 : 400,
      color: muted ? '#9ca3af' : '#374151',
      fontSize: 13, ...s,
    }}>{children}</td>
  );
}

// ── FormField ────────────────────────────────────────────────
export function FormField({ label, children, full }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, gridColumn: full ? '1/-1' : undefined }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
      {children}
    </div>
  );
}

export function Input(props) {
  return <input {...props} style={{
    padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: 8,
    fontSize: 13, color: '#1a1a2e', background: '#fff', width: '100%',
    outline: 'none', ...props.style,
  }} />;
}

export function Select({ children, ...props }) {
  return (
    <select {...props} style={{
      padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: 8,
      fontSize: 13, color: '#1a1a2e', background: '#fff', width: '100%',
      outline: 'none', ...props.style,
    }}>{children}</select>
  );
}

// ── Modal ────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = 640 }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 16, width, maxWidth: '95vw',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid #e5e7eb',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: '#9ca3af', cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

// ── Rupee formatter ──────────────────────────────────────────
export const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
export const fmtDate = (d) => {
  if (!d) return '–';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
