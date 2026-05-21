'use client';

import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import { Table, Input, DatePicker, Card, Button, Modal, Form, Space, Typography } from 'antd';
import type { FormInstance } from 'antd';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface DeliveryRow {
  key: string;
  orderId: string;
  destination: string;
  dueDate: string;
  notes: string;
}

const initialData: DeliveryRow[] = [
  { key: '1', orderId: 'ORD-4100', destination: 'New York, NY', dueDate: '2026-04-01', notes: 'Fragile' },
  { key: '2', orderId: 'ORD-4101', destination: 'Los Angeles, CA', dueDate: '2026-04-10', notes: '' },
  { key: '3', orderId: 'ORD-4102', destination: 'Chicago, IL', dueDate: '2026-02-28', notes: 'Rush delivery' },
  { key: '4', orderId: 'ORD-4103', destination: 'Seattle, WA', dueDate: '2026-05-15', notes: '' },
  { key: '5', orderId: 'ORD-4104', destination: 'Miami, FL', dueDate: '2026-03-20', notes: 'Call ahead' },
];

const EditableContext = createContext<FormInstance | null>(null);
const EditableRow: React.FC<any> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return <Form form={form} component={false}><EditableContext.Provider value={form}><tr {...props} /></EditableContext.Provider></Form>;
};

const EditableCell: React.FC<any> = ({ editable, dataIndex, record, handleSave, children, ...rest }) => {
  const [editing, setEditing] = useState(false);
  const form = useContext(EditableContext)!;
  const toggle = () => { setEditing(!editing); form.setFieldsValue({ [dataIndex]: dataIndex === 'dueDate' ? dayjs(record[dataIndex]) : record[dataIndex] }); };
  const save = async () => {
    const vals = await form.validateFields();
    if (vals.dueDate && dayjs.isDayjs(vals.dueDate)) vals.dueDate = vals.dueDate.format('YYYY-MM-DD');
    toggle();
    handleSave({ ...record, ...vals });
  };

  let child = children;
  if (editable && editing) {
    if (dataIndex === 'dueDate') {
      child = <Form.Item name={dataIndex} style={{ margin: 0 }}>
        <DatePicker needConfirm onOk={save} size="small" />
      </Form.Item>;
    } else {
      child = <Form.Item name={dataIndex} style={{ margin: 0 }}>
        <Input size="small" onPressEnter={save} onBlur={save} />
      </Form.Item>;
    }
  } else if (editable) {
    child = <div style={{ cursor: 'pointer', minHeight: 22 }} onClick={toggle}>{children}</div>;
  }
  return <td {...rest}>{child}</td>;
};

export default function T05({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState<DeliveryRow[]>(initialData);
  const [committed, setCommitted] = useState<DeliveryRow[]>(initialData);

  const handleSave = (row: DeliveryRow) => {
    const d = [...data]; const idx = d.findIndex((r) => r.key === row.key); d[idx] = row; setData(d);
  };

  const handleApply = () => { setCommitted([...data]); setModalOpen(false); };

  useEffect(() => {
    if (successFired.current) return;
    const row = committed.find((r) => r.orderId === 'ORD-4102');
    if (row && row.dueDate === '2026-03-15' && !modalOpen) { successFired.current = true; onSuccess(); }
  }, [committed, modalOpen, onSuccess]);

  const baseCols = [
    { title: 'Order ID', dataIndex: 'orderId', width: 110 },
    { title: 'Destination', dataIndex: 'destination', width: 150 },
    { title: 'Due date', dataIndex: 'dueDate', width: 140, editable: true },
    { title: 'Notes', dataIndex: 'notes', width: 150, editable: true },
  ];
  const columns = baseCols.map((c) => !c.editable ? c : { ...c, onCell: (record: DeliveryRow) => ({ record, editable: true, dataIndex: c.dataIndex, handleSave }) });

  return (
    <div style={{ minHeight: '100vh', background: '#141414', padding: 24, color: '#fff' }}>
      <Card style={{ background: '#1f1f1f', borderColor: '#333', maxWidth: 400, marginBottom: 16 }}>
        <Text style={{ color: '#aaa' }}>Delivery settings</Text>
        <div style={{ marginTop: 12 }}>
          <Button type="primary" onClick={() => setModalOpen(true)}>Edit delivery schedule</Button>
        </div>
      </Card>
      <Modal title="Delivery" open={modalOpen} onCancel={() => { setData([...committed]); setModalOpen(false); }}
        footer={<Space><Button onClick={() => { setData([...committed]); setModalOpen(false); }}>Cancel</Button><Button type="primary" onClick={handleApply}>Apply changes</Button></Space>}
        width={660}>
        <Table
          components={{ body: { row: EditableRow, cell: EditableCell } }}
          dataSource={data} columns={columns as any} pagination={false} size="small" bordered
        />
      </Modal>
    </div>
  );
}
