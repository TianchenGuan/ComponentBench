'use client';

/**
 * data_grid_editable-antd-T11: Edit a date cell in a modal and apply changes
 *
 * The page is a dark-theme settings page with a single primary button labeled "Edit delivery schedule".
 * Clicking this button opens an Ant Design Modal dialog (modal flow). The modal contains an editable table titled "Delivery".
 *
 * Modal/table details:
 * - Theme: dark (both the underlying page and the modal).
 * - The table uses inline editable cells.
 * - Columns: Order ID (read-only key), Destination (read-only), Due date (editable date), Notes (editable text).
 * - Editing Due date opens an Ant Design DatePicker popover anchored to the cell. The date picker includes a calendar grid and an "OK" button.
 *
 * Confirmation:
 * - Changes are only finalized when you click the modal footer button "Apply changes".
 * - Clicking the modal close icon or "Cancel" discards changes.
 *
 * Initial state:
 * - Row ORD-4102 exists; its Due date is not March 15, 2026.
 */

import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import { Table, Card, Form, Input, Button, Modal, DatePicker, ConfigProvider, theme } from 'antd';
import type { FormInstance } from 'antd';
import type { TaskComponentProps, DeliveryRow } from '../types';
import dayjs from 'dayjs';

const EditableContext = createContext<FormInstance | null>(null);

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof DeliveryRow;
  record: DeliveryRow;
  handleSave: (record: DeliveryRow) => void;
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
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    if (dataIndex === 'dueDate') {
      form.setFieldsValue({ [dataIndex]: record[dataIndex] ? dayjs(record[dataIndex]) : null });
    } else {
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    }
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      if (dataIndex === 'dueDate' && values[dataIndex]) {
        values[dataIndex] = values[dataIndex].format('YYYY-MM-DD');
      }
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    if (editing) {
      if (dataIndex === 'dueDate') {
        childNode = (
          <Form.Item style={{ margin: 0 }} name={dataIndex}>
            <DatePicker
              autoFocus
              open
              onChange={save}
              getPopupContainer={(trigger) => trigger.parentElement || document.body}
            />
          </Form.Item>
        );
      } else {
        childNode = (
          <Form.Item style={{ margin: 0 }} name={dataIndex}>
            <Input ref={inputRef as any} onPressEnter={save} onBlur={save} />
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

const initialData: DeliveryRow[] = [
  { key: '1', orderId: 'ORD-4101', destination: 'New York, NY', dueDate: '2026-03-10', notes: '' },
  { key: '2', orderId: 'ORD-4102', destination: 'Los Angeles, CA', dueDate: '2026-03-20', notes: 'Express shipping' },
  { key: '3', orderId: 'ORD-4103', destination: 'Chicago, IL', dueDate: '2026-03-25', notes: '' },
  { key: '4', orderId: 'ORD-4104', destination: 'Houston, TX', dueDate: '2026-04-01', notes: 'Fragile' },
];

export default function T11({ task, onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState<DeliveryRow[]>(initialData);
  const [pendingData, setPendingData] = useState<DeliveryRow[]>(initialData);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const showModal = () => {
    setPendingData([...dataSource]);
    setIsModalOpen(true);
  };

  const handleApply = () => {
    setDataSource(pendingData);
    setIsModalOpen(false);

    // Check success condition: ORD-4102 Due date = 2026-03-15
    const targetRow = pendingData.find((r) => r.orderId === 'ORD-4102');
    if (targetRow && targetRow.dueDate === '2026-03-15' && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSave = (row: DeliveryRow) => {
    const newData = [...pendingData];
    const index = newData.findIndex((item) => row.key === item.key);
    newData.splice(index, 1, row);
    setPendingData(newData);
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', width: 100 },
    { title: 'Destination', dataIndex: 'destination', key: 'destination', width: 150 },
    { title: 'Due date', dataIndex: 'dueDate', key: 'dueDate', editable: true, width: 150 },
    { title: 'Notes', dataIndex: 'notes', key: 'notes', editable: true, width: 150 },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record: DeliveryRow) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex as keyof DeliveryRow,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <Card
        style={{
          width: 400,
          background: '#1f1f1f',
          borderColor: '#333',
        }}
      >
        <div style={{ marginBottom: 16, color: '#ccc' }}>
          Manage your delivery schedule settings here.
        </div>
        <Button type="primary" onClick={showModal}>
          Edit delivery schedule
        </Button>
        <div style={{ marginTop: 16 }}>
          <Button disabled>Export settings</Button>
        </div>
      </Card>

      <Modal
        title="Edit delivery schedule"
        open={isModalOpen}
        onOk={handleApply}
        onCancel={handleCancel}
        okText="Apply changes"
        cancelText="Cancel"
        width={650}
        data-testid="edit-delivery-schedule"
      >
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
          <div style={{ marginBottom: 16, color: '#999' }}>
            Delivery
          </div>
          <Table
            components={{
              body: {
                row: EditableRow,
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={pendingData}
            columns={mergedColumns as any}
            pagination={false}
            size="small"
            data-testid="delivery-table"
          />
        </ConfigProvider>
      </Modal>
    </ConfigProvider>
  );
}
