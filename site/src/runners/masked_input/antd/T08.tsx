'use client';

/**
 * masked_input-antd-T08: Edit serial code in small input
 * 
 * Isolated card centered in the viewport titled "Device registration".
 * It contains a single Ant Design Input rendered in the small size tier (denser text and smaller clear/caret affordances).
 * The masked input is labeled "Serial code" and enforces the pattern "SN-####-####".
 * The field starts prefilled with "SN-1024-8890" so the agent must edit an existing masked value (e.g., change the last digit from 0 to 6).
 * 
 * Success: The "Serial code" masked input value equals "SN-1024-8896".
 */

import React, { useState, useEffect } from 'react';
import { Card, Typography } from 'antd';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('SN-1024-8890');

  useEffect(() => {
    if (value === 'SN-1024-8896') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Device registration" style={{ width: 360 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="serial-code" style={{ fontWeight: 500, marginBottom: 4, display: 'block', fontSize: 12 }}>
          Serial code
        </label>
        <IMaskInput
          id="serial-code"
          mask="SN-0000-0000"
          definitions={{
            '0': /[0-9]/
          }}
          placeholder="SN-####-####"
          value={value}
          onAccept={(val: string) => setValue(val)}
          data-testid="serial-code"
          style={{
            width: '100%',
            padding: '2px 7px',
            fontSize: 12,
            lineHeight: '1.5',
            border: '1px solid #d9d9d9',
            borderRadius: 4,
            outline: 'none',
            fontFamily: 'monospace',
          }}
        />
      </div>
    </Card>
  );
}
