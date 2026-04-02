'use client';

/**
 * context_menu-mantine-v2-T15: Draft 2 — Delete draft… → Delete
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Paper, Text, Stack, Box, Button, Group } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const DRAFTS = ['Draft 1', 'Draft 2', 'Draft 3'];

type DraftUi = {
  pending: boolean;
  confirmation: 'none' | 'confirmed' | 'cancelled';
};

export default function T15({ onSuccess }: TaskComponentProps) {
  const [byDraft, setByDraft] = useState<Record<string, DraftUi>>(() =>
    Object.fromEntries(DRAFTS.map((d) => [d, { pending: false, confirmation: 'none' as const }]))
  );
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    const d2 = byDraft['Draft 2'];
    if (d2?.confirmation === 'confirmed' && d2.pending === false) {
      done.current = true;
      onSuccess();
    }
  }, [byDraft, onSuccess]);

  return (
    <Paper shadow="sm" p="md" radius="md" w={400} maw="100%">
      <Text fw={600} size="sm" mb="xs">
        Drafts
      </Text>
      <Text size="xs" c="dimmed" mb="sm">
        Unsaved messages
      </Text>
      <Stack gap="sm">
        {DRAFTS.map((title) => (
          <DraftCard
            key={title}
            title={title}
            ui={byDraft[title]}
            setUi={(next) => setByDraft((prev) => ({ ...prev, [title]: next }))}
          />
        ))}
      </Stack>
    </Paper>
  );
}

function DraftCard({
  title,
  ui,
  setUi,
}: {
  title: string;
  ui: DraftUi;
  setUi: (u: DraftUi) => void;
}) {
  const [opened, setOpened] = useState(false);
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpened(true);
  };

  return (
    <Menu
      opened={opened}
      onChange={(o) => {
        setOpened(o);
        if (!o) setUi({ ...ui, pending: false });
      }}
      closeOnItemClick={false}
      position="bottom-start"
    >
      <Menu.Target>
        <Box
          p="sm"
          onContextMenu={handleContextMenu}
          style={{
            border: '1px solid var(--mantine-color-gray-4)',
            borderRadius: 8,
            cursor: 'context-menu',
            background: 'var(--mantine-color-gray-0)',
          }}
          data-testid={`draft-${title.replace(/\s+/g, '-').toLowerCase()}`}
          data-open-target={title}
          data-pending-action={ui.pending ? 'Delete draft' : ''}
          data-confirmation-result={ui.confirmation === 'none' ? '' : ui.confirmation}
        >
          <Text size="sm" fw={600}>
            {title}
          </Text>
          <Text size="xs" c="dimmed" lineClamp={2}>
            Lorem ipsum draft body…
          </Text>
        </Box>
      </Menu.Target>
      <Menu.Dropdown data-testid="context-menu-overlay">
        <Menu.Item onClick={() => setOpened(false)}>Open</Menu.Item>
        <Menu.Item onClick={() => setOpened(false)}>Rename</Menu.Item>
        <Menu.Item
          color="red"
          onClick={() => {
            setUi({ ...ui, pending: true });
          }}
        >
          Delete draft…
        </Menu.Item>
        {ui.pending && (
          <Box p="xs" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
            <Text size="xs" mb="xs">
              Delete this draft permanently?
            </Text>
            <Group gap="xs" grow>
              <Button
                size="xs"
                variant="default"
                onClick={() => {
                  setUi({ pending: false, confirmation: 'cancelled' });
                  setOpened(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="xs"
                color="red"
                onClick={() => {
                  setUi({ pending: false, confirmation: 'confirmed' });
                  setOpened(false);
                }}
              >
                Delete
              </Button>
            </Group>
          </Box>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
