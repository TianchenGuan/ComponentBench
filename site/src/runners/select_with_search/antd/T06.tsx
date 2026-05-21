'use client';

/**
 * select_with_search-antd-T06: Choose the correct Congo in dark mode
 *
 * Layout: isolated_card centered titled "Market selection".
 * Theme: dark mode styling (dark background, light text).
 * Component: one Ant Design Select labeled "Country" with showSearch enabled.
 * Options include several similar names to increase confusability:
 *  - Congo (Republic)
 *  - Congo (DRC)
 *  - Congo (Brazzaville)
 *  - Côte d'Ivoire
 *  - Cameroon
 *  - Canada
 * Initial state: empty (no selection).
 * Feedback: after selection, the chosen label appears in the Select input; the dropdown closes automatically.
 *
 * Success: The selected value of the "Country" Select equals "Congo (DRC)".
 */

import React, { useState } from 'react';
import { Card, Select, Typography, ConfigProvider, theme } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { value: 'Congo (Republic)', label: 'Congo (Republic)' },
  { value: 'Congo (DRC)', label: 'Congo (DRC)' },
  { value: 'Congo (Brazzaville)', label: 'Congo (Brazzaville)' },
  { value: "Côte d'Ivoire", label: "Côte d'Ivoire" },
  { value: 'Cameroon', label: 'Cameroon' },
  { value: 'Canada', label: 'Canada' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>(undefined);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'Congo (DRC)') {
      onSuccess();
    }
  };

  // Note: Dark theme is handled by ThemeWrapper, but we ensure the card itself has dark styling
  return (
    <Card 
      title="Market selection" 
      style={{ width: 400 }}
    >
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Country</Text>
      <Select
        data-testid="country-select"
        showSearch
        style={{ width: '100%' }}
        placeholder="Select a country"
        value={value}
        onChange={handleChange}
        options={options}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
      />
    </Card>
  );
}
