'use client';

import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import { Table, Select, Card, Form, Tag, Typography } from 'antd';
import type { FormInstance } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface ApprovalRow {
  key: string;
  approvalId: string;
  title: string;
  owner: string;
  reviewer: string;
  escalationTeam: string;
  escalationGroup: string;
}

const groupOptions = ['Core', 'Infra', 'Data', 'Security'];

const initialData: ApprovalRow[] = Array.from({ length: 40 }, (_, i) => ({
  key: String(i),
  approvalId: `AP-${150 + i}`,
  title: `Approval item ${150 + i}`,
  owner: ['Dana Kim', 'Alex Chen', 'Jordan Lee', 'Priya Shah'][i % 4],
  reviewer: ['Sam Rivera', 'Mina Ortiz', 'Liam Torres', 'Nina Park'][i % 4],
  escalationTeam: ['Alpha', 'Beta', 'Gamma', 'Delta'][i % 4],
  escalationGroup: i === 16 ? 'Data' : groupOptions[i % 4],
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
      <Select size="small" onBlur={save} onChange={save} options={groupOptions.map((g) => ({ value: g, label: g }))} />
    </Form.Item>;
  } else if (editable) {
    child = <div style={{ cursor: 'pointer', minHeight: 22 }} onClick={toggle}>{children}</div>;
  }
  return <td {...rest}>{child}</td>;
};

export default function T19({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [data, setData] = useState<ApprovalRow[]>(initialData);

  const handleSave = (row: ApprovalRow) => {
    const d = [...data]; const idx = d.findIndex((r) => r.key === row.key); d[idx] = row; setData(d);
  };

  useEffect(() => {
    if (successFired.current) return;
    const row = data.find((r) => r.approvalId === 'AP-166');
    if (row && row.escalationGroup.trim() === 'Infra') { successFired.current = true; onSuccess(); }
  }, [data, onSuccess]);

  const baseCols = [
    { title: 'Approval ID', dataIndex: 'approvalId', width: 100, fixed: 'left' as const },
    { title: 'Title', dataIndex: 'title', width: 180 },
    { title: 'Owner', dataIndex: 'owner', width: 120 },
    { title: 'Reviewer', dataIndex: 'reviewer', width: 120 },
    { title: 'Escalation team', dataIndex: 'escalationTeam', width: 130 },
    { title: 'Escalation group', dataIndex: 'escalationGroup', width: 140, editable: true },
  ];
  const columns = baseCols.map((c) => !(c as any).editable ? c : {
    ...c, onCell: (record: ApprovalRow) => ({ record, editable: true, dataIndex: c.dataIndex, handleSave }),
  });

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <Card size="small" title="Approvals" style={{ width: 620 }}>
          <Table
            components={{ body: { row: EditableRow, cell: EditableCell } }}
            dataSource={data} columns={columns as any} pagination={false} size="small" bordered
            scroll={{ x: 900, y: 350 }}
          />
        </Card>
        <Card size="small" style={{ width: 200 }}>
          <Text strong>Side panel</Text>
          <div style={{ marginTop: 8 }}><Text type="secondary">Filters, stats, and controls</Text></div>
        </Card>
      </div>
    </div>
  );
}
