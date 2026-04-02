'use client';

/**
 * clipboard_copy-mantine-T09: Copy read-only DSN in compact small panel
 *
 * Layout: settings_panel anchored near the bottom-left (placement=bottom_left).
 * Universal factors: spacing=compact, scale=small.
 *
 * The panel title is "Database connections". It lists three connection strings (each row has a Mantine CopyButton ActionIcon):
 * - Read-write DSN: postgres://rw_user@db.example.com:5432/app?sslmode=require
 * - Read-only DSN: postgres://ro_user@db.example.com:5432/app_ro?sslmode=require   (target)
 * - Analytics DSN: postgres://an_user@db.example.com:5432/analytics?sslmode=require
 *
 * Due to compact spacing and small scale, each DSN is displayed in a single line with ellipsis truncation. The copy icon is small and aligned at the end of the row.
 *
 * Component behavior:
 * - Clicking a row's copy icon copies the FULL DSN string (not the truncated rendering) and briefly changes tooltip to "Copied".
 *
 * Distractors: an "Edit" icon per row (disabled; does nothing).
 * Requirement: instances=3; target is the Read-only DSN row.
 *
 * Success: Clipboard text equals "postgres://ro_user@db.example.com:5432/app_ro?sslmode=require".
 */

import React, { useState } from 'react';
import { Card, Text, Group, ActionIcon, Tooltip, CopyButton as MantineCopyButton, Stack, Box } from '@mantine/core';
import { IconCopy, IconCheck, IconPencil } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

const connections = [
  { id: 'rw', label: 'Read-write DSN', dsn: 'postgres://rw_user@db.example.com:5432/app?sslmode=require' },
  { id: 'ro', label: 'Read-only DSN', dsn: 'postgres://ro_user@db.example.com:5432/app_ro?sslmode=require' },  // target
  { id: 'an', label: 'Analytics DSN', dsn: 'postgres://an_user@db.example.com:5432/analytics?sslmode=require' },
];

const targetDsn = 'postgres://ro_user@db.example.com:5432/app_ro?sslmode=require';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (dsn: string, connId: string, label: string) => {
    await copyToClipboard(dsn, label);
    setCopiedId(connId);
    setTimeout(() => setCopiedId(null), 2000);

    // Only complete if Read-only DSN was copied
    if (dsn === targetDsn && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" p="sm" radius="md" withBorder style={{ width: 400 }} data-testid="database-panel">
      <Text fw={500} size="sm" mb="sm">Database connections</Text>
      
      <Stack gap={6}>
        {connections.map((conn) => (
          <Box
            key={conn.id}
            p={6}
            style={{ background: '#f8f9fa', borderRadius: 4 }}
            data-testid={`dsn-row-${conn.id}`}
          >
            <Group justify="space-between" wrap="nowrap">
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Text size="xs" c="dimmed">{conn.label}</Text>
                <Text
                  ff="monospace"
                  size="xs"
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  data-value={conn.dsn}
                >
                  {conn.dsn}
                </Text>
              </Box>
              <Group gap={4} wrap="nowrap">
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  color="gray"
                  disabled
                  data-testid={`edit-${conn.id}`}
                >
                  <IconPencil size={12} />
                </ActionIcon>
                <MantineCopyButton value={conn.dsn} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied || copiedId === conn.id ? 'Copied' : 'Copy'} withArrow>
                      <ActionIcon
                        size="xs"
                        color={copied || copiedId === conn.id ? 'teal' : 'gray'}
                        variant="subtle"
                        onClick={() => {
                          copy();
                          handleCopy(conn.dsn, conn.id, conn.label);
                        }}
                        data-testid={`copy-${conn.id}-dsn`}
                        aria-label={`Copy ${conn.label}`}
                      >
                        {copied || copiedId === conn.id ? <IconCheck size={12} /> : <IconCopy size={12} />}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </MantineCopyButton>
              </Group>
            </Group>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
