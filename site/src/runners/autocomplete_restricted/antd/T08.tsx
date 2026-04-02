'use client';

/**
 * autocomplete_restricted-antd-T08: Scroll the list to pick a state
 *
 * setup_description:
 * The page contains a compact "Address" card anchored near the **top-right** of the viewport.
 *
 * There is one Ant Design Select labeled **State**.
 * - Theme: light.
 * - Spacing: **compact** (reduced padding) and the Select is rendered in a slightly tighter container, making the click targets smaller.
 * - Initial state: empty, placeholder "Select a state".
 * - The dropdown contains a long list of all US states (50 options) in alphabetical order.
 * - Search is **disabled** for this instance (the dropdown opens directly to the scrollable list).
 * - You must scroll within the dropdown to find and select **Wyoming** (near the bottom).
 *
 * No other controls are present; the challenge is scrolling and precise targeting in a dense, long options list.
 *
 * Success: The "State" Select has selected value "Wyoming".
 */

import React, { useState } from 'react';
import { Card, Select, Typography, ConfigProvider } from 'antd';
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
  'Wisconsin', 'Wyoming'
].map(state => ({ label: state, value: state }));

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>(undefined);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'Wyoming') {
      onSuccess();
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            controlHeight: 28,
            fontSize: 13,
          },
        },
      }}
    >
      <Card title="Address" style={{ width: 280 }} size="small">
        <Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>State</Text>
        <Select
          data-testid="state-select"
          style={{ width: '100%' }}
          placeholder="Select a state"
          value={value}
          onChange={handleChange}
          showSearch={false}
          options={usStates}
          listHeight={200}
        />
      </Card>
    </ConfigProvider>
  );
}
