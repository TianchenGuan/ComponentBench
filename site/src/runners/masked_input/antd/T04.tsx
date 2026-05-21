'use client';

/**
 * masked_input-antd-T04: Enter 6-digit verification code
 * 
 * Baseline isolated card in the center titled "Two‑step verification".
 * It contains one masked Ant Design Input labeled "Verification code".
 * The mask only allows digits and enforces exactly 6 digits; the placeholder shows six boxes/underscores (e.g., "______").
 * The field starts empty. There are no other masked inputs and no confirm/submit step.
 * 
 * Success: The "Verification code" masked input value equals "907214".
 */

import React, { useState, useEffect } from 'react';
import { Card, Typography } from 'antd';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '907214') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Two‑step verification" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="verification-code" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Verification code
        </label>
        <IMaskInput
          id="verification-code"
          mask="000000"
          definitions={{
            '0': /[0-9]/
          }}
          placeholder="______"
          value={value}
          onAccept={(val: string) => setValue(val)}
          inputMode="numeric"
          data-testid="verification-code"
          style={{
            width: '100%',
            padding: '4px 11px',
            fontSize: 14,
            lineHeight: '1.5714285714285714',
            border: '1px solid #d9d9d9',
            borderRadius: 6,
            outline: 'none',
            letterSpacing: '4px',
          }}
        />
      </div>
    </Card>
  );
}
