'use client';

/**
 * context_menu-mantine-v2-T02: Monthly report widget — scroll menu to Download as PDF
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Paper, Text, Group, Stack, Box, Switch, Badge } from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';

const GROUP_A = ['Refresh', 'Change timeframe', 'Pin widget', 'Duplicate widget'];
const GROUP_B = ['Export data', 'Download as CSV', 'Schedule email', 'Share snapshot'];
const GROUP_C = ['Open in tab', 'Widget settings', 'Reset layout', 'Download as PDF', 'Remove widget'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [path, setPath] = useState<string[] | null>(null);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    if (path && path.length === 1 && path[0] === 'Download as PDF') {
      done.current = true;
      onSuccess();
    }
  }, [path, onSuccess]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpened(true);
  };

  return (
    <Paper shadow="sm" p="md" radius="md" w={520} maw="100%">
      <Group align="flex-start" wrap="nowrap" gap="md">
        <Stack gap="xs" style={{ flex: 1 }}>
          <Text fw={600} size="sm">
            Dashboard
          </Text>
          <Group justify="space-between">
            <Text size="xs">Auto-refresh</Text>
            <Switch size="xs" defaultChecked />
          </Group>
          <Group justify="space-between">
            <Text size="xs">Show legends</Text>
            <Switch size="xs" />
          </Group>
          <Box
            p="sm"
            style={{
              border: '1px dashed var(--mantine-color-gray-4)',
              borderRadius: 8,
              background: 'var(--mantine-color-gray-0)',
            }}
          >
            <Text size="xs" c="dimmed">
              Side rail placeholder
            </Text>
          </Box>
        </Stack>
        <Box style={{ flex: 1.2, minWidth: 200 }}>
          <Group justify="space-between" mb={6}>
            <Text size="xs" fw={600}>
              Traffic
            </Text>
            <Badge size="xs" variant="light">
              Live
            </Badge>
          </Group>
          <Box h={48} mb="sm" style={{ background: 'var(--mantine-color-teal-0)', borderRadius: 6 }} />

          <Menu opened={opened} onChange={setOpened} position="bottom-start">
            <Menu.Target>
              <Box
                p="sm"
                onContextMenu={handleContextMenu}
                style={{
                  border: '1px solid var(--mantine-color-indigo-3)',
                  borderRadius: 8,
                  cursor: 'context-menu',
                  background: 'white',
                }}
                data-testid="monthly-report-widget"
              >
                <Group gap="xs">
                  <IconChartBar size={18} />
                  <div>
                    <Text size="sm" fw={600}>
                      Monthly report
                    </Text>
                    <Text size="xs" c="dimmed">
                      Last synced 2m ago
                    </Text>
                  </div>
                </Group>
              </Box>
            </Menu.Target>
            <Menu.Dropdown
              data-testid="context-menu-overlay"
              style={{ maxHeight: 220, overflowY: 'auto' }}
            >
              <Menu.Label>Common</Menu.Label>
              {GROUP_A.map((label) => (
                <Menu.Item key={label} onClick={() => setPath([label])}>
                  {label}
                </Menu.Item>
              ))}
              <Menu.Divider />
              <Menu.Label>Export</Menu.Label>
              {GROUP_B.map((label) => (
                <Menu.Item key={label} onClick={() => setPath([label])}>
                  {label}
                </Menu.Item>
              ))}
              <Menu.Divider />
              <Menu.Label>More</Menu.Label>
              {GROUP_C.map((label) => (
                <Menu.Item key={label} onClick={() => setPath([label])}>
                  {label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Box>
      </Group>
    </Paper>
  );
}
