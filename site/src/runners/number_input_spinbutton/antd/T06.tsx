'use client';

/**
 * number_input_spinbutton-antd-T06: Dark theme: set items per page
 * 
 * The UI uses a dark theme (dark background, light text), but otherwise follows the baseline isolated-card layout centered in the viewport.
 * The card title is "Display".
 * It contains a single Ant Design InputNumber labeled "Items per page".
 * - Constraints: min=5, max=100, step=5.
 * - Initial state: value is 10.
 * The stepper controls are visible; helper text under the field says "Used for paginated lists" and updates are immediate (no Apply button).
 * 
 * Success: The numeric value of the target number input is 25.
 */

import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number | null>(10);

  useEffect(() => {
    if (value === 25) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Display" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="items-per-page-input" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Items per page
        </label>
        <InputNumber
          id="items-per-page-input"
          min={5}
          max={100}
          step={5}
          value={value}
          onChange={(val) => setValue(val)}
          style={{ width: '100%' }}
          data-testid="items-per-page-input"
        />
        <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
          Used for paginated lists
        </Text>
      </div>
    </Card>
  );
}
