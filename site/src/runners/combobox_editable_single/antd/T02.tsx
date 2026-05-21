'use client';

/**
 * combobox_editable_single-antd-T02: Open airport suggestions list
 *
 * A single isolated card titled "Flight Search" is centered in the viewport.
 * It contains one editable combobox labeled "Airport" implemented with Ant Design AutoComplete.
 * - Scene: isolated_card, center placement, light theme, comfortable spacing, default scale.
 * - Component behavior: Clicking the input opens a popover list of suggested airports.
 * - Options: Atlanta (ATL), Boston (BOS), Chicago (ORD), Dallas (DFW), Denver (DEN), Los Angeles (LAX), Miami (MIA), New York (JFK), Seattle (SEA), San Francisco (SFO).
 * - Initial state: empty; placeholder "Type an airport".
 * - Distractors: none.
 *
 * Success: The "Airport" combobox suggestion dropdown is open/expanded.
 */

import React, { useState } from 'react';
import { Card, AutoComplete, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { value: 'Atlanta (ATL)' },
  { value: 'Boston (BOS)' },
  { value: 'Chicago (ORD)' },
  { value: 'Dallas (DFW)' },
  { value: 'Denver (DEN)' },
  { value: 'Los Angeles (LAX)' },
  { value: 'Miami (MIA)' },
  { value: 'New York (JFK)' },
  { value: 'Seattle (SEA)' },
  { value: 'San Francisco (SFO)' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  const handleDropdownVisibleChange = (visible: boolean) => {
    setOpen(visible);
    if (visible) {
      onSuccess();
    }
  };

  return (
    <Card title="Flight Search" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Airport</Text>
      <AutoComplete
        data-testid="airport-autocomplete"
        style={{ width: '100%' }}
        options={options}
        placeholder="Type an airport"
        value={value}
        onChange={setValue}
        open={open}
        onDropdownVisibleChange={handleDropdownVisibleChange}
        filterOption={(inputValue, option) =>
          option!.value.toLowerCase().includes(inputValue.toLowerCase())
        }
      />
    </Card>
  );
}
