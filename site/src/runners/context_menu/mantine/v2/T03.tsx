'use client';

/**
 * context_menu-mantine-v2-T03: API token A1B2 — Revoke token… then Cancel
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Paper, Text, Group, Stack, Button, Switch, Box } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<'idle' | 'cancelled' | 'confirmed'>('idle');
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    if (confirmationResult === 'cancelled') {
      done.current = true;
      onSuccess();
    }
  }, [confirmationResult, onSuccess]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpened(true);
  };

  return (
    <Paper
      shadow="sm"
      p="md"
      radius="md"
      w={420}
      maw="100%"
      bg="dark.7"
      c="gray.0"
    >
      <Text fw={600} size="sm" mb="md">
        API &amp; security
      </Text>
      <Stack gap="sm" mb="md">
        <Group justify="space-between">
          <Text size="xs">Rotate keys automatically</Text>
          <Switch size="xs" color="blue" />
        </Group>
        <Group justify="space-between">
          <Text size="xs">IP allowlist</Text>
          <Switch size="xs" color="blue" defaultChecked />
        </Group>
      </Stack>

      <Menu
        opened={opened}
        onChange={(o) => {
          setOpened(o);
          if (!o) {
            setConfirmRevoke(false);
            if (confirmationResult === 'idle') setConfirmationResult('idle');
          }
        }}
        closeOnItemClick={false}
        position="bottom-start"
      >
        <Menu.Target>
          <Box
            p="sm"
            onContextMenu={handleContextMenu}
            style={{
              border: '1px solid var(--mantine-color-dark-4)',
              borderRadius: 8,
              cursor: 'context-menu',
              background: 'var(--mantine-color-dark-6)',
            }}
            data-testid="token-row-a1b2"
            data-pending-action={confirmRevoke ? 'Revoke token' : ''}
            data-confirmation-result={confirmationResult === 'idle' ? '' : confirmationResult}
          >
            <Text size="sm" fw={600}>
              API token A1B2
            </Text>
            <Text size="xs" c="dimmed">
              Created Jan 4 · Last used 12m ago
            </Text>
          </Box>
        </Menu.Target>
        <Menu.Dropdown data-testid="context-menu-overlay">
          <Menu.Item
            onClick={() => {
              setConfirmRevoke(false);
              setOpened(false);
            }}
          >
            Copy token ID
          </Menu.Item>
          <Menu.Item
            color="red"
            onClick={() => {
              setConfirmRevoke(true);
            }}
          >
            Revoke token…
          </Menu.Item>
          {confirmRevoke && (
            <Box p="xs" pt={0} style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
              <Text size="xs" mb="xs">
                Revoke this token? Apps using it will fail.
              </Text>
              <Group gap="xs" grow>
                <Button
                  size="xs"
                  variant="default"
                  data-testid="revoke-cancel"
                  onClick={() => {
                    setConfirmationResult('cancelled');
                    setOpened(false);
                    setConfirmRevoke(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="xs"
                  color="red"
                  onClick={() => {
                    setConfirmationResult('confirmed');
                    setOpened(false);
                    setConfirmRevoke(false);
                  }}
                >
                  Revoke
                </Button>
              </Group>
            </Box>
          )}
        </Menu.Dropdown>
      </Menu>
    </Paper>
  );
}
