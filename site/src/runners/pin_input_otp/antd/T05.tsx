'use client';

/**
 * pin_input_otp-antd-T05: Disambiguate two OTP inputs (Email vs SMS)
 * 
 * A form_section layout titled "Two-factor verification" with two OTP inputs on the
 * same page: one labeled "Email code" and a second labeled "SMS code". Each OTP is
 * a 6-box Ant Design Input composite with auto-advance. The form also contains
 * non-target fields (read-only email address and phone number) and small helper
 * links "Resend email" / "Resend SMS" as realistic clutter.
 * Initial state: both OTP inputs are empty.
 * 
 * Success: Target OTP value equals '604918' in the "Email code" instance only.
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { OTP } = Input;
const { Text, Link } = Typography;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [emailCode, setEmailCode] = useState('');
  const [smsCode, setSmsCode] = useState('');

  useEffect(() => {
    if (emailCode === '604918') {
      onSuccess();
    }
  }, [emailCode, onSuccess]);

  return (
    <Card title="Two-factor verification" style={{ width: 480 }}>
      {/* Read-only info */}
      <div style={{ marginBottom: 24, padding: '12px 16px', background: '#f5f5f5', borderRadius: 8 }}>
        <div style={{ marginBottom: 8 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>Email</Text>
          <div>user@example.com</div>
        </div>
        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>Phone</Text>
          <div>+1 (555) 123-4567</div>
        </div>
      </div>

      {/* Email code OTP */}
      <div style={{ marginBottom: 24 }} aria-labelledby="email-code-label">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <label id="email-code-label" style={{ fontWeight: 500 }}>Email code</label>
          <Link style={{ fontSize: 12 }}>Resend email</Link>
        </div>
        <div data-testid="otp-email-code" aria-label="Email code">
          <OTP
            length={6}
            value={emailCode}
            onChange={setEmailCode}
          />
        </div>
      </div>

      {/* SMS code OTP */}
      <div aria-labelledby="sms-code-label">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <label id="sms-code-label" style={{ fontWeight: 500 }}>SMS code</label>
          <Link style={{ fontSize: 12 }}>Resend SMS</Link>
        </div>
        <div data-testid="otp-sms-code" aria-label="SMS code">
          <OTP
            length={6}
            value={smsCode}
            onChange={setSmsCode}
          />
        </div>
      </div>
    </Card>
  );
}
