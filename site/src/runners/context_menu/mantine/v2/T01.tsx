'use client';

/**
 * context_menu-mantine-v2-T01: Press kit.zip — Share → Copy public link (globe cue)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Paper, Text, Group, Box, Stack } from '@mantine/core';
import { IconFileZip, IconWorld, IconLock, IconMail } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';


const PACKAGES = ['Release bundle.tar.gz', 'Press kit.zip', 'SDK package.tgz'];

function PackageRow({
  name,
  isTarget,
  onPath,
}: {
  name: string;
  isTarget: boolean;
  onPath: (path: string[]) => void;
}) {
  const [opened, setOpened] = useState(false);
  const [showShareSub, setShowShareSub] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpened(true);
  };

  const activate = (path: string[]) => {
    onPath(path);
    setOpened(false);
  };

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      trigger="click-hover"
      closeDelay={200}
      openDelay={80}
      position="bottom-start"
    >
      <Menu.Target>
        <Group
          gap="xs"
          p="xs"
          onContextMenu={handleContextMenu}
          style={{
            border: '1px solid var(--mantine-color-gray-4)',
            borderRadius: 6,
            cursor: 'context-menu',
            background: isTarget ? 'var(--mantine-color-yellow-0)' : 'var(--mantine-color-gray-0)',
          }}
          data-testid={`package-row-${name.replace(/\s+/g, '-').replace(/\./g, '')}`}
          data-open-target={isTarget ? name : undefined}
        >
          <IconFileZip size={18} />
          <Text size="sm" fw={isTarget ? 600 : 400}>
            {name}
          </Text>
        </Group>
      </Menu.Target>
      <Menu.Dropdown data-testid="context-menu-overlay">
        <Menu.Item onClick={() => activate(['Open'])}>Open</Menu.Item>
        <Menu.Item closeMenuOnClick={false} onClick={() => setShowShareSub(!showShareSub)}>Share →</Menu.Item>
        {showShareSub && (
          <>
            <Menu.Item
              pl={28}
              leftSection={<IconWorld size={14} />}
              onClick={() => activate(['Share', 'Copy public link'])}
            >
              Copy public link
            </Menu.Item>
            <Menu.Item
              pl={28}
              leftSection={<IconLock size={14} />}
              onClick={() => activate(['Share', 'Copy private link'])}
            >
              Copy private link
            </Menu.Item>
            <Menu.Item
              pl={28}
              leftSection={<IconMail size={14} />}
              onClick={() => activate(['Share', 'Email link'])}
            >
              Email link
            </Menu.Item>
          </>
        )}
        <Menu.Item onClick={() => activate(['Rename'])}>Rename</Menu.Item>
        <Menu.Item color="red" onClick={() => activate(['Delete'])}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const [pathByTarget, setPathByTarget] = useState<Record<string, string[]>>({});
  const done = useRef(false);

  const recordPath = (label: string, path: string[]) => {
    setPathByTarget((prev) => ({ ...prev, [label]: path }));
  };

  useEffect(() => {
    if (done.current) return;
    const p = pathByTarget['Press kit.zip'];
    if (
      p &&
      p.length === 2 &&
      p[0] === 'Share' &&
      p[1] === 'Copy public link'
    ) {
      done.current = true;
      onSuccess();
    }
  }, [pathByTarget, onSuccess]);

  return (
    <Paper shadow="sm" p="md" radius="md" w={380} maw="100%">
      <Text fw={600} size="sm" mb="xs">
        Downloads
      </Text>
      <Group gap={6} mb="sm" wrap="nowrap">
        <Text size="xs" c="dimmed">
          Reference:
        </Text>
        <Box
          px={8}
          py={4}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            border: '1px solid var(--mantine-color-blue-3)',
            borderRadius: 4,
            background: 'var(--mantine-color-blue-0)',
          }}
          data-testid="reference-box"
        >
          <IconWorld size={14} color="var(--mantine-color-blue-7)" />
          <Text size="xs">Copy public link</Text>
        </Box>
      </Group>
      <Stack gap={6}>
        {PACKAGES.map((name) => (
          <PackageRow
            key={name}
            name={name}
            isTarget={name === 'Press kit.zip'}
            onPath={(path) => recordPath(name, path)}
          />
        ))}
      </Stack>
    </Paper>
  );
}
