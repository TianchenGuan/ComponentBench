'use client';

/**
 * listbox_single-mantine-v2-T48: Reference swatch: set Backup accent to Violet and apply theme
 *
 * Theme panel with two NavLink listboxes: "Primary accent" (Red, Green, Blue, Violet —
 * initial: Blue, must stay) and "Backup accent" (same, initial: Green). Each row shows a
 * color swatch and label. A reference chip shows a violet swatch with no text.
 * Footer: "Apply theme" and "Discard". Committed only after Apply theme.
 *
 * Success: Backup accent = "violet", Primary accent still "blue", "Apply theme" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, NavLink, Stack, Button, Group, Badge, Divider, Box, Chip } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const colorOptions = [
  { value: 'red', label: 'Red', swatch: '#e03131' },
  { value: 'green', label: 'Green', swatch: '#2f9e44' },
  { value: 'blue', label: 'Blue', swatch: '#1971c2' },
  { value: 'violet', label: 'Violet', swatch: '#7048e8' },
];

function ColorSwatch({ color }: { color: string }) {
  return (
    <span style={{
      display: 'inline-block',
      width: 14,
      height: 14,
      borderRadius: '50%',
      background: color,
      border: '1px solid rgba(0,0,0,0.1)',
    }} />
  );
}

export default function T48({ onSuccess }: TaskComponentProps) {
  const [primaryAccent, setPrimaryAccent] = useState<string>('blue');
  const [backupAccent, setBackupAccent] = useState<string>('green');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && backupAccent === 'violet' && primaryAccent === 'blue') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, backupAccent, primaryAccent, onSuccess]);

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'flex-start' }}>
      <div style={{ maxWidth: 460 }}>
        <Box
          data-testid="violet-accent-swatch"
          mb="sm"
          p="sm"
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#f8f9fa',
            borderRadius: 8,
            border: '1px solid #dee2e6',
          }}
        >
          <span style={{
            display: 'inline-block',
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: '#7048e8',
          }} />
          <Text size="xs" c="dimmed" mt={4}>Reference</Text>
        </Box>

        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 440 }}>
          <Text fw={600} size="lg" mb="md">Theme Configuration</Text>

          <Group mb="sm">
            <Chip size="xs" checked={false}>Dashboard</Chip>
            <Chip size="xs" checked={false}>Preview mode</Chip>
          </Group>

          <Group grow align="flex-start" gap="md">
            <div>
              <Text size="sm" fw={600} mb={4}>Primary accent</Text>
              <Stack
                gap={0}
                data-cb-listbox-root
                data-cb-instance="primary"
                data-cb-selected-value={primaryAccent}
                role="listbox"
                style={{ border: '1px solid #dee2e6', borderRadius: 6 }}
              >
                {colorOptions.map(opt => (
                  <NavLink
                    key={opt.value}
                    label={opt.label}
                    leftSection={<ColorSwatch color={opt.swatch} />}
                    active={primaryAccent === opt.value}
                    onClick={() => { setPrimaryAccent(opt.value); setApplied(false); }}
                    data-cb-option-value={opt.value}
                    role="option"
                    aria-selected={primaryAccent === opt.value}
                  />
                ))}
              </Stack>
            </div>

            <div>
              <Text size="sm" fw={600} mb={4}>Backup accent</Text>
              <Stack
                gap={0}
                data-cb-listbox-root
                data-cb-instance="backup"
                data-cb-selected-value={backupAccent}
                role="listbox"
                style={{ border: '1px solid #dee2e6', borderRadius: 6 }}
              >
                {colorOptions.map(opt => (
                  <NavLink
                    key={opt.value}
                    label={opt.label}
                    leftSection={<ColorSwatch color={opt.swatch} />}
                    active={backupAccent === opt.value}
                    onClick={() => { setBackupAccent(opt.value); setApplied(false); }}
                    data-cb-option-value={opt.value}
                    role="option"
                    aria-selected={backupAccent === opt.value}
                  />
                ))}
              </Stack>
            </div>
          </Group>

          <Divider my="md" />

          <Group justify="flex-end" gap="xs">
            <Button
              variant="default"
              onClick={() => {
                setPrimaryAccent('blue');
                setBackupAccent('green');
                setApplied(false);
              }}
            >
              Discard
            </Button>
            <Button onClick={() => setApplied(true)}>Apply theme</Button>
          </Group>
        </Card>
      </div>
    </div>
  );
}
