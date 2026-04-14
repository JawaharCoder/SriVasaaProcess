import React, { useState } from 'react';
import { MetricCard, Card, CardHeader, Pill, Table, Tr, Td, Modal, FormField, Input, Select, Btn, fmt, fmtDate } from '../components/UI';
import { bankTransactions, bankOpeningBalance } from '../data/sampleData';

export default function BankTransactions() {
  const [txns, setTxns] = useState(bankTransactions);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], desc: '', credit: '', debit: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const totalCredit = txns.reduce((s, t) => s + t.credit, 0);
  const totalDebit  = txns.reduce((s, t) => s + t.debit, 0);
  const closing     = bankOpeningBalance + totalCredit - totalDebit;

  // Running balance for display
  let bal = bankOpeningBalance;
  const rows = txns.map(t => {
    bal += t.credit - t.debit;
    return { ...t, balance: bal };
  });

  const addTxn = () => {
    const newTxn = {
      id: txns.length + 1,
      date: form.date,
      desc: form.desc,
      credit: parseFloat(form.credit) || 0,
      debit: parseFloat(form.debit) || 0,
    };
    setTxns(prev => [...prev, newTxn]);
    setAdding(false);
    setForm({ date: new Date().toISOString().split('T')[0], desc: '', credit: '', debit: '' });
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Opening Balance" value={fmt(bankOpeningBalance)} sub="Apr 2026"       accent="#3b82f6" />
        <MetricCard label="Total Credits"   value={fmt(totalCredit)}        sub={`${txns.filter(t=>t.credit>0).length} deposits`}  accent="#10b981" />
        <MetricCard label="Total Debits"    value={fmt(totalDebit)}         sub={`${txns.filter(t=>t.debit>0).length} transfers`}  accent="#ef4444" />
        <MetricCard label="Closing Balance" value={fmt(closing)}            sub="Current balance" accent="#f59e0b" />
      </div>

      <Card>
        <CardHeader title="Bank Transactions – April 2026" right={
          <>
            <Pill label="HDFC Bank" color="blue" />
            <Pill label="A/C: 50200106389545" color="gray" />
            <Btn variant="primary" size="sm" onClick={() => setAdding(true)}>+ Add Transaction</Btn>
          </>
        } />
        <Table headers={[
          { label: '#' }, { label: 'Date' }, { label: 'Description' },
          { label: 'Credit', right: true }, { label: 'Debit', right: true }, { label: 'Balance', right: true },
        ]}>
          {rows.map(t => (
            <Tr key={t.id}>
              <Td muted>{t.id}</Td>
              <Td>{fmtDate(t.date)}</Td>
              <Td>{t.desc}</Td>
              <Td right s={{ color: t.credit ? '#10b981' : '#d1d5db' }}>{t.credit ? fmt(t.credit) : '—'}</Td>
              <Td right s={{ color: t.debit  ? '#ef4444' : '#d1d5db' }}>{t.debit  ? fmt(t.debit)  : '—'}</Td>
              <Td right bold>{fmt(t.balance)}</Td>
            </Tr>
          ))}
        </Table>
        <div style={{ padding: '12px 14px', background: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 32 }}>
          <span style={{ fontSize: 12, color: '#6b7280' }}>Total Entries: {txns.length}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#10b981' }}>Total In: {fmt(totalCredit)}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#ef4444' }}>Total Out: {fmt(totalDebit)}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Net Balance: {fmt(closing)}</span>
        </div>
      </Card>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add Bank Transaction" width={480}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 20 }}>
          <FormField label="Date"><Input type="date" value={form.date} onChange={e => set('date', e.target.value)} /></FormField>
          <FormField label="Type">
            <Select value={form.type} onChange={e => set('type', e.target.value)}>
              <option>Deposit (Credit)</option>
              <option>Transfer (Debit)</option>
            </Select>
          </FormField>
          <FormField label="Description" full><Input value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="e.g. Deposit from Party Name" /></FormField>
          <FormField label="Credit Amount (₹)"><Input type="number" value={form.credit} onChange={e => set('credit', e.target.value)} placeholder="0" /></FormField>
          <FormField label="Debit Amount (₹)"><Input type="number" value={form.debit} onChange={e => set('debit', e.target.value)} placeholder="0" /></FormField>
        </div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn onClick={() => setAdding(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={addTxn}>Add Transaction</Btn>
        </div>
      </Modal>
    </div>
  );
}
