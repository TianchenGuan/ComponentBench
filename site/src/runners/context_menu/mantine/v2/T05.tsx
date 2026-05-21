'use client';

/**
 * context_menu-mantine-v2-T05: Server 2 — Lock (closed-lock reference icon)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Paper, Text, Group, Box, Badge, Stack } from '@mantine/core';
import { IconServer, IconLock, IconLockOpen, IconRefresh, IconPower } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';

function ServerRow({
  name,
  onPick,
}: {
  name: string;
  onPick: (item: string) => void;
}) {
  const [opened, setOpened] = useState(false);
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpened(true);
  };
  return (
    <Menu opened={opened} onChange={setOpened} position="bottom-start">
      <Menu.Target>
        <Group
          gap="sm"
          p="xs"
          mb={6}
          onContextMenu={handleContextMenu}
          style={{
            background: 'var(--mantine-color-gray-0)',
            borderRadius: 8,
            cursor: 'context-menu',
            border: '1px solid var(--mantine-color-gray-3)',
          }}
          data-testid={`server-${name.replace(' ', '-').toLowerCase()}`}
          data-open-target={name}
        >
          <IconServer size={18} color="var(--mantine-color-blue-6)" />
          <Text size="sm" fw={500}>
            {name}
          </Text>
          <Badge color="green" variant="light" size="xs" ml="auto">
            Online
          </Badge>
        </Group>
      </Menu.Target>
      <Menu.Dropdown data-testid="context-menu-overlay">
        <Menu.Item leftSection={<IconLock size={14} />} onClick={() => { onPick('Lock'); setOpened(false); }}>
          Lock
        </Menu.Item>
        <Menu.Item leftSection={<IconLockOpen size={14} />} onClick={() => { onPick('Unlock'); setOpened(false); }}>
          Unlock
        </Menu.Item>
        <Menu.Item leftSection={<IconRefresh size={14} />} onClick={() => { onPick('Restart'); setOpened(false); }}>
          Restart
        </Menu.Item>
        <Menu.Item
          leftSection={<IconPower size={14} />}
          color="red"
          onClick={() => { onPick('Shut down'); setOpened(false); }}
        >
          Shut down
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [lastByServer, setLastByServer] = useState<Record<string, string>>({});
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    if (lastByServer['Server 2'] === 'Lock') {
      done.current = true;
      onSuccess();
    }
  }, [lastByServer, onSuccess]);

  return (
    <Paper shadow="sm" p="md" radius="md" w={400} maw="100%">
      <Text fw={600} size="sm" mb="xs">
        Deployment
      </Text>
      <Box
        mb="sm"
        p={8}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: 'var(--mantine-color-blue-0)',
          border: '1px solid var(--mantine-color-blue-3)',
          borderRadius: 6,
        }}
        data-testid="reference-box"
      >
        <IconLock size={16} color="var(--mantine-color-blue-7)" />
      </Box>
      <Stack gap={0}>
        {['Server 1', 'Server 2', 'Server 3'].map((n) => (
          <ServerRow
            key={n}
            name={n}
            onPick={(item) => setLastByServer((prev) => ({ ...prev, [n]: item }))}
          />
        ))}
      </Stack>
      <Text size="xs" c="dimmed" mt="sm">
        Server 2 last: <span data-testid="server-2-last">{lastByServer['Server 2'] ?? '—'}</span>
      </Text>
    </Paper>
  );
}
