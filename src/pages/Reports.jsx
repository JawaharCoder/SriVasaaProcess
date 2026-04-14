import React from 'react';
import { Card, CardHeader, MetricCard, fmt } from '../components/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { balanceData } from '../data/sampleData';

const monthlyRevenue = [
  { month: 'Oct 25', revenue: 85000 },
  { month: 'Nov 25', revenue: 120000 },
  { month: 'Dec 25', revenue: 95000 },
  { month: 'Jan 26', revenue: 140000 },
  { month: 'Feb 26', revenue: 160000 },
  { month: 'Mar 26', revenue: 210000 },
  { month: 'Apr 26', revenue: 185000 },
];

const serviceMix = [
  { name: 'Stiff Wash',         value: 45 },
  { name: 'Soft Wash Special',  value: 30 },
  { name: 'Special Wash',       value: 18 },
  { name: 'Folding / Other',    value: 7 },
];
const PIE_COLORS = ['#e94560', '#3b82f6', '#f59e0b', '#10b981'];

const topPending = balanceData
  .filter(r => r.pending > 0)
  .sort((a, b) => b.pending - a.pending)
  .slice(0, 8);

const salaryTrend = [
  { month: 'Jan 26', payroll: 74000 },
  { month: 'Feb 26', payroll: 76000 },
  { month: 'Mar 26', payroll: 78000 },
  { month: 'Apr 26', payroll: 86000 },
];

export default function Reports() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Overall Collection Rate" value="82%"     sub="₹47.5L received of ₹57.8L" accent="#10b981" />
        <MetricCard label="Total Pending Recovery"  value="₹8.34L"  sub="31 active parties"         accent="#f59e0b" />
        <MetricCard label="Long-Term Overdue"       value="₹70,386" sub="Immediate follow-up needed" accent="#ef4444" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Monthly Revenue */}
        <Card>
          <CardHeader title="Monthly Revenue Trend" />
          <div style={{ padding: 16, height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={v => '₹' + (v / 1000) + 'K'} tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => [fmt(v), 'Revenue']} />
                <Bar dataKey="revenue" fill="#e94560" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Service Mix */}
        <Card>
          <CardHeader title="Service Mix" />
          <div style={{ padding: 16, height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={serviceMix} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={({ name, value }) => `${value}%`} labelLine={false}>
                  {serviceMix.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Legend iconType="square" iconSize={10} />
                <Tooltip formatter={v => v + '%'} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Pending by party */}
      <Card style={{ marginBottom: 20 }}>
        <CardHeader title="Party-wise Pending Amounts (Top 8)" />
        <div style={{ padding: 16, height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topPending} layout="vertical">
              <XAxis type="number" tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'K'} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140} />
              <Tooltip formatter={v => [fmt(v), 'Pending']} />
              <Bar dataKey="pending" radius={[0, 4, 4, 0]}>
                {topPending.map((r, i) => <Cell key={i} fill={r.pending > 50000 ? '#ef4444' : '#f59e0b'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Salary trend */}
      <Card>
        <CardHeader title="Monthly Payroll Trend" />
        <div style={{ padding: 16, height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salaryTrend}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={v => '₹' + (v / 1000) + 'K'} tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => [fmt(v), 'Payroll']} />
              <Line type="monotone" dataKey="payroll" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
