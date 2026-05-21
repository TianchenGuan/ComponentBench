'use client';

/**
 * context_menu-mantine-v2-T10: Alert row 3 — Status → Mark critical ON
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Paper, Text, Stack, Box, Badge, Group, Checkbox } from '@mantine/core';
import type { TaskComponentProps } from '../../types';


const ROWS = ['Alert row 1', 'Alert row 2', 'Alert row 3', 'Alert row 4'];

type RowFlags = { critical: boolean; ack: boolean; suppress: boolean };

export default function T10({ onSuccess }: TaskComponentProps) {
  const [states, setStates] = useState<Record<string, RowFlags>>(() =>
    Object.fromEntries(ROWS.map((r) => [r, { critical: false, ack: false, suppress: false }]))
  );
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    if (states['Alert row 3']?.critical === true) {
      done.current = true;
      onSuccess();
    }
  }, [states, onSuccess]);

  return (
    <Paper shadow="sm" p="md" radius="md" w={400} maw="100%">
      <Text fw={600} size="sm" mb="sm">
        Alerts
      </Text>
      <Box
        style={{
          maxHeight: 220,
          overflowY: 'auto',
          border: '1px solid var(--mantine-color-gray-3)',
          borderRadius: 8,
          padding: 8,
        }}
      >
        <Stack gap={6}>
          {ROWS.map((label) => (
            <AlertRow
              key={label}
              label={label}
              flags={states[label]}
              setFlags={(updater) =>
                setStates((prev) => ({
                  ...prev,
                  [label]: typeof updater === 'function' ? updater(prev[label]) : updater,
                }))
              }
            />
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}

function AlertRow({
  label,
  flags,
  setFlags,
}: {
  label: string;
  flags: RowFlags;
  setFlags: (u: RowFlags | ((p: RowFlags) => RowFlags)) => void;
}) {
  const [opened, setOpened] = useState(false);
  const [showStatusSub, setShowStatusSub] = useState(false);
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpened(true);
  };

  return (
    <Menu opened={opened} onChange={setOpened} closeOnItemClick={false} trigger="click-hover" closeDelay={180}>
      <Menu.Target>
        <Group
          justify="space-between"
          p={6}
          onContextMenu={handleContextMenu}
          style={{
            borderRadius: 6,
            cursor: 'context-menu',
            background: 'var(--mantine-color-gray-0)',
            border: '1px solid var(--mantine-color-gray-4)',
          }}
          data-testid={`alert-${label.replace(/\s+/g, '-').toLowerCase()}`}
          data-open-target={label}
          data-checked-items={JSON.stringify({ 'Mark critical': flags.critical })}
        >
          <Text size="sm">{label}</Text>
          <Group gap={6}>
            <Badge size="xs" color="orange" variant="light">
              warn
            </Badge>
            <Text size="xs" c="dimmed">
              10:02
            </Text>
          </Group>
        </Group>
      </Menu.Target>
      <Menu.Dropdown data-testid="context-menu-overlay">
        <Menu.Item onClick={() => setOpened(false)}>Open</Menu.Item>
        <Menu.Item closeMenuOnClick={false} onClick={() => setShowStatusSub(!showStatusSub)}>Status →</Menu.Item>
        {showStatusSub && (
          <>
            <Menu.Item
              pl={28}
              closeMenuOnClick={false}
              onClick={() =>
                setFlags((f) => ({
                  ...f,
                  critical: !f.critical,
                }))
              }
              leftSection={
                <Checkbox
                  size="xs"
                  checked={flags.critical}
                  onChange={() => {}}
                  tabIndex={-1}
                  styles={{ input: { pointerEvents: 'none' } }}
                />
              }
            >
              Mark critical
            </Menu.Item>
            <Menu.Item
              pl={28}
              closeMenuOnClick={false}
              onClick={() => setFlags((f) => ({ ...f, ack: !f.ack }))}
              leftSection={
                <Checkbox
                  size="xs"
                  checked={flags.ack}
                  onChange={() => {}}
                  tabIndex={-1}
                  styles={{ input: { pointerEvents: 'none' } }}
                />
              }
            >
              Acknowledge
            </Menu.Item>
            <Menu.Item
              pl={28}
              closeMenuOnClick={false}
              onClick={() => setFlags((f) => ({ ...f, suppress: !f.suppress }))}
              leftSection={
                <Checkbox
                  size="xs"
                  checked={flags.suppress}
                  onChange={() => {}}
                  tabIndex={-1}
                  styles={{ input: { pointerEvents: 'none' } }}
                />
              }
            >
              Suppress
            </Menu.Item>
          </>
        )}
        <Menu.Item onClick={() => setOpened(false)}>Assign</Menu.Item>
        <Menu.Item onClick={() => setOpened(false)}>Mute</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
