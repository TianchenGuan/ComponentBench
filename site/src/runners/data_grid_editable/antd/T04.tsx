'use client';

/**
 * data_grid_editable-antd-T04: Toggle paid checkbox in a cell
 *
 * The UI is a single Orders table (Ant Design Table) shown in a centered isolated card.
 * The Paid column is editable and is represented as a checkbox in each row.
 *
 * Details:
 * - Light theme, comfortable spacing, default scale.
 * - One table instance.
 * - The Paid checkbox is part of the table cell content (no separate editor overlay).
 * - Initial state: ORD-1002 is currently unchecked (Paid = No).
 */

import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import { Table, Input, Card, Form, InputNumber, Select, Checkbox } from 'antd';
import type { InputRef, FormInstance } from 'antd';
import type { TaskComponentProps, OrderRow } from '../types';

const EditableContext = createContext<FormInstance | null>(null);

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof OrderRow;
  record: OrderRow;
  handleSave: (record: OrderRow) => void;
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
      if (dataIndex === 'quantity') {
        childNode = (
          <Form.Item style={{ margin: 0 }} name={dataIndex}>
            <InputNumber
              ref={inputRef as any}
              onPressEnter={save}
              onBlur={save}
              min={1}
            />
          </Form.Item>
        );
      } else if (dataIndex === 'status') {
        childNode = (
          <Form.Item style={{ margin: 0 }} name={dataIndex}>
            <Select
              onBlur={save}
              onChange={save}
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'Processing', label: 'Processing' },
                { value: 'Shipped', label: 'Shipped' },
                { value: 'Cancelled', label: 'Cancelled' },
              ]}
            />
          </Form.Item>
        );
      } else {
        childNode = (
          <Form.Item style={{ margin: 0 }} name={dataIndex}>
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
          </Form.Item>
        );
      }
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

// Initial data with ORD-1002 having Paid = false
const initialData: OrderRow[] = [
  { key: '1', orderId: 'ORD-1001', customer: 'John Smith', quantity: 5, status: 'Pending', notes: 'Rush order', paid: true },
  { key: '2', orderId: 'ORD-1002', customer: 'Jane Doe', quantity: 3, status: 'Processing', notes: '', paid: false },
  { key: '3', orderId: 'ORD-1003', customer: 'Bob Johnson', quantity: 10, status: 'Pending', notes: 'Gift wrap', paid: false },
  { key: '4', orderId: 'ORD-1004', customer: 'Alice Brown', quantity: 2, status: 'Shipped', notes: 'Fragile items', paid: true },
  { key: '5', orderId: 'ORD-1005', customer: 'Charlie Wilson', quantity: 7, status: 'Pending', notes: '', paid: false },
  { key: '6', orderId: 'ORD-1006', customer: 'Diana Miller', quantity: 1, status: 'Cancelled', notes: '', paid: false },
  { key: '7', orderId: 'ORD-1007', customer: 'Eve Davis', quantity: 4, status: 'Processing', notes: 'Call before delivery', paid: true },
  { key: '8', orderId: 'ORD-1008', customer: 'Frank Garcia', quantity: 6, status: 'Shipped', notes: '', paid: true },
  { key: '9', orderId: 'ORD-1009', customer: 'Grace Lee', quantity: 8, status: 'Pending', notes: '', paid: false },
  { key: '10', orderId: 'ORD-1010', customer: 'Henry Taylor', quantity: 9, status: 'Processing', notes: 'Priority', paid: false },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [dataSource, setDataSource] = useState<OrderRow[]>(initialData);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const handleSave = (row: OrderRow) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    newData.splice(index, 1, row);
    setDataSource(newData);
  };

  const handlePaidChange = (record: OrderRow, checked: boolean) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => record.key === item.key);
    newData[index] = { ...newData[index], paid: checked };
    setDataSource(newData);

    // Check success condition: ORD-1002 Paid = true
    if (record.orderId === 'ORD-1002' && checked && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', width: 120 },
    { title: 'Customer', dataIndex: 'customer', key: 'customer', editable: true, width: 150 },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', editable: true, width: 100 },
    { title: 'Status', dataIndex: 'status', key: 'status', editable: true, width: 120 },
    { title: 'Notes', dataIndex: 'notes', key: 'notes', editable: true, width: 150 },
    {
      title: 'Paid',
      dataIndex: 'paid',
      key: 'paid',
      width: 80,
      render: (_: boolean, record: OrderRow) => (
        <Checkbox
          checked={record.paid}
          onChange={(e) => handlePaidChange(record, e.target.checked)}
        />
      ),
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: OrderRow) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex as keyof OrderRow,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <Card title="Orders (Editable Cells)" style={{ width: 850 }}>
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
        pagination={false}
        size="middle"
        data-testid="orders-table"
      />
    </Card>
  );
}
