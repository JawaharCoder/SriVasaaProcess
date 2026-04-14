import React, { useState } from 'react';
import { MetricCard, Card, CardHeader, Pill, Table, Tr, Td, Modal, FormField, Input, Select, Btn, fmt, fmtDate } from '../components/UI';
import { purchaseData } from '../data/sampleData';

export default function Purchases() {
  const [records, setRecords] = useState(purchaseData);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], product: 'AMH', rate: 38, qty: 200, mt: '', note: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const unpaid = records.filter(r => !r.paid).reduce((s, r) => s + r.price, 0);
  const paid   = records.filter(r => r.paid).reduce((s, r) => s + r.price, 0);
  const total  = records.reduce((s, r) => s + r.price, 0);

  const markPaid = (id) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, paid: true, paidDate: new Date().toLocaleDateString('en-IN') } : r));
  };

  const addRecord = () => {
    const price = (parseFloat(form.rate) || 0) * (parseFloat(form.qty) || 0);
    setRecords(prev => [...prev, { ...form, id: prev.length + 1, price, paid: false, paidDate: '' }]);
    setAdding(false);
    setForm({ date: new Date().toISOString().split('T')[0], product: 'AMH', rate: 38, qty: 200, mt: '', note: '' });
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Total Purchases"   value={fmt(total)}   sub={`${records.length} entries`}              accent="#3b82f6" />
        <MetricCard label="Amount Paid"       value={fmt(paid)}    sub={`${records.filter(r=>r.paid).length} records`} accent="#10b981" />
        <MetricCard label="Balance Due"       value={fmt(unpaid)}  sub="Not yet paid"                             accent="#ef4444" />
        <MetricCard label="Current AMH Rate"  value="₹38-39/kg"   sub="FIX: ₹110-120/kg"                        accent="#f59e0b" />
      </div>

      <Card>
        <CardHeader title="Purchase Ledger – Chemicals & Materials" right={
          <Btn variant="primary" size="sm" onClick={() => setAdding(true)}>+ Add Purchase</Btn>
        } />
        <Table headers={[
          { label: 'Date' }, { label: 'Product' }, { label: 'Rate', right: true },
          { label: 'Qty (kg)', right: true }, { label: 'Amount', right: true },
          { label: 'MT/Lot' }, { label: 'Status' }, { label: 'Paid Date' }, { label: 'Action' },
        ]}>
          {records.map(r => (
            <Tr key={r.id}>
              <Td>{fmtDate(r.date)}</Td>
              <Td><Pill label={r.product} color={r.product === 'AMH' ? 'blue' : 'green'} /></Td>
              <Td right>₹{r.rate}/kg</Td>
              <Td right>{r.qty} kg</Td>
              <Td right bold>{fmt(r.price)}</Td>
              <Td muted>{r.mt || '–'}</Td>
              <Td><Pill label={r.paid ? 'Paid' : 'Not Paid'} color={r.paid ? 'green' : 'red'} /></Td>
              <Td muted>{r.paidDate || '–'}</Td>
              <Td>
                {!r.paid && <Btn size="sm" variant="green" onClick={() => markPaid(r.id)}>Mark Paid</Btn>}
              </Td>
            </Tr>
          ))}
        </Table>
        <div style={{ padding: '12px 14px', background: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 32 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#ef4444' }}>Total Balance Due: {fmt(unpaid)}</span>
        </div>
      </Card>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add Purchase Entry" width={480}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 20 }}>
          <FormField label="Date"><Input type="date" value={form.date} onChange={e => set('date', e.target.value)} /></FormField>
          <FormField label="Product">
            <Select value={form.product} onChange={e => set('product', e.target.value)}>
              <option>AMH</option><option>FIX</option><option>Other Chemical</option>
            </Select>
          </FormField>
          <FormField label="Rate (₹/kg)"><Input type="number" value={form.rate} onChange={e => set('rate', e.target.value)} /></FormField>
          <FormField label="Quantity (kg)"><Input type="number" value={form.qty} onChange={e => set('qty', e.target.value)} /></FormField>
          <FormField label="MT / Lot No"><Input value={form.mt} onChange={e => set('mt', e.target.value)} placeholder="Optional" /></FormField>
          <FormField label="Note"><Input value={form.note} onChange={e => set('note', e.target.value)} placeholder="Optional" /></FormField>
        </div>
        <div style={{ padding: '10px 20px', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Amount: {fmt((parseFloat(form.rate)||0)*(parseFloat(form.qty)||0))}</span>
        </div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn onClick={() => setAdding(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={addRecord}>Save Purchase</Btn>
        </div>
      </Modal>
    </div>
  );
}
