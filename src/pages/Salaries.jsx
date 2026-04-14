import React, { useState } from 'react';
import { MetricCard, Card, CardHeader, Pill, Table, Tr, Td, Modal, FormField, Input, Select, Btn, fmt, fmtDate } from '../components/UI';

const MONTHS = [
  { value: '2026-04', label: 'April 2026' },
  { value: '2026-03', label: 'March 2026' },
  { value: '2026-02', label: 'February 2026' },
  { value: '2026-01', label: 'January 2026' },
];

const PAY_MODES = ['Bank Transfer', 'Cash', 'UPI/GPay', 'Cheque'];

export default function Salaries({ employees, salaryRecords, setSalaryRecords }) {
  const [month, setMonth] = useState('2026-04');
  const [editRec, setEditRec] = useState(null);
  const [form, setForm] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Filter records for selected month
  const monthRecords = salaryRecords.filter(r => r.month === month);

  // Stats
  const totalPayable = monthRecords.reduce((s, r) => s + r.baseSalary + r.bonus - r.deductions, 0);
  const totalPaid    = monthRecords.filter(r => r.paid).reduce((s, r) => s + r.baseSalary + r.bonus - r.deductions, 0);
  const totalAdvance = monthRecords.reduce((s, r) => s + r.advance, 0);
  const pendingCount = monthRecords.filter(r => !r.paid).length;

  const openEdit = (rec) => {
    setForm({ ...rec });
    setEditRec(rec.id);
  };

  const saveRec = () => {
    setSalaryRecords(prev => prev.map(r => r.id === editRec ? { ...form } : r));
    setEditRec(null);
  };

  const markPaid = (id) => {
    setSalaryRecords(prev => prev.map(r => r.id === id ? {
      ...r, paid: true, paidDate: new Date().toISOString().split('T')[0], mode: 'Bank Transfer',
    } : r));
  };

  const markAllPaid = () => {
    setSalaryRecords(prev => prev.map(r =>
      r.month === month && !r.paid
        ? { ...r, paid: true, paidDate: new Date().toISOString().split('T')[0], mode: 'Bank Transfer' }
        : r
    ));
  };

  // Generate month records if missing
  const generateRecords = () => {
    const existingEmpIds = monthRecords.map(r => r.empId);
    const missing = employees.filter(e => !existingEmpIds.includes(e.id) && e.status === 'Active');
    if (missing.length === 0) { alert('All active employees already have records for this month.'); return; }
    const newRecs = missing.map((e, i) => ({
      id: `SAL${Date.now()}${i}`, empId: e.id, month,
      baseSalary: e.baseSalary, advance: 0, deductions: 0, bonus: 0,
      paid: false, paidDate: '', mode: '', note: '',
    }));
    setSalaryRecords(prev => [...prev, ...newRecs]);
  };

  const netPay = (r) => r.baseSalary + r.bonus - r.deductions - r.advance;

  // Print salary slip
  const printSlip = (rec) => {
    const emp = employees.find(e => e.id === rec.empId);
    const net = netPay(rec);
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Salary Slip</title>
      <style>body{font-family:Arial,sans-serif;max-width:600px;margin:20px auto;font-size:13px}
      h2{color:#1a1a2e;margin-bottom:4px}table{width:100%;border-collapse:collapse;margin-top:12px}
      th,td{border:1px solid #ddd;padding:8px 10px}th{background:#f3f4f6}
      .total{font-size:15px;font-weight:700;background:#1a1a2e;color:#fff}</style></head>
      <body>
        <h2>SRI VASAA PROCESS</h2>
        <p style="color:#666;margin:0">216-5, Natu Street, Kondalampatti, Salem – 636 010</p>
        <hr style="margin:12px 0"/>
        <h3>Salary Slip – ${MONTHS.find(m=>m.value===rec.month)?.label}</h3>
        <table>
          <tr><th>Employee Name</th><td>${emp?.name}</td><th>Employee ID</th><td>${emp?.id}</td></tr>
          <tr><th>Designation</th><td>${emp?.role}</td><th>Month</th><td>${MONTHS.find(m=>m.value===rec.month)?.label}</td></tr>
        </table>
        <table style="margin-top:12px">
          <tr><th>Earnings</th><th>Amount (₹)</th><th>Deductions</th><th>Amount (₹)</th></tr>
          <tr><td>Basic Salary</td><td>₹${rec.baseSalary.toLocaleString('en-IN')}</td><td>Advance</td><td>₹${rec.advance.toLocaleString('en-IN')}</td></tr>
          <tr><td>Bonus</td><td>₹${rec.bonus.toLocaleString('en-IN')}</td><td>Other Deductions</td><td>₹${rec.deductions.toLocaleString('en-IN')}</td></tr>
        </table>
        <table style="margin-top:4px">
          <tr class="total"><td colspan="3">Net Pay</td><td>₹${net.toLocaleString('en-IN')}</td></tr>
        </table>
        <p style="margin-top:16px;font-size:12px;color:#666">Payment Mode: ${rec.mode || 'Pending'} | ${rec.paidDate ? 'Paid on: '+rec.paidDate : 'Not yet paid'}</p>
        ${rec.note ? `<p style="font-size:12px;color:#666">Note: ${rec.note}</p>` : ''}
        <p style="margin-top:40px;font-size:12px;border-top:1px solid #ddd;padding-top:10px">Authorised Signature</p>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div>
      {/* Month selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 500 }}>Select Month:</label>
        <select value={month} onChange={e => setMonth(e.target.value)} style={{
          padding: '8px 14px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, fontWeight: 500,
        }}>
          {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <Btn size="sm" onClick={generateRecords}>Generate Records</Btn>
        {pendingCount > 0 && <Btn size="sm" variant="green" onClick={markAllPaid}>Mark All Paid</Btn>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Total Payable"   value={fmt(totalPayable)}  sub={`${monthRecords.length} employees`} accent="#3b82f6" />
        <MetricCard label="Amount Paid"     value={fmt(totalPaid)}     sub={`${monthRecords.filter(r=>r.paid).length} paid`}      accent="#10b981" />
        <MetricCard label="Pending Payment" value={fmt(totalPayable - totalPaid)} sub={`${pendingCount} pending`} accent="#ef4444" />
        <MetricCard label="Total Advance"   value={fmt(totalAdvance)}  sub="This month"                         accent="#f59e0b" />
      </div>

      <Card>
        <CardHeader title={`Salary Register – ${MONTHS.find(m => m.value === month)?.label}`} right={
          <Pill label={`${monthRecords.filter(r => r.paid).length}/${monthRecords.length} Paid`}
                color={pendingCount === 0 ? 'green' : 'amber'} />
        } />
        <Table headers={[
          { label: 'Employee' }, { label: 'Role' },
          { label: 'Basic', right: true }, { label: 'Advance', right: true },
          { label: 'Bonus', right: true }, { label: 'Deduction', right: true },
          { label: 'Net Pay', right: true }, { label: 'Status' },
          { label: 'Paid Date' }, { label: 'Mode' }, { label: 'Actions' },
        ]}>
          {monthRecords.map(rec => {
            const emp = employees.find(e => e.id === rec.empId);
            const net = netPay(rec);
            if (!emp) return null;
            return (
              <Tr key={rec.id}>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#6b7280', flexShrink: 0 }}>
                      {emp.name[0]}
                    </div>
                    <span style={{ fontWeight: 500 }}>{emp.name}</span>
                  </div>
                </Td>
                <Td muted>{emp.role}</Td>
                <Td right>{fmt(rec.baseSalary)}</Td>
                <Td right s={{ color: rec.advance > 0 ? '#ef4444' : '#9ca3af' }}>
                  {rec.advance > 0 ? fmt(rec.advance) : '–'}
                </Td>
                <Td right s={{ color: rec.bonus > 0 ? '#10b981' : '#9ca3af' }}>
                  {rec.bonus > 0 ? fmt(rec.bonus) : '–'}
                </Td>
                <Td right s={{ color: rec.deductions > 0 ? '#ef4444' : '#9ca3af' }}>
                  {rec.deductions > 0 ? fmt(rec.deductions) : '–'}
                </Td>
                <Td right bold s={{ color: '#1a1a2e', fontSize: 14 }}>{fmt(net)}</Td>
                <Td><Pill label={rec.paid ? 'Paid' : 'Pending'} color={rec.paid ? 'green' : 'amber'} /></Td>
                <Td muted>{rec.paidDate ? fmtDate(rec.paidDate) : '–'}</Td>
                <Td muted>{rec.mode || '–'}</Td>
                <Td>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    <Btn size="sm" onClick={() => openEdit(rec)}>Edit</Btn>
                    {!rec.paid && <Btn size="sm" variant="green" onClick={() => markPaid(rec.id)}>Pay</Btn>}
                    <Btn size="sm" variant="ghost" onClick={() => printSlip(rec)}>Slip</Btn>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </Table>

        {/* Summary footer */}
        <div style={{ padding: '12px 14px', background: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12 }}>Basic Total: <strong>{fmt(monthRecords.reduce((s,r)=>s+r.baseSalary,0))}</strong></span>
          <span style={{ fontSize: 12 }}>Advance: <strong style={{ color: '#ef4444' }}>{fmt(totalAdvance)}</strong></span>
          <span style={{ fontSize: 12 }}>Bonus: <strong style={{ color: '#10b981' }}>{fmt(monthRecords.reduce((s,r)=>s+r.bonus,0))}</strong></span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Net Payable: <span style={{ color: '#e94560' }}>{fmt(totalPayable)}</span></span>
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal open={!!editRec} onClose={() => setEditRec(null)} title="Edit Salary Record" width={520}>
        {form && (
          <>
            <div style={{ padding: '12px 20px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <strong>{employees.find(e => e.id === form.empId)?.name}</strong>
              <span style={{ color: '#6b7280', marginLeft: 8 }}>{employees.find(e => e.id === form.empId)?.role}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 20 }}>
              <FormField label="Basic Salary (₹)"><Input type="number" value={form.baseSalary} onChange={e => set('baseSalary', parseFloat(e.target.value)||0)} /></FormField>
              <FormField label="Advance Paid (₹)"><Input type="number" value={form.advance} onChange={e => set('advance', parseFloat(e.target.value)||0)} /></FormField>
              <FormField label="Bonus (₹)"><Input type="number" value={form.bonus} onChange={e => set('bonus', parseFloat(e.target.value)||0)} /></FormField>
              <FormField label="Other Deductions (₹)"><Input type="number" value={form.deductions} onChange={e => set('deductions', parseFloat(e.target.value)||0)} /></FormField>
              <FormField label="Payment Mode">
                <Select value={form.mode} onChange={e => set('mode', e.target.value)}>
                  <option value="">– Select –</option>
                  {PAY_MODES.map(m => <option key={m}>{m}</option>)}
                </Select>
              </FormField>
              <FormField label="Paid Date"><Input type="date" value={form.paidDate} onChange={e => set('paidDate', e.target.value)} /></FormField>
              <FormField label="Paid?">
                <Select value={form.paid ? 'yes' : 'no'} onChange={e => set('paid', e.target.value === 'yes')}>
                  <option value="no">Not Paid</option>
                  <option value="yes">Paid</option>
                </Select>
              </FormField>
              <FormField label="Note"><Input value={form.note} onChange={e => set('note', e.target.value)} placeholder="Optional" /></FormField>
            </div>
            <div style={{ padding: '10px 20px', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>
                Net Pay: {fmt((form.baseSalary||0)+(form.bonus||0)-(form.deductions||0)-(form.advance||0))}
              </span>
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Btn onClick={() => setEditRec(null)}>Cancel</Btn>
              <Btn variant="primary" onClick={saveRec}>Update Record</Btn>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
