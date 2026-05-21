'use client';

/**
 * number_input_spinbutton-antd-T03: Set duration to 2.5 hours
 * 
 * A centered isolated card titled "Time entry" contains one Ant Design InputNumber labeled "Duration (hours)".
 * - The component allows decimals and shows the standard stepper buttons.
 * - Constraints: min=0, max=24, step=0.5, precision=1.
 * - Initial state: value is 1.0.
 * There is a small read-only preview text below: "Billed time: 1.0h" that updates immediately as the value changes.
 * 
 * Success: The numeric value of the target number input is within ±0.001 of 2.5.
 */

import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number | null>(1.0);

  useEffect(() => {
    if (value !== null && Math.abs(value - 2.5) < 0.001) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Time entry" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="duration-input" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Duration (hours)
        </label>
        <InputNumber
          id="duration-input"
          min={0}
          max={24}
          step={0.5}
          precision={1}
          value={value}
          onChange={(val) => setValue(val)}
          style={{ width: '100%' }}
          data-testid="duration-input"
        />
      </div>
      <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
        Billed time: {value?.toFixed(1) ?? '0.0'}h
      </Text>
    </Card>
  );
}
