'use client';

/**
 * text_input-antd-T02: Clear promo code field
 * 
 * Scene is an isolated card centered in the viewport titled "Checkout". It contains one Ant Design Input
 * labeled "Promo code". The input is configured with AntD's built-in clear icon (allowClear), so an '×'/clear
 * control appears inside the input when it has a value. Initial value is pre-filled as "SPRING10". No other
 * text inputs are present. There is no modal; feedback is immediate as the input value updates.
 * 
 * Success: The "Promo code" input's current value is the empty string (no characters after trimming).
 */

import React, { useState, useEffect } from 'react';
import { Card, Input } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('SPRING10');

  useEffect(() => {
    if (value.trim() === '') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Checkout" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="promo-code" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Promo code
        </label>
        <Input
          id="promo-code"
          allowClear
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="promo-code-input"
        />
      </div>
    </Card>
  );
}
