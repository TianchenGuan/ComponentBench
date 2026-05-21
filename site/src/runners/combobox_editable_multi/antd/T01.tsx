'use client';

/**
 * combobox_editable_multi-antd-T01: Project tech tags (3 items)
 *
 * You are on a single centered card titled "Tagging". The card contains one Ant Design Select component configured in tags mode (multi-value, editable).
 * - Label above the field: "Project tech tags"
 * - Placeholder: "Add tech tags"
 * - The dropdown contains a short suggestion list (e.g., React, Vue, Svelte, Angular, Node.js, Django, Flask, Rails).
 * - The field starts empty (no selected tags).
 * Interaction notes:
 * - Clicking the field opens a popover dropdown under the input.
 * - Selecting an option adds it as a removable tag ("pill") inside the input.
 * There are no other required controls or distractors on the card.
 *
 * Success: Selected values equal {React, Node.js, Svelte} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

const options = [
  { value: 'React', label: 'React' },
  { value: 'Vue', label: 'Vue' },
  { value: 'Svelte', label: 'Svelte' },
  { value: 'Angular', label: 'Angular' },
  { value: 'Node.js', label: 'Node.js' },
  { value: 'Django', label: 'Django' },
  { value: 'Flask', label: 'Flask' },
  { value: 'Rails', label: 'Rails' },
];

const TARGET_SET = ['React', 'Node.js', 'Svelte'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Tagging" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Project tech tags</Text>
      <Select
        data-testid="project-tech-tags"
        mode="tags"
        style={{ width: '100%' }}
        placeholder="Add tech tags"
        value={value}
        onChange={setValue}
        options={options}
      />
    </Card>
  );
}
