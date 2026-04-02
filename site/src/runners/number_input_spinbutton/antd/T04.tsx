'use client';

/**
 * number_input_spinbutton-antd-T04: Clear apartment number
 * 
 * The page is a centered isolated card titled "Delivery address".
 * It contains one Ant Design InputNumber labeled "Apartment number (optional)".
 * - Constraints: min=1, max=9999, step=1.
 * - Initial state: value is 1207.
 * - Placeholder text reads "Leave blank if not applicable".
 * No submit button exists; the input can be cleared by selecting the text and deleting/backspacing until the field is empty.
 * 
 * Success: The target number input is empty (no value).
 */

import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number | null>(1207);

  useEffect(() => {
    if (value === null) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Delivery address" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="apartment-input" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Apartment number (optional)
        </label>
        <InputNumber
          id="apartment-input"
          min={1}
          max={9999}
          step={1}
          value={value}
          onChange={(val) => setValue(val)}
          placeholder="Leave blank if not applicable"
          style={{ width: '100%' }}
          data-testid="apartment-input"
        />
      </div>
    </Card>
  );
}
