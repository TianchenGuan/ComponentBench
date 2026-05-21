'use client';

import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import { Table, Select, Card, Form, Tag, Typography } from 'antd';
import type { FormInstance } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface IncidentRow {
  key: string;
  incidentId: string;
  service: string;
  severity: string;
  status: string;
  owner: string;
}

const statusOptions = ['New', 'Investigating', 'Escalated', 'Resolved'];

const initialData: IncidentRow[] = Array.from({ length: 60 }, (_, i) => ({
  key: String(i),
  incidentId: `INC-${220 + i}`,
  service: ['API Gateway', 'Auth Service', 'DB Cluster', 'CDN', 'Scheduler'][i % 5],
  severity: ['P1', 'P2', 'P3', 'P4'][i % 4],
  status: i === 28 ? 'Investigating' : statusOptions[i % 4],
  owner: ['Dana Kim', 'Alex Chen', 'Jordan Lee', 'Priya Shah', 'Mina Ortiz'][i % 5],
}));

const EditableContext = createContext<FormInstance | null>(null);
const EditableRow: React.FC<any> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return <Form form={form} component={false}><EditableContext.Provider value={form}><tr {...props} /></EditableContext.Provider></Form>;
};
const EditableCell: React.FC<any> = ({ editable, dataIndex, record, handleSave, children, ...rest }) => {
  const [editing, setEditing] = useState(false);
  const form = useContext(EditableContext)!;
  const toggle = () => { setEditing(!editing); form.setFieldsValue({ [dataIndex]: record[dataIndex] }); };
  const save = async () => { const v = await form.validateFields(); toggle(); handleSave({ ...record, ...v }); };
  let child = children;
  if (editable && editing) {
    child = <Form.Item name={dataIndex} style={{ margin: 0 }}>
      <Select size="small" onBlur={save} onChange={save} options={statusOptions.map((s) => ({ value: s, label: s }))} />
    </Form.Item>;
  } else if (editable) {
    child = <div style={{ cursor: 'pointer', minHeight: 22 }} onClick={toggle}>{children}</div>;
  }
  return <td {...rest}>{child}</td>;
};

export default function T09({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [data, setData] = useState<IncidentRow[]>(initialData);

  const handleSave = (row: IncidentRow) => {
    const d = [...data]; const idx = d.findIndex((r) => r.key === row.key); d[idx] = row; setData(d);
  };

  useEffect(() => {
    if (successFired.current) return;
    const row = data.find((r) => r.incidentId === 'INC-248');
    if (row && row.status === 'Escalated') { successFired.current = true; onSuccess(); }
  }, [data, onSuccess]);

  const baseCols = [
    { title: 'Incident ID', dataIndex: 'incidentId', width: 100 },
    { title: 'Service', dataIndex: 'service', width: 120 },
    { title: 'Severity', dataIndex: 'severity', width: 80, render: (v: string) => <Tag color={v === 'P1' ? 'red' : v === 'P2' ? 'orange' : 'default'}>{v}</Tag> },
    { title: 'Status', dataIndex: 'status', width: 120, editable: true, render: (v: string) => <Tag>{v}</Tag> },
    { title: 'Owner', dataIndex: 'owner', width: 120 },
  ];
  const columns = baseCols.map((c) => !(c as any).editable ? c : {
    ...c, onCell: (record: IncidentRow) => ({ record, editable: true, dataIndex: c.dataIndex, handleSave }),
    render: undefined,
  });

  return (
    <div style={{ minHeight: '100vh', background: '#141414', padding: 24, color: '#fff' }}>
      <Card size="small" style={{ background: '#1f1f1f', borderColor: '#333', width: 200, marginBottom: 12 }}>
        <Text style={{ color: '#aaa' }}>Active incidents</Text><div style={{ fontSize: 18, color: '#fff' }}>60</div>
      </Card>
      <Card size="small" title="Incidents" style={{ width: 600, background: '#1f1f1f', borderColor: '#333' }}
        styles={{ header: { color: '#fff' }, body: { padding: 0 } }}>
        <Table
          components={{ body: { row: EditableRow, cell: EditableCell } }}
          dataSource={data} columns={columns as any} pagination={false} size="small" bordered
          scroll={{ y: 350 }}
          virtual
        />
      </Card>
    </div>
  );
}
