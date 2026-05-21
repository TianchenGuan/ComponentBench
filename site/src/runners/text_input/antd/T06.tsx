'use client';

/**
 * text_input-antd-T06: Enter formatted invite code (compact, small)
 * 
 * Scene is an isolated card centered in the viewport titled "Join workspace". The page uses compact spacing
 * and the AntD Input is rendered in the small size tier. There is a single text input labeled "Invite code"
 * with a subtle description: "6 characters, A–Z and 0–9". The field is inside an AntD Form.Item that shows
 * inline validation feedback: when the current value does not match the required format, a red error message
 * appears under the input. Initial value is empty. No other text inputs or overlays are present; the only
 * distractor is a disabled-looking 'Continue' button that is not required for success.
 * 
 * Success: The "Invite code" input value equals "Q7K2LM" exactly (case-sensitive; trim leading/trailing whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Form } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const formatRegex = /^[A-Z0-9]{6}$/;
  const isValid = formatRegex.test(value.trim());
  const hasError = value.length > 0 && !isValid;

  useEffect(() => {
    if (value.trim() === 'Q7K2LM' && isValid) {
      onSuccess();
    }
  }, [value, isValid, onSuccess]);

  return (
    <Card title="Join workspace" style={{ width: 350 }} bodyStyle={{ padding: '16px' }}>
      <Form layout="vertical" size="small">
        <Form.Item
          label="Invite code"
          help={hasError ? 'Invalid code format. Must be 6 characters, A-Z and 0-9.' : '6 characters, A–Z and 0–9'}
          validateStatus={hasError ? 'error' : ''}
        >
          <Input
            size="small"
            value={value}
            onChange={(e) => setValue(e.target.value.toUpperCase())}
            maxLength={6}
            data-testid="invite-code-input"
            aria-invalid={hasError}
          />
        </Form.Item>
        
        <Button type="primary" size="small" disabled={!isValid}>
          Continue
        </Button>
      </Form>
    </Card>
  );
}
