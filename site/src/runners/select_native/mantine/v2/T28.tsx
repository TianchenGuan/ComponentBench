'use client';

/**
 * select_native-mantine-v2-T28: Locale modal — set Time zone to Tokyo and save
 *
 * "Regional preferences" button opens a Mantine Modal with two NativeSelect controls:
 * "Time zone" (starts Chicago UTC-06:00 → Tokyo UTC+09:00) and "Region locale"
 * (starts en-US, must stay). Checkbox and helper text present.
 * Footer: "Cancel" / "Save preferences".
 *
 * Success: Time zone = "Asia/Tokyo", Region locale = "en-US", Save clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, NativeSelect, Button, Group, Stack, Modal, Checkbox, Box } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const timezoneOptions = [
  { label: 'New York (UTC-05:00)', value: 'America/New_York' },
  { label: 'Chicago (UTC-06:00)', value: 'America/Chicago' },
  { label: 'Denver (UTC-07:00)', value: 'America/Denver' },
  { label: 'Los Angeles (UTC-08:00)', value: 'America/Los_Angeles' },
  { label: 'London (UTC+00:00)', value: 'Europe/London' },
  { label: 'Berlin (UTC+01:00)', value: 'Europe/Berlin' },
  { label: 'Tokyo (UTC+09:00)', value: 'Asia/Tokyo' },
  { label: 'Sydney (UTC+11:00)', value: 'Australia/Sydney' },
];

const localeOptions = [
  { label: 'English (US)', value: 'en-US' },
  { label: 'English (UK)', value: 'en-GB' },
  { label: 'Japanese', value: 'ja-JP' },
  { label: 'German', value: 'de-DE' },
];

export default function T28({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [timezone, setTimezone] = useState('America/Chicago');
  const [regionLocale, setRegionLocale] = useState('en-US');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && timezone === 'Asia/Tokyo' && regionLocale === 'en-US') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, timezone, regionLocale, onSuccess]);

  const handleSave = () => {
    setSaved(true);
    setOpen(false);
  };

  return (
    <Box p="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: 400 }}>
        <Text fw={600} size="lg" mb="xs">Profile</Text>
        <Text size="sm" c="dimmed" mb="md">
          Manage your regional and locale settings.
        </Text>
        <Button onClick={() => setOpen(true)}>Regional preferences</Button>
      </Card>

      <Modal opened={open} onClose={() => setOpen(false)} title="Regional Preferences" centered>
        <Stack gap="md">
          <NativeSelect
            data-testid="timezone"
            data-canonical-type="select_native"
            data-selected-value={timezone}
            label="Time zone"
            value={timezone}
            onChange={(e) => { setTimezone(e.target.value); setSaved(false); }}
            data={timezoneOptions}
          />

          <NativeSelect
            data-testid="region-locale"
            data-canonical-type="select_native"
            data-selected-value={regionLocale}
            label="Region locale"
            value={regionLocale}
            onChange={(e) => { setRegionLocale(e.target.value); setSaved(false); }}
            data={localeOptions}
          />

          <Checkbox label="Use 24-hour format for this locale" defaultChecked />

          <Text size="xs" c="dimmed">
            These settings affect how dates, times, and numbers are displayed across the app.
          </Text>
        </Stack>

        <Group mt="lg" justify="flex-end" gap="sm">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save preferences</Button>
        </Group>
      </Modal>
    </Box>
  );
}
