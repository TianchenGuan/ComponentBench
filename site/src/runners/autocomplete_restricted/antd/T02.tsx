'use client';

/**
 * autocomplete_restricted-antd-T02: Clear a preselected status
 *
 * setup_description:
 * The page shows a centered "Account" card.
 *
 * Inside the card is one Ant Design Select labeled **Status**. It is configured as an options-only selector with `allowClear`.
 * - Theme: light; spacing: comfortable; size: default.
 * - Initial state: **Active** is already selected and displayed in the field.
 * - When the field is hovered/focused, a small clear "×" icon appears on the right side (in addition to the dropdown arrow).
 * - Clicking the clear icon removes the selection and restores the placeholder "Choose status".
 *
 * Options in the dropdown are: Active, Paused, Archived.
 * No other fields are present (clutter = none).
 *
 * Success: The "Status" Select has no selected value (empty/cleared).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const statuses = [
  { label: 'Active', value: 'Active' },
  { label: 'Paused', value: 'Paused' },
  { label: 'Archived', value: 'Archived' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>('Active');
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && value === undefined) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleChange = (newValue: string | undefined) => {
    setValue(newValue);
  };

  return (
    <Card title="Account" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Status</Text>
      <Select
        data-testid="status-select"
        style={{ width: '100%' }}
        placeholder="Choose status"
        value={value}
        onChange={handleChange}
        allowClear
        options={statuses}
      />
    </Card>
  );
}
