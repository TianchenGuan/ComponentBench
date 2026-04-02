'use client';

/**
 * context_menu-mantine-v2-T11: Card 2 — Priority → Blocker
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Paper, Text, Stack, Box, Badge, Group, Radio } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

type Priority = 'Low' | 'Medium' | 'High' | 'Blocker';

const CARDS = ['Card 1', 'Card 2', 'Card 3'];

export default function T11({ onSuccess }: TaskComponentProps) {
  const [priorityByCard, setPriorityByCard] = useState<Record<string, Priority>>(() =>
    Object.fromEntries(CARDS.map((c) => [c, 'High' as Priority]))
  );
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    if (priorityByCard['Card 2'] === 'Blocker') {
      done.current = true;
      onSuccess();
    }
  }, [priorityByCard, onSuccess]);

  return (
    <Paper shadow="sm" p="md" radius="md" w={420} maw="100%">
      <Text fw={600} size="sm" mb="sm">
        Sprint board
      </Text>
      <Text size="xs" c="dimmed" mb="xs">
        Doing
      </Text>
      <Stack gap={8}>
        {CARDS.map((name) => (
          <BoardCard
            key={name}
            name={name}
            priority={priorityByCard[name]}
            setPriority={(p) => setPriorityByCard((prev) => ({ ...prev, [name]: p }))}
          />
        ))}
      </Stack>
    </Paper>
  );
}

function BoardCard({
  name,
  priority,
  setPriority,
}: {
  name: string;
  priority: Priority;
  setPriority: (p: Priority) => void;
}) {
  const [opened, setOpened] = useState(false);
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpened(true);
  };

  const opts: Priority[] = ['Low', 'Medium', 'High', 'Blocker'];

  return (
    <Menu opened={opened} onChange={setOpened} closeOnItemClick={false} position="bottom-start">
      <Menu.Target>
        <Box
          p="sm"
          onContextMenu={handleContextMenu}
          style={{
            border: '1px solid var(--mantine-color-gray-4)',
            borderRadius: 8,
            cursor: 'context-menu',
            background: 'white',
          }}
          data-testid={`board-${name.replace(/\s+/g, '-').toLowerCase()}`}
          data-open-target={name}
          data-radio-groups={JSON.stringify({ Priority: priority })}
        >
          <Group justify="space-between">
            <Text size="sm" fw={600}>
              {name}
            </Text>
            <Badge size="xs" variant="outline">
              {priority}
            </Badge>
          </Group>
          <Text size="xs" c="dimmed" mt={4}>
            Refine filters for Q2
          </Text>
        </Box>
      </Menu.Target>
      <Menu.Dropdown data-testid="context-menu-overlay">
        <Menu.Item onClick={() => setOpened(false)}>Open</Menu.Item>
        <Menu.Label>Priority</Menu.Label>
        <Radio.Group
          value={priority}
          onChange={(v) => setPriority(v as Priority)}
          p="xs"
          style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}
        >
          <Stack gap={6}>
            {opts.map((o) => (
              <Radio key={o} value={o} label={o} size="xs" />
            ))}
          </Stack>
        </Radio.Group>
        <Menu.Divider />
        <Menu.Item onClick={() => setOpened(false)}>Move</Menu.Item>
        <Menu.Item color="red" onClick={() => setOpened(false)}>
          Archive
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
