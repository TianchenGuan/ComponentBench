'use client';

/**
 * data_grid_editable-antd-T15: Add a new row and save it
 *
 * The page contains one isolated card titled "New Orders" with an Ant Design Table that supports adding rows.
 * Above the table is a primary button labeled "Add a row".
 *
 * Add/edit behavior:
 * - Clicking "Add a row" inserts a new editable row at the top of the table.
 * - The new row appears immediately in edit mode with input controls for several columns.
 * - The Operation column for the new row shows "Save" and "Cancel".
 * - Saving commits the row into the table (inputs disappear).
 *
 * Table details:
 * - Theme light; spacing comfortable; default scale; centered.
 * - Columns: Order ID (editable only for the new row), Customer (editable text), Quantity (editable number), Status (editable select with options Pending/Processing/Shipped/Cancelled), Operation.
 * - Initial state: ORD-9001 does not yet exist in the table.
 *
 * Distractors:
 * - A small hint text under the button describes required fields, but it is not interactive.
 */

import React, { useState } from 'react';
import { Table, Input, Card, Form, InputNumber, Select, Button, Typography, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface NewOrderRow {
  key: string;
  orderId: string;
  customer: string;
  quantity: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Cancelled';
  isNew?: boolean;
}

const initialData: NewOrderRow[] = [
  { key: '1', orderId: 'ORD-8001', customer: 'John Smith', quantity: 5, status: 'Pending' },
  { key: '2', orderId: 'ORD-8002', customer: 'Jane Doe', quantity: 3, status: 'Processing' },
  { key: '3', orderId: 'ORD-8003', customer: 'Bob Wilson', quantity: 10, status: 'Shipped' },
];

export default function T15({ task, onSuccess }: TaskComponentProps) {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<NewOrderRow[]>(initialData);
  const [editingKey, setEditingKey] = useState<string>('');
  const [keyCounter, setKeyCounter] = useState(4);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const isEditing = (record: NewOrderRow) => record.key === editingKey;

  const handleAddRow = () => {
    const newKey = `new-${keyCounter}`;
    const newRow: NewOrderRow = {
      key: newKey,
      orderId: '',
      customer: '',
      quantity: 1,
      status: 'Pending',
      isNew: true,
    };
    setDataSource([newRow, ...dataSource]);
    setEditingKey(newKey);
    setKeyCounter(keyCounter + 1);
    form.setFieldsValue({
      orderId: '',
      customer: '',
      quantity: 1,
      status: 'Pending',
    });
  };

  const cancel = (key: string) => {
    const record = dataSource.find((item) => item.key === key);
    if (record?.isNew) {
      // Remove the unsaved new row
      setDataSource(dataSource.filter((item) => item.key !== key));
    }
    setEditingKey('');
  };

  const save = async (key: string) => {
    try {
      const row = await form.validateFields() as NewOrderRow;
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      
      if (index > -1) {
        const item = newData[index];
        const updatedRow = { ...item, ...row, isNew: false };
        newData.splice(index, 1, updatedRow);
        setDataSource(newData);
        setEditingKey('');

        // Check success condition: ORD-9001 exists with Customer="Sam Lee", Quantity=3, Status="Pending"
        if (
          updatedRow.orderId === 'ORD-9001' &&
          updatedRow.customer.trim() === 'Sam Lee' &&
          updatedRow.quantity === 3 &&
          updatedRow.status === 'Pending' &&
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
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 120,
      render: (_: string, record: NewOrderRow) => {
        const editing = isEditing(record);
        return editing && record.isNew ? (
          <Form.Item
            name="orderId"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input placeholder="ORD-XXXX" />
          </Form.Item>
        ) : (
          record.orderId
        );
      },
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
      render: (_: string, record: NewOrderRow) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="customer"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Required' }]}
          >
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
      render: (_: number, record: NewOrderRow) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="quantity"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
        ) : (
          record.quantity
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (_: string, record: NewOrderRow) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="status"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Required' }]}
          >
            <Select
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'Processing', label: 'Processing' },
                { value: 'Shipped', label: 'Shipped' },
                { value: 'Cancelled', label: 'Cancelled' },
              ]}
            />
          </Form.Item>
        ) : (
          record.status
        );
      },
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      key: 'operation',
      width: 130,
      render: (_: unknown, record: NewOrderRow) => {
        const editing = isEditing(record);
        return editing ? (
          <Space>
            <Button
              type="link"
              onClick={() => save(record.key)}
              style={{ padding: 0 }}
              data-testid="row-save-new"
            >
              Save
            </Button>
            <Button
              type="link"
              onClick={() => cancel(record.key)}
              style={{ padding: 0 }}
              data-testid="row-cancel-new"
            >
              Cancel
            </Button>
          </Space>
        ) : null;
      },
    },
  ];

  return (
    <Card title="New Orders" style={{ width: 700 }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddRow}
        disabled={editingKey !== ''}
        style={{ marginBottom: 8 }}
        data-testid="add-row-button"
      >
        Add a row
      </Button>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 12 }}>
        Required fields: Order ID, Customer, Quantity, Status
      </Text>
      <Form form={form} component={false}>
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          size="middle"
          data-testid="new-orders-table"
        />
      </Form>
    </Card>
  );
}
