'use client';

/**
 * pin_input_otp-antd-T02: Enter 4-digit PIN (single OTP, length 4)
 * 
 * A centered isolated card titled "Smart Lock Access". The card contains a label
 * "Door PIN" above a 4-box PIN/OTP input built from Ant Design Input fields with
 * square styling. Each box holds one digit; typing moves focus right, Backspace left.
 * Initial state: all four boxes are empty. No confirmation button required.
 * 
 * Success: Target OTP value equals '7304' with length 4.
 */

import React, { useState, useEffect } from 'react';
import { Card, Input } from 'antd';
import type { TaskComponentProps } from '../types';

const { OTP } = Input;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '7304') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Smart Lock Access" style={{ width: 360 }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>Door PIN</div>
        <div data-testid="otp-door-pin">
          <OTP
            length={4}
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
    </Card>
  );
}
