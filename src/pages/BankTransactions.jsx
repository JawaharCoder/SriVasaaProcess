import React, { useState } from 'react';
import { Card, Table, Tag, Button, Modal, Form, Input, DatePicker, Space, Row, Col, message, Radio } from 'antd';
import { PlusOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import MetricCard from '../components/MetricCard';
import { fmt, fmtDate, fmtShort } from '../utils/format';
import { bankOpeningBalance } from '../data/sampleData';

export default function BankTransactions({ txns, setTxns }) {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [txnType, setTxnType] = useState('credit');

  const totalCredit = txns.reduce((s, t) => s + t.credit, 0);
  const totalDebit  = txns.reduce((s, t) => s + t.debit, 0);
  const closing     = bankOpeningBalance + totalCredit - totalDebit;

  // Running balance
  let bal = bankOpeningBalance;
  const rows = txns.map(t => {
    bal += t.credit - t.debit;
    return { ...t, balance: bal };
  });

  const handleAdd = (values) => {
    const amt = parseFloat(values.amount) || 0;
    const newTxn = {
      id: txns.length + 1,
      date: values.date?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
      desc: values.desc,
      credit: txnType === 'credit' ? amt : 0,
      debit:  txnType === 'debit'  ? amt : 0,
    };
    setTxns(prev => [...prev, newTxn]);
    message.success('Transaction added');
    setModalOpen(false);
    form.resetFields();
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', width: 48, render: v => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span> },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 105, render: v => fmtDate(v), responsive: ['sm'] },
    { title: 'Description', dataIndex: 'desc', key: 'desc', ellipsis: true },
    {
      title: 'Credit', dataIndex: 'credit', key: 'credit', align: 'right', width: 110,
      render: v => v > 0 ? <span style={{ color: '#10b981', fontWeight: 700 }}>+{fmt(v)}</span> : <span style={{ color: '#e2e8f0' }}>–</span>,
    },
    {
      title: 'Debit', dataIndex: 'debit', key: 'debit', align: 'right', width: 110,
      render: v => v > 0 ? <span style={{ color: '#ef4444', fontWeight: 700 }}>-{fmt(v)}</span> : <span style={{ color: '#e2e8f0' }}>–</span>,
    },
    {
      title: 'Balance', dataIndex: 'balance', key: 'balance', align: 'right', width: 120,
      render: v => <span style={{ fontWeight: 700, color: v >= 0 ? '#0f172a' : '#ef4444' }}>{fmt(v)}</span>,
      responsive: ['md'],
    },
    {
      title: 'Type', key: 'type', width: 90, align: 'center',
      render: (_, r) => r.credit > 0
        ? <Tag color="success" icon={<ArrowUpOutlined />}>Credit</Tag>
        : <Tag color="error" icon={<ArrowDownOutlined />}>Debit</Tag>,
      responsive: ['sm'],
    },
  ];

  return (
    <div>
      <div className="metric-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        <MetricCard label="Opening Balance" value={fmt(bankOpeningBalance)} sub="Apr 2026 start"      accent="#64748b" />
        <MetricCard label="Total Credits"   value={fmtShort(totalCredit)}  sub={`${txns.filter(t => t.credit > 0).length} deposits`}  accent="#10b981" />
        <MetricCard label="Total Debits"    value={fmtShort(totalDebit)}   sub={`${txns.filter(t => t.debit > 0).length} transfers`}  accent="#ef4444" />
        <MetricCard label="Closing Balance" value={fmt(closing)}           sub="Current balance"      accent="#3b82f6" />
      </div>

      <Card
        title="Bank Transactions – HDFC Bank"
        extra={
          <Space wrap>
            <Tag color="blue" style={{ fontSize: 12 }}>A/C: 50200106389545</Tag>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalOpen(true); }}>Add Transaction</Button>
          </Space>
        }
      >
        <Table
          dataSource={rows}
          columns={columns}
          rowKey="id"
          size="small"
          scroll={{ x: 500 }}
          pagination={{ pageSize: 20, showTotal: t => `${t} transactions` }}
          rowClassName={(r) => r.credit > 0 ? 'credit-row' : 'debit-row'}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row style={{ background: '#f8fafc' }}>
                <Table.Summary.Cell index={0} colSpan={3}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>Summary</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="right">
                  <span style={{ fontWeight: 700, color: '#10b981' }}>+{fmt(totalCredit)}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} align="right">
                  <span style={{ fontWeight: 700, color: '#ef4444' }}>-{fmt(totalDebit)}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} align="right">
                  <span style={{ fontWeight: 800, color: '#3b82f6', fontSize: 14 }}>{fmt(closing)}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} />
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        title="Add Bank Transaction"
        footer={null}
        width={440}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item label="Transaction Type">
            <Radio.Group value={txnType} onChange={e => setTxnType(e.target.value)} buttonStyle="solid">
              <Radio.Button value="credit" style={{ color: txnType === 'credit' ? undefined : '#10b981' }}>
                <ArrowUpOutlined /> Credit (Deposit)
              </Radio.Button>
              <Radio.Button value="debit" style={{ color: txnType === 'debit' ? undefined : '#ef4444' }}>
                <ArrowDownOutlined /> Debit (Transfer)
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="date" label="Date" initialValue={dayjs()}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="amount" label="Amount (₹)" rules={[{ required: true, message: 'Enter amount' }]}>
                <Input type="number" prefix="₹" placeholder="0" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="desc" label="Description" rules={[{ required: true, message: 'Enter description' }]}>
            <Input.TextArea rows={2} placeholder="e.g. Deposit from Sun Tex" />
          </Form.Item>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">Add Transaction</Button>
          </div>
        </Form>
      </Modal>

      <style>{`
        .credit-row { background: #f0fdf4 !important; }
        .debit-row { background: #fff !important; }
      `}</style>
    </div>
  );
}
