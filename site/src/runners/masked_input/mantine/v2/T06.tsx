'use client';

/**
 * masked_input-mantine-v2-T06: Backup VAT ID offscreen in tax settings ScrollArea
 *
 * A dark settings panel with a Mantine ScrollArea containing mixed toggles, help
 * blocks, and two masked VAT-ID rows. "Primary VAT ID" is visible at load (starts
 * as EU-1024-11). "Backup VAT ID" is below the fold and starts empty. Mask: AA-####-##.
 * Each row has a Save button disabled until the value is complete.
 *
 * Success: Backup VAT ID committed value equals "EU-2048-77" AND its Save was clicked
 * AND Primary VAT ID remains "EU-1024-11".
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, ScrollArea, Group, Button, Badge, Box, Switch, Divider, MantineProvider } from '@mantine/core';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

interface VatRow {
  label: string;
  value: string;
  draft: string;
  saved: boolean;
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const [rows, setRows] = useState<VatRow[]>([
    { label: 'Primary VAT ID', value: 'EU-1024-11', draft: 'EU-1024-11', saved: true },
    { label: 'Backup VAT ID', value: '', draft: '', saved: false },
  ]);

  useEffect(() => {
    if (successFired.current) return;
    const primary = rows[0];
    const backup = rows[1];
    if (backup.saved && backup.value === 'EU-2048-77' && primary.value === 'EU-1024-11') {
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

  const isComplete = (val: string) => /^[A-Z]{2}-\d{4}-\d{2}$/.test(val);

  const fillerItems = [
    'Enable auto-filing',
    'Quarterly reporting',
    'EU reverse charge',
    'Include digital services',
    'MOSS registration',
    'Threshold monitoring',
    'Cross-border summary',
    'Intrastat reporting',
  ];

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '4px 8px',
    fontSize: 13,
    border: '1px solid #373a40',
    borderRadius: 4,
    background: '#25262b',
    color: '#c1c2c5',
    outline: 'none',
  };

  return (
    <MantineProvider defaultColorScheme="dark">
      <Box
        p="md"
        style={{
          width: 420,
          marginLeft: 60,
          background: '#1a1b1e',
          borderRadius: 8,
          border: '1px solid #373a40',
        }}
      >
        <Text fw={600} size="lg" mb="sm" c="white">Tax IDs</Text>
        <ScrollArea h={280} type="always" offsetScrollbars>
          <Box>
            {/* Primary VAT row */}
            <VatRowUI
              row={rows[0]}
              idx={0}
              inputStyle={inputStyle}
              isComplete={isComplete}
              onDraft={handleDraft}
              onSave={handleSave}
            />

            <Divider my="xs" color="dark.4" />

            {fillerItems.map(label => (
              <Group key={label} justify="space-between" py={5} px={4}>
                <Text size="xs" c="dimmed">{label}</Text>
                <Switch size="xs" />
              </Group>
            ))}

            <Divider my="xs" color="dark.4" />

            <Text size="xs" c="dimmed" px={4} py={4}>
              Need help? Contact tax-support@example.com for VAT filing assistance.
            </Text>

            <Divider my="xs" color="dark.4" />

            {/* Backup VAT row – below fold */}
            <VatRowUI
              row={rows[1]}
              idx={1}
              inputStyle={inputStyle}
              isComplete={isComplete}
              onDraft={handleDraft}
              onSave={handleSave}
            />
          </Box>
        </ScrollArea>
      </Box>
    </MantineProvider>
  );
}

function VatRowUI({
  row,
  idx,
  inputStyle,
  isComplete,
  onDraft,
  onSave,
}: {
  row: VatRow;
  idx: number;
  inputStyle: React.CSSProperties;
  isComplete: (v: string) => boolean;
  onDraft: (i: number, v: string) => void;
  onSave: (i: number) => void;
}) {
  return (
    <Box py={6} px={4}>
      <Group justify="space-between" mb={4}>
        <Text fw={500} size="sm" c="white">{row.label}</Text>
        <Badge size="xs" color={row.saved ? 'green' : 'gray'} variant="light">
          {row.saved ? 'Saved' : 'Draft'}
        </Badge>
      </Group>
      <Group gap="xs">
        <Box style={{ flex: 1 }}>
          <IMaskInput
            mask="AA-0000-00"
            definitions={{ A: /[A-Z]/, '0': /[0-9]/ }}
            placeholder="AA-####-##"
            value={row.draft}
            onAccept={(val: string) => onDraft(idx, val)}
            data-testid={row.label.toLowerCase().replace(/\s+/g, '-')}
            style={inputStyle}
          />
        </Box>
        <Button
          size="compact-xs"
          variant="light"
          disabled={!isComplete(row.draft)}
          onClick={() => onSave(idx)}
        >
          Save
        </Button>
      </Group>
    </Box>
  );
}
