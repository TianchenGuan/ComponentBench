'use client';

/**
 * context_menu-mantine-v2-T07: Archive node — Create → Markdown file
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Paper, Text, Stack, Box, Group, Switch } from '@mantine/core';
import { IconFolder } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';


const NODES = ['Docs', 'Drafts', 'Archive', 'Images'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [pathByNode, setPathByNode] = useState<Record<string, string[]>>({});
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    const p = pathByNode['Archive'];
    if (p && p.length === 2 && p[0] === 'Create' && p[1] === 'Markdown file') {
      done.current = true;
      onSuccess();
    }
  }, [pathByNode, onSuccess]);

  return (
    <Paper shadow="sm" p="md" radius="md" w={400} maw="100%">
      <Text fw={600} size="sm" mb="xs">
        Workspace
      </Text>
      <Group justify="space-between" mb="sm">
        <Text size="xs">Sync folders</Text>
        <Switch size="xs" />
      </Group>
      <Stack gap={4}>
        {NODES.map((node) => (
          <TreeNodeRow
            key={node}
            label={node}
            isArchive={node === 'Archive'}
            onActivate={(path) => setPathByNode((prev) => ({ ...prev, [node]: path }))}
          />
        ))}
      </Stack>
      <Group justify="space-between" mt="md">
        <Text size="xs">Telemetry</Text>
        <Switch size="xs" defaultChecked />
      </Group>
    </Paper>
  );
}

function TreeNodeRow({
  label,
  isArchive,
  onActivate,
}: {
  label: string;
  isArchive: boolean;
  onActivate: (path: string[]) => void;
}) {
  const [opened, setOpened] = useState(false);
  const [showCreateSub, setShowCreateSub] = useState(false);
  const handleContextMenu = (e: React.MouseEvent) => {
    if (!isArchive) return;
    e.preventDefault();
    setOpened(true);
  };

  const go = (path: string[]) => {
    onActivate(path);
    setOpened(false);
  };

  const row = (
    <Group
      gap={6}
      p={6}
      onContextMenu={handleContextMenu}
      style={{
        borderRadius: 6,
        cursor: isArchive ? 'context-menu' : 'default',
        border: '1px solid var(--mantine-color-gray-3)',
        background: isArchive ? 'var(--mantine-color-yellow-0)' : 'var(--mantine-color-gray-0)',
      }}
      data-testid={`tree-node-${label.toLowerCase()}`}
      data-open-target={isArchive ? label : undefined}
    >
      <IconFolder size={16} />
      <Text size="sm" fw={isArchive ? 600 : 400}>
        {label}
      </Text>
    </Group>
  );

  if (!isArchive) return <Box>{row}</Box>;

  return (
    <Menu
      key={label}
      opened={opened}
      onChange={setOpened}
      trigger="click-hover"
      closeDelay={200}
      position="bottom-start"
    >
      <Menu.Target>{row}</Menu.Target>
      <Menu.Dropdown data-testid="context-menu-overlay">
        <Menu.Item onClick={() => go(['Open'])}>Open</Menu.Item>
        <Menu.Item closeMenuOnClick={false} onClick={() => setShowCreateSub(!showCreateSub)}>Create →</Menu.Item>
        {showCreateSub && (
          <>
            <Menu.Item pl={28} onClick={() => go(['Create', 'Markdown file'])}>Markdown file</Menu.Item>
            <Menu.Item pl={28} onClick={() => go(['Create', 'Folder'])}>Folder</Menu.Item>
            <Menu.Item pl={28} onClick={() => go(['Create', 'JSON file'])}>JSON file</Menu.Item>
          </>
        )}
        <Menu.Item onClick={() => go(['Rename'])}>Rename</Menu.Item>
        <Menu.Item color="red" onClick={() => go(['Delete'])}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
