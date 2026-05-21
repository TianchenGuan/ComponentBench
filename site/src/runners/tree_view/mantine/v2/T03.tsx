'use client';

/**
 * tree_view-mantine-v2-T03: Notification channels panel — choose the right tree and exact leaf
 *
 * Dashboard, high clutter, two trees. Left: "Workspace" — Email→{Inbox}, Folders→{Docs, Images}.
 * Right: "Notification channels" — Email→{Daily digest[target], Incident alerts}, Chat→{On-call pings}.
 * Both collapsed. "Apply channel" under target panel.
 * Success: selected = notify/email/daily in target tree, Workspace unchanged, "Apply channel" clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, Text, Tree, Group, Button, Box, SimpleGrid, Paper,
  useTree, type TreeNodeData, type RenderTreeNodePayload,
} from '@mantine/core';
import { IconChevronRight, IconFolder, IconFile, IconBell, IconMail } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';

const workspaceData: TreeNodeData[] = [
  { value: 'ws/email', label: 'Email', children: [{ value: 'ws/email/inbox', label: 'Inbox' }] },
  { value: 'ws/folders', label: 'Folders', children: [
    { value: 'ws/folders/docs', label: 'Docs' },
    { value: 'ws/folders/images', label: 'Images' },
  ]},
];

const notifyData: TreeNodeData[] = [
  { value: 'notify/email', label: 'Email', children: [
    { value: 'notify/email/daily', label: 'Daily digest' },
    { value: 'notify/email/incidents', label: 'Incident alerts' },
  ]},
  { value: 'notify/chat', label: 'Chat', children: [
    { value: 'notify/chat/oncall', label: 'On-call pings' },
  ]},
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const wsTree = useTree({ initialExpandedState: {} });
  const notifyTree = useTree({ initialExpandedState: {} });
  const [notifySelected, setNotifySelected] = useState<string | null>(null);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && notifySelected === 'notify/email/daily') {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, notifySelected, onSuccess]);

  const makeRenderNode = (onSelect?: (val: string) => void, selectedVal?: string | null) =>
    ({ node, expanded, hasChildren, elementProps, tree: tc }: RenderTreeNodePayload) => (
      <Group gap={5} {...elementProps}
        onClick={() => { if (!hasChildren && onSelect) { onSelect(node.value); } }}
        style={{
          ...(elementProps as any).style,
          background: !hasChildren && selectedVal === node.value ? 'var(--mantine-color-blue-light)' : undefined,
          borderRadius: 4, cursor: !hasChildren ? 'pointer' : undefined,
        }}
      >
        {hasChildren ? (
          <IconChevronRight size={16}
            style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 150ms', cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); tc.toggleExpanded(node.value); }}
          />
        ) : <span style={{ width: 16 }} />}
        {hasChildren ? <IconFolder size={14} /> : <IconFile size={14} />}
        <Text size="sm">{node.label}</Text>
      </Group>
    );

  return (
    <Box p="md" maw={750}>
      <Text fw={600} size="lg" mb="md">Dashboard</Text>

      <SimpleGrid cols={4} mb="md">
        {[['Users', '2,401'], ['Messages', '18K'], ['Uptime', '99.9%'], ['Incidents', '2']].map(([k, v]) => (
          <Paper key={k} p="sm" withBorder shadow="xs" ta="center">
            <Text size="xs" c="dimmed">{k}</Text><Text fw={600}>{v}</Text>
          </Paper>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={2}>
        <Card shadow="xs" padding="sm" withBorder>
          <Text fw={500} size="sm" mb="xs"><IconFolder size={14} style={{ marginRight: 4 }} />Workspace</Text>
          <Tree data={workspaceData} tree={wsTree} renderNode={makeRenderNode()} />
        </Card>

        <Card shadow="xs" padding="sm" withBorder>
          <Text fw={500} size="sm" mb="xs"><IconBell size={14} style={{ marginRight: 4 }} />Notification channels</Text>
          <Tree data={notifyData} tree={notifyTree}
            renderNode={makeRenderNode((v) => { setNotifySelected(v); setCommitted(false); }, notifySelected)}
            data-testid="tree-root"
          />
          <Group justify="flex-end" mt="md">
            <Button size="xs" onClick={() => setCommitted(true)}>Apply channel</Button>
          </Group>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
