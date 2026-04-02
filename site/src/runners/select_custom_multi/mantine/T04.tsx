'use client';

/**
 * select_custom_multi-mantine-T04: Set Secondary languages with two instances
 *
 * Scene context: theme=light, spacing=comfortable, layout=form_section, placement=center, scale=default, instances=2, guidance=text, clutter=none.
 * Layout: a minimal form section titled "Languages" centered on the page.
 * There are two Mantine MultiSelect components with identical appearance:
 *   - "Primary languages" (distractor instance)
 *   - "Secondary languages" (TARGET instance)
 * Both use the same option list: English, Spanish, French, German, Italian, Portuguese, Japanese, Korean, Mandarin, Hindi.
 * Initial state:
 *   - Primary languages has English selected.
 *   - Secondary languages has French selected (distractor that must be removed).
 * No other form controls are included in this section (clutter: none). There is no Save button; pills update immediately.
 *
 * Success: Only 'Secondary languages' is evaluated. The selected values are exactly: Japanese, Korean, German (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, MultiSelect, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const languageOptions = [
  'English', 'Spanish', 'French', 'German', 'Italian',
  'Portuguese', 'Japanese', 'Korean', 'Mandarin', 'Hindi'
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [primaryLanguages, setPrimaryLanguages] = useState<string[]>(['English']);
  const [secondaryLanguages, setSecondaryLanguages] = useState<string[]>(['French']);

  useEffect(() => {
    const targetSet = new Set(['Japanese', 'Korean', 'German']);
    const currentSet = new Set(secondaryLanguages);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [secondaryLanguages, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Languages</Text>
      <Stack gap="md">
        <MultiSelect
          data-testid="primary-languages-select"
          label="Primary languages"
          placeholder="Select languages"
          data={languageOptions}
          value={primaryLanguages}
          onChange={setPrimaryLanguages}
        />
        <MultiSelect
          data-testid="secondary-languages-select"
          label="Secondary languages"
          placeholder="Select languages"
          data={languageOptions}
          value={secondaryLanguages}
          onChange={setSecondaryLanguages}
        />
      </Stack>
    </Card>
  );
}
