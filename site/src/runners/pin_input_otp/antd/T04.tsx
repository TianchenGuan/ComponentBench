'use client';

/**
 * pin_input_otp-antd-T04: Enter code shown in SMS preview (visual reference)
 * 
 * A centered isolated card titled "Enter verification code". On the left is an OTP
 * input labeled "SMS code" with 6 Ant Design Input boxes. On the right is a non-
 * interactive "SMS preview" panel that visually resembles a phone message bubble;
 * the 6-digit code is rendered inside the bubble as large monospace digits.
 * Initial state: OTP boxes are empty. No confirm/apply button.
 * 
 * Success: Target OTP value equals '913026'.
 */

import React, { useState, useEffect } from 'react';
import { Card, Input } from 'antd';
import type { TaskComponentProps } from '../types';

const { OTP } = Input;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const targetCode = '913026';

  useEffect(() => {
    if (value === targetCode) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Enter verification code" style={{ width: 520 }}>
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        {/* OTP Input side */}
        <div>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>SMS code</div>
          <div data-testid="otp-sms-code">
            <OTP
              length={6}
              value={value}
              onChange={setValue}
            />
          </div>
        </div>
        
        {/* SMS Preview side */}
        <div data-testid="sms-preview-bubble" style={{ flexShrink: 0 }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>SMS preview</div>
          <div
            style={{
              background: '#e8f5e9',
              borderRadius: 16,
              padding: '16px 20px',
              position: 'relative',
            }}
          >
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Your code is:</div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: 4,
                color: '#2e7d32',
                userSelect: 'none',
              }}
            >
              {targetCode}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
