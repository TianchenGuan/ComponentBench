'use client';

/**
 * number_input_spinbutton-antd-T02: Set quantity to 5
 * 
 * The page shows a centered isolated card titled "Cart item".
 * There is one Ant Design InputNumber labeled "Quantity" with helper text "Number of items".
 * - Stepper controls (up/down) are enabled.
 * - Constraints: min=0, max=99, step=1.
 * - Initial state: value is 1.
 * A non-interactive line of text below shows "Subtotal updates automatically" to indicate immediate feedback, but no buttons are required.
 * 
 * Success: The numeric value of the target number input is 5.
 */

import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number | null>(1);

  useEffect(() => {
    if (value === 5) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Cart item" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="quantity-input" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Quantity
        </label>
        <InputNumber
          id="quantity-input"
          min={0}
          max={99}
          step={1}
          value={value}
          onChange={(val) => setValue(val)}
          style={{ width: '100%' }}
          data-testid="quantity-input"
        />
        <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
          Number of items
        </Text>
      </div>
      <Text type="secondary" style={{ fontSize: 12, marginTop: 16, display: 'block' }}>
        Subtotal updates automatically
      </Text>
    </Card>
  );
}
