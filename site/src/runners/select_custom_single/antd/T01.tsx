'use client';

/**
 * select_custom_single-antd-T01: Set Department to Marketing
 *
 * Layout: a single centered isolated card titled "Team settings".
 * The card contains one Ant Design Select labeled "Department". The Select is rendered at default size with comfortable spacing.
 * The Select is closed initially and shows the current value "Engineering".
 *
 * When opened, the dropdown appears as a popover under the field with 5 options:
 * Engineering, Marketing, Sales, Support, and Finance. Options are custom-rendered with a small icon to the left of the text,
 * but the option text is still clearly visible.
 *
 * There are no other interactive components on the page besides the Select.
 * Selecting an option applies immediately (no Apply/OK button).
 *
 * Success: The AntD Select labeled "Department" has selected value exactly "Marketing".
 */

import React, { useState } from 'react';
import { Card, Select, Typography, Space } from 'antd';
import {
  CodeOutlined,
  RocketOutlined,
  DollarOutlined,
  CustomerServiceOutlined,
  BankOutlined,
} from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { label: 'Engineering', value: 'Engineering', icon: <CodeOutlined /> },
  { label: 'Marketing', value: 'Marketing', icon: <RocketOutlined /> },
  { label: 'Sales', value: 'Sales', icon: <DollarOutlined /> },
  { label: 'Support', value: 'Support', icon: <CustomerServiceOutlined /> },
  { label: 'Finance', value: 'Finance', icon: <BankOutlined /> },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('Engineering');

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'Marketing') {
      onSuccess();
    }
  };

  return (
    <Card title="Team settings" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Department</Text>
      <Select
        data-testid="department-select"
        style={{ width: '100%' }}
        value={value}
        onChange={handleChange}
        options={options.map(opt => ({
          value: opt.value,
          label: (
            <Space>
              {opt.icon}
              {opt.label}
            </Space>
          ),
        }))}
      />
    </Card>
  );
}
