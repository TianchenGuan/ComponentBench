'use client';

/**
 * masked_input-antd-T01: Set support phone number
 * 
 * Baseline isolated card centered in the viewport titled "Contact details".
 * It contains a single Ant Design Input labeled "Support phone (US)".
 * The input uses a phone mask and shows the placeholder "(###) ###-####"; only digits can be typed and the formatting characters appear automatically.
 * The field starts empty and has no validation errors. No other masked inputs are present and there is no submit button required for completion.
 * 
 * Success: The "Support phone (US)" masked input equals "(415) 555-0136".
 */

import React, { useState, useEffect } from 'react';
import { Card, Typography } from 'antd';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '(415) 555-0136') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Contact details" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="support-phone" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Support phone (US)
        </label>
        <IMaskInput
          id="support-phone"
          mask="(000) 000-0000"
          definitions={{
            '0': /[0-9]/
          }}
          placeholder="(###) ###-####"
          value={value}
          onAccept={(val: string) => setValue(val)}
          data-testid="support-phone"
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
