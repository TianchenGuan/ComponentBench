'use client';

import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import { Table, Select, Card, Form, Tag, Button, Space, Typography } from 'antd';
import type { FormInstance } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface AssignmentRow {
  key: string;
  taskId: string;
  title: string;
  assignee: string;
  reviewer: string;
  status: string;
}

const people = [
  'Mia Ortiz', 'Mia Ortega', 'Mia Owen', 'Jordan Lee', 'Jordan Li',
  'Alex Chen', 'Dana Kim', 'Priya Shah', 'Sam Rivera', 'Liam Torres',
  'Nina Park', 'Riley Park', 'Casey Morgan', 'Robin Hayes', 'Jamie Cruz',
];

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
      <Select showSearch size="small" style={{ width: '100%' }} onBlur={save} onChange={save}
        options={people.map((p) => ({ value: p, label: p }))}
        filterOption={(input, opt) => (opt?.label as string).toLowerCase().includes(input.toLowerCase())} />
    </Form.Item>;
  } else if (editable) {
    child = <div style={{ cursor: 'pointer', minHeight: 22 }} onClick={toggle}>{children}</div>;
  }
  return <td {...rest}>{child}</td>;
};

const makeRows = (prefix: string, offset: number): AssignmentRow[] => [
  { key: `${offset}`, taskId: `ASG-${40 + offset}`, title: 'Deploy monitoring', assignee: 'Dana Kim', reviewer: 'Alex Chen', status: 'Open' },
  { key: `${offset + 1}`, taskId: `ASG-${41 + offset}`, title: 'Rotate credentials', assignee: 'Liam Torres', reviewer: 'Priya Shah', status: 'In progress' },
  { key: `${offset + 2}`, taskId: `ASG-${42 + offset}`, title: 'Update firewall rules', assignee: 'Sam Rivera', reviewer: 'Jordan Lee', status: 'Open' },
  { key: `${offset + 3}`, taskId: `ASG-${43 + offset}`, title: 'Review SOC reports', assignee: 'Nina Park', reviewer: 'Dana Kim', status: 'Blocked' },
  { key: `${offset + 4}`, taskId: `ASG-${44 + offset}`, title: 'Patch CVE-2026-1234', assignee: 'Riley Park', reviewer: 'Mia Owen', status: 'Open' },
  { key: `${offset + 5}`, taskId: `ASG-${45 + offset}`, title: 'Capacity planning Q4', assignee: 'Casey Morgan', reviewer: 'Sam Rivera', status: 'In progress' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [eastData] = useState<AssignmentRow[]>(makeRows('East', 0));
  const [westData, setWestData] = useState<AssignmentRow[]>(makeRows('West', 4));
  const [westCommitted, setWestCommitted] = useState<AssignmentRow[]>(makeRows('West', 4));

  const handleWestSave = (row: AssignmentRow) => {
    const d = [...westData];
    const idx = d.findIndex((r) => r.key === row.key);
    d[idx] = row;
    setWestData(d);
  };

  const applyWest = () => { setWestCommitted([...westData]); };

  useEffect(() => {
    if (successFired.current) return;
    const row = westCommitted.find((r) => r.taskId === 'ASG-44');
    if (row && row.assignee.trim() === 'Mia Ortiz') { successFired.current = true; onSuccess(); }
  }, [westCommitted, onSuccess]);

  const makeCols = (handleSave: (r: AssignmentRow) => void) => {
    const base = [
      { title: 'Task ID', dataIndex: 'taskId', width: 90 },
      { title: 'Title', dataIndex: 'title', width: 160 },
      { title: 'Assignee', dataIndex: 'assignee', width: 130, editable: true },
      { title: 'Reviewer', dataIndex: 'reviewer', width: 120 },
      { title: 'Status', dataIndex: 'status', width: 100, render: (v: string) => <Tag>{v}</Tag> },
    ];
    return base.map((c) => !c.editable ? c : { ...c, onCell: (record: AssignmentRow) => ({ record, editable: true, dataIndex: c.dataIndex, handleSave }) });
  };

  const comps = { body: { row: EditableRow, cell: EditableCell } };

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 12 }}><Tag color="purple">Staffing</Tag><Text type="secondary">Pager: on-call rotation active</Text></Space>
      <div style={{ display: 'flex', gap: 16 }}>
        <Card size="small" title="East region assignments" style={{ flex: 1 }}>
          <Table components={comps} dataSource={eastData} columns={makeCols(() => {}) as any} pagination={false} size="small" bordered />
          <Button size="small" style={{ marginTop: 8 }}>Apply East changes</Button>
        </Card>
        <Card size="small" title="West region assignments" style={{ flex: 1 }}>
          <Table components={comps} dataSource={westData} columns={makeCols(handleWestSave) as any} pagination={false} size="small" bordered />
          <Button size="small" type="primary" style={{ marginTop: 8 }} onClick={applyWest}>Apply West changes</Button>
        </Card>
      </div>
      <Card size="small" style={{ marginTop: 12, width: 300 }}><Text type="secondary">Activity feed: 3 new events…</Text></Card>
    </div>
  );
}
