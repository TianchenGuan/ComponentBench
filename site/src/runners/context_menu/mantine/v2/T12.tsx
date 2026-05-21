'use client';

/**
 * context_menu-mantine-v2-T12: Worker metrics — scroll menu to Open diagnostics
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Paper, Text, Stack, Box, Group, Badge } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const G1 = ['Refresh metrics', 'Change timeframe', 'Compare runs', 'Set baseline'];
const G2 = ['Change visualization', 'Attach note', 'Export data', 'Open settings'];
const G3 = ['Pin card', 'Duplicate', 'Open diagnostics', 'Remove card'];

export default function T12({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [path, setPath] = useState<string[] | null>(null);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    if (path?.[0] === 'Open diagnostics') {
      done.current = true;
      onSuccess();
    }
  }, [path, onSuccess]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpened(true);
  };

  return (
    <Paper shadow="sm" p="md" radius="md" w={360} maw="100%" ml="auto" mt="auto">
      <Text fw={600} size="sm" mb="sm">
        Runtime
      </Text>
      <Box
        style={{
          maxHeight: 260,
          overflowY: 'auto',
          paddingRight: 4,
        }}
      >
        <Stack gap="sm">
          <MetricCard title="CPU budget" value="62%" />
          <MetricCard title="Queue depth" value="128" />
          <Menu opened={opened} onChange={setOpened} position="left-start">
            <Menu.Target>
              <Box
                p="sm"
                onContextMenu={handleContextMenu}
                style={{
                  border: '1px solid var(--mantine-color-blue-4)',
                  borderRadius: 8,
                  cursor: 'context-menu',
                  background: 'var(--mantine-color-blue-0)',
                }}
                data-testid="worker-metrics-card"
              >
                <Group justify="space-between">
                  <Text size="sm" fw={600}>
                    Worker metrics
                  </Text>
                  <Badge size="xs" color="blue">
                    live
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed">
                  Pool utilization
                </Text>
              </Box>
            </Menu.Target>
            <Menu.Dropdown
              data-testid="context-menu-overlay"
              style={{ maxHeight: 200, overflowY: 'auto' }}
            >
              <Menu.Label>View</Menu.Label>
              {G1.map((l) => (
                <Menu.Item key={l} onClick={() => setPath([l])}>
                  {l}
                </Menu.Item>
              ))}
              <Menu.Divider />
              <Menu.Label>Share</Menu.Label>
              {G2.map((l) => (
                <Menu.Item key={l} onClick={() => setPath([l])}>
                  {l}
                </Menu.Item>
              ))}
              <Menu.Divider />
              <Menu.Label>Card</Menu.Label>
              {G3.map((l) => (
                <Menu.Item key={l} onClick={() => setPath([l])}>
                  {l}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          <MetricCard title="Heap delta" value="+4 MB" />
        </Stack>
      </Box>
    </Paper>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <Box p="sm" style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: 8 }}>
      <Text size="sm" fw={600}>
        {title}
      </Text>
      <Text size="lg" fw={700}>
        {value}
      </Text>
    </Box>
  );
}
