'use client';

/**
 * checkbox_tristate-mantine-T04: Enable Email digest (Checked)
 *
 * Layout: form_section titled "Digest delivery", centered.
 * There are two Mantine tri-state checkboxes:
 * - "Email digest" (target)
 * - "SMS digest" (distractor)
 *
 * Initial states:
 * - Email digest: Unchecked
 * - SMS digest: Indeterminate
 *
 * Clutter: low. A non-required input "Digest frequency" (dropdown) is shown below.
 * No Save/Apply control; state changes are immediate.
 * 
 * Success: "Email digest" is Checked.
 */

import React, { useState } from 'react';
import { Card, Checkbox, Text, Select, Stack } from '@mantine/core';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [emailState, setEmailState] = useState<TristateValue>('unchecked');
  const [smsState, setSmsState] = useState<TristateValue>('indeterminate');

  const handleEmailClick = () => {
    const newState = cycleTristateValue(emailState);
    setEmailState(newState);
    if (newState === 'checked') {
      onSuccess();
    }
  };

  const handleSmsClick = () => {
    setSmsState(cycleTristateValue(smsState));
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} mb="md">Digest delivery</Text>
      
      <Stack gap="sm">
        <div onClick={handleEmailClick} style={{ cursor: 'pointer' }}>
          <Checkbox
            checked={emailState === 'checked'}
            indeterminate={emailState === 'indeterminate'}
            label="Email digest"
            data-testid="email-digest-checkbox"
            readOnly
          />
        </div>
        
        <div onClick={handleSmsClick} style={{ cursor: 'pointer' }}>
          <Checkbox
            checked={smsState === 'checked'}
            indeterminate={smsState === 'indeterminate'}
            label="SMS digest"
            data-testid="sms-digest-checkbox"
            readOnly
          />
        </div>
      </Stack>

      <Select
        label="Digest frequency"
        placeholder="Select frequency"
        data={[
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' },
        ]}
        mt="lg"
      />
    </Card>
  );
}
