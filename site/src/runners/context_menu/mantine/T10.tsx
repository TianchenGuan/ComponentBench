'use client';

/**
 * context_menu-mantine-T10: Server 2: choose option by icon (Lock)
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=3, guidance=visual.
 *
 * Instances: THREE server rows are listed inside the card and support a context menu on right-click:
 * - Server 1
 * - Server 2
 * - Server 3
 *
 * Target instance: Server 2.
 *
 * Guidance: a small non-interactive "Reference" box above the list shows ONLY a closed-lock icon (no text).
 * The user must pick the menu option with the same icon.
 *
 * Context menu: onContextMenu opens a Mantine Menu at cursor position. Menu items have left-side icons.
 *
 * Menu items (icon + label):
 * - Lock (closed-lock icon)
 * - Unlock (open-lock icon)
 * - Restart (circular arrow icon)
 * - Shut down (power icon)
 *
 * Success: The activated item path equals ['Lock'] on the context menu instance labeled 'Server 2'.
 */

import React, { useState, useEffect } from 'react';
import { Menu, Paper, Text, Group, Box, Badge } from '@mantine/core';
import { IconServer, IconLock, IconLockOpen, IconRefresh, IconPower } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface ServerRowProps {
  name: string;
  onMenuClick: (item: string) => void;
  lastActivated: string | null;
}

function ServerRow({ name, onMenuClick, lastActivated }: ServerRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuOpen(true);
  };

  const handleItemClick = (item: string) => {
    onMenuClick(item);
    setMenuOpen(false);
  };

  return (
    <Menu
      opened={menuOpen}
      onChange={setMenuOpen}
      position="bottom-start"
    >
      <Menu.Target>
        <Group
          onContextMenu={handleContextMenu}
          gap="sm"
          p="sm"
          mb="xs"
          style={{
            background: 'var(--mantine-color-gray-0)',
            borderRadius: 8,
            cursor: 'context-menu',
          }}
          data-testid={`server-${name.toLowerCase().replace(' ', '-')}`}
          data-last-activated={lastActivated}
        >
          <IconServer size={20} color="var(--mantine-color-blue-6)" />
          <Text size="sm" fw={500}>{name}</Text>
          <Badge color="green" variant="light" size="xs" ml="auto">Online</Badge>
        </Group>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<IconLock size={14} />} onClick={() => handleItemClick('Lock')}>
          Lock
        </Menu.Item>
        <Menu.Item leftSection={<IconLockOpen size={14} />} onClick={() => handleItemClick('Unlock')}>
          Unlock
        </Menu.Item>
        <Menu.Item leftSection={<IconRefresh size={14} />} onClick={() => handleItemClick('Restart')}>
          Restart
        </Menu.Item>
        <Menu.Item leftSection={<IconPower size={14} />} onClick={() => handleItemClick('Shut down')} color="red">
          Shut down
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [server1LastActivated, setServer1LastActivated] = useState<string | null>(null);
  const [server2LastActivated, setServer2LastActivated] = useState<string | null>(null);
  const [server3LastActivated, setServer3LastActivated] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (server2LastActivated === 'Lock' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [server2LastActivated, successTriggered, onSuccess]);

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 400 }}>
      <Text size="lg" fw={500} mb="md">Servers</Text>

      {/* Reference box - only icon, no text */}
      <Box
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '6px 12px',
          background: 'var(--mantine-color-blue-0)',
          border: '1px solid var(--mantine-color-blue-3)',
          borderRadius: 4,
          marginBottom: 16,
        }}
        data-testid="reference-box"
      >
        <IconLock size={16} color="var(--mantine-color-blue-6)" />
        <Text size="xs" c="blue" ml="xs">Reference</Text>
      </Box>
      
      <ServerRow
        name="Server 1"
        onMenuClick={(item) => setServer1LastActivated(item)}
        lastActivated={server1LastActivated}
      />
      <ServerRow
        name="Server 2"
        onMenuClick={(item) => setServer2LastActivated(item)}
        lastActivated={server2LastActivated}
      />
      <ServerRow
        name="Server 3"
        onMenuClick={(item) => setServer3LastActivated(item)}
        lastActivated={server3LastActivated}
      />

      <Box mt="md" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
        <Text size="xs" c="dimmed">
          Server 1: <strong data-testid="server1-last-action">{server1LastActivated || 'None'}</strong>
        </Text>
        <Text size="xs" c="dimmed">
          Server 2: <strong data-testid="server2-last-action">{server2LastActivated || 'None'}</strong>
        </Text>
        <Text size="xs" c="dimmed">
          Server 3: <strong data-testid="server3-last-action">{server3LastActivated || 'None'}</strong>
        </Text>
      </Box>
    </Paper>
  );
}
