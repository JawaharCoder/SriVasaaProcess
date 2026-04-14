import React, { useState } from 'react';
import { MetricCard, Card, CardHeader, Pill, Table, Tr, Td, Modal, FormField, Input, Select, Btn, fmt, fmtDate } from '../components/UI';

const ROLES = ['Machine Operator','Boiler Operator','Maintenance','Helper','Loading/Unloading','Driver','Supervisor','Accountant'];

export default function Employees({ employees, setEmployees }) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = { id: '', name: '', role: ROLES[0], baseSalary: 12000, phone: '', joinDate: new Date().toISOString().split('T')[0], status: 'Active' };
  const [form, setForm] = useState(blank);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const active   = employees.filter(e => e.status === 'Active').length;
  const inactive = employees.filter(e => e.status !== 'Active').length;
  const totalSalary = employees.filter(e => e.status === 'Active').reduce((s, e) => s + e.baseSalary, 0);

  const openAdd = () => {
    const nextId = 'EMP' + String(employees.length + 1).padStart(3, '0');
    setForm({ ...blank, id: nextId });
    setEditing(null);
    setAdding(true);
  };

  const openEdit = (emp) => {
    setForm({ ...emp });
    setEditing(emp.id);
    setAdding(true);
  };

  const save = () => {
    if (editing) {
      setEmployees(prev => prev.map(e => e.id === editing ? form : e));
    } else {
      setEmployees(prev => [...prev, form]);
    }
    setAdding(false);
  };

  const toggleStatus = (id) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: e.status === 'Active' ? 'Inactive' : 'Active' } : e));
  };

  const initials = name => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#dbeafe','#d1fae5','#ede9fe','#fef3c7','#fee2e2','#f0fdf4'];
  const textColors = ['#1e40af','#065f46','#5b21b6','#92400e','#991b1b','#166534'];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Total Employees"  value={employees.length} sub="All staff"          accent="#3b82f6" />
        <MetricCard label="Active"           value={active}           sub="Currently working"  accent="#10b981" />
        <MetricCard label="Inactive"         value={inactive}         sub="On leave / left"    accent="#9ca3af" />
        <MetricCard label="Monthly Payroll"  value={fmt(totalSalary)} sub="Base salaries"      accent="#e94560" />
      </div>

      <Card>
        <CardHeader title="Employee Directory" right={
          <Btn variant="primary" size="sm" onClick={openAdd}>+ Add Employee</Btn>
        } />
        <Table headers={[
          { label: 'Employee' }, { label: 'ID' }, { label: 'Role' }, { label: 'Phone' },
          { label: 'Join Date' }, { label: 'Base Salary', right: true }, { label: 'Status' }, { label: 'Actions' },
        ]}>
          {employees.map((emp, i) => (
            <Tr key={emp.id}>
              <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: colors[i % colors.length], color: textColors[i % textColors.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>{initials(emp.name)}</div>
                  <span style={{ fontWeight: 500 }}>{emp.name}</span>
                </div>
              </Td>
              <Td muted>{emp.id}</Td>
              <Td>{emp.role}</Td>
              <Td muted>{emp.phone}</Td>
              <Td>{fmtDate(emp.joinDate)}</Td>
              <Td right bold>{fmt(emp.baseSalary)}</Td>
              <Td><Pill label={emp.status} color={emp.status === 'Active' ? 'green' : 'gray'} /></Td>
              <Td>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Btn size="sm" onClick={() => openEdit(emp)}>Edit</Btn>
                  <Btn size="sm" variant={emp.status === 'Active' ? 'ghost' : 'green'} onClick={() => toggleStatus(emp.id)}>
                    {emp.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </Btn>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>

      <Modal open={adding} onClose={() => setAdding(false)} title={editing ? 'Edit Employee' : 'Add New Employee'} width={560}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 20 }}>
          <FormField label="Employee ID"><Input value={form.id} onChange={e => set('id', e.target.value)} readOnly={!!editing} /></FormField>
          <FormField label="Full Name"><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" /></FormField>
          <FormField label="Role">
            <Select value={form.role} onChange={e => set('role', e.target.value)}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </Select>
          </FormField>
          <FormField label="Phone"><Input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="9XXXXXXXXX" /></FormField>
          <FormField label="Join Date"><Input type="date" value={form.joinDate} onChange={e => set('joinDate', e.target.value)} /></FormField>
          <FormField label="Base Salary (₹/month)"><Input type="number" value={form.baseSalary} onChange={e => set('baseSalary', e.target.value)} /></FormField>
          <FormField label="Status">
            <Select value={form.status} onChange={e => set('status', e.target.value)}>
              <option>Active</option><option>Inactive</option>
            </Select>
          </FormField>
        </div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn onClick={() => setAdding(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={save}>{editing ? 'Update Employee' : 'Save Employee'}</Btn>
        </div>
      </Modal>
    </div>
  );
}
