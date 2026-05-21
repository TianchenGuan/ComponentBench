'use client';

/**
 * data_grid_editable-antd-T10: Match a priority value to a visual reference chip
 *
 * This page is a settings-style panel with two sections:
 *
 * Left: a "Reference" card that shows a single Priority chip (a colored Tag). The chip label is clearly visible (e.g., "High", "Medium", or "Low") and its color reinforces the meaning.
 *
 * Right: an editable Ant Design Table titled "Support Tickets".
 * - Columns: Ticket ID (read-only key), Subject (read-only), Priority (editable), Owner (read-only).
 * - The Priority cell is displayed as a colored Tag in view mode.
 * - When you click a Priority cell, it becomes a Select editor with the options Low, Medium, High.
 *
 * Scene configuration:
 * - Light theme; comfortable spacing; default scale.
 * - One table instance.
 * - Low clutter: a couple of explanatory sentences above the table; no other interactive controls required.
 *
 * Initial state:
 * - Ticket TCK-1021 exists and its Priority does not match the Reference chip.
 */

import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import { Table, Card, Form, Select, Tag, Row, Col, Typography } from 'antd';
import type { FormInstance } from 'antd';
import type { TaskComponentProps, TicketRow } from '../types';

const { Text, Paragraph } = Typography;

const EditableContext = createContext<FormInstance | null>(null);

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof TicketRow;
  record: TicketRow;
  handleSave: (record: TicketRow) => void;
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
            autoFocus
            defaultOpen
            onBlur={save}
            onChange={save}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
            ]}
          />
        </Form.Item>
      );
    } else {
      childNode = (
        <div
          className="editable-cell-value-wrap"
          style={{ cursor: 'pointer' }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
  }

  return <td {...restProps}>{childNode}</td>;
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'red';
    case 'Medium':
      return 'orange';
    case 'Low':
      return 'green';
    default:
      return 'default';
  }
};

// Reference priority - the target that TCK-1021 should match
const REFERENCE_PRIORITY: 'Low' | 'Medium' | 'High' = 'High';

const initialData: TicketRow[] = [
  { key: '1', ticketId: 'TCK-1020', subject: 'Login issue', priority: 'High', owner: 'Alice' },
  { key: '2', ticketId: 'TCK-1021', subject: 'Performance problem', priority: 'Low', owner: 'Bob' },
  { key: '3', ticketId: 'TCK-1022', subject: 'Feature request', priority: 'Low', owner: 'Charlie' },
  { key: '4', ticketId: 'TCK-1023', subject: 'Bug report', priority: 'Medium', owner: 'Diana' },
];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [dataSource, setDataSource] = useState<TicketRow[]>(initialData);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const handleSave = (row: TicketRow) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    newData.splice(index, 1, row);
    setDataSource(newData);

    // Check success condition: TCK-1021 Priority = REFERENCE_PRIORITY
    if (row.ticketId === 'TCK-1021' && row.priority === REFERENCE_PRIORITY && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  };

  const columns = [
    { title: 'Ticket ID', dataIndex: 'ticketId', key: 'ticketId', width: 100 },
    { title: 'Subject', dataIndex: 'subject', key: 'subject', width: 180 },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      editable: true,
      width: 100,
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
    },
    { title: 'Owner', dataIndex: 'owner', key: 'owner', width: 100 },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record: TicketRow) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex as keyof TicketRow,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <Row gutter={24}>
      <Col span={6}>
        <Card title="Reference" size="small">
          <Paragraph type="secondary">
            Target priority level:
          </Paragraph>
          <Tag color={getPriorityColor(REFERENCE_PRIORITY)} data-testid="priority-reference">
            {REFERENCE_PRIORITY}
          </Tag>
        </Card>
      </Col>
      <Col span={18}>
        <Card title="Support Tickets" size="small">
          <Paragraph type="secondary" style={{ marginBottom: 16 }}>
            Click on a Priority cell to change its value. Match the priority for TCK-1021 to the reference.
          </Paragraph>
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
            size="middle"
            data-testid="tickets-table"
          />
        </Card>
      </Col>
    </Row>
  );
}
