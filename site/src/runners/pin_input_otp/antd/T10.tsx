'use client';

/**
 * pin_input_otp-antd-T10: Alphanumeric OTP (case-sensitive)
 * 
 * A centered isolated card titled "Enter access code". The OTP component is a 6-box
 * Ant Design Input composite configured to accept uppercase letters and digits.
 * Visually, the boxes are grouped with subtle separators after the 2nd and 4th box
 * (e.g., 'AA–AA–AA' grouping) but the underlying value is still a 6-character string.
 * Initial state: all boxes empty. No confirm button required.
 * 
 * Success: Target OTP value equals 'A7C9D2' (case-sensitive, letters uppercase).
 */

import React, { useState, useEffect } from 'react';
import { Card, Input } from 'antd';
import type { TaskComponentProps } from '../types';

const { OTP } = Input;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === 'A7C9D2') {
      onSuccess();
    }
  }, [value, onSuccess]);

  // Auto-uppercase handler
  const handleChange = (val: string) => {
    setValue(val.toUpperCase());
  };

  return (
    <Card title="Enter access code" style={{ width: 440 }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>Access code</div>
        <div data-testid="otp-access-code" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* We'll use formatter prop if available, otherwise manual grouping */}
          <OTP
            length={6}
            value={value}
            onChange={handleChange}
            formatter={(val) => val.toUpperCase()}
          />
        </div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
          Enter uppercase letters and digits only
        </div>
      </div>
    </Card>
  );
}
