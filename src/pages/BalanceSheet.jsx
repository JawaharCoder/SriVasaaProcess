import React, { useState } from 'react';
import { MetricCard, Card, CardHeader, Pill, Table, Tr, Td, fmt } from '../components/UI';
import { balanceData } from '../data/sampleData';

export default function BalanceSheet() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const totalInv  = balanceData.reduce((s, r) => s + r.inv, 0);
  const totalRecv = balanceData.reduce((s, r) => s + r.recv, 0);
  const totalPend = balanceData.reduce((s, r) => s + (r.pending > 0 ? r.pending : 0), 0);

  const filtered = balanceData.filter(r => {
    const m = !search || r.name.toLowerCase().includes(search.toLowerCase());
    let t = true;
    if (filter === 'pending') t = r.pending > 0;
    else if (filter === 'long')   t = r.longPend > 0;
    else if (filter === 'clear')  t = r.pending <= 0;
    return m && t;
  });

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Total Invoiced"   value={fmt(totalInv)}  sub="All 31 parties"      accent="#3b82f6" />
        <MetricCard label="Amount Received"  value={fmt(totalRecv)} sub="82.2% collected"     accent="#10b981" />
        <MetricCard label="Outstanding"      value={fmt(totalPend)} sub="14.4% pending"        accent="#f59e0b" />
      </div>

      <Card>
        <CardHeader title="Party-wise Balance Sheet" right={
          <>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search party..." style={{ padding: '7px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12, width: 180 }} />
            <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '7px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}>
              <option value="">All Parties</option>
              <option value="pending">With Pending</option>
              <option value="long">Long-time Pending</option>
              <option value="clear">Fully Cleared</option>
            </select>
          </>
        } />
        <Table headers={[
          { label: '#' }, { label: 'Party Name' },
          { label: 'Invoice Amt', right: true }, { label: 'Received', right: true },
          { label: 'Pending', right: true }, { label: 'Long Pending', right: true }, { label: 'Status' },
        ]}>
          {filtered.map(r => {
            const pColor = r.pending <= 0 ? 'green' : r.pending > 50000 ? 'red' : 'amber';
            const pLabel = r.pending <= 0 ? 'Clear' : r.pending > 50000 ? 'High' : 'Pending';
            return (
              <Tr key={r.no}>
                <Td muted>{r.no}</Td>
                <Td bold>{r.name}</Td>
                <Td right>{fmt(r.inv)}</Td>
                <Td right s={{ color: '#10b981' }}>{fmt(r.recv)}</Td>
                <Td right bold s={{ color: r.pending > 0 ? '#ef4444' : '#10b981' }}>
                  {r.pending < 0 ? '-' : ''}{fmt(Math.abs(r.pending))}
                </Td>
                <Td right s={{ color: r.longPend > 0 ? '#ef4444' : '#9ca3af' }}>
                  {r.longPend > 0 ? fmt(r.longPend) : '–'}
                </Td>
                <Td><Pill label={pLabel} color={pColor} /></Td>
              </Tr>
            );
          })}
        </Table>
        <div style={{ padding: '12px 14px', background: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 32 }}>
          <span style={{ fontSize: 12, color: '#6b7280' }}>Showing {filtered.length} of {balanceData.length} parties</span>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Total Pending: <span style={{ color: '#ef4444' }}>{fmt(totalPend)}</span></span>
        </div>
      </Card>
    </div>
  );
}
