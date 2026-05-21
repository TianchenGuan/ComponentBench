'use client';

/**
 * search_input-antd-T06: Select a state from a compact AutoComplete list
 *
 * Isolated card centered in the viewport titled "Shipping".
 * Spacing mode is set to compact: the label, input padding, and dropdown items are tighter than default.
 * The card contains one Ant Design AutoComplete labeled "State search".
 * Suggestions dataset (12 items) includes several similar prefixes: California, Calgary, Calcutta, Camden, Colorado, Connecticut, etc.
 * Initial state: empty. The dropdown appears beneath the input while typing.
 * Feedback: selecting a suggestion fills the input and shows a checkmark row: "Selected: California".
 * No additional clutter.
 *
 * Success: The AutoComplete labeled "State search" has selected_option "California" and value "California".
 */

import React, { useState, useRef } from 'react';
import { Card, AutoComplete, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const states = [
  'California', 'Calgary', 'Calcutta', 'Camden', 'Colorado', 'Connecticut',
  'Carolina', 'Cambridge', 'Canton', 'Carson', 'Charleston', 'Charlotte'
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const hasSucceeded = useRef(false);

  const handleSearch = (searchText: string) => {
    if (!searchText) {
      setOptions([]);
      return;
    }
    const filtered = states
      .filter((state) => state.toLowerCase().includes(searchText.toLowerCase()))
      .map((state) => ({ value: state }));
    setOptions(filtered);
  };

  const handleSelect = (data: string) => {
    setValue(data);
    setSelectedOption(data);
    if (data === 'California' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  return (
    <Card title="Shipping" style={{ width: 350 }} size="small">
      <div style={{ marginBottom: 4 }}>
        <label htmlFor="search-state" style={{ fontWeight: 500, marginBottom: 2, display: 'block', fontSize: 13 }}>
          State search
        </label>
        <AutoComplete
          id="search-state"
          style={{ width: '100%' }}
          placeholder="Type to search…"
          value={value}
          options={options}
          onSearch={handleSearch}
          onSelect={handleSelect}
          onChange={setValue}
          data-testid="search-state"
          size="small"
        />
        {selectedOption && (
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            <Text style={{ fontSize: 12 }}>Selected: {selectedOption}</Text>
          </div>
        )}
      </div>
    </Card>
  );
}
