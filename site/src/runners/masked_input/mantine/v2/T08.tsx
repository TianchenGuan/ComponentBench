'use client';

/**
 * masked_input-mantine-v2-T08: Backup serial code among three dark rows
 *
 * A dark settings panel in the lower-right with compact spacing. Three masked
 * serial-code rows: "Primary serial code" (SN-1024-8890), "Backup serial code"
 * (SN-1024-8800), and "Legacy serial code" (SN-9999-0001). Mask: SN-####-####.
 * Each row has a row-local Save button.
 *
 * Success: Backup serial code committed value equals "SN-1024-8896" AND Save was
 * clicked AND Primary remains "SN-1024-8890" AND Legacy remains "SN-9999-0001".
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Button, Badge, Group, Box, Divider, MantineProvider } from '@mantine/core';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

interface SerialRow {
  label: string;
  value: string;
  draft: string;
  saved: boolean;
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const [rows, setRows] = useState<SerialRow[]>([
    { label: 'Primary serial code', value: 'SN-1024-8890', draft: 'SN-1024-8890', saved: true },
    { label: 'Backup serial code', value: 'SN-1024-8800', draft: 'SN-1024-8800', saved: false },
    { label: 'Legacy serial code', value: 'SN-9999-0001', draft: 'SN-9999-0001', saved: true },
  ]);

  useEffect(() => {
    if (successFired.current) return;
    const primary = rows[0];
    const backup = rows[1];
    const legacy = rows[2];
    if (
      backup.saved &&
      backup.value === 'SN-1024-8896' &&
      primary.value === 'SN-1024-8890' &&
      legacy.value === 'SN-9999-0001'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  const handleDraft = (idx: number, val: string) => {
    setRows(prev => prev.map((r, i) => (i === idx ? { ...r, draft: val } : r)));
  };

  const handleSave = (idx: number) => {
    setRows(prev =>
      prev.map((r, i) => (i === idx ? { ...r, value: r.draft, saved: true } : r)),
    );
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '2px 6px',
    fontSize: 12,
    border: '1px solid #373a40',
    borderRadius: 3,
    background: '#25262b',
    color: '#c1c2c5',
    outline: 'none',
    fontFamily: 'monospace',
  };

  return (
    <MantineProvider defaultColorScheme="dark">
      <Box
        p="md"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 400,
          background: '#1a1b1e',
          borderRadius: 8,
          border: '1px solid #373a40',
        }}
      >
        <Text fw={700} size="md" mb="sm" c="white">Device registration</Text>

        {rows.map((row, idx) => (
          <React.Fragment key={row.label}>
            {idx > 0 && <Divider my={6} color="dark.4" />}
            <Box py={4}>
              <Group justify="space-between" mb={4}>
                <Text fw={500} size="xs" c="white">{row.label}</Text>
                <Badge size="xs" color={row.saved ? 'green' : 'gray'} variant="light">
                  {row.saved ? 'Saved' : 'Draft'}
                </Badge>
              </Group>
              <Group gap="xs">
                <Box style={{ flex: 1 }}>
                  <IMaskInput
                    mask="SN-0000-0000"
                    definitions={{ '0': /[0-9]/ }}
                    placeholder="SN-####-####"
                    value={row.draft}
                    onAccept={(val: string) => handleDraft(idx, val)}
                    data-testid={row.label.toLowerCase().replace(/\s+/g, '-')}
                    style={inputStyle}
                  />
                </Box>
                <Button size="compact-xs" variant="light" onClick={() => handleSave(idx)}>
                  Save
                </Button>
              </Group>
            </Box>
          </React.Fragment>
        ))}

        <Group gap="xs" mt="sm">
          <Badge size="xs" variant="dot" color="green">3 registered</Badge>
          <Badge size="xs" variant="dot" color="yellow">1 pending</Badge>
        </Group>
      </Box>
    </MantineProvider>
  );
}
