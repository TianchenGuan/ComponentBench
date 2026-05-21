'use client';

/**
 * tree_view-mantine-v2-T01: Backup scope tree — exact checked leaves with custom checkbox indicators
 *
 * Settings panel, high clutter. Mantine Tree with custom renderNode (chevron, Checkbox.Indicator, label).
 * Tree: Server A→{Logs, Reports, Snapshots[checked by default]}, Server B→{Logs, Reports}.
 * Both roots collapsed. Clicking row selects but doesn't toggle checkbox.
 * Success: committed checked = exactly {server_a/logs, server_a/reports},
 *          Snapshots NOT checked, "Apply backup scope" clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Card, Text, Tree, Group, Checkbox, Button, TextInput, Switch, Stack, Box,
  useTree, type TreeNodeData, type RenderTreeNodePayload,
} from '@mantine/core';
import { IconChevronRight, IconServer, IconFile } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const treeData: TreeNodeData[] = [
  {
    value: 'server_a', label: 'Server A',
    children: [
      { value: 'server_a/logs', label: 'Logs' },
      { value: 'server_a/reports', label: 'Reports' },
      { value: 'server_a/snapshots', label: 'Snapshots' },
    ],
  },
  {
    value: 'server_b', label: 'Server B',
    children: [
      { value: 'server_b/logs', label: 'Logs' },
      { value: 'server_b/reports', label: 'Reports' },
    ],
  },
];

const TARGET_CHECKED = ['server_a/logs', 'server_a/reports'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const tree = useTree({
    initialExpandedState: {},
    initialCheckedState: ['server_a/snapshots'],
  });
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const leafChecked = tree.checkedState.filter(
      (v) => !['server_a', 'server_b'].includes(v),
    );
    if (committed && setsEqual(leafChecked, TARGET_CHECKED)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, tree.checkedState, onSuccess]);

  const renderNode = ({ node, expanded, hasChildren, elementProps, tree: tc }: RenderTreeNodePayload) => {
    const checked = tc.isNodeChecked(node.value);
    const indeterminate = tc.isNodeIndeterminate(node.value);
    return (
      <Group gap={5} {...elementProps}>
        {hasChildren && (
          <IconChevronRight size={16}
            style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 150ms', cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); tc.toggleExpanded(node.value); }}
          />
        )}
        {!hasChildren && <span style={{ width: 16 }} />}
        <Checkbox.Indicator checked={checked} indeterminate={indeterminate} size="xs"
          onClick={(e) => { e.stopPropagation(); checked ? tc.uncheckNode(node.value) : tc.checkNode(node.value); setCommitted(false); }}
        />
        {hasChildren ? <IconServer size={16} /> : <IconFile size={16} />}
        <Text size="sm">{node.label}</Text>
      </Group>
    );
  };

  return (
    <Box p="md" maw={700}>
      <Text fw={600} size="lg" mb="md">Backup Configuration</Text>

      <Group mb="md" gap="md">
        <Card shadow="xs" padding="sm" withBorder style={{ flex: 1 }}>
          <Text size="xs" c="dimmed">Retention</Text>
          <TextInput size="xs" value="30 days" readOnly />
        </Card>
        <Card shadow="xs" padding="sm" withBorder style={{ flex: 1 }}>
          <Stack gap={4}>
            <Group gap="xs"><Text size="xs">Archive</Text><Switch size="xs" defaultChecked /></Group>
            <Group gap="xs"><Text size="xs">Encrypt</Text><Switch size="xs" /></Group>
          </Stack>
        </Card>
      </Group>

      <Card shadow="xs" padding="sm" withBorder mb="md">
        <Text size="xs" c="dimmed">Storage summary: 12.4 GB used of 50 GB</Text>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text fw={500} mb="sm">Backup scope</Text>
        <Tree data={treeData} tree={tree} renderNode={renderNode} expandOnClick={false} data-testid="tree-root" />
        <Group justify="flex-end" mt="md">
          <Button size="xs" variant="default">Cancel</Button>
          <Button size="xs" onClick={() => setCommitted(true)}>Apply backup scope</Button>
        </Group>
      </Card>
    </Box>
  );
}
