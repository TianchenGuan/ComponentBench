'use client';

/**
 * autocomplete_restricted-mantine-v2-T02
 *
 * Nested scroll layout with a "Timesheet link" panel containing a non-searchable
 * Mantine Select for "Project code" (100 items PRJ-001 to PRJ-100).
 * PRJ-087 is offscreen initially.
 * Success: Project code = PRJ-087, Save project link clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Text, Select, Button, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const projectCodes = Array.from({ length: 100 }, (_, i) => {
  const n = String(i + 1).padStart(3, '0');
  return { label: `PRJ-${n}`, value: `PRJ-${n}` };
});

export default function T02({ onSuccess }: TaskComponentProps) {
  const [code, setCode] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && code === 'PRJ-087') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, code, onSuccess]);

  return (
    <div style={{ height: '100vh', overflow: 'auto', padding: 24 }}>
      <Text size="lg" fw={600} mb="md">Timesheet configuration</Text>
      <Text size="sm" c="dimmed" mb="lg">
        Link a project code to this timesheet for billing attribution.
      </Text>

      <div style={{ maxHeight: 400, overflow: 'auto', border: '1px solid #dee2e6', borderRadius: 8, padding: 16 }}>
        <Card shadow="xs" padding="md" radius="md" withBorder>
          <Text fw={600} mb="sm">Timesheet link</Text>

          <Stack gap="sm">
            <Text fw={500} size="sm">Project code</Text>
            <Select
              placeholder="Choose project"
              data={projectCodes}
              value={code}
              onChange={(v) => { setCode(v); setSaved(false); }}
              searchable={false}
              maxDropdownHeight={220}
            />

            <Button size="sm" onClick={() => setSaved(true)}>
              Save project link
            </Button>
          </Stack>
        </Card>
      </div>
    </div>
  );
}
