'use client';

/**
 * context_menu-mantine-v2-T08: Widget preview — Reset tiles… → Reset
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Paper, Text, Stack, Box, Button, Group, Slider, ColorInput } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<'idle' | 'confirmed' | 'cancelled'>('idle');
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    if (result === 'confirmed') {
      done.current = true;
      onSuccess();
    }
  }, [result, onSuccess]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpened(true);
  };

  return (
    <Paper shadow="sm" p="md" radius="md" w={440} maw="100%">
      <Text fw={600} size="sm" mb="sm">
        Tile layout
      </Text>
      <Group mb="sm" grow>
        <Box>
          <Text size="xs" mb={4}>
            Gap
          </Text>
          <Slider defaultValue={40} size="xs" />
        </Box>
        <ColorInput size="xs" label="Accent" defaultValue="#228be6" />
      </Group>
      <Group mb="sm">
        <Text size="xs">Snap to grid</Text>
        <input type="checkbox" defaultChecked />
      </Group>

      <Menu
        opened={opened}
        onChange={(o) => {
          setOpened(o);
          if (!o) setConfirming(false);
        }}
        closeOnItemClick={false}
        position="bottom-start"
      >
        <Menu.Target>
          <Box
            h={120}
            p="sm"
            onContextMenu={handleContextMenu}
            style={{
              border: '2px solid var(--mantine-color-violet-4)',
              borderRadius: 10,
              cursor: 'context-menu',
              background: 'linear-gradient(135deg, var(--mantine-color-violet-0), white)',
            }}
            data-testid="widget-preview"
            data-pending-action={confirming ? 'Reset tiles' : ''}
            data-confirmation-result={result === 'idle' ? '' : result}
          >
            <Text size="sm" fw={600}>
              Widget preview
            </Text>
            <Text size="xs" c="dimmed">
              Right-click for layout actions
            </Text>
          </Box>
        </Menu.Target>
        <Menu.Dropdown data-testid="context-menu-overlay">
          <Menu.Item onClick={() => setOpened(false)}>Add tile</Menu.Item>
          <Menu.Item onClick={() => setOpened(false)}>Auto-arrange</Menu.Item>
          <Menu.Item
            onClick={() => {
              setConfirming(true);
            }}
          >
            Reset tiles…
          </Menu.Item>
          {confirming && (
            <Box p="xs" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
              <Text size="xs" mb="xs">
                Reset all tiles to default positions?
              </Text>
              <Group gap="xs" grow>
                <Button
                  size="xs"
                  variant="default"
                  onClick={() => {
                    setResult('cancelled');
                    setOpened(false);
                    setConfirming(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="xs"
                  color="red"
                  onClick={() => {
                    setResult('confirmed');
                    setOpened(false);
                    setConfirming(false);
                  }}
                >
                  Reset
                </Button>
              </Group>
            </Box>
          )}
        </Menu.Dropdown>
      </Menu>
    </Paper>
  );
}
