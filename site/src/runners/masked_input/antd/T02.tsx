'use client';

/**
 * masked_input-antd-T02: Enter credit card number
 * 
 * Baseline isolated card centered in the viewport titled "Payment details".
 * It contains one masked Ant Design Input labeled "Card number" with a credit-card mask that groups digits in fours.
 * The placeholder shows "#### #### #### ####". As the user types digits, spaces are inserted automatically.
 * The field starts empty. There are no other masked inputs, no modal/drawer, and no submit/apply step.
 * 
 * Success: The "Card number" masked input value equals "4242 4242 4242 4242".
 */

import React, { useState, useEffect } from 'react';
import { Card, Typography } from 'antd';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '4242 4242 4242 4242') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Payment details" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="card-number" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Card number
        </label>
        <IMaskInput
          id="card-number"
          mask="0000 0000 0000 0000"
          definitions={{
            '0': /[0-9]/
          }}
          placeholder="#### #### #### ####"
          value={value}
          onAccept={(val: string) => setValue(val)}
          data-testid="card-number"
          style={{
            width: '100%',
            padding: '4px 11px',
            fontSize: 14,
            lineHeight: '1.5714285714285714',
            border: '1px solid #d9d9d9',
            borderRadius: 6,
            outline: 'none',
          }}
        />
      </div>
    </Card>
  );
}
