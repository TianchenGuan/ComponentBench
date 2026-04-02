'use client';

/**
 * combobox_editable_single-antd-T10: Enter a formatted custom tag Road-trip
 *
 * A small "Tags" card is placed near the top-right of the viewport.
 * It contains one editable combobox labeled "Custom tag" implemented with Ant Design AutoComplete.
 * - Scene: isolated_card layout, top_right placement, light theme, comfortable spacing, SMALL scale.
 * - Component behavior: The AutoComplete shows suggestions while typing but allows free text.
 * - Suggestions: Road trip, road-trip, Road-trip, Roadtrip, Weekend-trip, Work-trip.
 * - Initial state: empty.
 * - Distractors: none.
 *
 * Success: The "Custom tag" combobox value equals the exact string "Road-trip".
 */

import React, { useState } from 'react';
import { Card, AutoComplete, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const suggestions = [
  { value: 'Road trip' },
  { value: 'road-trip' },
  { value: 'Road-trip' },
  { value: 'Roadtrip' },
  { value: 'Weekend-trip' },
  { value: 'Work-trip' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const handleSelect = (selectedValue: string) => {
    setValue(selectedValue);
    if (selectedValue === 'Road-trip') {
      onSuccess();
    }
  };

  const handleBlur = () => {
    if (value.trim() === 'Road-trip') {
      onSuccess();
    }
  };

  return (
    <Card 
      title="Tags" 
      style={{ width: 300 }}
      size="small"
    >
      <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>Custom tag</Text>
      <AutoComplete
        data-testid="custom-tag"
        style={{ width: '100%' }}
        size="small"
        options={suggestions}
        placeholder="Enter tag"
        value={value}
        onChange={handleChange}
        onSelect={handleSelect}
        onBlur={handleBlur}
        filterOption={(inputValue, option) =>
          option!.value.toLowerCase().includes(inputValue.toLowerCase())
        }
      />
      <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 11 }}>
        Goal: Road-trip
      </Text>
    </Card>
  );
}
