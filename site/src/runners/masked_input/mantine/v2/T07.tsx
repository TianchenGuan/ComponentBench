'use client';

/**
 * masked_input-mantine-v2-T07: License key in compact strip with confirm popover
 *
 * A high-contrast inline surface near bottom-left with compact spacing. Two masked
 * license-key rows: "Primary license key" (ABCD-EF12-GH34) and "Backup license key"
 * (ABCD-EF12-GH00). Mask: AAAA-AAAA-AAAA. Each row has a Save button that opens a
 * Popover with Confirm/Cancel. Only Confirm commits.
 *
 * Success: Backup license key committed value equals "QWER-TY12-ZX90" AND Confirm was
 * clicked AND Primary license key remains "ABCD-EF12-GH34".
 */

import React, { useState, useRef, useEffect } from 'react';
import { Text, Button, Group, Box, Popover, Badge, Chip, ActionIcon, MantineProvider } from '@mantine/core';
import { IconSettings, IconBell, IconLock } from '@tabler/icons-react';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

interface LicenseRow {
  label: string;
  value: string;
  draft: string;
  saved: boolean;
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const [rows, setRows] = useState<LicenseRow[]>([
    { label: 'Primary license key', value: 'ABCD-EF12-GH34', draft: 'ABCD-EF12-GH34', saved: true },
    { label: 'Backup license key', value: 'ABCD-EF12-GH00', draft: 'ABCD-EF12-GH00', saved: false },
  ]);
  const [popoverIdx, setPopoverIdx] = useState<number | null>(null);

  useEffect(() => {
    if (successFired.current) return;
    const primary = rows[0];
    const backup = rows[1];
    if (backup.saved && backup.value === 'QWER-TY12-ZX90' && primary.value === 'ABCD-EF12-GH34') {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  const handleDraft = (idx: number, val: string) => {
    setRows(prev => prev.map((r, i) => (i === idx ? { ...r, draft: val } : r)));
  };

  const handleSave = (idx: number) => {
    setPopoverIdx(idx);
  };

  const handleConfirm = (idx: number) => {
    setRows(prev =>
      prev.map((r, i) => (i === idx ? { ...r, value: r.draft, saved: true } : r)),
    );
    setPopoverIdx(null);
  };

  const handleCancelPopover = () => {
    setPopoverIdx(null);
  };

  const inputStyle: React.CSSProperties = {
    width: 160,
    padding: '2px 6px',
    fontSize: 12,
    border: '1px solid #555',
    borderRadius: 3,
    background: '#111',
    color: '#fff',
    outline: 'none',
    fontFamily: 'monospace',
  };

  return (
    <MantineProvider defaultColorScheme="light">
      <Box
        p="sm"
        style={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          width: 480,
          background: '#000',
          color: '#fff',
          borderRadius: 6,
          border: '2px solid #fff',
        }}
      >
        <Group justify="space-between" mb="xs">
          <Text fw={700} size="sm" c="white">Licensing</Text>
          <Group gap={4}>
            <Chip size="xs" variant="filled" checked={false}>Pro</Chip>
            <ActionIcon size="xs" variant="subtle" c="white"><IconSettings size={12} /></ActionIcon>
            <ActionIcon size="xs" variant="subtle" c="white"><IconBell size={12} /></ActionIcon>
            <ActionIcon size="xs" variant="subtle" c="white"><IconLock size={12} /></ActionIcon>
          </Group>
        </Group>

        {rows.map((row, idx) => (
          <Group key={row.label} gap="xs" py={4} align="center">
            <Text size="xs" c="white" style={{ width: 130 }}>{row.label}</Text>
            <IMaskInput
              mask="AAAA-AAAA-AAAA"
              definitions={{ A: /[A-Z0-9]/ }}
              placeholder="AAAA-AAAA-AAAA"
              value={row.draft}
              onAccept={(val: string) => handleDraft(idx, val)}
              data-testid={row.label.toLowerCase().replace(/\s+/g, '-')}
              style={inputStyle}
            />
            <Badge size="xs" color={row.saved ? 'green' : 'gray'} variant="light">
              {row.saved ? 'Saved' : 'Draft'}
            </Badge>
            <Popover
              opened={popoverIdx === idx}
              onClose={handleCancelPopover}
              position="top"
              withArrow
              shadow="md"
            >
              <Popover.Target>
                <Button size="compact-xs" variant="light" onClick={() => handleSave(idx)}>
                  Save
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Text size="xs" mb="xs">Commit this license key?</Text>
                <Group gap="xs">
                  <Button size="compact-xs" onClick={() => handleConfirm(idx)}>Confirm</Button>
                  <Button size="compact-xs" variant="default" onClick={handleCancelPopover}>Cancel</Button>
                </Group>
              </Popover.Dropdown>
            </Popover>
          </Group>
        ))}
      </Box>
    </MantineProvider>
  );
}
