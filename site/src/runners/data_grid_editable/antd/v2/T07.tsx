'use client';

import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import { Table, Input, Card, Form, Tag, Typography } from 'antd';
import type { FormInstance } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface RiskRow {
  key: string;
  riskId: string;
  title: string;
  severity: string;
  owner: string;
  reviewer: string;
  escalationGroup: string;
  mitigationOwner: string;
}

const initialData: RiskRow[] = Array.from({ length: 15 }, (_, i) => ({
  key: String(i),
  riskId: `RK-${410 + i}`,
  title: `Risk item ${410 + i}`,
  severity: ['Low', 'Medium', 'High', 'Critical'][i % 4],
  owner: ['Dana Kim', 'Alex Chen', 'Liam Torres', 'Priya Shah'][i % 4],
  reviewer: ['Jordan Lee', 'Mina Ortiz', 'Sam Rivera', 'Nina Park'][i % 4],
  escalationGroup: ['Core', 'Infra', 'Data', 'Security'][i % 4],
  mitigationOwner: i === 7 ? 'Ops' : ['Platform', 'Infra', 'Core', 'Data'][i % 4],
}));

const EditableContext = createContext<FormInstance | null>(null);
const EditableRow: React.FC<any> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return <Form form={form} component={false}><EditableContext.Provider value={form}><tr {...props} /></EditableContext.Provider></Form>;
};
const EditableCell: React.FC<any> = ({ editable, dataIndex, record, handleSave, children, ...rest }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<any>(null);
  const form = useContext(EditableContext)!;
  useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);
  const toggle = () => { setEditing(!editing); form.setFieldsValue({ [dataIndex]: record[dataIndex] }); };
  const save = async () => { const v = await form.validateFields(); toggle(); handleSave({ ...record, ...v }); };
  let child = children;
  if (editable && editing) {
    child = <Form.Item name={dataIndex} style={{ margin: 0 }}><Input ref={inputRef} size="small" onPressEnter={save} onBlur={save} /></Form.Item>;
  } else if (editable) {
    child = <div style={{ cursor: 'pointer', minHeight: 22 }} onClick={toggle}>{children}</div>;
  }
  return <td {...rest}>{child}</td>;
};

export default function T07({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [data, setData] = useState<RiskRow[]>(initialData);

  const handleSave = (row: RiskRow) => {
    const d = [...data]; const idx = d.findIndex((r) => r.key === row.key); d[idx] = row; setData(d);
  };

  useEffect(() => {
    if (successFired.current) return;
    const row = data.find((r) => r.riskId === 'RK-417');
    if (row && row.mitigationOwner.trim() === 'SRE') { successFired.current = true; onSuccess(); }
  }, [data, onSuccess]);

  const baseCols = [
    { title: 'Risk ID', dataIndex: 'riskId', width: 90, fixed: 'left' as const },
    { title: 'Title', dataIndex: 'title', width: 180 },
    { title: 'Severity', dataIndex: 'severity', width: 100, render: (v: string) => <Tag color={v === 'Critical' ? 'red' : v === 'High' ? 'orange' : 'default'}>{v}</Tag> },
    { title: 'Owner', dataIndex: 'owner', width: 130, editable: true },
    { title: 'Reviewer', dataIndex: 'reviewer', width: 130, editable: true },
    { title: 'Escalation group', dataIndex: 'escalationGroup', width: 140, editable: true },
    { title: 'Mitigation owner', dataIndex: 'mitigationOwner', width: 140, editable: true },
  ];

  const columns = baseCols.map((c) => !(c as any).editable ? c : { ...c, onCell: (record: RiskRow) => ({ record, editable: true, dataIndex: c.dataIndex, handleSave }) });

  return (
    <div style={{ padding: 24 }}>
      <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>Risk register — scroll horizontally to see all editable columns</Text>
      <Card size="small" title="Risk register" style={{ width: 650 }}>
        <Table
          components={{ body: { row: EditableRow, cell: EditableCell } }}
          dataSource={data}
          columns={columns as any}
          pagination={false}
          size="small"
          bordered
          scroll={{ x: 1000, y: 400 }}
        />
      </Card>
    </div>
  );
}
