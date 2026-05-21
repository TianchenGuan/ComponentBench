'use client';

/**
 * data_grid_editable-antd-T07: Set validated quantity in compact table
 *
 * The page shows a single Ant Design Table inside a centered isolated card titled "Inventory (Validated)".
 * This table uses inline editable cells.
 *
 * Key configuration:
 * - Spacing mode is compact (tighter row height and smaller padding), which makes cell targets closer together.
 * - Scale is default; theme is light.
 * - One table instance.
 * - Columns: SKU (read-only key), Item (read-only), Quantity (editable number with validation), Location (read-only).
 * - Quantity editing uses an InputNumber editor with validation rules: it must be an integer from 1 to 99. Invalid values show a red validation message below the input and are not committed.
 *
 * Initial state:
 * - Row SKU-118 exists and its Quantity is not 7.
 */

import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import { Table, Card, Form, InputNumber } from 'antd';
import type { FormInstance } from 'antd';
import type { TaskComponentProps, InventoryRow } from '../types';

const EditableContext = createContext<FormInstance | null>(null);

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof InventoryRow;
  record: InventoryRow;
  handleSave: (record: InventoryRow) => void;
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
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      // Validation failed, stay in edit mode
      console.log('Validation failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    if (editing) {
      childNode = (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[
            { required: true, message: 'Required' },
            { type: 'number', min: 1, max: 99, message: 'Must be 1-99' },
          ]}
        >
          <InputNumber
            ref={inputRef as any}
            onPressEnter={save}
            onBlur={save}
            min={1}
            max={99}
            precision={0}
          />
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

const initialData: InventoryRow[] = [
  { key: '1', sku: 'SKU-115', item: 'Widget A', quantity: 25, location: 'Warehouse 1' },
  { key: '2', sku: 'SKU-116', item: 'Widget B', quantity: 12, location: 'Warehouse 2' },
  { key: '3', sku: 'SKU-117', item: 'Gadget X', quantity: 8, location: 'Warehouse 1' },
  { key: '4', sku: 'SKU-118', item: 'Gadget Y', quantity: 15, location: 'Warehouse 3' },
  { key: '5', sku: 'SKU-119', item: 'Tool Pro', quantity: 42, location: 'Warehouse 2' },
  { key: '6', sku: 'SKU-120', item: 'Tool Basic', quantity: 67, location: 'Warehouse 1' },
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [dataSource, setDataSource] = useState<InventoryRow[]>(initialData);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const handleSave = (row: InventoryRow) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    newData.splice(index, 1, row);
    setDataSource(newData);

    // Check success condition: SKU-118 Quantity = 7
    if (row.sku === 'SKU-118' && row.quantity === 7 && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  };

  const columns = [
    { title: 'SKU', dataIndex: 'sku', key: 'sku', width: 100 },
    { title: 'Item', dataIndex: 'item', key: 'item', width: 150 },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', editable: true, width: 100 },
    { title: 'Location', dataIndex: 'location', key: 'location', width: 150 },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: InventoryRow) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex as keyof InventoryRow,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <Card title="Inventory (Validated)" style={{ width: 550 }}>
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={mergedColumns as any}
        pagination={false}
        size="small"
        data-testid="inventory-table"
      />
    </Card>
  );
}
