'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Table, Input, DatePicker, Card, Button, Form, Tag, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface OrderRow { key: string; orderId: string; customer: string; total: number; }
interface DeliveryRow { key: string; deliveryId: string; destination: string; shipDate: string; carrier: string; }

const orders: OrderRow[] = [
  { key: 'o1', orderId: 'ORD-53', customer: 'Acme Corp', total: 12400 },
  { key: 'o2', orderId: 'ORD-54', customer: 'Globex Inc', total: 8900 },
  { key: 'o3', orderId: 'ORD-55', customer: 'Stark Ltd', total: 22000 },
  { key: 'o4', orderId: 'ORD-56', customer: 'Wayne Ent', total: 5600 },
];

const childMap: Record<string, DeliveryRow[]> = {
  o1: [{ key: 'd1', deliveryId: 'D-1', destination: 'New York', shipDate: '2026-10-15', carrier: 'FedEx' }],
  o2: [{ key: 'd2', deliveryId: 'D-1', destination: 'LA', shipDate: '2026-11-01', carrier: 'UPS' }],
  o3: [
    { key: 'd3', deliveryId: 'D-1', destination: 'Chicago', shipDate: '2026-10-20', carrier: 'DHL' },
    { key: 'd4', deliveryId: 'D-2', destination: 'Seattle', shipDate: '2026-11-15', carrier: 'FedEx' },
    { key: 'd5', deliveryId: 'D-3', destination: 'Miami', shipDate: '2026-12-20', carrier: 'USPS' },
  ],
  o4: [{ key: 'd6', deliveryId: 'D-1', destination: 'Dallas', shipDate: '2026-09-30', carrier: 'UPS' }],
};

export default function T11({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [children, setChildren] = useState<Record<string, DeliveryRow[]>>(childMap);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();

  const isEditing = (r: DeliveryRow) => r.key === editingKey;
  const edit = (r: DeliveryRow) => { form.setFieldsValue({ ...r, shipDate: dayjs(r.shipDate) }); setEditingKey(r.key); };
  const cancel = () => setEditingKey('');

  const save = async (parentKey: string, childKey: string) => {
    const vals = await form.validateFields();
    if (vals.shipDate && dayjs.isDayjs(vals.shipDate)) vals.shipDate = vals.shipDate.format('YYYY-MM-DD');
    const nc = { ...children };
    const arr = [...nc[parentKey]];
    const idx = arr.findIndex((c) => c.key === childKey);
    arr[idx] = { ...arr[idx], ...vals };
    nc[parentKey] = arr;
    setChildren(nc);
    setEditingKey('');
  };

  useEffect(() => {
    if (successFired.current) return;
    const deliveries = children['o3'];
    if (!deliveries) return;
    const d2 = deliveries.find((r) => r.deliveryId === 'D-2');
    if (d2 && d2.shipDate === '2026-12-01' && editingKey !== d2.key) {
      successFired.current = true; onSuccess();
    }
  }, [children, editingKey, onSuccess]);

  const childCols = (parentKey: string) => [
    { title: 'Delivery ID', dataIndex: 'deliveryId', width: 100 },
    { title: 'Destination', dataIndex: 'destination', width: 120 },
    {
      title: 'Ship date', dataIndex: 'shipDate', width: 170,
      render: (_: string, r: DeliveryRow) => isEditing(r)
        ? <Form.Item name="shipDate" style={{ margin: 0 }}><DatePicker needConfirm onOk={() => {}} size="small" /></Form.Item>
        : r.shipDate,
    },
    { title: 'Carrier', dataIndex: 'carrier', width: 90 },
    {
      title: 'Actions', width: 130,
      render: (_: unknown, r: DeliveryRow) => isEditing(r)
        ? <Space size="small"><Button size="small" type="link" onClick={() => save(parentKey, r.key)}>Save</Button><Button size="small" type="link" onClick={cancel}>Cancel</Button></Space>
        : <Button size="small" type="link" disabled={editingKey !== ''} onClick={() => edit(r)}>Edit</Button>,
    },
  ];

  const parentCols = [
    { title: 'Order ID', dataIndex: 'orderId', width: 100 },
    { title: 'Customer', dataIndex: 'customer', width: 140 },
    { title: 'Total', dataIndex: 'total', width: 110, render: (v: number) => `$${v.toLocaleString()}` },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>Order management — expand to view deliveries</Text>
      <Card size="small" title="Orders" style={{ width: 700 }}>
        <Form form={form} component={false}>
          <Table
            dataSource={orders}
            columns={parentCols as any}
            pagination={false}
            size="small"
            bordered
            expandable={{
              expandedRowRender: (record) => (
                <Table
                  dataSource={children[record.key] || []}
                  columns={childCols(record.key) as any}
                  pagination={false}
                  size="small"
                  bordered
                  title={() => <Text strong>Deliveries</Text>}
                />
              ),
            }}
          />
        </Form>
      </Card>
    </div>
  );
}
