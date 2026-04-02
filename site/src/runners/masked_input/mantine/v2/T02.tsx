'use client';

/**
 * masked_input-mantine-v2-T02: Raw account number in right drawer with in-field apply
 *
 * A page button opens a right-side Mantine Drawer titled "Payout account".
 * Inside: one masked TextInput "Account number" with a Formatted/Raw toggle above it.
 * Formatted mode groups digits with spaces (000 0000 00000); Raw mode shows digits only
 * while preserving the 12-digit numeric mask. The field starts empty in Formatted mode.
 * Right section has small Apply (check) and Cancel (x) ActionIcons.
 *
 * Success: raw_mode is true AND committed value equals "000012345678" AND Apply was clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button, Drawer, Text, SegmentedControl, ActionIcon, Group, Box } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [opened, setOpened] = useState(false);
  const [rawMode, setRawMode] = useState(false);
  const [draft, setDraft] = useState('');
  const [committed, setCommitted] = useState('');

  useEffect(() => {
    if (successFired.current) return;
    if (rawMode && committed === '000012345678') {
      successFired.current = true;
      onSuccess();
    }
  }, [rawMode, committed, onSuccess]);

  const handleApply = () => setCommitted(draft);
  const handleCancel = () => setDraft(committed);

  const mask = rawMode ? '000000000000' : '000 0000 00000';

  return (
    <>
      <Button onClick={() => setOpened(true)}>Add bank account</Button>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Payout account"
        position="right"
        size="sm"
        padding="md"
      >
        <Text fw={500} size="sm" mb={4}>Account number</Text>

        <SegmentedControl
          size="xs"
          mb="sm"
          value={rawMode ? 'raw' : 'formatted'}
          onChange={v => setRawMode(v === 'raw')}
          data={[
            { label: 'Formatted', value: 'formatted' },
            { label: 'Raw', value: 'raw' },
          ]}
        />

        <Group gap={4} align="flex-end">
          <Box style={{ flex: 1 }}>
            <IMaskInput
              key={rawMode ? 'raw' : 'fmt'}
              mask={mask}
              definitions={{ '0': /[0-9]/ }}
              placeholder={rawMode ? '000000000000' : '000 0000 00000'}
              value={draft}
              onAccept={(val: string) => setDraft(val)}
              data-testid="account-number"
              style={{
                width: '100%',
                padding: '6px 10px',
                fontSize: 14,
                border: '1px solid #ced4da',
                borderRadius: 4,
                outline: 'none',
              }}
            />
          </Box>
          <ActionIcon
            variant="light"
            color="green"
            size="sm"
            onClick={handleApply}
            aria-label="Apply"
            data-testid="apply-btn"
          >
            <IconCheck size={14} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="red"
            size="sm"
            onClick={handleCancel}
            aria-label="Cancel"
            data-testid="cancel-btn"
          >
            <IconX size={14} />
          </ActionIcon>
        </Group>

        <Text size="xs" c="dimmed" mt="xs">
          Status: {committed ? 'Saved' : 'Pending'}
        </Text>
      </Drawer>
    </>
  );
}
