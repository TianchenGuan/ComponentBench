'use client';

/**
 * tree_select-mantine-v2-T17: Checked-state settings panel — exact sync folder set
 *
 * Settings panel with TextInput + Popover + Tree with Checkbox.Indicator. The tree uses
 * useTree checked state. Select exactly: Sync/Photos/2024, Sync/Docs/Taxes,
 * Sync/Music/Playlists. Click "Apply sync".
 *
 * Success: Exact set = {sync-photos-2024, sync-docs-taxes, sync-music-playlists}, Apply clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, Text, Button, Group, Badge, TextInput, Popover, Stack, Switch,
  Progress, Checkbox, MantineProvider, Tree, useTree,
} from '@mantine/core';
import { setsEqual } from '../../types';
import type { TaskComponentProps } from '../../types';

const treeData = [
  {
    label: 'Sync', value: 'sync', children: [
      {
        label: 'Photos', value: 'sync-photos', children: [
          { label: '2023', value: 'sync-photos-2023' },
          { label: '2024', value: 'sync-photos-2024' },
          { label: '2025', value: 'sync-photos-2025' },
        ],
      },
      {
        label: 'Docs', value: 'sync-docs', children: [
          { label: 'Taxes', value: 'sync-docs-taxes' },
          { label: 'Insurance', value: 'sync-docs-insurance' },
          { label: 'Contracts', value: 'sync-docs-contracts' },
        ],
      },
      {
        label: 'Music', value: 'sync-music', children: [
          { label: 'Playlists', value: 'sync-music-playlists' },
          { label: 'Albums', value: 'sync-music-albums' },
        ],
      },
    ],
  },
];

const LEAF_VALUES = new Set([
  'sync-photos-2023', 'sync-photos-2024', 'sync-photos-2025',
  'sync-docs-taxes', 'sync-docs-insurance', 'sync-docs-contracts',
  'sync-music-playlists', 'sync-music-albums',
]);

const TARGET_SET = ['sync-photos-2024', 'sync-docs-taxes', 'sync-music-playlists'];

export default function T17({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);
  const tree = useTree();

  useEffect(() => {
    if (successFired.current) return;
    if (committed) {
      const leaves = checkedValues.filter((v) => LEAF_VALUES.has(v));
      if (setsEqual(leaves, TARGET_SET)) {
        successFired.current = true;
        onSuccess();
      }
    }
  }, [committed, checkedValues, onSuccess]);

  const toggleValue = (val: string) => {
    setCheckedValues((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
    setCommitted(false);
  };

  const display = checkedValues.filter((v) => LEAF_VALUES.has(v)).length;

  return (
    <MantineProvider>
      <div style={{ padding: 16, maxWidth: 480, marginLeft: 60 }}>
        <Text fw={700} size="lg" mb="sm">Sync Settings</Text>
        <Group gap="xs" mb="sm">
          <Switch size="xs" defaultChecked label="Auto-sync" />
          <Badge variant="outline" size="sm">Wi-Fi only</Badge>
        </Group>
        <Progress value={42} size="sm" mb="sm" />
        <Text size="xs" c="dimmed" mb="md">Storage: 42% used — 58 GB free</Text>

        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Stack gap="md">
            <Popover opened={opened} onChange={setOpened} width={300} position="bottom-start">
              <Popover.Target>
                <TextInput
                  label="Folders to sync"
                  readOnly
                  value={display ? `${display} folder(s) selected` : ''}
                  placeholder="Click to select folders"
                  onClick={() => setOpened(true)}
                  style={{ cursor: 'pointer' }}
                />
              </Popover.Target>
              <Popover.Dropdown>
                <div style={{ maxHeight: 280, overflow: 'auto' }}>
                  <Tree
                    data={treeData}
                    tree={tree}
                    levelOffset={23}
                    renderNode={({ node, expanded, hasChildren, elementProps }) => (
                      <Group gap="xs" {...elementProps}>
                        {hasChildren && (
                          <span style={{ cursor: 'pointer', fontSize: 12, width: 16 }}>
                            {expanded ? '▼' : '▶'}
                          </span>
                        )}
                        {!hasChildren && <span style={{ width: 16 }} />}
                        <Checkbox.Indicator
                          checked={checkedValues.includes(node.value)}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleValue(node.value);
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                        <Text size="sm">{node.label}</Text>
                      </Group>
                    )}
                  />
                </div>
              </Popover.Dropdown>
            </Popover>
            <Button onClick={() => setCommitted(true)}>Apply sync</Button>
          </Stack>
        </Card>
      </div>
    </MantineProvider>
  );
}
