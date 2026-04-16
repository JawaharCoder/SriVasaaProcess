import React, { useMemo } from 'react';
import { Row, Col, Card, Tag, Button, Table, Avatar, Space } from 'antd';
import { ArrowRightOutlined, WarningOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import MetricCard from '../components/MetricCard';
import { fmt, fmtDate, fmtShort, initials, AVATAR_COLORS } from '../utils/format';
import { balanceData, bankOpeningBalance } from '../data/sampleData';

const topPending = [
  { name: 'Sun Tex',           amt: 143000 },
  { name: 'V.R.K Fabrics',     amt: 119385 },
  { name: 'PR Silks',          amt: 69077 },
  { name: 'A N Tex',           amt: 63181 },
  { name: 'Appa Ramasamy',     amt: 57115 },
  { name: 'Sri Palanimurugan', amt: 50000 },
];

const monthlyRevenue = [
  { month: 'Oct', revenue: 85000 },
  { month: 'Nov', revenue: 120000 },
  { month: 'Dec', revenue: 95000 },
  { month: 'Jan', revenue: 140000 },
  { month: 'Feb', revenue: 160000 },
  { month: 'Mar', revenue: 210000 },
  { month: 'Apr', revenue: 185000 },
];

export default function Dashboard({ onNavigate, invoices = [], employees = [], salaryRecords = [], bankTxns = [] }) {
  const totalInvoiced = balanceData.reduce((s, r) => s + r.inv, 0);
  const totalRecv = balanceData.reduce((s, r) => s + r.recv, 0);
  const totalPending = balanceData.reduce((s, r) => s + Math.max(0, r.pending), 0);
  const longPending = balanceData.reduce((s, r) => s + r.longPend, 0);

  const totalCredits = bankTxns.reduce((s, t) => s + t.credit, 0);
  const totalDebits = bankTxns.reduce((s, t) => s + t.debit, 0);
  const closing = bankOpeningBalance + totalCredits - totalDebits;

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthSalaries = salaryRecords.filter(r => r.month === currentMonth);
  const paidSalaries = monthSalaries.filter(r => r.paid);

  const activeEmployees = employees.filter(e => e.status === 'Active');

  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map(inv => {
      const base = inv.rate * inv.qty + (inv.transport || 0);
      const nett = base + base * 0.05;
      return { ...inv, nett };
    });

  return (
    <div>
      {/* Metrics */}
      <div className="metric-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        <MetricCard label="Total Invoiced"    value={fmtShort(totalInvoiced)} sub="31 active parties"   accent="#3b82f6" icon="📋" />
        <MetricCard label="Amount Received"   value={fmtShort(totalRecv)}     sub={`${Math.round(totalRecv/totalInvoiced*100)}% collection`} accent="#10b981" icon="✅" />
        <MetricCard label="Pending Amount"    value={fmtShort(totalPending)}  sub="Needs follow-up"     accent="#f59e0b" icon="⏳" />
        <MetricCard label="Long-Term Overdue" value={fmt(longPending)}        sub="4 overdue parties"   accent="#ef4444" icon="🚨" />
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {/* Top Pending Chart */}
        <Col xs={24} lg={14}>
          <Card
            title="Top Pending Parties"
            extra={<Tag color="warning"><WarningOutlined /> Action Needed</Tag>}
            style={{ height: '100%' }}
          >
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPending} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                  <XAxis type="number" tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'K'} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} width={110} />
                  <Tooltip formatter={v => [fmt(v), 'Pending']} />
                  <Bar dataKey="amt" fill="#e94560" radius={[0, 6, 6, 0]}
                    background={{ fill: '#f8fafc', radius: [0, 6, 6, 0] }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Bank Summary */}
        <Col xs={24} lg={10}>
          <Card title="April 2026 – Bank" extra={<Tag color="blue">HDFC Bank</Tag>} style={{ height: '100%' }}>
            {[
              { label: 'Opening Balance', val: fmt(bankOpeningBalance), color: '#0f172a' },
              { label: 'Total Credits',   val: '+' + fmt(totalCredits),  color: '#10b981' },
              { label: 'Total Debits',    val: '-' + fmt(totalDebits),   color: '#ef4444' },
              { label: 'Closing Balance', val: fmt(closing),             color: '#3b82f6', bold: true },
            ].map((r, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none',
              }}>
                <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{r.label}</span>
                <span style={{ fontSize: r.bold ? 17 : 14, fontWeight: 700, color: r.color }}>{r.val}</span>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {/* Revenue Trend */}
        <Col xs={24} lg={14}>
          <Card title="Revenue Trend (Oct 25 – Apr 26)">
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e94560" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#e94560" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'K'} tick={{ fontSize: 11, fill: '#94a3b8' }} width={50} />
                  <Tooltip formatter={v => [fmt(v), 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#e94560" strokeWidth={2.5} fill="url(#revGrad)" dot={{ fill: '#e94560', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Salary Status */}
        <Col xs={24} lg={10}>
          <Card
            title={`${new Date().toLocaleString('en-IN', { month: 'long' })} – Salary`}
            extra={<Button type="link" size="small" onClick={() => onNavigate('salaries')} icon={<ArrowRightOutlined />}>View all</Button>}
          >
            {activeEmployees.slice(0, 4).map((emp, i) => {
              const rec = monthSalaries.find(r => r.empId === emp.id);
              const paid = rec?.paid || false;
              const c = AVATAR_COLORS[i % AVATAR_COLORS.length];
              return (
                <div key={emp.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: i < 3 ? '1px solid #f8fafc' : 'none',
                }}>
                  <Space>
                    <Avatar style={{ background: c.bg, color: c.text, fontWeight: 700, fontSize: 11 }} size={32}>{initials(emp.name)}</Avatar>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{emp.name}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{emp.role}</div>
                    </div>
                  </Space>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{fmt(emp.baseSalary)}</div>
                    <Tag color={paid ? 'success' : 'warning'} icon={paid ? <CheckCircleOutlined /> : <ClockCircleOutlined />}>
                      {paid ? 'Paid' : 'Pending'}
                    </Tag>
                  </div>
                </div>
              );
            })}
          </Card>
        </Col>
      </Row>

      {/* Recent Invoices */}
      <Card
        title="Recent Invoices"
        extra={<Button type="link" size="small" onClick={() => onNavigate('invoices')} icon={<ArrowRightOutlined />}>View all</Button>}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Invoice #', 'Party', 'Service', 'Date', 'Amount', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv, i) => (
                <tr key={inv.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 700, color: '#e94560' }}>#{inv.id}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500 }}>{inv.party}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#64748b' }}>{inv.service}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#94a3b8' }}>{fmtDate(inv.date)}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 700 }}>{fmt(inv.nett)}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <Tag color={inv.status === 'Paid' ? 'success' : 'warning'}>{inv.status}</Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
