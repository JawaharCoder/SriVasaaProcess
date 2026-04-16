import React from 'react';
import { Card, Statistic } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

export default function MetricCard({ label, value, sub, accent = '#3b82f6', icon, trend }) {
  return (
    <Card
      style={{ borderTop: `3px solid ${accent}`, height: '100%' }}
      bodyStyle={{ padding: '16px 20px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.6px', color: '#64748b', marginBottom: 8,
          }}>{label}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{value}</div>
          {sub && (
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6, fontWeight: 500 }}>{sub}</div>
          )}
        </div>
        {icon && (
          <div style={{
            width: 42, height: 42, borderRadius: 10, display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 20,
            background: accent + '18', color: accent, flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
