'use client';

/**
 * autocomplete_freeform-antd-T03: Clear a prefilled autocomplete
 *
 * setup_description:
 * A centered isolated card titled "Trip Preferences" contains a single Ant Design AutoComplete labeled "City search". The AutoComplete is configured with allowClear so a clear (×) icon appears when the field has a value.
 *
 * Initial state: the input already contains the text "Seattle" and the dropdown is closed. A short suggestion list (Seattle, San Diego, San Jose, Santa Fe) exists but is not needed.
 *
 * There are no other inputs on the page. Feedback: when cleared, the input becomes empty and the clear icon disappears.
 *
 * Success: The "City search" AutoComplete input's displayed value is an empty string after trimming whitespace.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, AutoComplete, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const suggestions = [
  { value: 'Seattle' },
  { value: 'San Diego' },
  { value: 'San Jose' },
  { value: 'Santa Fe' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Seattle');
  const successFired = useRef(false);

  const normalizedValue = value.trim();

  useEffect(() => {
    if (!successFired.current && normalizedValue === '') {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedValue, onSuccess]);

  return (
    <Card title="Trip Preferences" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>City search</Text>
      <AutoComplete
        data-testid="city-search"
        style={{ width: '100%' }}
        options={suggestions}
        placeholder="Type a city"
        value={value}
        onChange={(newValue) => setValue(newValue)}
        allowClear
        filterOption={(inputValue, option) =>
          option!.value.toLowerCase().includes(inputValue.toLowerCase())
        }
      />
    </Card>
  );
}
