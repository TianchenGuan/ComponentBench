'use client';

/**
 * context_menu-mantine-v2-T09: Key preview — match shortcut Ctrl+Shift+K → Copy key
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Paper, Text, Group, Box, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [path, setPath] = useState<string[] | null>(null);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    if (path && path[0] === 'Copy key') {
      done.current = true;
      onSuccess();
    }
  }, [path, onSuccess]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpened(true);
  };

  return (
    <Paper shadow="sm" p="md" radius="md" w={380} maw="100%" ml="auto">
      <Stack gap="sm">
        <Group gap="xs">
          <Text size="xs" c="dimmed">
            Reference
          </Text>
          <Box
            px={10}
            py={4}
            style={{
              borderRadius: 20,
              background: 'var(--mantine-color-gray-2)',
              fontFamily: 'monospace',
              fontSize: 11,
            }}
            data-testid="reference-pill"
          >
            Ctrl+Shift+K
          </Box>
        </Group>
        <Group gap="md" wrap="nowrap">
          <Box
            p="sm"
            style={{
              flex: 1,
              border: '1px dashed var(--mantine-color-gray-4)',
              borderRadius: 8,
            }}
          >
            <Text size="xs" c="dimmed">
              Other preview
            </Text>
          </Box>
          <Menu opened={opened} onChange={setOpened} position="left-start">
            <Menu.Target>
              <Box
                p="sm"
                w={160}
                onContextMenu={handleContextMenu}
                style={{
                  border: '1px solid var(--mantine-color-teal-4)',
                  borderRadius: 8,
                  cursor: 'context-menu',
                }}
                data-testid="key-preview"
              >
                <Text size="sm" fw={600}>
                  Key preview
                </Text>
                <Text size="xs" c="dimmed" truncate>
                  config.env.API_KEY
                </Text>
              </Box>
            </Menu.Target>
            <Menu.Dropdown data-testid="context-menu-overlay">
              <Menu.Item
                rightSection={
                  <Text size="xs" c="dimmed" ff="monospace">
                    Ctrl+C
                  </Text>
                }
                onClick={() => {
                  setPath(['Copy value']);
                  setOpened(false);
                }}
              >
                Copy value
              </Menu.Item>
              <Menu.Item
                rightSection={
                  <Text size="xs" c="dimmed" ff="monospace">
                    Ctrl+Shift+K
                  </Text>
                }
                onClick={() => {
                  setPath(['Copy key']);
                  setOpened(false);
                }}
              >
                Copy key
              </Menu.Item>
              <Menu.Item
                rightSection={
                  <Text size="xs" c="dimmed" ff="monospace">
                    Ctrl+Shift+P
                  </Text>
                }
                onClick={() => {
                  setPath(['Copy path']);
                  setOpened(false);
                }}
              >
                Copy path
              </Menu.Item>
              <Menu.Item
                rightSection={
                  <Text size="xs" c="dimmed" ff="monospace">
                    Ctrl+Enter
                  </Text>
                }
                onClick={() => {
                  setPath(['Open in new tab']);
                  setOpened(false);
                }}
              >
                Open in new tab
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Stack>
    </Paper>
  );
}
