'use client';

/**
 * data_grid_editable-antd-T09: Edit the correct table when two grids are present
 *
 * The page uses a dashboard layout with two cards shown side-by-side:
 *
 * 1) Left card: "Orders" — an editable Ant Design Table of recent orders.
 * 2) Right card: "Returns" — an editable Ant Design Table of return requests.
 *
 * Both tables share a similar look and both support inline editable cells. This task targets the Returns table only.
 *
 * Returns table details:
 * - Columns: Return ID (read-only key), Reason (read-only), Status (editable select), Notes (editable text).
 * - Editing Status opens a dropdown list with options: Requested, Under Review, Approved, Denied.
 * - Changes commit immediately on selection (no separate Save button).
 *
 * Clutter:
 * - The dashboard also contains a small metrics strip (Total Orders / Total Returns) above the two cards.
 *
 * Initial state:
 * - In the Returns table, RET-1002 exists and its Status is not "Approved".
 */

import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import { Table, Input, Card, Form, Select, Row, Col, Statistic } from 'antd';
import type { InputRef, FormInstance } from 'antd';
import type { TaskComponentProps, ReturnsRow } from '../types';

const EditableContext = createContext<FormInstance | null>(null);

// Order type for the Orders table
interface OrderData {
  key: string;
  orderId: string;
  customer: string;
  amount: number;
}

interface EditableCellProps<T> {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof T;
  record: T;
  handleSave: (record: T) => void;
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

// Returns table editable cell
const ReturnsEditableCell: React.FC<EditableCellProps<ReturnsRow>> = ({
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
      if (dataIndex === 'status') {
        childNode = (
          <Form.Item style={{ margin: 0 }} name={dataIndex}>
            <Select
              autoFocus
              defaultOpen
              onBlur={save}
              onChange={save}
              options={[
                { value: 'Requested', label: 'Requested' },
                { value: 'Under Review', label: 'Under Review' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Denied', label: 'Denied' },
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

// Orders table editable cell
const OrdersEditableCell: React.FC<EditableCellProps<OrderData>> = ({
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

const ordersData: OrderData[] = [
  { key: '1', orderId: 'ORD-5001', customer: 'John Smith', amount: 250 },
  { key: '2', orderId: 'ORD-5002', customer: 'Jane Doe', amount: 180 },
  { key: '3', orderId: 'ORD-5003', customer: 'Bob Wilson', amount: 420 },
];

const returnsData: ReturnsRow[] = [
  { key: '1', returnId: 'RET-1001', reason: 'Defective', status: 'Under Review', notes: '' },
  { key: '2', returnId: 'RET-1002', reason: 'Wrong item', status: 'Requested', notes: 'Customer wants exchange' },
  { key: '3', returnId: 'RET-1003', reason: 'Changed mind', status: 'Denied', notes: '' },
  { key: '4', returnId: 'RET-1004', reason: 'Damaged in shipping', status: 'Approved', notes: 'Refund processed' },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [orders, setOrders] = useState<OrderData[]>(ordersData);
  const [returns, setReturns] = useState<ReturnsRow[]>(returnsData);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const handleOrdersSave = (row: OrderData) => {
    const newData = [...orders];
    const index = newData.findIndex((item) => row.key === item.key);
    newData.splice(index, 1, row);
    setOrders(newData);
  };

  const handleReturnsSave = (row: ReturnsRow) => {
    const newData = [...returns];
    const index = newData.findIndex((item) => row.key === item.key);
    newData.splice(index, 1, row);
    setReturns(newData);

    // Check success condition: RET-1002 Status = "Approved"
    if (row.returnId === 'RET-1002' && row.status === 'Approved' && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  };

  const ordersColumns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', width: 100 },
    { title: 'Customer', dataIndex: 'customer', key: 'customer', editable: true, width: 120 },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 80, render: (v: number) => `$${v}` },
  ];

  const returnsColumns = [
    { title: 'Return ID', dataIndex: 'returnId', key: 'returnId', width: 100 },
    { title: 'Reason', dataIndex: 'reason', key: 'reason', width: 120 },
    { title: 'Status', dataIndex: 'status', key: 'status', editable: true, width: 120 },
    { title: 'Notes', dataIndex: 'notes', key: 'notes', editable: true, width: 150 },
  ];

  const mergedOrdersColumns = ordersColumns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record: OrderData) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex as keyof OrderData,
        title: col.title,
        handleSave: handleOrdersSave,
      }),
    };
  });

  const mergedReturnsColumns = returnsColumns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record: ReturnsRow) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex as keyof ReturnsRow,
        title: col.title,
        handleSave: handleReturnsSave,
      }),
    };
  });

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Statistic title="Total Orders" value={orders.length} />
        </Col>
        <Col span={12}>
          <Statistic title="Total Returns" value={returns.length} />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Orders" size="small" data-testid="orders-table">
            <Table
              components={{
                body: {
                  row: EditableRow,
                  cell: OrdersEditableCell,
                },
              }}
              bordered
              dataSource={orders}
              columns={mergedOrdersColumns as any}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Returns" size="small" data-testid="returns-table">
            <Table
              components={{
                body: {
                  row: EditableRow,
                  cell: ReturnsEditableCell,
                },
              }}
              bordered
              dataSource={returns}
              columns={mergedReturnsColumns as any}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
