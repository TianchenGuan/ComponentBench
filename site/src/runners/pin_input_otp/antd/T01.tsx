'use client';

/**
 * pin_input_otp-antd-T01: Enter 6-digit SMS code (single OTP)
 * 
 * A single centered isolated card titled "Verify your phone". Under the title is
 * helper text "SMS code" followed by a 6-box OTP input styled with Ant Design Input
 * boxes (outlined). Each box accepts exactly one character; focus auto-advances as
 * you type and Backspace moves to the previous box when empty.
 * Initial state: all six boxes are empty. No other interactive controls.
 * 
 * Success: Target OTP value equals '482159' with length 6.
 */

import React, { useState, useEffect } from 'react';
import { Card, Input } from 'antd';
import type { TaskComponentProps } from '../types';

const { OTP } = Input;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '482159') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Verify your phone" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>SMS code</div>
        <div data-testid="otp-sms">
          <OTP
            length={6}
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
    </Card>
  );
}
