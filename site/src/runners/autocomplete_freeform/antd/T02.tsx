'use client';

/**
 * autocomplete_freeform-antd-T02: Pick an airport from suggestions
 *
 * setup_description:
 * The page shows an isolated card titled "Flight Finder" in the center of the viewport. Inside the card there is one Ant Design AutoComplete labeled "Airport" with placeholder "Start typing an airport".
 *
 * To the right of the input (still inside the card) there is a small non-interactive reference pill labeled "Reference" that displays the target text "LAX - Los Angeles". This gives a visual cross-check but the value is also written in the instruction.
 *
 * The AutoComplete has a dropdown of 8 airport options. The dropdown opens when the user clicks the input or types, and closes after an option is selected.
 *
 * Initial state: the input is empty. Distractors: the reference pill and a short help text below the input ("Pick from the list or type your own") are present but are not interactive. Feedback: when an option is selected, the input displays the selected option text.
 *
 * Success: The "Airport" AutoComplete input's displayed value equals "LAX - Los Angeles" (after trimming whitespace).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, AutoComplete, Typography, Tag, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const airports = [
  { value: 'LAX - Los Angeles' },
  { value: 'JFK - New York' },
  { value: 'SFO - San Francisco' },
  { value: 'SEA - Seattle' },
  { value: 'LAS - Las Vegas' },
  { value: 'LHR - London Heathrow' },
  { value: 'NRT - Tokyo Narita' },
  { value: 'CDG - Paris Charles de Gaulle' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const successFired = useRef(false);

  const normalizedValue = value.trim();
  const targetValue = 'LAX - Los Angeles';

  useEffect(() => {
    if (!successFired.current && normalizedValue === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedValue, onSuccess]);

  return (
    <Card title="Flight Finder" style={{ width: 480 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Airport</Text>
            <AutoComplete
              data-testid="airport"
              style={{ width: '100%' }}
              options={airports}
              placeholder="Start typing an airport"
              value={value}
              onChange={(newValue) => setValue(newValue)}
              filterOption={(inputValue, option) =>
                option!.value.toLowerCase().includes(inputValue.toLowerCase())
              }
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>Reference</Text>
            <Tag color="blue">LAX - Los Angeles</Tag>
          </div>
        </div>
        <Text type="secondary" style={{ fontSize: 12 }}>Pick from the list or type your own</Text>
      </Space>
    </Card>
  );
}
