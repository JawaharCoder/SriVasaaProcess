import React from 'react';
import { Card, Row, Col, Tag } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, CartesianGrid, LineChart, Line,
} from 'recharts';
import MetricCard from '../components/MetricCard';
import { fmt, fmtShort } from '../utils/format';
import { balanceData } from '../data/sampleData';

const PIE_COLORS = ['#e94560', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];

const monthlyRevenue = [
  { month: 'Oct', revenue: 85000 },
  { month: 'Nov', revenue: 120000 },
  { month: 'Dec', revenue: 95000 },
  { month: 'Jan', revenue: 140000 },
  { month: 'Feb', revenue: 160000 },
  { month: 'Mar', revenue: 210000 },
  { month: 'Apr', revenue: 185000 },
];

const serviceMix = [
  { name: 'Stiff Wash',        value: 45 },
  { name: 'Soft Wash Special', value: 30 },
  { name: 'Special Wash',      value: 18 },
  { name: 'Folding / Other',   value: 7 },
];

const salaryTrend = [
  { month: 'Jan', payroll: 74000 },
  { month: 'Feb', payroll: 76000 },
  { month: 'Mar', payroll: 78000 },
  { month: 'Apr', payroll: 86000 },
];

const topPendingParties = balanceData
  .filter(r => r.pending > 0)
  .sort((a, b) => b.pending - a.pending)
  .slice(0, 8);

export default function Reports({ invoices = [], employees = [], purchases = [] }) {
  const totalInv  = balanceData.reduce((s, r) => s + r.inv, 0);
  const totalRecv = balanceData.reduce((s, r) => s + r.recv, 0);
  const totalPend = balanceData.reduce((s, r) => s + Math.max(0, r.pending), 0);
  const collRate  = Math.round((totalRecv / totalInv) * 100);

  const totalPurchases = purchases.reduce((s, r) => s + r.price, 0);
  const unpaidPurchases = purchases.filter(r => !r.paid).reduce((s, r) => s + r.price, 0);

  return (
    <div>
      <div className="metric-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        <MetricCard label="Collection Rate"   value={`${collRate}%`}        sub={`${fmtShort(totalRecv)} of ${fmtShort(totalInv)}`} accent="#10b981" />
        <MetricCard label="Pending Recovery"  value={fmtShort(totalPend)}   sub="From all active parties"    accent="#f59e0b" />
        <MetricCard label="Purchase Payables" value={fmtShort(unpaidPurchases)} sub="Chemical & materials due" accent="#ef4444" />
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {/* Revenue Trend */}
        <Col xs={24} lg={14}>
          <Card title="Monthly Revenue Trend">
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'K'} tick={{ fontSize: 11, fill: '#94a3b8' }} width={48} />
                  <Tooltip formatter={v => [fmt(v), 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revGrad2)" dot={{ fill: '#3b82f6', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Service Mix Pie */}
        <Col xs={24} lg={10}>
          <Card title="Service Mix">
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceMix}
                    cx="50%" cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {serviceMix.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={v => [`${v}%`, 'Share']} />
                  <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 12, color: '#64748b' }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {/* Top Pending */}
        <Col xs={24} lg={14}>
          <Card title="Top Pending Parties" extra={<Tag color="error">Action Required</Tag>}>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPendingParties} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                  <XAxis type="number" tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'K'} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} width={120} />
                  <Tooltip formatter={v => [fmt(v), 'Pending']} />
                  <Bar dataKey="pending" fill="#e94560" radius={[0, 6, 6, 0]} background={{ fill: '#fef2f2', radius: [0, 6, 6, 0] }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Salary Trend */}
        <Col xs={24} lg={10}>
          <Card title="Payroll Trend">
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salaryTrend} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'K'} tick={{ fontSize: 11, fill: '#94a3b8' }} width={48} />
                  <Tooltip formatter={v => [fmt(v), 'Payroll']} />
                  <Line type="monotone" dataKey="payroll" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Summary table */}
      <Card title="Party-wise Collection Summary">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0f172a' }}>
                {['Party', 'Invoiced', 'Received', 'Pending', 'Rate'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: h === 'Party' ? 'left' : 'right', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {balanceData.filter(r => r.pending > 0).sort((a, b) => b.pending - a.pending).map((r, i) => {
                const rate = Math.min(100, Math.round((r.recv / r.inv) * 100));
                return (
                  <tr key={r.no} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                    <td style={{ padding: '9px 14px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{r.name}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', fontSize: 13 }}>{fmt(r.inv)}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', fontSize: 13, color: '#10b981', fontWeight: 600 }}>{fmt(r.recv)}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', fontSize: 13, color: '#ef4444', fontWeight: 700 }}>{fmt(r.pending)}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', fontSize: 13, color: rate >= 80 ? '#10b981' : '#f59e0b', fontWeight: 600 }}>{rate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
