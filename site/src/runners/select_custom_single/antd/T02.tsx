'use client';

/**
 * select_custom_single-antd-T02: Clear the Project selection
 *
 * Layout: centered isolated card titled "New ticket".
 * The card contains one Ant Design Select labeled "Project", rendered at default size with comfortable spacing.
 *
 * Initial state: the Select currently has value "Apollo". The component has allowClear enabled:
 * when hovered, a small clear (×) icon appears inside the input on the right side (before the dropdown arrow).
 * The placeholder text is "Select a project".
 *
 * Dropdown options (when opened) include: Apollo, Borealis, Cassini, and Delta. However, the task is to clear the value,
 * not to switch to another project.
 *
 * Feedback: clearing immediately removes the selected text and shows the placeholder; no Apply/OK button.
 * No other similar components are present.
 *
 * Success: The AntD Select labeled "Project" has no selected value (cleared / null).
 */

import React, { useState } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { label: 'Apollo', value: 'Apollo' },
  { label: 'Borealis', value: 'Borealis' },
  { label: 'Cassini', value: 'Cassini' },
  { label: 'Delta', value: 'Delta' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>('Apollo');

  const handleChange = (newValue: string | undefined) => {
    setValue(newValue);
    if (newValue === undefined || newValue === null) {
      onSuccess();
    }
  };

  const handleClear = () => {
    setValue(undefined);
    onSuccess();
  };

  return (
    <Card title="New ticket" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Project</Text>
      <Select
        data-testid="project-select"
        style={{ width: '100%' }}
        value={value}
        onChange={handleChange}
        onClear={handleClear}
        allowClear
        placeholder="Select a project"
        options={options}
      />
    </Card>
  );
}
