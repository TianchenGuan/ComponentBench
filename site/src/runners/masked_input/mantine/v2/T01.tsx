'use client';

/**
 * masked_input-mantine-v2-T01: Emergency phone in ScrollArea with row apply
 *
 * A Mantine ScrollArea titled "Emergency contacts" contains two masked US phone
 * fields plus several filler settings rows to push "Emergency contact phone"
 * below the fold. Each row has a local Apply button; until Apply is clicked
 * the row status shows "Draft".
 *
 * "Primary contact phone" starts as (718) 555-0100 and is visible at load.
 * "Emergency contact phone" starts empty and is below the fold.
 *
 * Success: Emergency contact phone equals "(917) 555-0120" AND its row Apply
 * has been clicked AND Primary contact phone remains "(718) 555-0100".
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, ScrollArea, Group, Button, Badge, Box, Switch, Divider } from '@mantine/core';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

interface PhoneRow {
  label: string;
  value: string;
  saved: boolean;
  draft: string;
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const [rows, setRows] = useState<PhoneRow[]>([
    { label: 'Primary contact phone', value: '(718) 555-0100', saved: true, draft: '(718) 555-0100' },
    { label: 'Emergency contact phone', value: '', saved: false, draft: '' },
  ]);

  useEffect(() => {
    if (successFired.current) return;
    const primary = rows[0];
    const emergency = rows[1];
    if (
      emergency.saved &&
      emergency.value === '(917) 555-0120' &&
      primary.value === '(718) 555-0100'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  const handleDraft = (idx: number, val: string) => {
    setRows(prev => prev.map((r, i) => (i === idx ? { ...r, draft: val } : r)));
  };

  const handleApply = (idx: number) => {
    setRows(prev =>
      prev.map((r, i) => (i === idx ? { ...r, value: r.draft, saved: true } : r)),
    );
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '6px 10px',
    fontSize: 13,
    border: '1px solid #ced4da',
    borderRadius: 4,
    outline: 'none',
  };

  const fillerRows = [
    'Enable SMS alerts',
    'Notify on missed calls',
    'Auto-forward to backup',
    'Log call duration',
    'International dialing prefix',
    'Silent mode override',
    'Ring timeout (seconds)',
  ];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 440 }}>
      <Text fw={600} size="lg" mb="sm">Emergency contacts</Text>
      <ScrollArea h={260} type="always" offsetScrollbars>
        <Box>
          {/* Primary phone row – visible at load */}
          <PhoneRowUI row={rows[0]} idx={0} inputStyle={inputStyle} onDraft={handleDraft} onApply={handleApply} />

          <Divider my="xs" />

          {/* Filler controls to push emergency phone below fold */}
          {fillerRows.map(label => (
            <Group key={label} justify="space-between" py={6} px={4}>
              <Text size="sm">{label}</Text>
              <Switch size="xs" />
            </Group>
          ))}

          <Divider my="xs" />

          {/* Emergency phone row – below the fold */}
          <PhoneRowUI row={rows[1]} idx={1} inputStyle={inputStyle} onDraft={handleDraft} onApply={handleApply} />
        </Box>
      </ScrollArea>
    </Card>
  );
}

function PhoneRowUI({
  row,
  idx,
  inputStyle,
  onDraft,
  onApply,
}: {
  row: PhoneRow;
  idx: number;
  inputStyle: React.CSSProperties;
  onDraft: (i: number, v: string) => void;
  onApply: (i: number) => void;
}) {
  return (
    <Box py={6} px={4}>
      <Group justify="space-between" mb={4}>
        <Text fw={500} size="sm">{row.label}</Text>
        <Badge size="sm" color={row.saved ? 'green' : 'gray'} variant="light">
          {row.saved ? 'Applied' : 'Draft'}
        </Badge>
      </Group>
      <Group gap="xs">
        <Box style={{ flex: 1 }}>
          <IMaskInput
            mask="(000) 000-0000"
            definitions={{ '0': /[0-9]/ }}
            placeholder="(###) ###-####"
            value={row.draft}
            onAccept={(val: string) => onDraft(idx, val)}
            data-testid={row.label.toLowerCase().replace(/\s+/g, '-')}
            style={inputStyle}
          />
        </Box>
        <Button size="xs" variant="light" onClick={() => onApply(idx)}>
          Apply
        </Button>
      </Group>
    </Box>
  );
}
