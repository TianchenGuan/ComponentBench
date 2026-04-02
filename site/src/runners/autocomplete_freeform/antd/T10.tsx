'use client';

/**
 * autocomplete_freeform-antd-T10: Scroll the suggestion list and pick a diacritic city
 *
 * setup_description:
 * A small travel widget is anchored in the bottom-right corner of the viewport. It contains a small-sized Ant Design AutoComplete labeled "Destination city".
 *
 * The AutoComplete uses a long suggestion list of European cities (about 40 items) rendered in a scrollable dropdown with a fixed max height. The list includes many similar names and diacritics (e.g., "Zurich" is NOT present, but "Zürich" is present; also items like "Zagreb", "Zaragoza", "Žilina").
 *
 * The component is rendered at small scale (smaller input and option height than default), so the click targets are tighter. Selecting from the dropdown is the most reliable way to get the exact spelling with diacritics.
 *
 * Initial state: the input is empty. Distractors: none. Feedback: after selection, the input displays the chosen city text exactly as in the option.
 *
 * Success: The "Destination city" AutoComplete input's displayed value equals "Zürich" exactly (trim whitespace).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, AutoComplete, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

// Long list of European cities with diacritics
const cities = [
  { value: 'Amsterdam' },
  { value: 'Athens' },
  { value: 'Barcelona' },
  { value: 'Belgrade' },
  { value: 'Berlin' },
  { value: 'Bratislava' },
  { value: 'Brussels' },
  { value: 'Bucharest' },
  { value: 'Budapest' },
  { value: 'Copenhagen' },
  { value: 'Dublin' },
  { value: 'Edinburgh' },
  { value: 'Florence' },
  { value: 'Frankfurt' },
  { value: 'Geneva' },
  { value: 'Göteborg' },
  { value: 'Hamburg' },
  { value: 'Helsinki' },
  { value: 'Istanbul' },
  { value: 'Kraków' },
  { value: 'Lisbon' },
  { value: 'Ljubljana' },
  { value: 'London' },
  { value: 'Madrid' },
  { value: 'Malmö' },
  { value: 'Milan' },
  { value: 'Moscow' },
  { value: 'Munich' },
  { value: 'Oslo' },
  { value: 'Paris' },
  { value: 'Prague' },
  { value: 'Riga' },
  { value: 'Rome' },
  { value: 'Stockholm' },
  { value: 'Vienna' },
  { value: 'Warsaw' },
  { value: 'Zagreb' },
  { value: 'Zaragoza' },
  { value: 'Žilina' },
  { value: 'Zürich' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const successFired = useRef(false);

  const normalizedValue = value.trim();
  const targetValue = 'Zürich';

  useEffect(() => {
    if (!successFired.current && normalizedValue === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedValue, onSuccess]);

  return (
    <Card title="Travel" style={{ width: 280 }} size="small">
      <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>Destination city</Text>
      <AutoComplete
        data-testid="destination-city"
        style={{ width: '100%' }}
        options={cities}
        placeholder="Type a city"
        value={value}
        onChange={(newValue) => setValue(newValue)}
        filterOption={(inputValue, option) =>
          option!.value.toLowerCase().includes(inputValue.toLowerCase())
        }
        size="small"
        listHeight={200}
      />
    </Card>
  );
}
