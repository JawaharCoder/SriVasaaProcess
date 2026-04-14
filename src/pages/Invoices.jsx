import React, { useState } from 'react';
import { Card, CardHeader, Pill, Btn, Table, Tr, Td, Modal, FormField, Input, Select, fmt, fmtDate } from '../components/UI';
import { partyNames, serviceTypes } from '../data/sampleData';

function calcAmounts(rate, qty, transport) {
  const base = (parseFloat(rate) || 0) * (parseFloat(qty) || 0) + (parseFloat(transport) || 0);
  const gst = base * 0.025;
  return { base, sgst: gst, cgst: gst, nett: base + gst * 2 };
}

function InvoicePreview({ inv, onClose }) {
  const { base, sgst, cgst, nett } = calcAmounts(inv.rate, inv.qty, inv.transport);
  return (
    <div style={{ padding: 24 }}>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e' }}>SRI VASAA PROCESS</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>216-5, Natu Street, Kondalampatti, Salem – 636 010</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>GSTIN: 33AFKFS2048M1ZO | Cell: 96986 39012 / 93635 37715</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase' }}>Tax Invoice</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#e94560' }}>#{inv.id}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{fmtDate(inv.date)}</div>
          </div>
        </div>
        <div style={{ background: '#f9fafb', padding: '12px 16px', borderRadius: 8, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#6b7280' }}>Bill To:</div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{inv.party}</div>
          {inv.gstin && <div style={{ fontSize: 12, color: '#6b7280' }}>GSTIN: {inv.gstin}</div>}
          {inv.vehicle && <div style={{ fontSize: 12, color: '#6b7280' }}>Vehicle: {inv.vehicle}</div>}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 16 }}>
          <thead>
            <tr style={{ background: '#1a1a2e', color: '#fff' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Service</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>Qty/Mtrs</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>Rate</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>{inv.service}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>{Number(inv.qty).toLocaleString('en-IN')}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>₹{inv.rate}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>{fmt(inv.rate * inv.qty)}</td>
            </tr>
            {inv.transport > 0 && (
              <tr>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>Transport Charges</td>
                <td colSpan={2} style={{ borderBottom: '1px solid #e5e7eb' }}></td>
                <td style={{ padding: '10px 12px', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>{fmt(inv.transport)}</td>
              </tr>
            )}
          </tbody>
        </table>
        <div style={{ maxWidth: 260, marginLeft: 'auto' }}>
          {[['Total', fmt(base)], ['SGST 2.5%', fmt(sgst)], ['CGST 2.5%', fmt(cgst)]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13 }}>
              <span>{k}</span><span style={{ color: k.includes('GST') ? '#f59e0b' : undefined }}>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 16, fontWeight: 700, borderTop: '2px solid #1a1a2e', marginTop: 6 }}>
            <span>Nett Amount</span><span style={{ color: '#e94560' }}>{fmt(nett)}</span>
          </div>
        </div>
        <div style={{ marginTop: 16, padding: '10px 14px', background: '#f0fdf4', borderRadius: 8, fontSize: 12, color: '#065f46' }}>
          Bank: HDFC BANK LTD | A/C: 50200106389545 | IFSC: HDFC0005767 | Branch: Salem, Kondalampatti
        </div>
      </div>
      <div style={{ padding: '16px 0 0', display: 'flex', justifyContent: 'flex-end' }}>
        <Btn onClick={onClose}>Close</Btn>
      </div>
    </div>
  );
}

export default function Invoices({ invoices, setInvoices, showCreate }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewInv, setViewInv] = useState(null);
  const [creating, setCreating] = useState(showCreate || false);

  // New invoice form state
  const today = new Date().toISOString().split('T')[0];
  const nextId = String(Math.max(...invoices.map(i => parseInt(i.id) || 0)) + 1);
  const [form, setForm] = useState({ id: nextId, date: today, party: partyNames[0], gstin: '', vehicle: '', service: serviceTypes[0], qty: 500, rate: 33, transport: 0 });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const { base, sgst, cgst, nett } = calcAmounts(form.rate, form.qty, form.transport);

  const filtered = invoices.filter(i => {
    const m = !search || i.party.toLowerCase().includes(search.toLowerCase()) || i.id.includes(search);
    const s = !statusFilter || i.status === statusFilter;
    return m && s;
  });

  const saveInvoice = () => {
    setInvoices(prev => [{ ...form, status: 'Pending' }, ...prev]);
    setCreating(false);
  };

  const toggleStatus = (id) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: i.status === 'Paid' ? 'Pending' : 'Paid' } : i));
  };

  if (creating) return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Btn onClick={() => setCreating(false)}>← Back</Btn>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Create New Invoice</h2>
      </div>
      <Card style={{ maxWidth: 780 }}>
        <CardHeader title="Invoice Details" right={<span style={{ fontSize: 12, color: '#6b7280' }}>GSTIN: 33AFKFS2048M1ZO</span>} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 20 }}>
          <FormField label="Invoice Number"><Input value={form.id} onChange={e => set('id', e.target.value)} /></FormField>
          <FormField label="Invoice Date"><Input type="date" value={form.date} onChange={e => set('date', e.target.value)} /></FormField>
          <FormField label="Party Name" full>
            <Select value={form.party} onChange={e => set('party', e.target.value)}>
              {partyNames.map(p => <option key={p}>{p}</option>)}
            </Select>
          </FormField>
          <FormField label="Party GSTIN"><Input value={form.gstin} onChange={e => set('gstin', e.target.value)} placeholder="33XXXXXXXXX" /></FormField>
          <FormField label="Vehicle Number"><Input value={form.vehicle} onChange={e => set('vehicle', e.target.value)} placeholder="TN XX XX XXXX" /></FormField>
          <FormField label="Service Type">
            <Select value={form.service} onChange={e => set('service', e.target.value)}>
              {serviceTypes.map(s => <option key={s}>{s}</option>)}
            </Select>
          </FormField>
          <FormField label="Rate per Metre (₹)"><Input type="number" value={form.rate} onChange={e => set('rate', e.target.value)} /></FormField>
          <FormField label="Qty / Metres"><Input type="number" value={form.qty} onChange={e => set('qty', e.target.value)} /></FormField>
          <FormField label="Transport Charges (₹)"><Input type="number" value={form.transport} onChange={e => set('transport', e.target.value)} /></FormField>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, padding: '14px 20px', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
          {[['Base Amount', fmt(base), '#1a1a2e'], ['SGST 2.5%', fmt(sgst), '#f59e0b'], ['CGST 2.5%', fmt(cgst), '#f59e0b'], ['Nett Amount', fmt(nett), '#e94560']].map(([l, v, c]) => (
            <div key={l}><div style={{ fontSize: 11, color: '#6b7280' }}>{l}</div><div style={{ fontSize: 20, fontWeight: 700, color: c, marginTop: 4 }}>{v}</div></div>
          ))}
        </div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn onClick={() => setCreating(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={saveInvoice}>Save Invoice</Btn>
        </div>
      </Card>
    </div>
  );

  return (
    <div>
      <Card>
        <CardHeader title={`All Invoices (${filtered.length})`} right={
          <>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search party / invoice #..." style={{ padding: '7px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12, width: 200 }} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '7px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}>
              <option value="">All Status</option>
              <option>Paid</option>
              <option>Pending</option>
            </select>
            <Btn variant="primary" size="sm" onClick={() => setCreating(true)}>+ New Invoice</Btn>
          </>
        } />
        <Table headers={[
          { label: 'Inv #' }, { label: 'Date' }, { label: 'Party' }, { label: 'Service' },
          { label: 'Qty', right: true }, { label: 'Rate', right: true }, { label: 'Base', right: true },
          { label: 'GST', right: true }, { label: 'Nett Amt', right: true }, { label: 'Status' }, { label: 'Actions' },
        ]}>
          {filtered.map(inv => {
            const { base, sgst, nett } = calcAmounts(inv.rate, inv.qty, inv.transport);
            return (
              <Tr key={inv.id}>
                <Td bold>#{inv.id}</Td>
                <Td>{fmtDate(inv.date)}</Td>
                <Td>{inv.party}</Td>
                <Td>{inv.service}</Td>
                <Td right>{Number(inv.qty).toLocaleString('en-IN')}</Td>
                <Td right>₹{inv.rate}</Td>
                <Td right>{fmt(base)}</Td>
                <Td right s={{ color: '#f59e0b' }}>{fmt(sgst * 2)}</Td>
                <Td right bold s={{ color: '#1a1a2e' }}>{fmt(nett)}</Td>
                <Td><Pill label={inv.status} color={inv.status === 'Paid' ? 'green' : 'amber'} /></Td>
                <Td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Btn size="sm" onClick={() => setViewInv(inv)}>View</Btn>
                    <Btn size="sm" variant={inv.status === 'Paid' ? 'ghost' : 'green'} onClick={() => toggleStatus(inv.id)}>
                      {inv.status === 'Paid' ? 'Unmark' : 'Mark Paid'}
                    </Btn>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </Table>
      </Card>
      <Modal open={!!viewInv} onClose={() => setViewInv(null)} title={`Invoice #${viewInv?.id}`} width={720}>
        {viewInv && <InvoicePreview inv={viewInv} onClose={() => setViewInv(null)} />}
      </Modal>
    </div>
  );
}
