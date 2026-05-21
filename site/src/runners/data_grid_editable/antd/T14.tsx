'use client';

/**
 * data_grid_editable-antd-T14: Cancel a row edit so nothing is saved
 *
 * The page is a form-style section titled "Vendors" anchored near the bottom-left of the viewport.
 * It contains a single Ant Design Table using row editing with explicit actions.
 *
 * Table details:
 * - Columns: Vendor ID (read-only key), Company (read-only), Contact (editable text), Email (editable text), Operation (Edit/Save/Cancel).
 * - Clicking "Edit" on a row switches that row into edit mode (inputs appear for Contact and Email) and shows "Save" and "Cancel".
 * - Clicking "Cancel" exits edit mode and discards any edits (reverts to the pre-edit values).
 *
 * Initial state:
 * - Vendor V-17 exists and currently shows Contact = "Pat Quinn".
 * - No rows are in edit mode initially.
 *
 * Clutter:
 * - The section includes helper text and a non-interactive "Last updated" timestamp; these are distractors only.
 */

import React, { useState } from 'react';
import { Table, Input, Card, Form, Button, Typography, Space } from 'antd';
import type { TaskComponentProps, VendorRow } from '../types';

const { Text } = Typography;

type EditOutcome = 'saved' | 'canceled' | null;

const initialData: VendorRow[] = [
  { key: '1', vendorId: 'V-15', company: 'Acme Corp', contact: 'John Smith', email: 'john@acme.com' },
  { key: '2', vendorId: 'V-16', company: 'Global Tech', contact: 'Jane Doe', email: 'jane@globaltech.com' },
  { key: '3', vendorId: 'V-17', company: 'FastShip Inc', contact: 'Pat Quinn', email: 'pat@fastship.com' },
  { key: '4', vendorId: 'V-18', company: 'Quality Parts', contact: 'Sam Wilson', email: 'sam@qualityparts.com' },
];

export default function T14({ task, onSuccess }: TaskComponentProps) {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<VendorRow[]>(initialData);
  const [editingKey, setEditingKey] = useState<string>('');
  const [lastEditOutcome, setLastEditOutcome] = useState<Record<string, EditOutcome>>({});
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const isEditing = (record: VendorRow) => record.key === editingKey;

  const edit = (record: VendorRow) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = (record: VendorRow) => {
    setEditingKey('');
    setLastEditOutcome((prev) => ({ ...prev, [record.vendorId]: 'canceled' }));

    // Check success condition: V-17 was in edit mode and Cancel was clicked
    if (record.vendorId === 'V-17' && !hasSucceeded) {
      // Verify Contact is still "Pat Quinn" (original value)
      const originalRow = dataSource.find((r) => r.vendorId === 'V-17');
      if (originalRow && originalRow.contact.trim() === 'Pat Quinn') {
        setHasSucceeded(true);
        onSuccess();
      }
    }
  };

  const save = async (key: string) => {
    try {
      const row = await form.validateFields() as VendorRow;
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      
      if (index > -1) {
        const item = newData[index];
        const updatedRow = { ...item, ...row };
        newData.splice(index, 1, updatedRow);
        setDataSource(newData);
        setEditingKey('');
        setLastEditOutcome((prev) => ({ ...prev, [updatedRow.vendorId]: 'saved' }));
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    { title: 'Vendor ID', dataIndex: 'vendorId', key: 'vendorId', width: 80 },
    { title: 'Company', dataIndex: 'company', key: 'company', width: 130 },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
      width: 130,
      render: (_: string, record: VendorRow) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item name="contact" style={{ margin: 0 }} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        ) : (
          record.contact
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      render: (_: string, record: VendorRow) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item name="email" style={{ margin: 0 }} rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
        ) : (
          record.email
        );
      },
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      key: 'operation',
      width: 130,
      render: (_: unknown, record: VendorRow) => {
        const editing = isEditing(record);
        return editing ? (
          <Space>
            <Button
              type="link"
              onClick={() => save(record.key)}
              style={{ padding: 0 }}
              data-testid={`row-save-${record.vendorId}`}
            >
              Save
            </Button>
            <Button
              type="link"
              onClick={() => cancel(record)}
              style={{ padding: 0 }}
              data-testid={`row-cancel-${record.vendorId}`}
            >
              Cancel
            </Button>
          </Space>
        ) : (
          <Button
            type="link"
            disabled={editingKey !== ''}
            onClick={() => edit(record)}
            style={{ padding: 0 }}
            data-testid={`row-edit-${record.vendorId}`}
          >
            Edit
          </Button>
        );
      },
    },
  ];

  return (
    <Card title="Vendors" style={{ width: 700 }}>
      <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
        Manage vendor contact information. Click Edit to modify a vendor&apos;s contact details.
      </Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 12 }}>
        Last updated: January 15, 2026
      </Text>
      <Form form={form} component={false}>
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          size="middle"
          data-testid="vendors-table"
        />
      </Form>
    </Card>
  );
}
