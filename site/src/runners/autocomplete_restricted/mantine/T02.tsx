'use client';

/**
 * autocomplete_restricted-mantine-T02: Clear selected language (clearable)
 *
 * setup_description:
 * The page shows a centered "Localization" card.
 *
 * It contains one Mantine **Select** labeled **Language** configured with a visible clear button (clearable).
 * - Theme: light; spacing: comfortable; size: default.
 * - Initial state: **English** is selected.
 * - A small clear "×" control appears in the right section when a value is present.
 * - Options: English, Spanish, French.
 * - No save/apply workflow; clearing immediately sets the value to empty.
 *
 * No other fields are present.
 *
 * Success: The "Language" Select has no selected value (empty/cleared).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Select } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const languages = [
  { label: 'English', value: 'English' },
  { label: 'Spanish', value: 'Spanish' },
  { label: 'French', value: 'French' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('English');
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && value === null) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Localization</Text>
      <Text fw={500} size="sm" mb={4}>Language</Text>
      <Select
        data-testid="language-select"
        placeholder="Choose language"
        data={languages}
        value={value}
        onChange={setValue}
        clearable
      />
    </Card>
  );
}
