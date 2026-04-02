'use client';

/**
 * autocomplete_freeform-antd-T01: Set a custom city query
 *
 * setup_description:
 * A single isolated card is centered on the page with the title "Travel Search". It contains one Ant Design AutoComplete labeled "City search" with a placeholder "Type a city".
 *
 * The AutoComplete is configured with a short suggestion list (Boston, Chicago, Denver, Miami), but it allows free input. As you type, a dropdown list appears directly under the input. The input has a standard text caret and supports typing/pasting.
 *
 * Initial state: the input is empty and the dropdown is closed. There is no separate Submit/Search button and no other form fields on the card, so the only meaningful state is the value currently shown in the AutoComplete input.
 *
 * Distractors: none. Feedback: the typed value is immediately visible in the input; selecting a suggestion would also fill the input, but selection is optional.
 *
 * Success: The "City search" AutoComplete input's displayed value equals "Boston" (after trimming whitespace).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, AutoComplete, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const suggestions = [
  { value: 'Boston' },
  { value: 'Chicago' },
  { value: 'Denver' },
  { value: 'Miami' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const successFired = useRef(false);

  // Normalize and check value
  const normalizedValue = value.trim().toLowerCase();
  const targetValue = 'boston';

  useEffect(() => {
    if (!successFired.current && normalizedValue === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedValue, onSuccess]);

  return (
    <Card title="Travel Search" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>City search</Text>
      <AutoComplete
        data-testid="city-search"
        style={{ width: '100%' }}
        options={suggestions}
        placeholder="Type a city"
        value={value}
        onChange={(newValue) => setValue(newValue)}
        filterOption={(inputValue, option) =>
          option!.value.toLowerCase().includes(inputValue.toLowerCase())
        }
      />
    </Card>
  );
}
