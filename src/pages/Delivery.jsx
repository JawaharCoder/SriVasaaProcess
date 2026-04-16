import React, { useState } from 'react';
import { Card, Table, Tag, Button, Modal, Form, Input, DatePicker, Space, message, Row, Col } from 'antd';
import { PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import MetricCard from '../components/MetricCard';
import { fmtDate } from '../utils/format';

export default function Delivery({ deliveries, setDeliveries }) {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const totalLot  = deliveries.reduce((s, r) => s + r.lot, 0);
  const totalVasa = deliveries.reduce((s, r) => s + r.vasanaLot, 0);

  const addDelivery = (values) => {
    const newRec = {
      ...values,
      id: deliveries.length + 1,
      date: values.date?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
      lot: parseInt(values.lot) || 0,
      vasanaLot: parseInt(values.vasanaLot) || 0,
    };
    setDeliveries(prev => [...prev, newRec]);
    message.success('Delivery record added');
    setModalOpen(false);
    form.resetFields();
  };

  const columns = [
    { title: 'Dispatch Date', dataIndex: 'date', key: 'date', width: 120, render: v => fmtDate(v) },
    { title: 'Party', dataIndex: 'party', key: 'party', ellipsis: true, responsive: ['sm'] },
    { title: 'Lot Sent', dataIndex: 'lot', key: 'lot', align: 'right', width: 100, render: v => <span style={{ fontWeight: 700 }}>{v}</span> },
    { title: 'Vasana No.', dataIndex: 'vasanaNo', key: 'vasanaNo', width: 100 },
    { title: 'Vasana Lot', dataIndex: 'vasanaLot', key: 'vasanaLot', align: 'right', width: 100, responsive: ['sm'] },
    { title: 'Note', dataIndex: 'note', key: 'note', render: v => <span style={{ color: '#64748b' }}>{v || '–'}</span>, responsive: ['md'] },
    {
      title: 'Status', key: 'status', width: 110,
      render: () => <Tag color="success" icon={<CheckCircleOutlined />}>Delivered</Tag>
    },
  ];

  return (
    <div>
      <div className="metric-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        <MetricCard label="Total Dispatches" value={deliveries.length}  sub="All records"         accent="#3b82f6" />
        <MetricCard label="Total Lots Sent"  value={totalLot}           sub="Units dispatched"    accent="#10b981" />
        <MetricCard label="Total Vasana Lot" value={totalVasa}          sub="Matched lots"        accent="#8b5cf6" />
        <MetricCard label="Balance Stock"    value="5,009"              sub="Vasana No: 1164–1167" accent="#f59e0b" />
      </div>

      <Card
        title="Delivery & Dispatch Register"
        extra={
          <Space>
            <Tag color="blue">March – April 2026</Tag>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalOpen(true); }}>Add Delivery</Button>
          </Space>
        }
      >
        <Table
          dataSource={deliveries}
          columns={columns}
          rowKey="id"
          size="small"
          scroll={{ x: 500 }}
          pagination={{ pageSize: 15 }}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row style={{ background: '#f0fdf4' }}>
                <Table.Summary.Cell index={0}><span style={{ fontWeight: 700 }}>Total</span></Table.Summary.Cell>
                <Table.Summary.Cell index={1} />
                <Table.Summary.Cell index={2} align="right"><span style={{ fontWeight: 800, color: '#065f46' }}>{totalLot}</span></Table.Summary.Cell>
                <Table.Summary.Cell index={3} />
                <Table.Summary.Cell index={4} align="right"><span style={{ fontWeight: 800, color: '#065f46' }}>{totalVasa}</span></Table.Summary.Cell>
                <Table.Summary.Cell index={5} colSpan={2} />
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        title="Add Delivery Record"
        footer={null}
        width={440}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={addDelivery} style={{ marginTop: 8 }}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="date" label="Dispatch Date" initialValue={dayjs()}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="party" label="Party / Customer" rules={[{ required: true }]}>
                <Input placeholder="Party name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="lot" label="Lots Sent" rules={[{ required: true }]}>
                <Input type="number" placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="vasanaNo" label="Vasana No." rules={[{ required: true }]}>
                <Input placeholder="e.g. 1167" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="vasanaLot" label="Vasana Lot" rules={[{ required: true }]}>
                <Input type="number" placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="note" label="Note (Optional)">
                <Input placeholder="Reference/note" />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">Save Delivery</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
