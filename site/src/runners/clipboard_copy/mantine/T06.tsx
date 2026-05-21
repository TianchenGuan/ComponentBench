'use client';

/**
 * clipboard_copy-mantine-T06: Copy the device key matching the reference suffix
 *
 * Layout: isolated_card, centered.
 * The card title is "Device keys". At the top there is a badge labeled "Reference" that shows the target suffix in large text:
 * - Reference suffix: 4419
 *
 * Below, there is a list of four device rows. Each row shows:
 * - Device name (Device A/B/C/D)
 * - Device key (monospace)
 * - A Mantine CopyButton ActionIcon at the end of the row
 *
 * The keys are:
 * - Device A: devkey-0-4417
 * - Device B: devkey-1-4418
 * - Device C: devkey-2-4419  (target; matches reference suffix)
 * - Device D: devkey-3-4420
 *
 * Component behavior:
 * - Clicking a row's copy icon copies that row's full device key and toggles to "Copied" state briefly.
 *
 * Distractors: a small "Last used" timestamp per row (irrelevant).
 * Requirement: instances=4; target is the row whose key matches the reference suffix.
 *
 * Success: Clipboard text equals "devkey-2-4419".
 */

import React, { useState } from 'react';
import { Card, Text, Badge, Group, ActionIcon, Tooltip, CopyButton as MantineCopyButton, Stack, Box } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

const devices = [
  { id: 'a', name: 'Device A', key: 'devkey-0-4417', lastUsed: '2 hours ago' },
  { id: 'b', name: 'Device B', key: 'devkey-1-4418', lastUsed: '1 day ago' },
  { id: 'c', name: 'Device C', key: 'devkey-2-4419', lastUsed: '5 mins ago' },  // target
  { id: 'd', name: 'Device D', key: 'devkey-3-4420', lastUsed: '3 days ago' },
];

const targetKey = 'devkey-2-4419';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (key: string, deviceId: string) => {
    await copyToClipboard(key, `Device ${deviceId.toUpperCase()}`);
    setCopiedId(deviceId);
    setTimeout(() => setCopiedId(null), 2000);

    // Only complete if the correct key was copied
    if (key === targetKey && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }} data-testid="device-keys-card">
      <Text fw={500} size="lg" mb="md">Device keys</Text>
      
      <Stack gap="md">
        {/* Reference badge */}
        <Box style={{ textAlign: 'center', padding: '8px 0' }}>
          <Badge size="lg" variant="filled" color="blue" data-testid="reference-badge">
            Reference suffix: 4419
          </Badge>
        </Box>

        {/* Device list */}
        {devices.map((device) => (
          <Group
            key={device.id}
            justify="space-between"
            p="xs"
            style={{ background: '#f8f9fa', borderRadius: 8 }}
            data-testid={`device-row-${device.id}`}
          >
            <Stack gap={2}>
              <Text size="sm" fw={500}>{device.name}</Text>
              <Text size="xs" c="dimmed">Last used: {device.lastUsed}</Text>
            </Stack>
            <Group gap="xs">
              <Text ff="monospace" size="sm">{device.key}</Text>
              <MantineCopyButton value={device.key} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip label={copied || copiedId === device.id ? 'Copied' : 'Copy'} withArrow>
                    <ActionIcon
                      color={copied || copiedId === device.id ? 'teal' : 'gray'}
                      variant="subtle"
                      onClick={() => {
                        copy();
                        handleCopy(device.key, device.id);
                      }}
                      data-testid={`copy-device-${device.id}`}
                      aria-label={`Copy ${device.name} key`}
                    >
                      {copied || copiedId === device.id ? <IconCheck size={16} /> : <IconCopy size={16} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </MantineCopyButton>
            </Group>
          </Group>
        ))}
      </Stack>
    </Card>
  );
}
