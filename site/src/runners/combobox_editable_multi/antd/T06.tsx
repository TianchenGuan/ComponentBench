'use client';

/**
 * combobox_editable_multi-antd-T06: Stakeholder departments in a form
 *
 * Layout is a "Project intake" form section (not a single isolated card). The target combobox appears mid-page in a typical form.
 * - Target field label: "Stakeholder departments"
 * - Ant Design Select in tags mode with showSearch enabled and allowClear enabled.
 * - Initial selected tags: "Design" and "Product"
 * - Options list includes ~12 departments with similar names (Design, Product, Data, Legal, Security, Sales, Support, Finance, HR, Marketing, Operations, IT).
 * Clutter/distractors:
 * - Above: Text input "Project name", a DatePicker "Kickoff date", and a Switch "Requires approval".
 * - Below: a textarea "Notes" and two buttons "Cancel" and "Submit" (buttons do nothing for success).
 * To succeed, the field must end with exactly Design, Legal, and Security (Product must be removed).
 *
 * Success: Selected values equal {Design, Legal, Security} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Typography, Input, DatePicker, Switch, Button, Space } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;
const { TextArea } = Input;

const options = [
  { value: 'Design', label: 'Design' },
  { value: 'Product', label: 'Product' },
  { value: 'Data', label: 'Data' },
  { value: 'Legal', label: 'Legal' },
  { value: 'Security', label: 'Security' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Support', label: 'Support' },
  { value: 'Finance', label: 'Finance' },
  { value: 'HR', label: 'HR' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Operations', label: 'Operations' },
  { value: 'IT', label: 'IT' },
];

const TARGET_SET = ['Design', 'Legal', 'Security'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>(['Design', 'Product']);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Project intake" style={{ width: 500 }}>
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Project name</Text>
        <Input placeholder="Enter project name" />
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Kickoff date</Text>
        <DatePicker style={{ width: '100%' }} />
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Requires approval</Text>
        <Switch />
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Stakeholder departments</Text>
        <Select
          data-testid="stakeholder-departments"
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Select departments"
          value={value}
          onChange={setValue}
          options={options}
          showSearch
          allowClear
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Notes</Text>
        <TextArea rows={3} placeholder="Additional notes" />
      </div>
      
      <Space>
        <Button>Cancel</Button>
        <Button type="primary">Submit</Button>
      </Space>
    </Card>
  );
}
