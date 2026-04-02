'use client';

/**
 * data_grid_editable-antd-T12: Search and select an assignee from a long list
 *
 * The page is a light-theme dashboard with several small cards. The main card contains an Ant Design Table titled "Team Assignments".
 * The layout is more crowded than baseline:
 * - Spacing mode is compact.
 * - The table is rendered in a small scale (reduced font and control size).
 *
 * Table details:
 * - One table instance.
 * - Columns: Task ID (read-only key), Title (read-only), Assignee (editable), Status (read-only).
 * - The Assignee cell uses an Ant Design Select editor with showSearch enabled.
 * - The dropdown contains many names (around 40), so typing is the quickest way to find the right option.
 * - Selecting an option commits immediately (no separate Save button).
 *
 * Clutter/distractors:
 * - Above the table is a small toolbar with non-required buttons (Refresh, Export).
 * - A right sidebar card shows "Team capacity" but does not affect success.
 *
 * Initial state:
 * - TASK-007 exists; its Assignee is not Jordan Lee.
 */

import React, { useState, useContext, createContext } from 'react';
import { Table, Card, Form, Select, Button, Row, Col, Space, Typography, Progress } from 'antd';
import { ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import type { TaskComponentProps, TeamAssignmentRow } from '../types';

const { Text } = Typography;

const EditableContext = createContext<FormInstance | null>(null);

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof TeamAssignmentRow;
  record: TeamAssignmentRow;
  handleSave: (record: TeamAssignmentRow) => void;
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

// Generate 40 team members
const teamMembers = [
  'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Edward Norton',
  'Fiona Apple', 'George Lucas', 'Hannah Montana', 'Ivan Petrov', 'Julia Roberts',
  'Kevin Hart', 'Laura Palmer', 'Michael Scott', 'Nancy Drew', 'Oliver Twist',
  'Patricia Arquette', 'Quentin Tarantino', 'Rachel Green', 'Samuel Jackson', 'Tina Turner',
  'Uma Thurman', 'Victor Hugo', 'Wendy Williams', 'Xavier Woods', 'Yvonne Strahovski',
  'Zachary Quinto', 'Amy Adams', 'Brad Pitt', 'Cate Blanchett', 'Daniel Craig',
  'Emma Stone', 'Frank Sinatra', 'Gal Gadot', 'Hugh Jackman', 'Idris Elba',
  'Jordan Lee', 'Kate Winslet', 'Leonardo DiCaprio', 'Margot Robbie', 'Natalie Portman',
];

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
  const form = useContext(EditableContext)!;

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
          <Select
            showSearch
            autoFocus
            defaultOpen
            onBlur={save}
            onChange={save}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={teamMembers.map((name) => ({ value: name, label: name }))}
            style={{ width: 150 }}
          />
        </Form.Item>
      );
    } else {
      childNode = (
        <div
          className="editable-cell-value-wrap"
          style={{ cursor: 'pointer', minHeight: 22 }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
  }

  return <td {...restProps}>{childNode}</td>;
};

const initialData: TeamAssignmentRow[] = [
  { key: '1', taskId: 'TASK-001', title: 'Design mockups', assignee: 'Alice Johnson', status: 'In Progress' },
  { key: '2', taskId: 'TASK-002', title: 'API integration', assignee: 'Bob Smith', status: 'Done' },
  { key: '3', taskId: 'TASK-003', title: 'Database setup', assignee: 'Charlie Brown', status: 'Done' },
  { key: '4', taskId: 'TASK-004', title: 'Testing', assignee: 'Diana Prince', status: 'Pending' },
  { key: '5', taskId: 'TASK-005', title: 'Documentation', assignee: 'Edward Norton', status: 'In Progress' },
  { key: '6', taskId: 'TASK-006', title: 'Code review', assignee: 'Fiona Apple', status: 'Done' },
  { key: '7', taskId: 'TASK-007', title: 'Bug fixing', assignee: 'George Lucas', status: 'In Progress' },
  { key: '8', taskId: 'TASK-008', title: 'Deployment', assignee: 'Hannah Montana', status: 'Pending' },
];

export default function T12({ task, onSuccess }: TaskComponentProps) {
  const [dataSource, setDataSource] = useState<TeamAssignmentRow[]>(initialData);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const handleSave = (row: TeamAssignmentRow) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    newData.splice(index, 1, row);
    setDataSource(newData);

    // Check success condition: TASK-007 Assignee = "Jordan Lee"
    if (row.taskId === 'TASK-007' && row.assignee.trim() === 'Jordan Lee' && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  };

  const columns = [
    { title: 'Task ID', dataIndex: 'taskId', key: 'taskId', width: 80 },
    { title: 'Title', dataIndex: 'title', key: 'title', width: 120 },
    { title: 'Assignee', dataIndex: 'assignee', key: 'assignee', editable: true, width: 150 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 90 },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record: TeamAssignmentRow) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex as keyof TeamAssignmentRow,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <Row gutter={16}>
      <Col span={18}>
        <Card title="Team Assignments" size="small">
          <Space style={{ marginBottom: 8 }}>
            <Button size="small" icon={<ReloadOutlined />}>Refresh</Button>
            <Button size="small" icon={<ExportOutlined />}>Export</Button>
          </Space>
          <Table
            components={{
              body: {
                row: EditableRow,
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={dataSource}
            columns={mergedColumns as any}
            pagination={false}
            size="small"
            data-testid="assignments-table"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card title="Team capacity" size="small">
          <Text type="secondary">Active members</Text>
          <div style={{ marginTop: 8 }}>
            <Progress percent={75} size="small" />
          </div>
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Available slots: 5</Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
}
