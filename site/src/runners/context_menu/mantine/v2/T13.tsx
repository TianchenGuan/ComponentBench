'use client';

/**
 * context_menu-mantine-v2-T13: prod-west — Move → Under Archive → As child
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Paper, Text, Stack, Box, Group, Switch, Badge } from '@mantine/core';
import { IconCloud } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';


const NODES = ['staging', 'prod-east', 'prod-west', 'archive', 'backup'];

export default function T13({ onSuccess }: TaskComponentProps) {
  const [paths, setPaths] = useState<Record<string, string[]>>({});
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    const p = paths['prod-west'];
    if (
      p &&
      p.length === 3 &&
      p[0] === 'Move' &&
      p[1] === 'Under Archive' &&
      p[2] === 'As child'
    ) {
      done.current = true;
      onSuccess();
    }
  }, [paths, onSuccess]);

  return (
    <Paper shadow="sm" p="md" radius="md" w={420} maw="100%">
      <Badge color="yellow" variant="light" size="xs" mb="sm">
        Release freeze
      </Badge>
      <Group justify="space-between" mb="sm">
        <Text size="xs">Canary traffic</Text>
        <Switch size="xs" />
      </Group>
      <Text fw={600} size="sm" mb="xs">
        Environments
      </Text>
      <Stack gap={4}>
        {NODES.map((node) => (
          <EnvNode
            key={node}
            label={node}
            isTarget={node === 'prod-west'}
            onPath={(path) => setPaths((prev) => ({ ...prev, [node]: path }))}
          />
        ))}
      </Stack>
    </Paper>
  );
}

function EnvNode({
  label,
  isTarget,
  onPath,
}: {
  label: string;
  isTarget: boolean;
  onPath: (path: string[]) => void;
}) {
  const [opened, setOpened] = useState(false);
  const [showMoveSub, setShowMoveSub] = useState(false);
  const [showUnderArchiveSub, setShowUnderArchiveSub] = useState(false);
  const [showUnderBackupSub, setShowUnderBackupSub] = useState(false);
  const handleContextMenu = (e: React.MouseEvent) => {
    if (!isTarget) return;
    e.preventDefault();
    setOpened(true);
  };

  const go = (path: string[]) => {
    onPath(path);
    setOpened(false);
  };

  const row = (
    <Group
      gap={6}
      p={6}
      onContextMenu={handleContextMenu}
      style={{
        borderRadius: 6,
        border: '1px solid var(--mantine-color-gray-3)',
        cursor: isTarget ? 'context-menu' : 'default',
        background: isTarget ? 'var(--mantine-color-green-0)' : 'var(--mantine-color-gray-0)',
      }}
      data-testid={`env-${label.replace(/\s+/g, '-')}`}
      data-open-target={isTarget ? label : undefined}
    >
      <IconCloud size={14} />
      <Text size="sm" fw={isTarget ? 600 : 400}>
        {label}
      </Text>
    </Group>
  );

  if (!isTarget) return <Box>{row}</Box>;

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      trigger="click-hover"
      closeDelay={220}
      openDelay={70}
      position="bottom-start"
    >
      <Menu.Target>{row}</Menu.Target>
      <Menu.Dropdown data-testid="context-menu-overlay">
        <Menu.Item closeMenuOnClick={false} onClick={() => setShowMoveSub(!showMoveSub)}>Move →</Menu.Item>
        {showMoveSub && (
          <>
            <Menu.Item closeMenuOnClick={false} pl={28} onClick={() => setShowUnderArchiveSub(!showUnderArchiveSub)}>Under Archive →</Menu.Item>
            {showUnderArchiveSub && (
              <>
                <Menu.Item pl={52} onClick={() => go(['Move', 'Under Archive', 'As sibling'])}>
                  As sibling
                </Menu.Item>
                <Menu.Item pl={52} onClick={() => go(['Move', 'Under Archive', 'As child'])}>
                  As child
                </Menu.Item>
              </>
            )}
            <Menu.Item closeMenuOnClick={false} pl={28} onClick={() => setShowUnderBackupSub(!showUnderBackupSub)}>Under Backup →</Menu.Item>
            {showUnderBackupSub && (
              <>
                <Menu.Item pl={52} onClick={() => go(['Move', 'Under Backup', 'As sibling'])}>
                  As sibling
                </Menu.Item>
                <Menu.Item pl={52} onClick={() => go(['Move', 'Under Backup', 'As child'])}>
                  As child
                </Menu.Item>
              </>
            )}
          </>
        )}
        <Menu.Item onClick={() => go(['Rename'])}>Rename</Menu.Item>
        <Menu.Item onClick={() => go(['Inspect'])}>Inspect</Menu.Item>
        <Menu.Item color="red" onClick={() => go(['Delete'])}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
