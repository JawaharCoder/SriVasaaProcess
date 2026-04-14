import React from 'react';

const navItems = [
  { id: 'dashboard',  label: 'Dashboard',         section: 'Overview',    icon: 'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z' },
  { id: 'invoices',   label: 'Invoices',           section: 'Sales',       icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8' },
  { id: 'newinvoice', label: 'New Invoice',        section: null,          icon: 'M12 5v14 M5 12h14' },
  { id: 'balance',    label: 'Balance Sheet',      section: 'Finance',     icon: 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
  { id: 'bank',       label: 'Bank Transactions',  section: null,          icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { id: 'purchases',  label: 'Purchases',          section: null,          icon: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18' },
  { id: 'employees',  label: 'Employees',          section: 'HR & Payroll', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' },
  { id: 'salaries',   label: 'Salary Management',  section: null,          icon: 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6 M9 3H5v4h4V3z' },
  { id: 'delivery',   label: 'Delivery',           section: 'Operations',  icon: 'M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z' },
  { id: 'reports',    label: 'Reports',            section: null,          icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
];

export default function Sidebar({ currentPage, onNavigate, onLogout }) {
  let lastSection = null;

  return (
    <div style={{
      width: 230, background: '#1a1a2e', position: 'fixed', top: 0, left: 0,
      height: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, background: 'rgba(233,69,96,0.2)', borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>🏭</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Sri Vasaa Process</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Salem – 636 010</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: '10px 0' }}>
        {navItems.map(item => {
          const showSection = item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;
          const active = currentPage === item.id;
          return (
            <React.Fragment key={item.id}>
              {showSection && (
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', padding: '14px 16px 6px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {item.section}
                </div>
              )}
              <div onClick={() => onNavigate(item.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                cursor: 'pointer', transition: 'all 0.15s',
                borderLeft: `3px solid ${active ? '#e94560' : 'transparent'}`,
                background: active ? 'rgba(233,69,96,0.12)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.6)',
                fontSize: 13,
              }}
                onMouseEnter={e => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
              >
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  {item.icon.split(' ').map((d, i) => <path key={i} d={d} />)}
                </svg>
                {item.label}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: 'rgba(233,69,96,0.2)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, color: '#e94560', fontWeight: 700,
          }}>AD</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>Admin</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Owner</div>
          </div>
          <button onClick={onLogout} title="Logout" style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)',
            cursor: 'pointer', fontSize: 16, lineHeight: 1,
          }}>⏻</button>
        </div>
      </div>
    </div>
  );
}
