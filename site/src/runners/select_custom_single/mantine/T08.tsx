'use client';

/**
 * select_custom_single-mantine-T08: Set Backup language to Japanese in dark settings panel
 *
 * Layout: settings_panel in dark theme titled "Language settings".
 * Spacing is comfortable; selects are default size.
 *
 * Instances: three Mantine Select components are present:
 * 1) Primary language (English)
 * 2) Backup language (Spanish)  ← TARGET
 * 3) UI language (English)
 *
 * Each dropdown includes the same language list: English, Spanish, French, German, Japanese, Korean.
 * The options are text-only but the dark theme reduces contrast and increases reliance on correct label association.
 *
 * Clutter: the panel also includes a toggle "Auto-detect language" and a button "Test translation".
 * These are distractors.
 *
 * Feedback: selecting a language updates the field immediately; no Save/Apply button is required.
 *
 * Success: The Select labeled "Backup language" has selected value exactly "Japanese".
 */

import React, { useState } from 'react';
import { Card, Text, Select, Switch, Button, Stack, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const languages = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Korean', label: 'Korean' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [primaryLanguage, setPrimaryLanguage] = useState<string | null>('English');
  const [backupLanguage, setBackupLanguage] = useState<string | null>('Spanish');
  const [uiLanguage, setUiLanguage] = useState<string | null>('English');

  const handleBackupChange = (newValue: string | null) => {
    setBackupLanguage(newValue);
    if (newValue === 'Japanese') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Language settings</Text>
      <Stack gap="md">
        <Select
          data-testid="primary-language-select"
          label="Primary language"
          data={languages}
          value={primaryLanguage}
          onChange={setPrimaryLanguage}
        />
        <Select
          data-testid="backup-language-select"
          label="Backup language"
          data={languages}
          value={backupLanguage}
          onChange={handleBackupChange}
        />
        <Select
          data-testid="ui-language-select"
          label="UI language"
          data={languages}
          value={uiLanguage}
          onChange={setUiLanguage}
        />
        <Group justify="space-between" mt="sm">
          <Switch label="Auto-detect language" />
          <Button variant="outline" size="sm">Test translation</Button>
        </Group>
      </Stack>
    </Card>
  );
}
