import React, { useState } from 'react';
import { Card, Table, Tag, Button, Modal, Form, Input, Select, DatePicker, Space, Row, Col, Popconfirm, message } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import MetricCard from '../components/MetricCard';
import { fmt, fmtDate, fmtShort } from '../utils/format';

export default function Purchases({ purchases, setPurchases }) {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [liveAmt, setLiveAmt] = useState(0);

  const total  = purchases.reduce((s, r) => s + r.price, 0);
  const paid   = purchases.filter(r => r.paid).reduce((s, r) => s + r.price, 0);
  const unpaid = purchases.filter(r => !r.paid).reduce((s, r) => s + r.price, 0);

  const markPaid = (id) => {
    setPurchases(prev => prev.map(r => r.id === id ? { ...r, paid: true, paidDate: dayjs().format('DD/MM/YY') } : r));
    message.success('Marked as paid');
  };

  const addRecord = (values) => {
    const price = (parseFloat(values.rate) || 0) * (parseFloat(values.qty) || 0);
    const newRec = {
      ...values,
      id: purchases.length + 1,
      date: values.date?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
      rate: parseFloat(values.rate) || 0,
      qty: parseFloat(values.qty) || 0,
      price,
      paid: false,
      paidDate: '',
    };
    setPurchases(prev => [...prev, newRec]);
    message.success('Purchase added');
    setModalOpen(false);
    form.resetFields();
    setLiveAmt(0);
  };

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date', width: 110, render: v => fmtDate(v), responsive: ['sm'] },
    {
      title: 'Product', dataIndex: 'product', key: 'product', width: 90,
      render: v => <Tag color={v === 'AMH' ? 'blue' : v === 'FIX' ? 'green' : 'purple'}>{v}</Tag>,
    },
    { title: 'Rate', dataIndex: 'rate', key: 'rate', align: 'right', width: 90, render: v => `₹${v}/kg`, responsive: ['md'] },
    { title: 'Qty (kg)', dataIndex: 'qty', key: 'qty', align: 'right', width: 80, render: v => `${v} kg`, responsive: ['sm'] },
    { title: 'Amount', dataIndex: 'price', key: 'price', align: 'right', width: 110, render: v => <span style={{ fontWeight: 700 }}>{fmt(v)}</span> },
    { title: 'MT/Lot', dataIndex: 'mt', key: 'mt', render: v => v || '–', responsive: ['lg'] },
    {
      title: 'Status', dataIndex: 'paid', key: 'paid', width: 90,
      render: v => <Tag color={v ? 'success' : 'error'}>{v ? 'Paid' : 'Due'}</Tag>,
    },
    { title: 'Paid Date', dataIndex: 'paidDate', key: 'paidDate', render: v => v || '–', responsive: ['md'] },
    {
      title: 'Action', key: 'action', width: 110,
      render: (_, r) => !r.paid && (
        <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => markPaid(r.id)}>Mark Paid</Button>
      ),
    },
  ];

  return (
    <div>
      <div className="metric-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        <MetricCard label="Total Purchases"  value={fmtShort(total)}   sub={`${purchases.length} entries`}                    accent="#3b82f6" />
        <MetricCard label="Amount Paid"      value={fmtShort(paid)}    sub={`${purchases.filter(r => r.paid).length} records`} accent="#10b981" />
        <MetricCard label="Balance Due"      value={fmt(unpaid)}       sub="Not yet paid"                                     accent="#ef4444" />
        <MetricCard label="AMH Rate"         value="₹38–39/kg"         sub="FIX: ₹110–120/kg"                                accent="#f59e0b" />
      </div>

      <Card
        title="Purchase Ledger – Chemicals & Materials"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setLiveAmt(0); setModalOpen(true); }}>Add Purchase</Button>}
      >
        <Table
          dataSource={purchases}
          columns={columns}
          rowKey="id"
          size="small"
          scroll={{ x: 500 }}
          pagination={{ pageSize: 15, showTotal: t => `${t} records` }}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row style={{ background: '#fef2f2' }}>
                <Table.Summary.Cell index={0} colSpan={4}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>Total Balance Due</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} align="right">
                  <span style={{ fontWeight: 800, color: '#ef4444', fontSize: 14 }}>{fmt(unpaid)}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} colSpan={4} />
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        title="Add Purchase Entry"
        footer={null}
        width={440}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={addRecord}
          onValuesChange={(_, all) => setLiveAmt((parseFloat(all.rate) || 0) * (parseFloat(all.qty) || 0))}
        >
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="date" label="Date" initialValue={dayjs()}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="product" label="Product" initialValue="AMH" rules={[{ required: true }]}>
                <Select options={[{ value: 'AMH', label: 'AMH' }, { value: 'FIX', label: 'FIX' }, { value: 'Other Chemical', label: 'Other' }]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="rate" label="Rate (₹/kg)" rules={[{ required: true }]}>
                <Input type="number" suffix="₹/kg" placeholder="38" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="qty" label="Quantity (kg)" rules={[{ required: true }]}>
                <Input type="number" suffix="kg" placeholder="200" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="mt" label="MT / Lot No (Optional)">
                <Input placeholder="e.g. 10×100=1000" />
              </Form.Item>
            </Col>
          </Row>

          {liveAmt > 0 && (
            <div style={{ background: '#f0fdf4', borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#065f46', fontWeight: 600 }}>Amount:</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#065f46' }}>{fmt(liveAmt)}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">Save Purchase</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
