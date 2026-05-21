'use client';

/**
 * select_custom_single-antd-T07: Scroll to pick Wyoming
 *
 * Layout: isolated card anchored near the bottom-right of the viewport (not centered).
 * The card is titled "Mailing address" and contains one Ant Design Select labeled "State".
 *
 * Initial state: no state selected (placeholder "Select a state"). showSearch is disabled.
 * The dropdown contains all 50 U.S. states in alphabetical order.
 *
 * The dropdown list has a fixed height with its own scrollbar; "Wyoming" is near the bottom and is not visible initially.
 * You must scroll within the dropdown menu to reach it.
 *
 * No other interactive components exist on the card (no second select).
 * Feedback: selecting an option immediately sets the field value and closes the dropdown.
 *
 * Success: The Select labeled "State" has selected value exactly "Wyoming".
 */

import React, { useState } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const usStates = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>(undefined);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'Wyoming') {
      onSuccess();
    }
  };

  return (
    <Card title="Mailing address" style={{ width: 350 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>State</Text>
      <Select
        data-testid="state-select"
        style={{ width: '100%' }}
        value={value}
        onChange={handleChange}
        placeholder="Select a state"
        listHeight={200}
        options={usStates.map(state => ({
          value: state,
          label: state,
        }))}
      />
    </Card>
  );
}
