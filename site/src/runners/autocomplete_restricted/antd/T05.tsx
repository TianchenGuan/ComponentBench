'use client';

/**
 * autocomplete_restricted-antd-T05: Search and select a city
 *
 * setup_description:
 * The page shows a **form section** titled "Shipping address" (centered), containing several fields as realistic clutter:
 * - Full name (text input)
 * - Street address (text input)
 * - ZIP code (text input)
 * - **City** (Ant Design Select with search)
 *
 * The task target is the **City** Select only.
 * - Theme: light; spacing: comfortable; size: default.
 * - The City Select is empty initially (placeholder "Start typing to search").
 * - The dropdown list contains ~20 US cities including: San Diego, San Jose, San Francisco, Santa Ana, Santa Fe, Sacramento, Seattle, etc.
 * - `showSearch` is enabled. Typing filters the list; you must commit by selecting an option from the dropdown.
 * - There is no submit button required; selection immediately updates the City field.
 *
 * Other form fields are present but do not affect success.
 *
 * Success: The "City" Select has selected value "San Diego".
 */

import React, { useState } from 'react';
import { Card, Select, Typography, Input, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const cities = [
  'San Diego', 'San Jose', 'San Francisco', 'Santa Ana', 'Santa Fe',
  'Sacramento', 'Seattle', 'San Antonio', 'Salt Lake City', 'Scottsdale',
  'Spokane', 'St. Louis', 'Savannah', 'Springfield', 'Sioux Falls',
  'Syracuse', 'Shreveport', 'Salem', 'Stockton', 'South Bend',
].map(city => ({ label: city, value: city }));

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>(undefined);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'San Diego') {
      onSuccess();
    }
  };

  return (
    <Card title="Shipping address" style={{ width: 450 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Full name</Text>
          <Input placeholder="Enter your name" />
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Street address</Text>
          <Input placeholder="Enter street address" />
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>ZIP code</Text>
          <Input placeholder="Enter ZIP code" style={{ width: 150 }} />
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>City</Text>
          <Select
            data-testid="city-select"
            style={{ width: '100%' }}
            placeholder="Start typing to search"
            value={value}
            onChange={handleChange}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={cities}
          />
        </div>
      </Space>
    </Card>
  );
}
