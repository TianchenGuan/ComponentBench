'use client';

/**
 * data_grid_editable-antd-T13: Enter a currency value in the correct table instance
 *
 * This page is a settings panel with two similar cards, each containing an editable Ant Design Table:
 *
 * 1) "Default thresholds" table (Primary) — baseline values (read-only-looking but still editable in some columns).
 * 2) "Overrides" table (Secondary) — per-policy overrides.
 *
 * The task targets the Overrides table only.
 *
 * A small "Reference amount" badge near the Overrides table header displays "$125.50" as a visual reference.
 *
 * Overrides table details:
 * - Columns: Policy ID (read-only key), Region (read-only), Max refund (editable currency), Active (editable checkbox).
 * - The Max refund cell is displayed with a dollar sign and two decimals in view mode (e.g., "$80.00").
 * - Clicking the cell opens an inline input that accepts a number; on commit it formats to "$X.XX".
 * - Commit happens on Enter or blur; there is no separate Save button.
 *
 * Scene configuration:
 * - Light theme, comfortable spacing, default scale.
 * - Two table instances on the page (Default thresholds vs Overrides).
 * - Medium clutter: surrounding toggles and helper text describe the settings but do not affect success.
 *
 * Initial state:
 * - In Overrides, row POL-3 exists and Max refund is not $125.50.
 */

import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import { Table, Card, Form, InputNumber, Checkbox, Tag, Typography, Row, Col, Switch } from 'antd';
import type { FormInstance } from 'antd';
import type { TaskComponentProps, PolicyRow } from '../types';

const { Text, Paragraph } = Typography;

const EditableContext = createContext<FormInstance | null>(null);

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof PolicyRow;
  record: PolicyRow;
  handleSave: (record: PolicyRow) => void;
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
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable && dataIndex === 'maxRefund') {
    if (editing) {
      childNode = (
        <Form.Item style={{ margin: 0 }} name={dataIndex}>
          <InputNumber
            ref={inputRef as any}
            onPressEnter={save}
            onBlur={save}
            min={0}
            precision={2}
            prefix="$"
            style={{ width: 100 }}
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

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

const defaultThresholdsData = [
  { key: '1', policyId: 'DEFAULT-1', region: 'North America', maxRefund: 100.00, active: true },
  { key: '2', policyId: 'DEFAULT-2', region: 'Europe', maxRefund: 85.00, active: true },
  { key: '3', policyId: 'DEFAULT-3', region: 'Asia Pacific', maxRefund: 75.00, active: true },
];

const overridesData: PolicyRow[] = [
  { key: '1', policyId: 'POL-1', region: 'California', maxRefund: 150.00, active: true },
  { key: '2', policyId: 'POL-2', region: 'Texas', maxRefund: 90.00, active: false },
  { key: '3', policyId: 'POL-3', region: 'New York', maxRefund: 80.00, active: true },
  { key: '4', policyId: 'POL-4', region: 'Florida', maxRefund: 95.00, active: true },
];

export default function T13({ task, onSuccess }: TaskComponentProps) {
  const [overrides, setOverrides] = useState<PolicyRow[]>(overridesData);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const handleOverridesSave = (row: PolicyRow) => {
    const newData = [...overrides];
    const index = newData.findIndex((item) => row.key === item.key);
    newData.splice(index, 1, row);
    setOverrides(newData);

    // Check success condition: POL-3 Max refund = 125.50 (with tolerance ±0.01)
    if (row.policyId === 'POL-3' && Math.abs(row.maxRefund - 125.50) < 0.01 && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  };

  const handleActiveChange = (record: PolicyRow, checked: boolean) => {
    const newData = [...overrides];
    const index = newData.findIndex((item) => record.key === item.key);
    newData[index] = { ...newData[index], active: checked };
    setOverrides(newData);
  };

  const defaultColumns = [
    { title: 'Policy ID', dataIndex: 'policyId', key: 'policyId', width: 100 },
    { title: 'Region', dataIndex: 'region', key: 'region', width: 130 },
    { title: 'Max refund', dataIndex: 'maxRefund', key: 'maxRefund', width: 100, render: formatCurrency },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      width: 70,
      render: (val: boolean) => <Checkbox checked={val} disabled />,
    },
  ];

  const overridesColumns = [
    { title: 'Policy ID', dataIndex: 'policyId', key: 'policyId', width: 80 },
    { title: 'Region', dataIndex: 'region', key: 'region', width: 100 },
    {
      title: 'Max refund',
      dataIndex: 'maxRefund',
      key: 'maxRefund',
      editable: true,
      width: 100,
      render: formatCurrency,
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      width: 70,
      render: (_: boolean, record: PolicyRow) => (
        <Checkbox
          checked={record.active}
          onChange={(e) => handleActiveChange(record, e.target.checked)}
        />
      ),
    },
  ];

  const mergedOverridesColumns = overridesColumns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record: PolicyRow) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex as keyof PolicyRow,
        title: col.title,
        handleSave: handleOverridesSave,
      }),
    };
  });

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Paragraph type="secondary">
            Configure refund limits for different regions. Override default thresholds as needed.
          </Paragraph>
          <div style={{ marginBottom: 8 }}>
            <Switch defaultChecked /> <Text type="secondary">Enable automatic refunds</Text>
          </div>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Default thresholds" size="small" data-testid="default-thresholds-table">
            <Table
              bordered
              dataSource={defaultThresholdsData}
              columns={defaultColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Overrides</span>
                <Tag color="blue" data-testid="reference-amount">Reference amount: $125.50</Tag>
              </div>
            }
            size="small"
            data-testid="overrides-table"
          >
            <Table
              components={{
                body: {
                  row: EditableRow,
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={overrides}
              columns={mergedOverridesColumns as any}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
