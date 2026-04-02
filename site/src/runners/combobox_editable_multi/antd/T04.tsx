'use client';

/**
 * combobox_editable_multi-antd-T04: Search and pick two research topics
 *
 * Centered isolated card titled "Team settings" with one Ant Design Select in tags mode.
 * - Label: "Team topics"
 * - Placeholder: "Search topics"
 * - showSearch is enabled: typing filters the dropdown options.
 * - Options list contains ~25 topics with similar wording (e.g., Design Systems, Design Ops, UX Research, User Research, Quant Research, Accessibility, Typography, Prototyping, etc.).
 * - Initial state: empty selection.
 * This task is intended to be completed by typing to narrow the list, then selecting the two target options.
 *
 * Success: Selected values equal {Design Systems, UX Research} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

const options = [
  { value: 'Design Systems', label: 'Design Systems' },
  { value: 'Design Ops', label: 'Design Ops' },
  { value: 'UX Research', label: 'UX Research' },
  { value: 'User Research', label: 'User Research' },
  { value: 'Quant Research', label: 'Quant Research' },
  { value: 'Accessibility', label: 'Accessibility' },
  { value: 'Typography', label: 'Typography' },
  { value: 'Prototyping', label: 'Prototyping' },
  { value: 'Visual Design', label: 'Visual Design' },
  { value: 'Motion Design', label: 'Motion Design' },
  { value: 'Interaction Design', label: 'Interaction Design' },
  { value: 'Content Strategy', label: 'Content Strategy' },
  { value: 'Information Architecture', label: 'Information Architecture' },
  { value: 'Design Tokens', label: 'Design Tokens' },
  { value: 'Brand Design', label: 'Brand Design' },
  { value: 'Service Design', label: 'Service Design' },
  { value: 'Product Strategy', label: 'Product Strategy' },
  { value: 'User Testing', label: 'User Testing' },
  { value: 'A/B Testing', label: 'A/B Testing' },
  { value: 'Usability Testing', label: 'Usability Testing' },
  { value: 'Design Leadership', label: 'Design Leadership' },
  { value: 'Design Critique', label: 'Design Critique' },
  { value: 'Design Tools', label: 'Design Tools' },
  { value: 'Design Process', label: 'Design Process' },
  { value: 'Design Ethics', label: 'Design Ethics' },
];

const TARGET_SET = ['Design Systems', 'UX Research'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Team settings" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Team topics</Text>
      <Select
        data-testid="team-topics"
        mode="tags"
        style={{ width: '100%' }}
        placeholder="Search topics"
        value={value}
        onChange={setValue}
        options={options}
        showSearch
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
      />
    </Card>
  );
}
