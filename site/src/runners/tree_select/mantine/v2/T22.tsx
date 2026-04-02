'use client';

/**
 * tree_select-mantine-v2-T22: Drawer exact checked set with indeterminate parents
 *
 * Drawer with composite Mantine tree-select using checkbox indicators. Select exactly:
 * Projects/Alpha/QA, Projects/Beta/QA, Projects/Beta/Design. Click "Save projects".
 *
 * Success: Exact set = {projects-alpha-qa, projects-beta-qa, projects-beta-design}, Save clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, Text, Button, Group, Badge, Drawer, Stack, Divider,
  Checkbox, MantineProvider, Tree, useTree,
} from '@mantine/core';
import { setsEqual } from '../../types';
import type { TaskComponentProps } from '../../types';

const treeData = [
  {
    label: 'Projects', value: 'projects', children: [
      {
        label: 'Alpha', value: 'projects-alpha', children: [
          { label: 'QA', value: 'projects-alpha-qa' },
          { label: 'Design', value: 'projects-alpha-design' },
          { label: 'Docs', value: 'projects-alpha-docs' },
        ],
      },
      {
        label: 'Beta', value: 'projects-beta', children: [
          { label: 'QA', value: 'projects-beta-qa' },
          { label: 'Design', value: 'projects-beta-design' },
          { label: 'Docs', value: 'projects-beta-docs' },
        ],
      },
      {
        label: 'Gamma', value: 'projects-gamma', children: [
          { label: 'QA', value: 'projects-gamma-qa' },
          { label: 'Design', value: 'projects-gamma-design' },
        ],
      },
    ],
  },
];

const LEAF_VALUES = new Set([
  'projects-alpha-qa', 'projects-alpha-design', 'projects-alpha-docs',
  'projects-beta-qa', 'projects-beta-design', 'projects-beta-docs',
  'projects-gamma-qa', 'projects-gamma-design',
]);

const TARGET_SET = ['projects-alpha-qa', 'projects-beta-qa', 'projects-beta-design'];

export default function T22({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  const handleSave = () => {
    setCommitted(true);
    setDrawerOpen(false);
  };

  return (
    <MantineProvider>
      <div style={{ padding: 16 }}>
        <Text fw={700} size="lg" mb="xs">Notification Hub</Text>
        <Group gap="xs" mb="md">
          <Badge variant="light" color="blue">Channels: 5</Badge>
          <Badge variant="outline">Unread: 12</Badge>
        </Group>
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ maxWidth: 400 }}>
          <Text size="sm" c="dimmed" mb="sm">Configure which projects receive notifications.</Text>
          <Button onClick={() => setDrawerOpen(true)}>Projects to notify</Button>
        </Card>

        <Drawer
          opened={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Projects to Notify"
          position="right"
          size="sm"
        >
          <Stack gap="md">
            <Text fw={500} size="sm">Projects</Text>
            <div style={{ maxHeight: 350, overflow: 'auto' }}>
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
            <Divider />
            <Group justify="flex-end" gap="sm">
              <Button variant="default" onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save projects</Button>
            </Group>
          </Stack>
        </Drawer>
      </div>
    </MantineProvider>
  );
}
