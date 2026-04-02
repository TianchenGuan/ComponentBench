'use client';

/**
 * select_native-mantine-T05: Set Secondary language to Spanish (two selects)
 *
 * Layout: a centered isolated card titled "Languages".
 * The card contains TWO Mantine NativeSelect components stacked vertically:
 * 1) "Primary language"
 * 2) "Secondary language"  ← TARGET
 *
 * Both selects share the same options (label → value):
 * - English → en
 * - Spanish → es  ← TARGET OPTION
 * - French → fr
 * - German → de
 *
 * Initial state:
 * - Primary language: English
 * - Secondary language: French
 *
 * Clutter: none — no other inputs. The labels are prominent and directly above each select.
 * Feedback: immediate.
 *
 * Success: The target native select labeled "Secondary language" has selected option value 'es' (label 'Spanish').
 */

import React, { useState } from 'react';
import { Card, Text, NativeSelect, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [primaryLang, setPrimaryLang] = useState<string>('en');
  const [secondaryLang, setSecondaryLang] = useState<string>('fr');

  const handleSecondaryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSecondaryLang(value);
    if (value === 'es') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Languages</Text>
      
      <Stack gap="md">
        <NativeSelect
          data-testid="primary-language"
          data-canonical-type="select_native"
          data-selected-value={primaryLang}
          label="Primary language"
          value={primaryLang}
          onChange={(e) => setPrimaryLang(e.target.value)}
          data={options}
        />

        <NativeSelect
          data-testid="secondary-language"
          data-canonical-type="select_native"
          data-selected-value={secondaryLang}
          label="Secondary language"
          value={secondaryLang}
          onChange={handleSecondaryChange}
          data={options}
        />
      </Stack>
    </Card>
  );
}
