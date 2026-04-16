import React, { useState } from 'react';
import { Card, Table, Tag, Button, Modal, Form, Input, Select, Space, Avatar, message, Row, Col, Alert } from 'antd';
import { CheckOutlined, PlusOutlined, EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import MetricCard from '../components/MetricCard';
import { fmt, fmtDate, initials, AVATAR_COLORS } from '../utils/format';

const MONTHS = [
  { value: '2026-04', label: 'April 2026' },
  { value: '2026-03', label: 'March 2026' },
  { value: '2026-02', label: 'February 2026' },
  { value: '2026-01', label: 'January 2026' },
];

const PAY_MODES = ['Bank Transfer', 'Cash', 'UPI/GPay', 'Cheque'];

export default function Salaries({ employees, salaryRecords, setSalaryRecords }) {
  const [month, setMonth] = useState('2026-04');
  const [form] = Form.useForm();
  const [editRec, setEditRec] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const monthRecords = salaryRecords.filter(r => r.month === month);
  const totalPayable = monthRecords.reduce((s, r) => s + r.baseSalary + r.bonus - r.deductions, 0);
  const totalPaid    = monthRecords.filter(r => r.paid).reduce((s, r) => s + r.baseSalary + r.bonus - r.deductions, 0);
  const totalAdvance = monthRecords.reduce((s, r) => s + r.advance, 0);
  const pendingCount = monthRecords.filter(r => !r.paid).length;

  const openEdit = (rec) => {
    form.setFieldsValue(rec);
    setEditRec(rec.id);
    setModalOpen(true);
  };

  const saveRec = (values) => {
    setSalaryRecords(prev => prev.map(r => r.id === editRec
      ? { ...r, ...values, bonus: parseFloat(values.bonus) || 0, deductions: parseFloat(values.deductions) || 0, advance: parseFloat(values.advance) || 0 }
      : r
    ));
    message.success('Record updated');
    setModalOpen(false);
  };

  const markPaid = (id) => {
    setSalaryRecords(prev => prev.map(r => r.id === id
      ? { ...r, paid: true, paidDate: new Date().toISOString().split('T')[0], mode: 'Bank Transfer' }
      : r
    ));
    message.success('Salary marked as paid');
  };

  const markAllPaid = () => {
    setSalaryRecords(prev => prev.map(r =>
      r.month === month && !r.paid
        ? { ...r, paid: true, paidDate: new Date().toISOString().split('T')[0], mode: 'Bank Transfer' }
        : r
    ));
    message.success(`All ${pendingCount} salaries marked as paid`);
  };

  const generateRecords = () => {
    const existingEmpIds = monthRecords.map(r => r.empId);
    const missing = employees.filter(e => !existingEmpIds.includes(e.id) && e.status === 'Active');
    if (!missing.length) { message.info('All active employees already have records for this month.'); return; }
    const newRecs = missing.map((e, i) => ({
      id: `SAL${Date.now()}${i}`, empId: e.id, month,
      baseSalary: e.baseSalary, advance: 0, deductions: 0, bonus: 0,
      paid: false, paidDate: '', mode: '', note: '',
    }));
    setSalaryRecords(prev => [...prev, ...newRecs]);
    message.success(`Generated records for ${missing.length} employees`);
  };

  const columns = [
    {
      title: 'Employee', key: 'emp', render: (_, r, i) => {
        const emp = employees.find(e => e.id === r.empId);
        if (!emp) return r.empId;
        const c = AVATAR_COLORS[i % AVATAR_COLORS.length];
        return (
          <Space>
            <Avatar style={{ background: c.bg, color: c.text, fontWeight: 700, fontSize: 11 }} size={32}>{initials(emp.name)}</Avatar>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{emp.name}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{emp.role}</div>
            </div>
          </Space>
        );
      }
    },
    { title: 'Base Salary', dataIndex: 'baseSalary', key: 'baseSalary', align: 'right', render: v => fmt(v), responsive: ['sm'] },
    { title: 'Advance', dataIndex: 'advance', key: 'advance', align: 'right', render: v => v > 0 ? <span style={{ color: '#f59e0b' }}>{fmt(v)}</span> : '–', responsive: ['md'] },
    { title: 'Deductions', dataIndex: 'deductions', key: 'deductions', align: 'right', render: v => v > 0 ? <span style={{ color: '#ef4444' }}>-{fmt(v)}</span> : '–', responsive: ['md'] },
    { title: 'Bonus', dataIndex: 'bonus', key: 'bonus', align: 'right', render: v => v > 0 ? <span style={{ color: '#10b981' }}>+{fmt(v)}</span> : '–', responsive: ['md'] },
    {
      title: 'Net Payable', key: 'net', align: 'right',
      render: (_, r) => <span style={{ fontWeight: 700 }}>{fmt(r.baseSalary + r.bonus - r.deductions)}</span>,
    },
    {
      title: 'Status', dataIndex: 'paid', key: 'paid', width: 90,
      render: (v, r) => v
        ? <Tag color="success" icon={<CheckCircleOutlined />}>Paid</Tag>
        : <Tag color="warning">Pending</Tag>,
    },
    { title: 'Paid Date', dataIndex: 'paidDate', key: 'paidDate', render: v => v ? fmtDate(v) : '–', responsive: ['lg'] },
    {
      title: 'Actions', key: 'actions', width: 130,
      render: (_, r) => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          {!r.paid && <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => markPaid(r.id)}>Pay</Button>}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="metric-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        <MetricCard label="Total Payable"  value={fmt(totalPayable)} sub={`${monthRecords.length} employees`} accent="#3b82f6" />
        <MetricCard label="Total Paid"     value={fmt(totalPaid)}    sub={`${monthRecords.filter(r => r.paid).length} salaries`} accent="#10b981" />
        <MetricCard label="Pending"        value={pendingCount}      sub="Yet to be paid"  accent="#f59e0b" />
        <MetricCard label="Total Advance"  value={fmt(totalAdvance)} sub="This month"      accent="#8b5cf6" />
      </div>

      <Card
        title="Salary Management"
        extra={
          <Space wrap>
            <Select
              value={month}
              onChange={setMonth}
              options={MONTHS}
              style={{ width: 140 }}
            />
            <Button onClick={generateRecords} icon={<PlusOutlined />}>Generate</Button>
            {pendingCount > 0 && (
              <Button type="primary" icon={<CheckOutlined />} onClick={markAllPaid}>
                Pay All ({pendingCount})
              </Button>
            )}
          </Space>
        }
      >
        {monthRecords.length === 0 && (
          <Alert
            type="info"
            message="No salary records for this month."
            description={<>Click <strong>Generate</strong> to create records for all active employees.</>}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Table
          dataSource={monthRecords}
          columns={columns}
          rowKey="id"
          size="small"
          scroll={{ x: 600 }}
          pagination={false}
          summary={() => monthRecords.length > 0 && (
            <Table.Summary fixed>
              <Table.Summary.Row style={{ background: '#f8fafc' }}>
                <Table.Summary.Cell index={0}><span style={{ fontWeight: 700 }}>Total</span></Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <span style={{ fontWeight: 700 }}>{fmt(monthRecords.reduce((s, r) => s + r.baseSalary, 0))}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="right">
                  <span style={{ fontWeight: 700, color: '#f59e0b' }}>{fmt(monthRecords.reduce((s, r) => s + r.advance, 0))}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="right">
                  <span style={{ fontWeight: 700, color: '#ef4444' }}>{fmt(monthRecords.reduce((s, r) => s + r.deductions, 0))}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} align="right">
                  <span style={{ fontWeight: 700, color: '#10b981' }}>{fmt(monthRecords.reduce((s, r) => s + r.bonus, 0))}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} align="right">
                  <span style={{ fontWeight: 800, color: '#e94560', fontSize: 14 }}>{fmt(totalPayable)}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} colSpan={3} />
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        title="Edit Salary Record"
        footer={null}
        width={440}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={saveRec} style={{ marginTop: 8 }}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="advance" label="Advance (₹)">
                <Input type="number" prefix="₹" placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="deductions" label="Deductions (₹)">
                <Input type="number" prefix="₹" placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="bonus" label="Bonus (₹)">
                <Input type="number" prefix="₹" placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="mode" label="Payment Mode">
                <Select options={PAY_MODES.map(m => ({ label: m, value: m }))} placeholder="Select mode" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="note" label="Note">
                <Input.TextArea rows={2} placeholder="Optional note..." />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">Update</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
