'use client';

/**
 * select_custom_single-mantine-v2-T15: Language settings — set Backup language to Japanese and save
 *
 * Dark settings panel with three Mantine Select controls of identical styling:
 * "Primary language" (English, must stay), "Backup language" (Spanish → Japanese),
 * "UI language" (English, must stay). Options: English, Spanish, Japanese, German.
 * Surrounded by unrelated toggles, segmented controls, help links.
 * Footer: "Save language settings". Committed only after Save.
 *
 * Success: Backup language = "Japanese", Primary language still "English",
 * UI language still "English", "Save language settings" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, Text, Select, Button, Group, Badge, Stack, SegmentedControl,
  Switch, Anchor, Divider, MantineProvider,
} from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'German', label: 'German' },
];

export default function T15({ onSuccess }: TaskComponentProps) {
  const [primaryLang, setPrimaryLang] = useState<string | null>('English');
  const [backupLang, setBackupLang] = useState<string | null>('Spanish');
  const [uiLang, setUiLang] = useState<string | null>('English');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved &&
      backupLang === 'Japanese' &&
      primaryLang === 'English' &&
      uiLang === 'English'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, backupLang, primaryLang, uiLang, onSuccess]);

  return (
    <MantineProvider forceColorScheme="dark">
      <div style={{ padding: 16, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', minHeight: '80vh' }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
          <Text fw={700} size="lg" mb="md">Language Settings</Text>

          <Stack gap="md">
            <Select
              label="Primary language"
              data={languageOptions}
              value={primaryLang}
              onChange={(val) => { setPrimaryLang(val); setSaved(false); }}
            />

            <Select
              label="Backup language"
              data={languageOptions}
              value={backupLang}
              onChange={(val) => { setBackupLang(val); setSaved(false); }}
            />

            <Select
              label="UI language"
              data={languageOptions}
              value={uiLang}
              onChange={(val) => { setUiLang(val); setSaved(false); }}
            />

            <Divider />

            <Group justify="space-between">
              <Text size="sm">Date format</Text>
              <SegmentedControl size="xs" data={['MM/DD', 'DD/MM', 'YYYY-MM-DD']} defaultValue="MM/DD" />
            </Group>

            <Group justify="space-between">
              <Text size="sm">Auto-translate</Text>
              <Switch size="sm" defaultChecked />
            </Group>

            <Group gap="xs">
              <Badge size="sm" variant="outline">Locale: en-US</Badge>
              <Anchor size="xs" href="#">Help & docs</Anchor>
            </Group>

            <Button fullWidth onClick={() => setSaved(true)}>Save language settings</Button>
          </Stack>
        </Card>
      </div>
    </MantineProvider>
  );
}
