'use client';

/**
 * select_native-mantine-T08: Set time format in modal and Save
 *
 * Layout: a profile page with a button labeled "Preferences". Clicking it opens a modal dialog.
 * Inside the modal:
 * - Title: "Preferences"
 * - Target component: Mantine NativeSelect labeled "Time format"
 * - Footer buttons: "Cancel" and "Save"
 *
 * Options (label → value):
 * - 12-hour (AM/PM) → 12h
 * - 24-hour → 24h  ← TARGET
 *
 * Initial state: 12-hour is selected.
 * Clutter: low — one checkbox "Show seconds" appears above the footer.
 * Feedback: selection changes immediately, but success requires clicking "Save" to confirm.
 *
 * Success: The target native select has selected option value '24h' AND user clicks 'Save'.
 */

import React, { useState } from 'react';
import { Card, Text, NativeSelect, Button, Modal, Group, Checkbox, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { label: '12-hour (AM/PM)', value: '12h' },
  { label: '24-hour', value: '24h' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [timeFormat, setTimeFormat] = useState<string>('12h');
  const [showSeconds, setShowSeconds] = useState(false);

  const handleSave = () => {
    if (timeFormat === '24h') {
      onSuccess();
    }
    setOpened(false);
  };

  const handleCancel = () => {
    setOpened(false);
    setTimeFormat('12h'); // Reset to initial
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={600} size="lg" mb="xs">Profile</Text>
        <Text size="sm" c="dimmed" mb="md">
          Manage your profile and preferences
        </Text>
        <Button onClick={() => setOpened(true)}>Preferences</Button>
      </Card>

      <Modal opened={opened} onClose={handleCancel} title="Preferences" centered>
        <Stack gap="md">
          <NativeSelect
            data-testid="time-format-select"
            data-canonical-type="select_native"
            data-selected-value={timeFormat}
            label="Time format"
            value={timeFormat}
            onChange={(e) => setTimeFormat(e.target.value)}
            data={options}
          />

          <Checkbox
            label="Show seconds"
            checked={showSeconds}
            onChange={(e) => setShowSeconds(e.currentTarget.checked)}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
