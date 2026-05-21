'use client';

/**
 * combobox_editable_multi-antd-T10: Replace tags under a max limit
 *
 * Centered isolated card titled "Label assignment".
 * - Target component: Ant Design Select in tags mode with a helper text "Max 4 labels".
 * - maxCount is set to 4 (the component blocks adding a 5th label).
 * - Initial selected tags (4): alpha, beta, gamma, delta
 * - Options dropdown includes: alpha, beta, gamma, delta, omega, theta, kappa, lambda.
 * The task requires replacing some tags while respecting the max selection limit, ending with exactly alpha, gamma, omega, theta.
 *
 * Success: Selected values equal {alpha, gamma, omega, theta} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

const options = [
  { value: 'alpha', label: 'alpha' },
  { value: 'beta', label: 'beta' },
  { value: 'gamma', label: 'gamma' },
  { value: 'delta', label: 'delta' },
  { value: 'omega', label: 'omega' },
  { value: 'theta', label: 'theta' },
  { value: 'kappa', label: 'kappa' },
  { value: 'lambda', label: 'lambda' },
];

const TARGET_SET = ['alpha', 'gamma', 'omega', 'theta'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>(['alpha', 'beta', 'gamma', 'delta']);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Label assignment" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 4 }}>Assigned labels</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>Max 4 labels</Text>
      <Select
        data-testid="assigned-labels"
        mode="tags"
        style={{ width: '100%' }}
        placeholder="Select labels"
        value={value}
        onChange={setValue}
        options={options}
        maxCount={4}
      />
    </Card>
  );
}
