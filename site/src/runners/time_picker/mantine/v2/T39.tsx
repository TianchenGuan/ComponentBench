'use client';

/**
 * time_picker-mantine-v2-T39: Log time 13:07:30 with seconds in nested scroll
 *
 * Diagnostics layout: scrollable sidebar with filler content; Log time TimeInput withSeconds;
 * Apply diagnostics commits.
 *
 * Success: Log time 13:07:30 after Apply.
 */

import { useRef, useState, type ChangeEvent } from 'react';
import { Box, Button, ScrollArea, Text, Stack } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../../types';

function normHms(s: string) {
  if (!s) return '';
  const m = s.match(/^(\d{1,2}):(\d{2}):(\d{2})/);
  if (!m) return '';
  return `${m[1].padStart(2, '0')}:${m[2].padStart(2, '0')}:${m[3].padStart(2, '0')}`;
}

export default function T39({ onSuccess }: TaskComponentProps) {
  const [log, setLog] = useState('');
  const fired = useRef(false);

  const handleApply = () => {
    if (fired.current) return;
    if (normHms(log) === '13:07:30') {
      fired.current = true;
      onSuccess();
    }
  };

  const filler = Array.from({ length: 12 }, (_, i) => (
    <Text key={i} size="xs" c="dimmed" mb={8}>
      Diagnostics chunk {i + 1}: buffer health, queue depth, and sampling flags (scroll to Log time below).
    </Text>
  ));

  return (
    <Box style={{ display: 'flex', gap: 16, alignItems: 'flex-start', maxWidth: 720 }}>
      <Box style={{ flex: 1, minHeight: 120 }}>
        <Text fw={600} size="sm" mb={8}>
          Diagnostics overview
        </Text>
        <Text size="xs" c="dimmed">
          Use the sidebar scroll — Log time sits below the fold.
        </Text>
      </Box>
      <Box style={{ width: 280, border: '1px solid var(--mantine-color-default-border)', borderRadius: 8, padding: 8 }}>
        <Text fw={500} size="xs" mb={6}>
          Sidebar
        </Text>
        <ScrollArea h={220} type="auto" offsetScrollbars>
          <Stack gap={0} pr={6}>
            {filler}
            <div style={{ marginTop: 8 }}>
              <Text component="label" htmlFor="tp-log-time" fw={500} size="xs" mb={4} style={{ display: 'block' }}>
                Log time
              </Text>
              <TimeInput
                id="tp-log-time"
                value={log}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLog(e.currentTarget.value)}
                withSeconds
                size="xs"
                data-testid="tp-log-time"
              />
            </div>
          </Stack>
        </ScrollArea>
        <Button fullWidth size="xs" mt={8} onClick={handleApply} data-testid="apply-diagnostics">
          Apply diagnostics
        </Button>
      </Box>
    </Box>
  );
}
