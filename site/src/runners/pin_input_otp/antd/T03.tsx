'use client';

/**
 * pin_input_otp-antd-T03: Replace a prefilled OTP with a new code
 * 
 * A centered isolated card titled "Reset your password". Under a label "Reset code"
 * is a 6-box OTP input made from Ant Design Input fields. Initial state: the six
 * boxes are prefilled with digits (9 1 7 3 5 5). The target code (2 8 0 4 6 1) is
 * displayed above the input. The user must clear the old code and type the new one.
 * 
 * Success: OTP value equals '280461'.
 */

import React from 'react';
import { Card, Input, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { OTP } = Input;
const { Text } = Typography;

const TARGET_CODE = '280461';

export default function T03({ onSuccess }: TaskComponentProps) {
  const successRef = React.useRef(false);

  const handleChange = (val: string) => {
    if (successRef.current) return;
    if (val === TARGET_CODE) {
      successRef.current = true;
      onSuccess();
    }
  };

  return (
    <Card title="Reset your password" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Your new reset code is: <Text strong style={{ letterSpacing: 2, fontSize: 16 }}>{TARGET_CODE}</Text>
        </Text>
      </div>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>Reset code</div>
        <div data-testid="otp-reset-code">
          <OTP
            length={6}
            defaultValue="917355"
            onChange={handleChange}
          />
        </div>
      </div>
    </Card>
  );
}
