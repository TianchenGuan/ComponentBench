'use client';

/**
 * slider_range-antd-T04: Set budget range via min/max fields
 * 
 * Layout: isolated_card centered in the viewport.
 * The card title is "Budget". The widget includes:
 * - Two small number inputs labeled "Min" and "Max" (currency formatting with a $ prefix in the readout),
 * - One Ant Design range Slider directly below them, kept in sync with the two inputs.
 * Slider configuration: min=0, max=100, step=1, range=true. Typing into Min/Max updates the slider thumbs after blur/Enter.
 * Initial state: Min=15 and Max=60, and a readout line shows "Selected: $15 – $60".
 * No Apply/Reset controls exist; updates are immediate once the inputs commit.
 * 
 * Success: Target range is set to 30–55 USD (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Card, Slider, Typography, InputNumber, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[number, number]>([15, 60]);

  useEffect(() => {
    if (value[0] === 30 && value[1] === 55) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleMinChange = (val: number | null) => {
    if (val !== null && val >= 0 && val <= value[1]) {
      setValue([val, value[1]]);
    }
  };

  const handleMaxChange = (val: number | null) => {
    if (val !== null && val >= value[0] && val <= 100) {
      setValue([value[0], val]);
    }
  };

  const handleSliderChange = (val: number[]) => {
    setValue(val as [number, number]);
  };

  return (
    <Card title="Budget" style={{ width: 400 }}>
      <Space style={{ marginBottom: 16 }}>
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Min</Text>
          <InputNumber
            min={0}
            max={value[1]}
            value={value[0]}
            onChange={handleMinChange}
            style={{ width: 100 }}
            data-testid="budget-min"
          />
        </div>
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Max</Text>
          <InputNumber
            min={value[0]}
            max={100}
            value={value[1]}
            onChange={handleMaxChange}
            style={{ width: 100 }}
            data-testid="budget-max"
          />
        </div>
      </Space>
      <Slider
        range
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={handleSliderChange}
        data-testid="budget-range"
      />
      <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
        Selected: ${value[0]} – ${value[1]}
      </Text>
    </Card>
  );
}
