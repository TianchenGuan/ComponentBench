'use client';

/**
 * select_custom_single-antd-T04: Pick EUR from an already-open Currency list
 *
 * Layout: centered isolated card titled "Billing".
 * The card contains one Ant Design Select labeled "Currency".
 *
 * Configuration: the Select is rendered with defaultOpen=true, so the dropdown menu is already expanded on page load.
 * The options list is visible without needing to click the field first.
 *
 * Initial state: no value selected; the input shows placeholder "Pick a currency".
 * Options visible in the open dropdown: USD, EUR, JPY, GBP (each shown as simple text).
 *
 * Selecting an option applies immediately and may close the dropdown (closing is fine for this task).
 * No other interactive controls are present.
 *
 * Success: The AntD Select labeled "Currency" has selected value exactly "EUR".
 */

import React, { useState } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'JPY', value: 'JPY' },
  { label: 'GBP', value: 'GBP' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>(undefined);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'EUR') {
      onSuccess();
    }
  };

  return (
    <Card title="Billing" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Currency</Text>
      <Select
        data-testid="currency-select"
        style={{ width: '100%' }}
        value={value}
        onChange={handleChange}
        defaultOpen
        placeholder="Pick a currency"
        options={options}
      />
    </Card>
  );
}
