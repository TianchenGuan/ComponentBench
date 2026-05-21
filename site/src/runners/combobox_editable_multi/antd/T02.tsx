'use client';

/**
 * combobox_editable_multi-antd-T02: Add a custom internal label
 *
 * Centered card titled "Labels". It contains a single Ant Design Select in tags mode.
 * - Label: "Internal labels"
 * - Placeholder: "Type a label and press Enter"
 * - Suggestion dropdown includes a few common labels (e.g., beta, customer-facing, urgent) but NOT "internal-only".
 * - Initial state: empty (no tags selected).
 * Behavior:
 * - You can type arbitrary text; pressing Enter commits it as a new tag.
 * - Selected tags appear as removable pills inside the input.
 * No other components affect success.
 *
 * Success: Selected values equal {internal-only} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

const options = [
  { value: 'beta', label: 'beta' },
  { value: 'customer-facing', label: 'customer-facing' },
  { value: 'urgent', label: 'urgent' },
];

const TARGET_SET = ['internal-only'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Labels" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Internal labels</Text>
      <Select
        data-testid="internal-labels"
        mode="tags"
        style={{ width: '100%' }}
        placeholder="Type a label and press Enter"
        value={value}
        onChange={setValue}
        options={options}
        tokenSeparators={[',']}
      />
    </Card>
  );
}
