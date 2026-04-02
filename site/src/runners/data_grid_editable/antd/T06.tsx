'use client';

/**
 * data_grid_editable-antd-T06: Edit a row and click Save (row editing mode)
 *
 * The page is a small "Billing" form section with a few read-only fields (Billing period, Account ID) above an Ant Design Table titled "Invoices (Editable Rows)".
 * This table uses the "editable rows" pattern:
 * - Each row has an Operation column with an "Edit" action.
 * - Clicking "Edit" turns multiple cells in that row into input fields at once and the Operation column changes to "Save" and "Cancel".
 * - Changes are only committed when you click "Save" for that same row.
 *
 * Table details:
 * - Light theme, comfortable spacing, default scale.
 * - One table instance.
 * - Columns: Invoice ID (read-only key), Customer (editable text), Quantity (editable number), Notes (editable text), Operation (Edit/Save/Cancel).
 * - Initial state: INV-2002 has different values for Customer and/or Quantity.
 */

import React, { useState } from 'react';
import { Table, Input, Card, Form, InputNumber, Button, Typography, Space } from 'antd';
import type { TaskComponentProps, InvoiceRow } from '../types';

const { Text } = Typography;

const initialData: InvoiceRow[] = [
  { key: '1', invoiceId: 'INV-2001', customer: 'Acme Corp', quantity: 15, notes: 'Net 30' },
  { key: '2', invoiceId: 'INV-2002', customer: 'Tech Solutions', quantity: 8, notes: 'Urgent' },
  { key: '3', invoiceId: 'INV-2003', customer: 'Global Inc', quantity: 22, notes: '' },
  { key: '4', invoiceId: 'INV-2004', customer: 'StartUp LLC', quantity: 5, notes: 'First order' },
  { key: '5', invoiceId: 'INV-2005', customer: 'Enterprise Co', quantity: 30, notes: 'Bulk discount' },
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<InvoiceRow[]>(initialData);
  const [editingKey, setEditingKey] = useState<string>('');
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const isEditing = (record: InvoiceRow) => record.key === editingKey;

  const edit = (record: InvoiceRow) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: string) => {
    try {
      const row = await form.validateFields() as InvoiceRow;
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      
      if (index > -1) {
        const item = newData[index];
        const updatedRow = { ...item, ...row };
        newData.splice(index, 1, updatedRow);
        setDataSource(newData);
        setEditingKey('');

        // Check success condition: INV-2002 Customer = "Riley Park" and Quantity = 5
        if (
          updatedRow.invoiceId === 'INV-2002' &&
          updatedRow.customer.trim() === 'Riley Park' &&
          updatedRow.quantity === 5 &&
          !hasSucceeded
        ) {
          setHasSucceeded(true);
          onSuccess();
        }
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    { title: 'Invoice ID', dataIndex: 'invoiceId', key: 'invoiceId', width: 120 },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      width: 180,
      render: (_: string, record: InvoiceRow) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item name="customer" style={{ margin: 0 }} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        ) : (
          record.customer
        );
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (_: number, record: InvoiceRow) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item name="quantity" style={{ margin: 0 }} rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
        ) : (
          record.quantity
        );
      },
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      width: 150,
      render: (_: string, record: InvoiceRow) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item name="notes" style={{ margin: 0 }}>
            <Input />
          </Form.Item>
        ) : (
          record.notes
        );
      },
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      key: 'operation',
      width: 150,
      render: (_: unknown, record: InvoiceRow) => {
        const editing = isEditing(record);
        return editing ? (
          <Space>
            <Button
              type="link"
              onClick={() => save(record.key)}
              style={{ padding: 0 }}
              data-testid={`row-save-${record.invoiceId}`}
            >
              Save
            </Button>
            <Button type="link" onClick={cancel} style={{ padding: 0 }}>
              Cancel
            </Button>
          </Space>
        ) : (
          <Button
            type="link"
            disabled={editingKey !== ''}
            onClick={() => edit(record)}
            style={{ padding: 0 }}
            data-testid={`row-edit-${record.invoiceId}`}
          >
            Edit
          </Button>
        );
      },
    },
  ];

  return (
    <Card title="Billing" style={{ width: 750 }}>
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">Billing period:</Text>{' '}
        <Text>January 2026</Text>
        <br />
        <Text type="secondary">Account ID:</Text>{' '}
        <Text>ACC-12345</Text>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Text strong>Invoices (Editable Rows)</Text>
      </div>
      <Button disabled style={{ marginBottom: 16 }}>
        Export CSV
      </Button>
      <Form form={form} component={false}>
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          size="middle"
          data-testid="invoices-table"
        />
      </Form>
    </Card>
  );
}
