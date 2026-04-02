'use client';

/**
 * context_menu-mantine-v2-T16: Preview card 2 — Hide preview (crossed-eye cue)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Paper, Text, Group, Box, Stack } from '@mantine/core';
import { IconEye, IconEyeOff, IconCopy, IconTrash } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';

const CARDS = ['Preview card 1', 'Preview card 2'];

export default function T16({ onSuccess }: TaskComponentProps) {
  const [lastByCard, setLastByCard] = useState<Record<string, string>>({});
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    if (lastByCard['Preview card 2'] === 'Hide preview') {
      done.current = true;
      onSuccess();
    }
  }, [lastByCard, onSuccess]);

  return (
    <Paper shadow="sm" p="md" radius="md" w={400} maw="100%" ml="auto">
      <Box
        mb="sm"
        p={8}
        style={{
          display: 'inline-flex',
          background: 'var(--mantine-color-gray-1)',
          borderRadius: 6,
        }}
        data-testid="reference-box"
      >
        <IconEyeOff size={18} color="var(--mantine-color-gray-7)" />
      </Box>
      <Stack gap="sm">
        {CARDS.map((title) => (
          <PreviewCard
            key={title}
            title={title}
            onPick={(action) => setLastByCard((p) => ({ ...p, [title]: action }))}
          />
        ))}
      </Stack>
      <Group gap="xs" mt="md" pt="sm" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
        <Text size="xs" c="dimmed">
          Toolbar
        </Text>
        <Box h={8} style={{ flex: 1, background: 'var(--mantine-color-gray-2)', borderRadius: 4 }} />
      </Group>
    </Paper>
  );
}

function PreviewCard({ title, onPick }: { title: string; onPick: (a: string) => void }) {
  const [opened, setOpened] = useState(false);
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpened(true);
  };

  return (
    <Menu opened={opened} onChange={setOpened} position="bottom-start">
      <Menu.Target>
        <Box
          h={72}
          p="sm"
          onContextMenu={handleContextMenu}
          style={{
            border: '1px solid var(--mantine-color-indigo-3)',
            borderRadius: 8,
            cursor: 'context-menu',
            background: 'var(--mantine-color-indigo-0)',
          }}
          data-testid={`preview-${title.replace(/\s+/g, '-').toLowerCase()}`}
          data-open-target={title}
        >
          <Text size="sm" fw={600}>
            {title}
          </Text>
          <Text size="xs" c="dimmed">
            Canvas snapshot
          </Text>
        </Box>
      </Menu.Target>
      <Menu.Dropdown data-testid="context-menu-overlay">
        <Menu.Item
          leftSection={<IconEye size={14} />}
          onClick={() => {
            onPick('Show preview');
            setOpened(false);
          }}
        >
          Show preview
        </Menu.Item>
        <Menu.Item
          leftSection={<IconEyeOff size={14} />}
          onClick={() => {
            onPick('Hide preview');
            setOpened(false);
          }}
        >
          Hide preview
        </Menu.Item>
        <Menu.Item
          leftSection={<IconCopy size={14} />}
          onClick={() => {
            onPick('Duplicate');
            setOpened(false);
          }}
        >
          Duplicate
        </Menu.Item>
        <Menu.Item
          leftSection={<IconTrash size={14} />}
          color="red"
          onClick={() => {
            onPick('Delete');
            setOpened(false);
          }}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
