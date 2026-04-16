import React, { useState } from 'react';
import { Card, Table, Tag, Input, Space, Row, Col, Progress } from 'antd';
import { SearchOutlined, WarningOutlined } from '@ant-design/icons';
import MetricCard from '../components/MetricCard';
import { fmt, fmtShort } from '../utils/format';
import { balanceData } from '../data/sampleData';

export default function BalanceSheet() {
  const [search, setSearch] = useState('');

  const filtered = balanceData.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalInv     = balanceData.reduce((s, r) => s + r.inv, 0);
  const totalRecv    = balanceData.reduce((s, r) => s + r.recv, 0);
  const totalPending = balanceData.reduce((s, r) => s + Math.max(0, r.pending), 0);
  const totalLong    = balanceData.reduce((s, r) => s + r.longPend, 0);
  const collectionRate = Math.round((totalRecv / totalInv) * 100);

  const columns = [
    { title: '#', dataIndex: 'no', key: 'no', width: 48, render: v => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span> },
    { title: 'Party Name', dataIndex: 'name', key: 'name', ellipsis: true, render: v => <span style={{ fontWeight: 600, color: '#0f172a' }}>{v}</span> },
    {
      title: 'Invoiced', dataIndex: 'inv', key: 'inv', align: 'right', width: 120,
      render: v => <span style={{ fontWeight: 600 }}>{fmt(v)}</span>,
      sorter: (a, b) => a.inv - b.inv,
      responsive: ['sm'],
    },
    {
      title: 'Received', dataIndex: 'recv', key: 'recv', align: 'right', width: 120,
      render: v => <span style={{ color: '#10b981', fontWeight: 600 }}>{fmt(v)}</span>,
      sorter: (a, b) => a.recv - b.recv,
      responsive: ['sm'],
    },
    {
      title: 'Pending', dataIndex: 'pending', key: 'pending', align: 'right', width: 120,
      render: v => (
        <span style={{ fontWeight: 700, color: v > 0 ? '#ef4444' : v < 0 ? '#10b981' : '#94a3b8' }}>
          {v > 0 ? fmt(v) : v < 0 ? `(Adv: ${fmt(Math.abs(v))})` : '–'}
        </span>
      ),
      sorter: (a, b) => b.pending - a.pending,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Collection', key: 'rate', align: 'right', width: 120,
      render: (_, r) => {
        const rate = r.inv > 0 ? Math.min(100, Math.round((r.recv / r.inv) * 100)) : 100;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
            <Progress percent={rate} size="small" showInfo={false} strokeColor={rate >= 90 ? '#10b981' : rate >= 70 ? '#f59e0b' : '#ef4444'} style={{ width: 60 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', minWidth: 30 }}>{rate}%</span>
          </div>
        );
      },
      responsive: ['lg'],
    },
    {
      title: 'Long Overdue', dataIndex: 'longPend', key: 'longPend', align: 'right', width: 120,
      render: v => v > 0 ? <Tag color="error" icon={<WarningOutlined />}>{fmt(v)}</Tag> : <span style={{ color: '#94a3b8' }}>–</span>,
      responsive: ['md'],
    },
  ];

  return (
    <div>
      <div className="metric-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        <MetricCard label="Total Invoiced"    value={fmtShort(totalInv)}     sub="All parties"           accent="#3b82f6" />
        <MetricCard label="Amount Received"   value={fmtShort(totalRecv)}    sub={`${collectionRate}% collected`} accent="#10b981" />
        <MetricCard label="Pending Recovery"  value={fmtShort(totalPending)} sub="To be collected"       accent="#f59e0b" />
        <MetricCard label="Long-Term Overdue" value={fmt(totalLong)}         sub="Immediate follow-up"   accent="#ef4444" />
      </div>

      {/* Summary bar */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 8]} align="middle">
          <Col xs={24} md={14}>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Overall Collection Rate</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginLeft: 12 }}>{collectionRate}%</span>
            </div>
            <Progress
              percent={collectionRate}
              strokeColor={{ '0%': '#ef4444', '70%': '#f59e0b', '100%': '#10b981' }}
              trailColor="#f1f5f9"
              strokeWidth={10}
            />
          </Col>
          <Col xs={24} md={10}>
            <Row gutter={8}>
              {[
                { label: 'Invoiced', val: fmtShort(totalInv), color: '#3b82f6' },
                { label: 'Received', val: fmtShort(totalRecv), color: '#10b981' },
                { label: 'Pending', val: fmtShort(totalPending), color: '#ef4444' },
              ].map(item => (
                <Col span={8} key={item.label}>
                  <div style={{ textAlign: 'center', padding: '8px 4px', background: '#f8fafc', borderRadius: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: item.color }}>{item.val}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>{item.label}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Card>

      <Card
        title={`Balance Sheet – All Parties (${balanceData.length})`}
        extra={
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search party..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 180 }}
            allowClear
          />
        }
      >
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="no"
          size="small"
          scroll={{ x: 600 }}
          pagination={false}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row style={{ background: '#0f172a' }}>
                <Table.Summary.Cell index={0} colSpan={2}>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>TOTAL ({filtered.length} parties)</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="right">
                  <span style={{ fontWeight: 700, color: '#93c5fd' }}>{fmtShort(filtered.reduce((s, r) => s + r.inv, 0))}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="right">
                  <span style={{ fontWeight: 700, color: '#6ee7b7' }}>{fmtShort(filtered.reduce((s, r) => s + r.recv, 0))}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} align="right">
                  <span style={{ fontWeight: 700, color: '#fca5a5', fontSize: 14 }}>{fmt(filtered.reduce((s, r) => s + Math.max(0, r.pending), 0))}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} />
                <Table.Summary.Cell index={6} align="right">
                  <span style={{ fontWeight: 700, color: '#fca5a5' }}>{fmt(filtered.reduce((s, r) => s + r.longPend, 0))}</span>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>
    </div>
  );
}
