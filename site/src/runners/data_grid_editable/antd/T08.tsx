'use client';

/**
 * data_grid_editable-antd-T08: Paginate to find a row and edit a cell
 *
 * The interface is a single Ant Design Table in an isolated card titled "All Orders".
 * The card is anchored near the top-right of the viewport (not centered), so the table starts higher on the page.
 *
 * Table behavior:
 * - The table uses pagination with 10 rows per page (page controls below the table).
 * - Customer is an inline editable cell (click to edit; Enter/blur commits).
 * - The Order ID column is a non-editable unique key.
 *
 * Initial state:
 * - The table has at least 3 pages of data.
 * - Order ID ORD-3017 exists but is not visible on the first page (it appears on a later page).
 *
 * Distractors:
 * - A small "Summary" text block appears above the table but does not affect success.
 */

import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import { Table, Input, Card, Form, Typography } from 'antd';
import type { InputRef, FormInstance } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const EditableContext = createContext<FormInstance | null>(null);

interface OrderData {
  key: string;
  orderId: string;
  customer: string;
  amount: number;
}

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof OrderData;
  record: OrderData;
  handleSave: (record: OrderData) => void;
}

const EditableRow: React.FC<{ index?: number }> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    if (editing) {
      childNode = (
        <Form.Item style={{ margin: 0 }} name={dataIndex}>
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      );
    } else {
      childNode = (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24, cursor: 'pointer', minHeight: 22 }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
  }

  return <td {...restProps}>{childNode}</td>;
};

// Generate 30 orders so ORD-3017 is on page 2
const generateOrders = (): OrderData[] => {
  const customers = [
    'John Smith', 'Jane Doe', 'Bob Wilson', 'Alice Chen', 'Charlie Brown',
    'Diana Prince', 'Edward Norton', 'Fiona Apple', 'George Lucas', 'Hannah Montana',
  ];
  const orders: OrderData[] = [];
  for (let i = 1; i <= 30; i++) {
    const orderId = `ORD-30${i.toString().padStart(2, '0')}`;
    orders.push({
      key: i.toString(),
      orderId,
      customer: customers[(i - 1) % customers.length],
      amount: Math.floor(Math.random() * 900) + 100,
    });
  }
  return orders;
};

const initialData = generateOrders();

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [dataSource, setDataSource] = useState<OrderData[]>(initialData);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const handleSave = (row: OrderData) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    newData.splice(index, 1, row);
    setDataSource(newData);

    // Check success condition: ORD-3017 Customer = "Mia Rivera"
    if (row.orderId === 'ORD-3017' && row.customer.trim() === 'Mia Rivera' && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', width: 120 },
    { title: 'Customer', dataIndex: 'customer', key: 'customer', editable: true, width: 180 },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 100, render: (v: number) => `$${v}` },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: OrderData) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex as keyof OrderData,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <Card title="All Orders" style={{ width: 450 }}>
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">Summary: 30 orders total, $15,234 revenue</Text>
      </div>
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={mergedColumns as any}
        pagination={{ pageSize: 10 }}
        size="middle"
        data-testid="orders-table"
      />
    </Card>
  );
}
