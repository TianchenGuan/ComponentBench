'use client';

/**
 * listbox_multi-mantine-T01: Pick spoken languages
 *
 * Layout: isolated_card centered titled "Profile".
 * Target component: a Mantine Checkbox.Group rendered as a vertical Stack of Checkbox items, labeled "Languages".
 * Options (8): English, Spanish, French, German, Japanese, Korean, Mandarin, Hindi.
 * Initial state: none selected.
 * No overlays or scrolling. No other checkbox groups are present.
 * Feedback: checkmarks update immediately; a small line below shows "Current value: …" with the selected values.
 *
 * Success: The target listbox has exactly: English, Spanish, Japanese.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Checkbox, Stack, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const options = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Mandarin', 'Hindi'];
const targetSet = ['English', 'Spanish', 'Japanese'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(selected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="xs">
        Profile
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Languages (select all that apply).
      </Text>
      <Checkbox.Group
        data-testid="listbox-languages"
        value={selected}
        onChange={setSelected}
      >
        <Stack gap="xs">
          {options.map((opt) => (
            <Checkbox key={opt} value={opt} label={opt} />
          ))}
        </Stack>
      </Checkbox.Group>
      <Text size="sm" c="dimmed" mt="md">
        Current value: {selected.join(', ') || '–'}
      </Text>
    </Card>
  );
}
