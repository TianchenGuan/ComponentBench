'use client';

/**
 * pin_input_otp-antd-T09: Masked OTP in dark theme with Apply
 * 
 * A single isolated card in dark theme titled "Admin action required". The OTP
 * input labeled "Admin verification code" is a 6-box Ant Design Input composite
 * configured in masked/password display mode (each character renders as a dot).
 * The card includes a primary button "Apply" that commits the code; it is disabled
 * until all 6 boxes have a value.
 * Initial state: all OTP boxes empty; Apply disabled.
 * 
 * Success: OTP value equals '390771' AND Apply button is clicked (committed).
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button } from 'antd';
import type { TaskComponentProps } from '../types';

const { OTP } = Input;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const successCalledRef = useRef(false);

  const handleApply = () => {
    if (value === '390771' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  };

  // Reset on mount
  useEffect(() => {
    successCalledRef.current = false;
  }, []);

  return (
    <Card title="Admin action required" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>
          Admin verification code
        </label>
        <div data-testid="otp-admin-code">
          <OTP
            length={6}
            value={value}
            onChange={setValue}
            mask
          />
        </div>
      </div>
      <Button
        type="primary"
        disabled={value.length !== 6}
        onClick={handleApply}
        data-testid="apply-button"
        block
      >
        Apply
      </Button>
    </Card>
  );
}
