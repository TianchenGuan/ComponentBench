'use client';

/**
 * tree_view-mantine-v2-T05: Review tree reset — leave only Finance path open and target checked
 *
 * Drawer flow, high clutter. "Review access" opens left drawer with Mantine Tree (custom checkbox).
 * Initial: Finance(expanded)→{Invoices[unchecked target], Refunds[checked]},
 *          HR(expanded)→{Payroll[checked]}, Ops(collapsed).
 * Success: committed checked = exactly {finance/invoices}, expanded = exactly {finance},
 *          Finance parent NOT checked, "Apply access review" clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, Text, Tree, Group, Checkbox, Button, Drawer, Box, Stack,
  useTree, type TreeNodeData, type RenderTreeNodePayload,
} from '@mantine/core';
import { IconChevronRight, IconFolder, IconFile } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const treeData: TreeNodeData[] = [
  {
    value: 'finance', label: 'Finance',
    children: [
      { value: 'finance/invoices', label: 'Invoices' },
      { value: 'finance/refunds', label: 'Refunds' },
    ],
  },
  {
    value: 'hr', label: 'HR',
    children: [
      { value: 'hr/payroll', label: 'Payroll' },
    ],
  },
  { value: 'ops', label: 'Ops' },
];

const TARGET_CHECKED = ['finance/invoices'];
const REQUIRED_EXPANDED_KEYS = ['finance'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const tree = useTree({
    initialExpandedState: { finance: true, hr: true },
    initialCheckedState: ['finance/refunds', 'hr/payroll'],
  });
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  const expandedKeys = Object.entries(tree.expandedState)
    .filter(([, v]) => v)
    .map(([k]) => k);

  useEffect(() => {
    if (successFired.current) return;
    const leafChecked = tree.checkedState.filter(
      (v) => !['finance', 'hr', 'ops'].includes(v),
    );
    if (
      committed &&
      setsEqual(leafChecked, TARGET_CHECKED) &&
      setsEqual(expandedKeys, REQUIRED_EXPANDED_KEYS) &&
      !tree.isNodeChecked('finance')
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, tree.checkedState, expandedKeys, tree, onSuccess]);

  const handleApply = () => {
    setCommitted(true);
    setDrawerOpen(false);
  };

  const renderNode = ({ node, expanded, hasChildren, elementProps, tree: tc }: RenderTreeNodePayload) => {
    const checked = tc.isNodeChecked(node.value);
    const indeterminate = tc.isNodeIndeterminate(node.value);
    return (
      <Group gap={5} {...elementProps}>
        {hasChildren ? (
          <IconChevronRight size={16}
            style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 150ms', cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); tc.toggleExpanded(node.value); setCommitted(false); }}
          />
        ) : <span style={{ width: 16 }} />}
        <Checkbox.Indicator checked={checked} indeterminate={indeterminate} size="xs"
          onClick={(e) => { e.stopPropagation(); checked ? tc.uncheckNode(node.value) : tc.checkNode(node.value); setCommitted(false); }}
        />
        {hasChildren ? <IconFolder size={14} /> : <IconFile size={14} />}
        <Text size="sm">{node.label}</Text>
      </Group>
    );
  };

  return (
    <Box p="md" maw={700}>
      <Text fw={600} size="lg" mb="md">Access Management</Text>

      <Group mb="md" gap="md">
        <Card shadow="xs" padding="sm" withBorder style={{ flex: 1 }}>
          <Text size="xs" c="dimmed">Open reviews</Text><Text fw={600}>8</Text>
        </Card>
        <Card shadow="xs" padding="sm" withBorder style={{ flex: 1 }}>
          <Text size="xs" c="dimmed">Completed</Text><Text fw={600}>42</Text>
        </Card>
        <Card shadow="xs" padding="sm" withBorder style={{ flex: 1 }}>
          <Text size="xs" c="dimmed">Violations</Text><Text fw={600} c="red">3</Text>
        </Card>
      </Group>

      <Button onClick={() => setDrawerOpen(true)}>Review access</Button>

      <Drawer opened={drawerOpen} onClose={() => setDrawerOpen(false)} title="Review access"
        position="left" size="sm">
        <Stack gap="md" style={{ height: '100%' }}>
          <Box style={{ flex: 1 }}>
            <Tree data={treeData} tree={tree} renderNode={renderNode} expandOnClick={false} data-testid="tree-root" />
          </Box>
          <Group justify="flex-end">
            <Button size="xs" variant="default" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button size="xs" onClick={handleApply}>Apply access review</Button>
          </Group>
        </Stack>
      </Drawer>
    </Box>
  );
}
