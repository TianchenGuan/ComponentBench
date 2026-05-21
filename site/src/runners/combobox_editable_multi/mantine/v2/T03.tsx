'use client';

/**
 * combobox_editable_multi-mantine-v2-T03
 *
 * Compact card at bottom-right. Mantine MultiSelect (searchable, maxValues=4, comboboxProps position=top).
 * Visual reference "Target stack": React, Next.js, TypeScript, Tailwind.
 * Options: React, Vue, Next.js, Nuxt, TypeScript, JavaScript, Tailwind, Bootstrap.
 * Initial chips: none.
 * Success: Frameworks = {React, Next.js, TypeScript, Tailwind}, Save stack clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Text, MultiSelect, Button, Badge, Group, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const options = ['React', 'Vue', 'Next.js', 'Nuxt', 'TypeScript', 'JavaScript', 'Tailwind', 'Bootstrap'];
const TARGET_SET = ['React', 'Next.js', 'TypeScript', 'Tailwind'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [frameworks, setFrameworks] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(frameworks, TARGET_SET)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, frameworks, onSuccess]);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', minHeight: '80vh', padding: 24 }}>
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 360 }}>
        <Text fw={600} size="md" mb="xs">Stack configurator</Text>

        <Card withBorder padding="xs" radius="sm" mb="sm" bg="gray.0">
          <Text size="xs" c="dimmed" mb={4}>Target stack</Text>
          <Group gap={4}>
            {TARGET_SET.map((t) => (
              <Badge key={t} size="sm" variant="outline">{t}</Badge>
            ))}
          </Group>
        </Card>

        <Stack gap="xs">
          <Text fw={500} size="sm">Frameworks</Text>
          <MultiSelect
            placeholder="Search frameworks"
            data={options}
            value={frameworks}
            onChange={(v) => { setFrameworks(v); setSaved(false); }}
            searchable
            maxValues={4}
            comboboxProps={{ position: 'top' }}
          />
          <Button size="sm" onClick={() => setSaved(true)}>
            Save stack
          </Button>
        </Stack>
      </Card>
    </div>
  );
}
