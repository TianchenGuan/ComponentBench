'use client';

/**
 * select_with_search-mantine-T06: Clear the email frequency selection
 *
 * Layout: settings_panel centered titled "Notifications".
 * Component: one Mantine Select labeled "Email frequency" with searchable enabled and clearable enabled (a clear button appears when a value is selected).
 * Options: Never, Daily, Weekly, Monthly.
 * Initial state: "Daily" is selected.
 * Clutter (low): the panel also shows non-target switches (Push notifications, SMS alerts), but they do not affect success.
 * Feedback: clicking the clear control removes the selection and shows placeholder "Pick frequency".
 *
 * Success: The "Email frequency" Select has no selected value (empty / null).
 */

import React, { useState } from 'react';
import { Card, Text, Select, Switch, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { value: 'Never', label: 'Never' },
  { value: 'Daily', label: 'Daily' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Monthly', label: 'Monthly' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('Daily');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  const handleChange = (newValue: string | null) => {
    setValue(newValue);
    if (newValue === null) {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Notifications</Text>
      
      <Stack gap="md">
        <Select
          data-testid="email-frequency-select"
          label="Email frequency"
          placeholder="Pick frequency"
          searchable
          clearable
          data={options}
          value={value}
          onChange={handleChange}
        />
        
        <Switch
          label="Push notifications"
          checked={pushEnabled}
          onChange={(e) => setPushEnabled(e.currentTarget.checked)}
        />
        
        <Switch
          label="SMS alerts"
          checked={smsEnabled}
          onChange={(e) => setSmsEnabled(e.currentTarget.checked)}
        />
      </Stack>
    </Card>
  );
}
