import React, { useState } from 'react';
import { Card, Table, Tag, Button, Modal, Form, Input, Select, DatePicker, Space, Avatar, Popconfirm, message, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, UserSwitchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import MetricCard from '../components/MetricCard';
import { fmt, fmtDate, initials, AVATAR_COLORS } from '../utils/format';

const ROLES = ['Machine Operator', 'Boiler Operator', 'Maintenance', 'Helper', 'Loading/Unloading', 'Driver', 'Supervisor', 'Accountant'];

const BLANK = { id: '', name: '', role: ROLES[0], baseSalary: 12000, phone: '', joinDate: dayjs(), status: 'Active' };

export default function Employees({ employees, setEmployees }) {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const active   = employees.filter(e => e.status === 'Active').length;
  const inactive = employees.filter(e => e.status !== 'Active').length;
  const totalSalary = employees.filter(e => e.status === 'Active').reduce((s, e) => s + e.baseSalary, 0);

  const openAdd = () => {
    const nextId = 'EMP' + String(employees.length + 1).padStart(3, '0');
    form.setFieldsValue({ ...BLANK, id: nextId, joinDate: dayjs() });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (emp) => {
    form.setFieldsValue({ ...emp, joinDate: dayjs(emp.joinDate) });
    setEditingId(emp.id);
    setModalOpen(true);
  };

  const save = (values) => {
    const emp = { ...values, joinDate: values.joinDate?.format('YYYY-MM-DD') || '', baseSalary: parseFloat(values.baseSalary) || 0 };
    if (editingId) {
      setEmployees(prev => prev.map(e => e.id === editingId ? { ...emp, id: editingId } : e));
      message.success('Employee updated');
    } else {
      setEmployees(prev => [...prev, emp]);
      message.success('Employee added');
    }
    setModalOpen(false);
  };

  const toggleStatus = (id) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: e.status === 'Active' ? 'Inactive' : 'Active' } : e));
  };

  const columns = [
    {
      title: 'Employee', key: 'employee', render: (_, r, i) => {
        const c = AVATAR_COLORS[i % AVATAR_COLORS.length];
        return (
          <Space>
            <Avatar style={{ background: c.bg, color: c.text, fontWeight: 700, fontSize: 12 }} size={36}>{initials(r.name)}</Avatar>
            <div>
              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{r.name}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{r.id}</div>
            </div>
          </Space>
        );
      }
    },
    { title: 'Role', dataIndex: 'role', key: 'role', responsive: ['sm'] },
    { title: 'Phone', dataIndex: 'phone', key: 'phone', render: v => <span style={{ color: '#64748b' }}>{v}</span>, responsive: ['md'] },
    { title: 'Join Date', dataIndex: 'joinDate', key: 'joinDate', render: v => fmtDate(v), responsive: ['lg'] },
    {
      title: 'Salary', dataIndex: 'baseSalary', key: 'baseSalary', align: 'right',
      render: v => <span style={{ fontWeight: 700 }}>{fmt(v)}/mo</span>,
      sorter: (a, b) => a.baseSalary - b.baseSalary,
    },
    {
      title: 'Status', dataIndex: 'status', key: 'status', width: 90,
      render: v => <Tag color={v === 'Active' ? 'success' : 'default'}>{v}</Tag>,
    },
    {
      title: 'Actions', key: 'actions', width: 130,
      render: (_, r) => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Button
            size="small"
            icon={<UserSwitchOutlined />}
            type={r.status === 'Active' ? 'default' : 'primary'}
            onClick={() => toggleStatus(r.id)}
          >
            {r.status === 'Active' ? 'Deactivate' : 'Activate'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="metric-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        <MetricCard label="Total Employees"  value={employees.length} sub="All staff"           accent="#3b82f6" />
        <MetricCard label="Active"           value={active}           sub="Currently working"   accent="#10b981" />
        <MetricCard label="Inactive"         value={inactive}         sub="On leave / left"     accent="#94a3b8" />
        <MetricCard label="Monthly Payroll"  value={fmt(totalSalary)} sub="Active staff total"  accent="#e94560" />
      </div>

      <Card
        title="Employee Directory"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Add Employee</Button>}
      >
        <Table
          dataSource={employees}
          columns={columns}
          rowKey="id"
          size="small"
          scroll={{ x: 600 }}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        title={editingId ? 'Edit Employee' : 'Add New Employee'}
        footer={null}
        width={560}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={save} style={{ marginTop: 8 }}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="id" label="Employee ID" rules={[{ required: true }]}>
                <Input disabled={!!editingId} placeholder="EMP001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                <Input placeholder="Full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                <Select options={ROLES.map(r => ({ label: r, value: r }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone">
                <Input placeholder="9XXXXXXXXX" maxLength={10} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="joinDate" label="Join Date">
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="baseSalary" label="Base Salary (₹/month)" rules={[{ required: true }]}>
                <Input type="number" prefix="₹" suffix="/mo" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status" initialValue="Active">
                <Select options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">{editingId ? 'Update Employee' : 'Save Employee'}</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
