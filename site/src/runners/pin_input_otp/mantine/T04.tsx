'use client';

/**
 * pin_input_otp-mantine-T24: Two PinInputs in a form (choose Authenticator code)
 * 
 * A form_section titled "Two-factor verification" containing two Mantine PinInput
 * components. The first is labeled "Email code" and the second is labeled
 * "Authenticator app code". Both are numeric, length=6. Additional non-target
 * form elements include a "Trust this browser" checkbox and a short help link.
 * Initial state: both PinInputs empty.
 * 
 * Success: Target OTP value equals '772610' in "Authenticator app code" instance only.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, PinInput, Group, Checkbox, Anchor, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [emailCode, setEmailCode] = useState('');
  const [authCode, setAuthCode] = useState('');

  useEffect(() => {
    if (authCode === '772610') {
      onSuccess();
    }
  }, [authCode, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 420 }}>
      <Text fw={600} size="lg" mb="md">Two-factor verification</Text>
      
      <Stack gap="lg">
        {/* Email code */}
        <div aria-labelledby="email-code-label">
          <Text id="email-code-label" fw={500} size="sm" mb="xs">Email code</Text>
          <Group data-testid="otp-email-code" aria-label="Email code">
            <PinInput
              length={6}
              type="number"
              value={emailCode}
              onChange={setEmailCode}
            />
          </Group>
        </div>

        {/* Authenticator app code */}
        <div aria-labelledby="auth-code-label">
          <Text id="auth-code-label" fw={500} size="sm" mb="xs">Authenticator app code</Text>
          <Group data-testid="otp-authenticator-code" aria-label="Authenticator app code">
            <PinInput
              length={6}
              type="number"
              value={authCode}
              onChange={setAuthCode}
            />
          </Group>
        </div>

        {/* Clutter elements */}
        <Checkbox size="sm" label="Trust this browser" />
        <Anchor size="xs" href="#">Need help?</Anchor>
      </Stack>
    </Card>
  );
}
