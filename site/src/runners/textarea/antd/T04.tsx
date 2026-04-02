'use client';

/**
 * textarea-antd-T04: Pickup instructions in two lines
 *
 * A centered card titled "Delivery" contains one Ant Design Input.TextArea labeled "Pickup instructions".
 * - Light theme, comfortable spacing, default scale.
 * - The textarea uses autoSize with minRows=2 so it grows slightly with content.
 * - It starts empty and shows a faint placeholder "Two lines recommended".
 * - No other textareas or required buttons are present.
 *
 * Success: Value equals exactly:
 *   Leave package at front desk.
 *   Ring bell once.
 * (normalize_newlines=true, whitespace=exact)
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { TextArea } = Input;

const TARGET_VALUE = `Leave package at front desk.
Ring bell once.`;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    // Normalize newlines for comparison (CRLF -> LF)
    const normalized = value.replace(/\r\n/g, '\n');
    if (normalized === TARGET_VALUE) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Delivery" style={{ width: 450 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="pickup-instructions" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Pickup instructions
        </label>
        <TextArea
          id="pickup-instructions"
          placeholder="Two lines recommended"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoSize={{ minRows: 2 }}
          data-testid="textarea-pickup-instructions"
        />
      </div>
    </Card>
  );
}
