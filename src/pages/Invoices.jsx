import React, { useState, useEffect } from 'react';
import { Card, Button, Tag, Modal, Form, Input, Select, DatePicker, Row, Col, Space, Table, Popconfirm, message, Typography, Divider } from 'antd';
import { PlusOutlined, EyeOutlined, CheckOutlined, DeleteOutlined, PrinterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import MetricCard from '../components/MetricCard';
import { fmt, fmtDate, fmtShort, initials } from '../utils/format';
import { partyNames, serviceTypes } from '../data/sampleData';

function calcAmounts(rate, qty, transport) {
  const base = (parseFloat(rate) || 0) * (parseFloat(qty) || 0) + (parseFloat(transport) || 0);
  const gst = base * 0.025;
  return { base, sgst: gst, cgst: gst, nett: base + gst * 2 };
}

function InvoicePreview({ inv, onClose }) {
  const { base, sgst, cgst, nett } = calcAmounts(inv.rate, inv.qty, inv.transport);
  return (
    <div style={{ padding: 8 }}>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>SRI VASAA PROCESS</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>216-5, Natu Street, Kondalampatti, Salem – 636 010</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>GSTIN: 33AFKFS2048M1ZO | Cell: 96986 39012</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Tax Invoice</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#e94560', lineHeight: 1 }}>#{inv.id}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{fmtDate(inv.date)}</div>
          </div>
        </div>
        <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 8, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Bill To</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginTop: 3 }}>{inv.party}</div>
          {inv.gstin && <div style={{ fontSize: 12, color: '#64748b' }}>GSTIN: {inv.gstin}</div>}
          {inv.vehicle && <div style={{ fontSize: 12, color: '#64748b' }}>Vehicle: {inv.vehicle}</div>}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 16 }}>
          <thead>
            <tr style={{ background: '#0f172a', color: '#fff' }}>
              {['Service', 'Qty/Mtrs', 'Rate', 'Amount'].map(h => (
                <th key={h} style={{ padding: '9px 12px', textAlign: h === 'Service' ? 'left' : 'right', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9' }}>{inv.service}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', borderBottom: '1px solid #f1f5f9' }}>{Number(inv.qty).toLocaleString('en-IN')}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', borderBottom: '1px solid #f1f5f9' }}>₹{inv.rate}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', borderBottom: '1px solid #f1f5f9' }}>{fmt(inv.rate * inv.qty)}</td>
            </tr>
            {inv.transport > 0 && (
              <tr>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9' }}>Transport Charges</td>
                <td colSpan={2} style={{ borderBottom: '1px solid #f1f5f9' }}></td>
                <td style={{ padding: '10px 12px', textAlign: 'right', borderBottom: '1px solid #f1f5f9' }}>{fmt(inv.transport)}</td>
              </tr>
            )}
          </tbody>
        </table>
        <div style={{ maxWidth: 240, marginLeft: 'auto' }}>
          {[['Subtotal', fmt(base)], ['SGST 2.5%', fmt(sgst)], ['CGST 2.5%', fmt(cgst)]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, color: '#64748b' }}>
              <span>{k}</span><span>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 16, fontWeight: 800, borderTop: '2px solid #0f172a', marginTop: 6, color: '#e94560' }}>
            <span style={{ color: '#0f172a' }}>Nett Amount</span><span>{fmt(nett)}</span>
          </div>
        </div>
        <div style={{ marginTop: 16, padding: '10px 14px', background: '#f0fdf4', borderRadius: 8, fontSize: 12, color: '#065f46', fontWeight: 500 }}>
          🏦 HDFC BANK LTD | A/C: 50200106389545 | IFSC: HDFC0005767 | Salem, Kondalampatti
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
        <Button onClick={onClose}>Close</Button>
        <Button type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>Print</Button>
      </div>
    </div>
  );
}

const BLANK = { id: '', date: dayjs(), party: '', gstin: '', service: '', qty: '', rate: '', transport: '', vehicle: '', status: 'Pending' };

export default function Invoices({ invoices, setInvoices, showCreate }) {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [previewInv, setPreviewInv] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (showCreate) { form.resetFields(); setModalOpen(true); }
  }, [showCreate]);

  const totalInvoiced = invoices.reduce((s, i) => {
    const { nett } = calcAmounts(i.rate, i.qty, i.transport);
    return s + nett;
  }, 0);
  const paid = invoices.filter(i => i.status === 'Paid').length;
  const pending = invoices.filter(i => i.status === 'Pending').length;

  const filtered = invoices.filter(inv =>
    inv.party.toLowerCase().includes(search.toLowerCase()) ||
    inv.id.includes(search) ||
    inv.service.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleSave = (values) => {
    const nextId = String(Math.max(...invoices.map(i => parseInt(i.id) || 0), 0) + 1);
    const newInv = {
      ...values,
      id: nextId,
      date: values.date?.format('YYYY-MM-DD') || new Date().toISOString().split('T')[0],
      qty: parseFloat(values.qty) || 0,
      rate: parseFloat(values.rate) || 0,
      transport: parseFloat(values.transport) || 0,
    };
    setInvoices(prev => [newInv, ...prev]);
    message.success(`Invoice #${nextId} created!`);
    setModalOpen(false);
    form.resetFields();
  };

  const markPaid = (id) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'Paid' } : i));
    message.success('Marked as paid');
  };

  const deleteInv = (id) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
    message.success('Invoice deleted');
  };

  const [rateQty, setRateQty] = useState({ rate: 0, qty: 0, transport: 0 });
  const preview = calcAmounts(rateQty.rate, rateQty.qty, rateQty.transport);

  const columns = [
    { title: 'Invoice #', dataIndex: 'id', key: 'id', width: 90, render: v => <span style={{ fontWeight: 700, color: '#e94560' }}>#{v}</span> },
    { title: 'Party', dataIndex: 'party', key: 'party', ellipsis: true },
    { title: 'Service', dataIndex: 'service', key: 'service', ellipsis: true, responsive: ['md'] },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 110, render: v => fmtDate(v), responsive: ['sm'] },
    { title: 'Qty', dataIndex: 'qty', key: 'qty', width: 80, align: 'right', render: v => v?.toLocaleString('en-IN'), responsive: ['lg'] },
    { title: 'Amount', key: 'nett', width: 110, align: 'right', render: (_, r) => <span style={{ fontWeight: 700 }}>{fmt(calcAmounts(r.rate, r.qty, r.transport).nett)}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 90, render: v => <Tag color={v === 'Paid' ? 'success' : 'warning'}>{v}</Tag> },
    {
      title: 'Actions', key: 'actions', width: 120, render: (_, r) => (
        <Space size="small">
          <Button size="small" icon={<EyeOutlined />} onClick={() => setPreviewInv(r)} />
          {r.status === 'Pending' && <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => markPaid(r.id)} />}
          <Popconfirm title="Delete invoice?" onConfirm={() => deleteInv(r.id)} okText="Delete" okButtonProps={{ danger: true }}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <div>
      <div className="metric-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        <MetricCard label="Total Invoiced" value={fmtShort(totalInvoiced)} sub={`${invoices.length} invoices`} accent="#3b82f6" />
        <MetricCard label="Paid" value={paid} sub="Completed" accent="#10b981" />
        <MetricCard label="Pending" value={pending} sub="Needs collection" accent="#f59e0b" />
        <MetricCard label="Collection Rate" value={invoices.length ? Math.round(paid / invoices.length * 100) + '%' : '0%'} sub="Paid vs total" accent="#8b5cf6" />
      </div>

      <Card
        title="Invoice Register"
        extra={
          <Space wrap>
            <Input.Search placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200 }} allowClear />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalOpen(true); }}>New Invoice</Button>
          </Space>
        }
      >
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          size="small"
          scroll={{ x: 600 }}
          pagination={{ pageSize: 15, showSizeChanger: false, showTotal: t => `${t} invoices` }}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        title="Create New Invoice"
        footer={null}
        width={580}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSave}
          onValuesChange={(_, all) => setRateQty({ rate: all.rate || 0, qty: all.qty || 0, transport: all.transport || 0 })}
        >
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="party" label="Party Name" rules={[{ required: true }]}>
                <Select showSearch placeholder="Select party" options={partyNames.map(p => ({ label: p, value: p }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="date" label="Date" initialValue={dayjs()}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="gstin" label="GSTIN (Optional)">
                <Input placeholder="33XXXXXXX..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="service" label="Service Type" rules={[{ required: true }]}>
                <Select placeholder="Select service" options={serviceTypes.map(s => ({ label: s, value: s }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="vehicle" label="Vehicle No (if any)">
                <Input placeholder="TN XX XX-XXXX" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="qty" label="Quantity (Mtrs)" rules={[{ required: true }]}>
                <Input type="number" placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="rate" label="Rate (₹/mtr)" rules={[{ required: true }]}>
                <Input type="number" step="0.5" placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="transport" label="Transport (₹)">
                <Input type="number" placeholder="0" />
              </Form.Item>
            </Col>
          </Row>

          {/* Live Preview */}
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px', marginBottom: 16, border: '1px solid #e2e8f0' }}>
            <Row gutter={16}>
              {[['Base', fmt(preview.base)], ['SGST 2.5%', fmt(preview.sgst)], ['CGST 2.5%', fmt(preview.cgst)], ['Nett', fmt(preview.nett)]].map(([k, v]) => (
                <Col key={k} span={6}>
                  <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>{k}</div>
                  <div style={{ fontSize: k === 'Nett' ? 16 : 13, fontWeight: 700, color: k === 'Nett' ? '#e94560' : '#0f172a' }}>{v}</div>
                </Col>
              ))}
            </Row>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">Create Invoice</Button>
          </div>
        </Form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        open={!!previewInv}
        onCancel={() => setPreviewInv(null)}
        title={`Invoice Preview – #${previewInv?.id}`}
        footer={null}
        width={640}
      >
        {previewInv && <InvoicePreview inv={previewInv} onClose={() => setPreviewInv(null)} />}
      </Modal>
    </div>
  );
}
