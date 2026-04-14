import React from 'react';
import { Card, CardHeader, Table, Tr, Td, Pill } from '../components/UI';

const deliveryData = [
  { date: '02.03.26', lot: 400,  vasanaNo: '1165', vasanaLot: 400,  note: '846'  },
  { date: '02.03.26', lot: 500,  vasanaNo: '1166', vasanaLot: 500,  note: '500'  },
  { date: '05.03.26', lot: 60,   vasanaNo: '1167', vasanaLot: 60,   note: '66'   },
  { date: '06.03.26', lot: 123,  vasanaNo: '1167', vasanaLot: 123,  note: '123'  },
  { date: '24.03.26', lot: 127,  vasanaNo: '1167', vasanaLot: 127,  note: '127'  },
];

export default function Delivery() {
  return (
    <div>
      <Card>
        <CardHeader
          title="Delivery & Dispatch Register"
          right={<Pill label="March 2026" color="blue" />}
        />
        <Table headers={[
          { label: 'Dispatch Date' },
          { label: 'Lot Sent', right: true },
          { label: 'Vasana No.' },
          { label: 'Vasana Lot', right: true },
          { label: 'Delivery Note' },
          { label: 'Status' },
        ]}>
          {deliveryData.map((r, i) => (
            <Tr key={i}>
              <Td>{r.date}</Td>
              <Td right bold>{r.lot}</Td>
              <Td>{r.vasanaNo}</Td>
              <Td right>{r.vasanaLot}</Td>
              <Td muted>{r.note}</Td>
              <Td><Pill label="Delivered" color="green" /></Td>
            </Tr>
          ))}
          <Tr>
            <Td bold>Total</Td>
            <Td right bold>{deliveryData.reduce((s, r) => s + r.lot, 0)}</Td>
            <Td muted>–</Td>
            <Td right bold>{deliveryData.reduce((s, r) => s + r.vasanaLot, 0)}</Td>
            <Td muted>–</Td>
            <Td>–</Td>
          </Tr>
        </Table>
        <div style={{ padding: '12px 14px', background: '#f9fafb', borderTop: '1px solid #e5e7eb', fontSize: 12, color: '#6b7280' }}>
          Balance Stock: 5009 lots | Vasana No. range: 1164–1167
        </div>
      </Card>
    </div>
  );
}
