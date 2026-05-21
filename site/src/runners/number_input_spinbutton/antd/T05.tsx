'use client';

/**
 * number_input_spinbutton-antd-T05: Fix max retries to 7 (starts invalid)
 * 
 * A single isolated card is centered in the viewport with the title "Retry policy".
 * The card contains one Ant Design InputNumber labeled "Max retries".
 * - Constraints: min=0, max=10, step=1.
 * - Initial state: value is 12, and the field shows an inline error status with helper text "Must be between 0 and 10".
 * The standard up/down stepper controls are visible. There are no other interactive controls and no Save button; the error clears automatically once the value is within range.
 * 
 * Success: The numeric value of the target number input is 7, and the input is in a valid (non-error) state.
 */

import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number | null>(12);
  
  const isValid = value !== null && value >= 0 && value <= 10;

  useEffect(() => {
    if (value === 7 && isValid) {
      onSuccess();
    }
  }, [value, isValid, onSuccess]);

  return (
    <Card title="Retry policy" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="max-retries-input" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Max retries
        </label>
        <InputNumber
          id="max-retries-input"
          min={0}
          max={10}
          step={1}
          value={value}
          onChange={(val) => setValue(val)}
          status={isValid ? undefined : 'error'}
          style={{ width: '100%' }}
          data-testid="max-retries-input"
        />
        {!isValid && (
          <Text type="danger" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
            Must be between 0 and 10
          </Text>
        )}
      </div>
    </Card>
  );
}
