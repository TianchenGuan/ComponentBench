'use client';

/**
 * autocomplete_restricted-mantine-v2-T01
 *
 * Dense locale settings panel with two clearable Mantine Select controls:
 * Primary locale (en-US) and Backup locale (de-DE). High clutter with switches, radio, helper text.
 * Success: Backup locale cleared to null, Primary locale remains en-US, Save locale settings clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Text, Select, Button, Switch, Radio, Group, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const localeOptions = [
  { label: 'en-US', value: 'en-US' },
  { label: 'en-GB', value: 'en-GB' },
  { label: 'de-DE', value: 'de-DE' },
  { label: 'fr-FR', value: 'fr-FR' },
  { label: 'ja-JP', value: 'ja-JP' },
  { label: 'es-ES', value: 'es-ES' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [primary, setPrimary] = useState<string | null>('en-US');
  const [backup, setBackup] = useState<string | null>('de-DE');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && backup === null && primary === 'en-US') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, backup, primary, onSuccess]);

  return (
    <div style={{ padding: 24 }}>
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 420 }}>
        <Text fw={600} size="lg" mb="sm">Locale settings</Text>

        <Stack gap="xs">
          <Switch defaultChecked label="Auto-detect locale" size="sm" />
          <Switch label="Use 24-hour clock" size="sm" />
          <Text size="xs" c="dimmed">
            When auto-detect is enabled, the primary locale is used as fallback.
          </Text>

          <Radio.Group defaultValue="metric" label="Measurement system" size="sm">
            <Group mt={4}>
              <Radio value="metric" label="Metric" size="sm" />
              <Radio value="imperial" label="Imperial" size="sm" />
            </Group>
          </Radio.Group>

          <Text fw={500} size="sm">Primary locale</Text>
          <Select
            size="sm"
            placeholder="Select locale"
            data={localeOptions}
            value={primary}
            onChange={(v) => { setPrimary(v); setSaved(false); }}
            searchable
            clearable
          />

          <Text fw={500} size="sm">Backup locale</Text>
          <Select
            size="sm"
            placeholder="Select locale"
            data={localeOptions}
            value={backup}
            onChange={(v) => { setBackup(v); setSaved(false); }}
            searchable
            clearable
          />

          <Button size="sm" mt="xs" onClick={() => setSaved(true)}>
            Save locale settings
          </Button>
        </Stack>
      </Card>
    </div>
  );
}
