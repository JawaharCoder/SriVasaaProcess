import React from 'react';
import { MetricCard, Card, CardHeader, Pill, fmt, fmtDate } from '../components/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const topPending = [
  { name: 'Sun Tex',           amt: 143000 },
  { name: 'V.R.K Fabrics',     amt: 119385 },
  { name: 'PR Silks',          amt: 69077 },
  { name: 'A N Tex',           amt: 63181 },
  { name: 'Appa Ramasamy',     amt: 57115 },
  { name: 'Sri Palanimurugan', amt: 50000 },
];

const recentInvoices = [
  { id: '492', date: '2026-04-10', party: 'Sun Textile Elampillai', service: 'Stiff Wash',      nett: 42000,  status: 'Pending' },
  { id: '136', date: '2026-03-30', party: 'Shri Vihaash Silks',     service: 'Special Wash',    nett: 79411,  status: 'Pending' },
  { id: '135', date: '2026-03-28', party: 'Pothys Retail Pvt Ltd',  service: 'Soft Wash Special',nett: 18191, status: 'Paid' },
  { id: '134', date: '2026-03-26', party: 'V.R.K Fabrics',          service: 'Stiff Wash',      nett: 55163,  status: 'Pending' },
  { id: '133', date: '2026-03-14', party: 'Pothys Retail Pvt Ltd',  service: 'Soft Wash Special',nett: 11597, status: 'Paid' },
];

export default function Dashboard({ onNavigate }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Total Invoiced"    value="₹57.8L"   sub="31 active parties"  accent="#3b82f6" />
        <MetricCard label="Amount Received"   value="₹47.5L"   sub="82% collection rate" accent="#10b981" />
        <MetricCard label="Pending Amount"    value="₹8.34L"   sub="Needs follow-up"     accent="#f59e0b" />
        <MetricCard label="Long-Time Pending" value="₹70,386"  sub="4 overdue parties"   accent="#ef4444" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Top Pending */}
        <Card>
          <CardHeader title="Top Pending Parties" right={<Pill label="Action needed" color="amber" />} />
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPending} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <XAxis type="number" tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'K'} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                <Tooltip formatter={v => fmt(v)} />
                <Bar dataKey="amt" fill="#e94560" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bank Summary */}
        <Card>
          <CardHeader title="April 2026 – Bank Summary" right={<Pill label="HDFC Bank" color="blue" />} />
          <div style={{ padding: '4px 0' }}>
            {[
              { label: 'Opening Balance',  val: '₹1,668',    color: '#374151' },
              { label: 'Total Credits',    val: '+₹2,11,758', color: '#10b981' },
              { label: 'Total Debits',     val: '-₹1,79,830', color: '#ef4444' },
              { label: 'Closing Balance',  val: '₹33,596',   color: '#3b82f6', bold: true },
            ].map((r, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', padding: '11px 20px',
                borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none',
                background: i === 3 ? '#f9fafb' : '#fff',
              }}>
                <span style={{ fontSize: 13, fontWeight: r.bold ? 600 : 400 }}>{r.label}</span>
                <span style={{ fontSize: r.bold ? 17 : 13, fontWeight: 600, color: r.color }}>{r.val}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Employee Salary Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <Card>
          <CardHeader title="April 2026 – Salary Status" right={
            <button onClick={() => onNavigate('salaries')} style={{ fontSize: 12, color: '#e94560', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>View all →</button>
          } />
          {[
            { name: 'Palani',   role: 'Machine Operator', salary: 18000, paid: true },
            { name: 'Natraj',   role: 'Boiler Operator',  salary: 16000, paid: false },
            { name: 'Alakash',  role: 'Maintenance',      salary: 14000, paid: false },
            { name: 'Selvam',   role: 'Driver',           salary: 15000, paid: false },
          ].map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                  {e.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{e.name}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{e.role}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{fmt(e.salary)}</div>
                <Pill label={e.paid ? 'Paid' : 'Pending'} color={e.paid ? 'green' : 'amber'} />
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <CardHeader title="Recent Invoices" right={
            <button onClick={() => onNavigate('invoices')} style={{ fontSize: 12, color: '#e94560', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>View all →</button>
          } />
          {recentInvoices.slice(0, 4).map((inv, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>#{inv.id} – {inv.party.split(' ')[0]}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{inv.service} · {fmtDate(inv.date)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{fmt(inv.nett)}</div>
                <Pill label={inv.status} color={inv.status === 'Paid' ? 'green' : 'amber'} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
