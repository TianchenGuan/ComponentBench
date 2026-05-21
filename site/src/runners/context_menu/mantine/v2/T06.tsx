'use client';

/**
 * context_menu-mantine-v2-T06: Inspector B — View toggles exact set
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Paper, Text, Stack, Box, Checkbox, Group } from '@mantine/core';
import type { TaskComponentProps } from '../../types';


type ViewState = {
  'Show preview': boolean;
  'Show toolbar': boolean;
  'Spell check': boolean;
  'Word wrap': boolean;
};

const initialA: ViewState = {
  'Show preview': true,
  'Show toolbar': false,
  'Spell check': true,
  'Word wrap': true,
};

const initialB: ViewState = {
  'Show preview': false,
  'Show toolbar': true,
  'Spell check': false,
  'Word wrap': false,
};

const targetB: ViewState = {
  'Show preview': true,
  'Show toolbar': false,
  'Spell check': true,
  'Word wrap': true,
};

function matchesTarget(s: ViewState) {
  return (
    s['Show preview'] === targetB['Show preview'] &&
    s['Show toolbar'] === targetB['Show toolbar'] &&
    s['Spell check'] === targetB['Spell check'] &&
    s['Word wrap'] === targetB['Word wrap']
  );
}

function InspectorPanel({
  label,
  view,
  setView,
}: {
  label: string;
  view: ViewState;
  setView: React.Dispatch<React.SetStateAction<ViewState>>;
}) {
  const [opened, setOpened] = useState(false);
  const [showViewSub, setShowViewSub] = useState(false);
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpened(true);
  };

  const toggle = (key: keyof ViewState) => {
    setView((v) => ({ ...v, [key]: !v[key] }));
  };

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      closeOnItemClick={false}
      trigger="click-hover"
      closeDelay={200}
      position="bottom-start"
    >
      <Menu.Target>
        <Box
          p="sm"
          h={100}
          onContextMenu={handleContextMenu}
          style={{
            border: '1px solid var(--mantine-color-gray-4)',
            borderRadius: 8,
            cursor: 'context-menu',
            background: 'var(--mantine-color-gray-0)',
          }}
          data-testid={`inspector-${label.replace(/\s+/g, '-').toLowerCase()}`}
          data-open-target={label}
          data-checked-items={JSON.stringify(view)}
        >
          <Text size="xs" fw={600}>
            {label}
          </Text>
          <Text size="xs" c="dimmed" mt={4}>
            Preview surface
          </Text>
        </Box>
      </Menu.Target>
      <Menu.Dropdown data-testid="context-menu-overlay">
        <Menu.Item onClick={() => setOpened(false)}>Undo</Menu.Item>
        <Menu.Item closeMenuOnClick={false} onClick={() => setShowViewSub(!showViewSub)}>View →</Menu.Item>
        {showViewSub && (
          <>
            {(Object.keys(view) as (keyof ViewState)[]).map((key) => (
              <Menu.Item
                key={key}
                pl={28}
                closeMenuOnClick={false}
                onClick={() => toggle(key)}
                leftSection={
                  <Checkbox
                    checked={view[key]}
                    onChange={() => {}}
                    size="xs"
                    aria-hidden
                    tabIndex={-1}
                    styles={{ input: { pointerEvents: 'none' } }}
                  />
                }
              >
                {key}
              </Menu.Item>
            ))}
          </>
        )}
        <Menu.Item onClick={() => setOpened(false)}>Inspect DOM</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [viewA, setViewA] = useState<ViewState>(initialA);
  const [viewB, setViewB] = useState<ViewState>(initialB);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    if (matchesTarget(viewB)) {
      done.current = true;
      onSuccess();
    }
  }, [viewB, onSuccess]);

  return (
    <Paper shadow="sm" p="md" radius="md" w={440} maw="100%">
      <Text fw={600} size="sm" mb="xs">
        Preview settings
      </Text>
      <Group grow align="stretch" gap="sm">
        <Stack gap={6}>
          <Text size="xs" c="dimmed">
            Inspector A
          </Text>
          <InspectorPanel label="Inspector A" view={viewA} setView={setViewA} />
        </Stack>
        <Stack gap={6}>
          <Text size="xs" c="dimmed">
            Inspector B
          </Text>
          <InspectorPanel label="Inspector B" view={viewB} setView={setViewB} />
        </Stack>
      </Group>
    </Paper>
  );
}
