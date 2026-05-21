'use client';

import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import { Table, Select, Card, Form, Tag, Space, Typography } from 'antd';
import type { FormInstance } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface AssignmentRow {
  key: string;
  taskId: string;
  title: string;
  assignee: string;
  status: string;
  queue: string;
}

const people = [
  'Jordan Lee', 'Jordan Li', 'Jordan Levin', 'Jordan Lewis',
  'Alex Chen', 'Alex Chang', 'Dana Kim', 'Dana King',
  'Mina Patel', 'Mina Ortiz', 'Priya Shah', 'Liam Torres',
  'Sam Rivera', 'Nina Park', 'Riley Park', 'Casey Morgan',
  'Taylor Swift', 'Morgan Blake', 'Robin Hayes', 'Jamie Cruz',
];

const EditableContext = createContext<FormInstance | null>(null);

const EditableRow: React.FC<{ index?: number }> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}><tr {...props} /></EditableContext.Provider>
    </Form>
  );
};

const EditableCell: React.FC<any> = ({ editable, dataIndex, record, handleSave, children, ...restProps }) => {
  const [editing, setEditing] = useState(false);
  const form = useContext(EditableContext)!;

  const toggleEdit = () => { setEditing(!editing); form.setFieldsValue({ [dataIndex]: record[dataIndex] }); };
  const save = async () => { const vals = await form.validateFields(); toggleEdit(); handleSave({ ...record, ...vals }); };

  let childNode = children;
  if (editable && editing) {
    childNode = (
      <Form.Item name={dataIndex} style={{ margin: 0 }}>
        <Select showSearch size="small" style={{ width: '100%' }} onBlur={save} onChange={save}
          options={people.map((p) => ({ value: p, label: p }))}
          filterOption={(input, option) => (option?.label as string).toLowerCase().includes(input.toLowerCase())}
        />
      </Form.Item>
    );
  } else if (editable) {
    childNode = <div style={{ cursor: 'pointer', minHeight: 22 }} onClick={toggleEdit}>{children}</div>;
  }
  return <td {...restProps}>{childNode}</td>;
};

const initialData: AssignmentRow[] = [
  { key: '1', taskId: 'TASK-205', title: 'Update auth module', assignee: 'Dana Kim', status: 'In progress', queue: 'Backend' },
  { key: '2', taskId: 'TASK-206', title: 'Fix navbar overflow', assignee: 'Alex Chen', status: 'Open', queue: 'Frontend' },
  { key: '3', taskId: 'TASK-207', title: 'Add rate limiter', assignee: 'Liam Torres', status: 'Open', queue: 'Backend' },
  { key: '4', taskId: 'TASK-208', title: 'Write E2E tests', assignee: 'Mina Patel', status: 'In progress', queue: 'QA' },
  { key: '5', taskId: 'TASK-209', title: 'Deploy staging v2', assignee: 'Sam Rivera', status: 'Blocked', queue: 'DevOps' },
  { key: '6', taskId: 'TASK-210', title: 'Review PR #491', assignee: 'Jordan Li', status: 'Open', queue: 'Backend' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [data, setData] = useState<AssignmentRow[]>(initialData);

  const handleSave = (row: AssignmentRow) => {
    const newData = [...data];
    const idx = newData.findIndex((item) => item.key === row.key);
    newData[idx] = row;
    setData(newData);
  };

  useEffect(() => {
    if (successFired.current) return;
    const row = data.find((r) => r.taskId === 'TASK-207');
    if (row && row.assignee.trim() === 'Jordan Lee') {
      successFired.current = true;
      onSuccess();
    }
  }, [data, onSuccess]);

  const baseColumns = [
    { title: 'Task ID', dataIndex: 'taskId', width: 100 },
    { title: 'Title', dataIndex: 'title', width: 180 },
    { title: 'Assignee', dataIndex: 'assignee', width: 150, editable: true },
    { title: 'Status', dataIndex: 'status', width: 110, render: (v: string) => <Tag>{v}</Tag> },
    { title: 'Queue', dataIndex: 'queue', width: 100 },
  ];

  const columns = baseColumns.map((col) =>
    !col.editable ? col : { ...col, onCell: (record: AssignmentRow) => ({ record, editable: true, dataIndex: col.dataIndex, handleSave }) }
  );

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 12 }}><Tag color="blue">Sprint 14</Tag><Tag>6 tasks</Tag><Text type="secondary">Capacity: 80%</Text></Space>
      <Card size="small" title="Team assignments" style={{ width: 660 }}>
        <Table
          components={{ body: { row: EditableRow, cell: EditableCell } }}
          dataSource={data}
          columns={columns as any}
          pagination={false}
          size="small"
          bordered
        />
      </Card>
    </div>
  );
}
