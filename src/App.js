import React, { useState, useCallback } from 'react';
import { Layout, Menu, Button, Avatar, Tooltip, Drawer, Badge, theme } from 'antd';
import {
  DashboardOutlined, FileTextOutlined, PlusCircleOutlined, DollarOutlined,
  BankOutlined, ShoppingCartOutlined, TeamOutlined, WalletOutlined,
  CarOutlined, BarChartOutlined, MenuOutlined, PoweroffOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  initialInvoices, initialEmployees, initialSalaryRecords,
  initialPurchases, initialBankTransactions, initialDeliveries,
} from './data/sampleData';

import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import BalanceSheet from './pages/BalanceSheet';
import BankTransactions from './pages/BankTransactions';
import Purchases from './pages/Purchases';
import Employees from './pages/Employees';
import Salaries from './pages/Salaries';
import Delivery from './pages/Delivery';
import Reports from './pages/Reports';

const { Sider, Content, Header } = Layout;

const NAV_ITEMS = [
  { type: 'group', label: 'Overview', children: [
    { key: 'dashboard',  label: 'Dashboard',        icon: <DashboardOutlined /> },
  ]},
  { type: 'group', label: 'Sales', children: [
    { key: 'invoices',   label: 'Invoices',          icon: <FileTextOutlined /> },
    { key: 'newinvoice', label: 'New Invoice',       icon: <PlusCircleOutlined /> },
  ]},
  { type: 'group', label: 'Finance', children: [
    { key: 'balance',    label: 'Balance Sheet',     icon: <DollarOutlined /> },
    { key: 'bank',       label: 'Bank Transactions', icon: <BankOutlined /> },
    { key: 'purchases',  label: 'Purchases',         icon: <ShoppingCartOutlined /> },
  ]},
  { type: 'group', label: 'HR & Payroll', children: [
    { key: 'employees',  label: 'Employees',         icon: <TeamOutlined /> },
    { key: 'salaries',   label: 'Salary Mgmt',       icon: <WalletOutlined /> },
  ]},
  { type: 'group', label: 'Operations', children: [
    { key: 'delivery',   label: 'Delivery',          icon: <CarOutlined /> },
    { key: 'reports',    label: 'Reports',           icon: <BarChartOutlined /> },
  ]},
];

const PAGE_TITLES = {
  dashboard: 'Dashboard', invoices: 'Invoices', newinvoice: 'New Invoice',
  balance: 'Balance Sheet', bank: 'Bank Transactions', purchases: 'Purchases & Chemicals',
  employees: 'Employee Directory', salaries: 'Salary Management',
  delivery: 'Delivery Tracking', reports: 'Reports & Analytics',
};

function LoginPage({ onLogin }) {
  const [user, setUser] = useState('admin');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const attempt = () => {
    if (user === 'admin' && pass === 'vasaa2024') onLogin();
    else setErr('Invalid credentials. Try admin / vasaa2024');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      padding: 16,
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.04,
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div style={{
        background: 'rgba(255,255,255,0.97)', borderRadius: 20, padding: '40px 36px',
        width: '100%', maxWidth: 400,
        boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
        position: 'relative',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, background: 'linear-gradient(135deg, #e94560, #c73350)',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(233,69,96,0.35)',
          }}>🏭</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Sri Vasaa Process</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4, fontWeight: 500 }}>Business Management System</div>
        </div>

        {[
          { label: 'Username', type: 'text', value: user, onChange: setUser },
          { label: 'Password', type: 'password', value: pass, onChange: setPass },
        ].map(f => (
          <div key={f.label} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
            <input
              type={f.type} value={f.value}
              onChange={e => f.onChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && attempt()}
              style={{
                width: '100%', padding: '12px 14px', border: '2px solid #e2e8f0',
                borderRadius: 10, fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
                fontFamily: 'inherit', color: '#0f172a',
              }}
              onFocus={e => e.target.style.borderColor = '#e94560'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
        ))}

        {err && <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 12, padding: '8px 12px', background: '#fef2f2', borderRadius: 8 }}>{err}</div>}

        <button onClick={attempt} style={{
          width: '100%', padding: '13px', background: 'linear-gradient(135deg, #e94560, #c73350)',
          color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700,
          cursor: 'pointer', marginTop: 4, letterSpacing: '0.3px',
          boxShadow: '0 4px 16px rgba(233,69,96,0.4)', transition: 'transform 0.1s',
        }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >Sign In →</button>

        <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 16 }}>
          Demo: <strong style={{ color: '#64748b' }}>admin</strong> / <strong style={{ color: '#64748b' }}>vasaa2024</strong>
        </div>
      </div>
    </div>
  );
}

const SidebarContent = ({ page, onNavigate, onLogout }) => (
  <>
    <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 38, height: 38, background: 'linear-gradient(135deg, #e94560, #c73350)',
          borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0, boxShadow: '0 4px 12px rgba(233,69,96,0.3)',
        }}>🏭</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Sri Vasaa Process</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Salem – 636 010</div>
        </div>
      </div>
    </div>

    <Menu
      mode="inline"
      selectedKeys={[page]}
      theme="dark"
      style={{ border: 'none', flex: 1, paddingTop: 8 }}
      onClick={({ key }) => onNavigate(key)}
      items={NAV_ITEMS}
    />

    <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar style={{ background: 'rgba(233,69,96,0.3)', color: '#e94560', fontWeight: 700, flexShrink: 0 }} size={34}>AD</Avatar>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>Admin</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Owner</div>
        </div>
        <Tooltip title="Logout">
          <Button
            icon={<PoweroffOutlined />}
            type="text"
            size="small"
            onClick={onLogout}
            style={{ color: 'rgba(255,255,255,0.35)', padding: '4px' }}
          />
        </Tooltip>
      </div>
    </div>
  </>
);

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem('vasaa_session'));
  const [page, setPage] = useState('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [invoices, setInvoices] = useLocalStorage('vasaa_invoices', initialInvoices);
  const [employees, setEmployees] = useLocalStorage('vasaa_employees', initialEmployees);
  const [salaryRecords, setSalaryRecords] = useLocalStorage('vasaa_salaries', initialSalaryRecords);
  const [purchases, setPurchases] = useLocalStorage('vasaa_purchases', initialPurchases);
  const [bankTxns, setBankTxns] = useLocalStorage('vasaa_bank_txns', initialBankTransactions);
  const [deliveries, setDeliveries] = useLocalStorage('vasaa_deliveries', initialDeliveries);

  const handleLogin = useCallback(() => {
    localStorage.setItem('vasaa_session', '1');
    setLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('vasaa_session');
    setLoggedIn(false);
  }, []);

  const navigate = useCallback((p) => {
    setPage(p);
    setDrawerOpen(false);
  }, []);

  if (!loggedIn) return <LoginPage onLogin={handleLogin} />;

  const renderPage = () => {
    const cls = 'page-fade-in';
    switch (page) {
      case 'dashboard':  return <div className={cls}><Dashboard onNavigate={navigate} invoices={invoices} employees={employees} salaryRecords={salaryRecords} bankTxns={bankTxns} /></div>;
      case 'invoices':   return <div className={cls}><Invoices invoices={invoices} setInvoices={setInvoices} /></div>;
      case 'newinvoice': return <div className={cls}><Invoices invoices={invoices} setInvoices={setInvoices} showCreate /></div>;
      case 'balance':    return <div className={cls}><BalanceSheet /></div>;
      case 'bank':       return <div className={cls}><BankTransactions txns={bankTxns} setTxns={setBankTxns} /></div>;
      case 'purchases':  return <div className={cls}><Purchases purchases={purchases} setPurchases={setPurchases} /></div>;
      case 'employees':  return <div className={cls}><Employees employees={employees} setEmployees={setEmployees} /></div>;
      case 'salaries':   return <div className={cls}><Salaries employees={employees} salaryRecords={salaryRecords} setSalaryRecords={setSalaryRecords} /></div>;
      case 'delivery':   return <div className={cls}><Delivery deliveries={deliveries} setDeliveries={setDeliveries} /></div>;
      case 'reports':    return <div className={cls}><Reports invoices={invoices} employees={employees} purchases={purchases} /></div>;
      default:           return <div className={cls}><Dashboard onNavigate={navigate} invoices={invoices} employees={employees} salaryRecords={salaryRecords} bankTxns={bankTxns} /></div>;
    }
  };

  const siderStyle = {
    background: '#0f172a',
    height: '100vh',
    position: 'fixed',
    left: 0, top: 0, bottom: 0,
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      <Sider
        width={230}
        style={{ ...siderStyle, zIndex: 100 }}
        className="desktop-sider"
        breakpoint="lg"
        collapsedWidth={0}
        trigger={null}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <SidebarContent page={page} onNavigate={navigate} onLogout={handleLogout} />
        </div>
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={230}
        styles={{ body: { padding: 0, background: '#0f172a', display: 'flex', flexDirection: 'column' }, header: { display: 'none' } }}
      >
        <SidebarContent page={page} onNavigate={navigate} onLogout={handleLogout} />
      </Drawer>

      <Layout style={{ marginLeft: 0 }} className="main-layout">
        {/* Top Header */}
        <Header style={{
          background: '#fff', padding: '0 16px', height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 50,
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button
              icon={<MenuOutlined />}
              type="text"
              onClick={() => setDrawerOpen(true)}
              style={{ display: 'none' }}
              className="mobile-menu-btn"
            />
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px' }}>
              {PAGE_TITLES[page]}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', fontWeight: 500 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
              <span className="hide-xs">System Online</span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }} className="hide-xs">
              <CalendarOutlined style={{ marginRight: 4 }} />
              {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </Header>

        <Content style={{ padding: '20px 16px', minHeight: 'calc(100vh - 56px)' }}>
          {renderPage()}
        </Content>
      </Layout>

      <style>{`
        @media (max-width: 991px) {
          .desktop-sider { display: none !important; }
          .main-layout { margin-left: 0 !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 992px) {
          .main-layout { margin-left: 230px !important; }
        }
        @media (max-width: 480px) {
          .hide-xs { display: none !important; }
        }
      `}</style>
    </Layout>
  );
}
