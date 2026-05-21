'use client';

/**
 * number_input_spinbutton-antd-T01: Set age to 34
 * 
 * A single isolated card is centered in the viewport. The card title is "Profile".
 * Inside the card there is one Ant Design InputNumber labeled "Age (years)".
 * - Size: default (middle), with the standard up/down stepper controls visible on the right.
 * - Constraints: min=0, max=120, step=1.
 * - Initial state: value is 18.
 * There are no other interactive components on the page (no submit button); changing the value is immediately reflected in the field.
 * 
 * Success: The numeric value of the target number input is 34.
 */

import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number | null>(18);

  useEffect(() => {
    if (value === 34) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Profile" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="age-input" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Age (years)
        </label>
        <InputNumber
          id="age-input"
          min={0}
          max={120}
          step={1}
          value={value}
          onChange={(val) => setValue(val)}
          style={{ width: '100%' }}
          data-testid="age-input"
        />
      </div>
    </Card>
  );
}
