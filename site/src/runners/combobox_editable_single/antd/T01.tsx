'use client';

/**
 * combobox_editable_single-antd-T01: Set favorite framework to React
 *
 * A single isolated card titled "Developer Profile" is centered in the viewport.
 * The card contains one editable combobox labeled "Favorite framework" implemented with Ant Design AutoComplete.
 * - Scene: isolated_card layout, centered, light theme, comfortable spacing, default scale.
 * - Component behavior: Clicking into the input opens a suggestion dropdown (popover) with framework options; typing filters the list.
 * - Options: React, Angular, Vue, Svelte, SolidJS, Ember, Next.js, Remix.
 * - Initial state: empty input (placeholder "Start typing…").
 * - Distractors: none.
 *
 * Success: The value of the "Favorite framework" combobox equals "React".
 */

import React, { useState } from 'react';
import { Card, AutoComplete, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { value: 'React' },
  { value: 'Angular' },
  { value: 'Vue' },
  { value: 'Svelte' },
  { value: 'SolidJS' },
  { value: 'Ember' },
  { value: 'Next.js' },
  { value: 'Remix' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const handleSelect = (selectedValue: string) => {
    setValue(selectedValue);
    if (selectedValue === 'React') {
      onSuccess();
    }
  };

  // Also check on blur in case user typed the exact value
  const handleBlur = () => {
    if (value === 'React') {
      onSuccess();
    }
  };

  return (
    <Card title="Developer Profile" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Favorite framework</Text>
      <AutoComplete
        data-testid="favorite-framework"
        style={{ width: '100%' }}
        options={options}
        placeholder="Start typing…"
        value={value}
        onChange={handleChange}
        onSelect={handleSelect}
        onBlur={handleBlur}
        filterOption={(inputValue, option) =>
          option!.value.toLowerCase().includes(inputValue.toLowerCase())
        }
      />
    </Card>
  );
}
