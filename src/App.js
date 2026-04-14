import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import BalanceSheet from './pages/BalanceSheet';
import BankTransactions from './pages/BankTransactions';
import Purchases from './pages/Purchases';
import Employees from './pages/Employees';
import Salaries from './pages/Salaries';
import Delivery from './pages/Delivery';
import Reports from './pages/Reports';
import { initialInvoices, initialEmployees, initialSalaryRecords } from './data/sampleData';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  invoices: 'Invoices',
  newinvoice: 'New Invoice',
  balance: 'Balance Sheet',
  bank: 'Bank Transactions',
  purchases: 'Purchases & Chemicals',
  employees: 'Employee Directory',
  salaries: 'Salary Management',
  delivery: 'Delivery Tracking',
  reports: 'Reports & Analytics',
};

// ─── Login ───────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [user, setUser] = useState('admin');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const attempt = () => {
    if (user === 'admin' && pass === 'vasaa2024') {
      onLogin();
    } else {
      setErr('Invalid credentials. Try admin / vasaa2024');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
    }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 40, width: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 60, height: 60, background: '#1a1a2e', borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, margin: '0 auto 14px',
          }}>🏭</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>Sri Vasaa Process</div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Business Management System</div>
        </div>

        {['Username', 'Password'].map((label, i) => (
          <div key={label} style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
            <input
              type={i === 1 ? 'password' : 'text'}
              value={i === 0 ? user : pass}
              onChange={e => i === 0 ? setUser(e.target.value) : setPass(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && attempt()}
              style={{ width: '100%', padding: '11px 14px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none' }}
            />
          </div>
        ))}

        {err && <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 10 }}>{err}</div>}

        <button onClick={attempt} style={{
          width: '100%', padding: 12, background: '#e94560', color: '#fff',
          border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 4,
        }}>Sign In</button>

        <div style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 14 }}>
          Default login: <strong>admin</strong> / <strong>vasaa2024</strong>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState('dashboard');

  // Shared state lifted up
  const [invoices, setInvoices] = useState(initialInvoices);
  const [employees, setEmployees] = useState(initialEmployees);
  const [salaryRecords, setSalaryRecords] = useState(initialSalaryRecords);

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;

  const navigate = (p) => setPage(p);

  const renderPage = () => {
    switch (page) {
      case 'dashboard':  return <Dashboard onNavigate={navigate} />;
      case 'invoices':   return <Invoices invoices={invoices} setInvoices={setInvoices} />;
      case 'newinvoice': return <Invoices invoices={invoices} setInvoices={setInvoices} showCreate />;
      case 'balance':    return <BalanceSheet />;
      case 'bank':       return <BankTransactions />;
      case 'purchases':  return <Purchases />;
      case 'employees':  return <Employees employees={employees} setEmployees={setEmployees} />;
      case 'salaries':   return <Salaries employees={employees} salaryRecords={salaryRecords} setSalaryRecords={setSalaryRecords} />;
      case 'delivery':   return <Delivery />;
      case 'reports':    return <Reports />;
      default:           return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar currentPage={page} onNavigate={navigate} onLogout={() => setLoggedIn(false)} />

      <div style={{ marginLeft: 230, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top bar */}
        <div style={{
          background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px',
          height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>{PAGE_TITLES[page]}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
              System Online
            </div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>
              {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: 24, flex: 1 }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
