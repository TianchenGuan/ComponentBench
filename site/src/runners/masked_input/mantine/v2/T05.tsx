'use client';

/**
 * masked_input-mantine-v2-T05: Reference badge copied into secondary employee ID
 *
 * A card titled "Staff IDs" placed near the upper-right. A bold badge shows the
 * target value EMP-2048. Two masked TextInputs: "Primary employee ID" (starts as
 * EMP-1024) and "Secondary employee ID" (starts empty). Mask: EMP-####.
 * A card-level "Apply IDs" button commits the card state.
 *
 * Success: Secondary employee ID committed value equals "EMP-2048" AND Apply IDs
 * was clicked AND Primary employee ID remains "EMP-1024".
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Badge, Button, Group, Box } from '@mantine/core';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

interface EmpRow {
  label: string;
  value: string;
  draft: string;
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const [rows, setRows] = useState<EmpRow[]>([
    { label: 'Primary employee ID', value: 'EMP-1024', draft: 'EMP-1024' },
    { label: 'Secondary employee ID', value: '', draft: '' },
  ]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && rows[1].value === 'EMP-2048' && rows[0].value === 'EMP-1024') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, rows, onSuccess]);

  const handleDraft = (idx: number, val: string) => {
    setRows(prev => prev.map((r, i) => (i === idx ? { ...r, draft: val } : r)));
  };

  const handleApply = () => {
    setRows(prev => prev.map(r => ({ ...r, value: r.draft })));
    setSaved(true);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '6px 10px',
    fontSize: 14,
    border: '1px solid #ced4da',
    borderRadius: 4,
    outline: 'none',
  };

  return (
    <Box style={{ position: 'fixed', top: 32, right: 32, width: 380 }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text fw={600} size="lg" mb="xs">Staff IDs</Text>

        <Group mb="md">
          <Text size="sm" c="dimmed">Target ID:</Text>
          <Badge size="lg" variant="filled" color="blue">EMP-2048</Badge>
        </Group>

        {rows.map((row, idx) => (
          <Box key={row.label} mb="sm">
            <Text fw={500} size="sm" mb={4}>{row.label}</Text>
            <IMaskInput
              mask="EMP-0000"
              definitions={{ '0': /[0-9]/ }}
              placeholder="EMP-####"
              value={row.draft}
              onAccept={(val: string) => handleDraft(idx, val)}
              data-testid={row.label.toLowerCase().replace(/\s+/g, '-')}
              style={inputStyle}
            />
          </Box>
        ))}

        <Button fullWidth mt="sm" onClick={handleApply}>Apply IDs</Button>
      </Card>
    </Box>
  );
}
