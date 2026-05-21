'use client';

/**
 * tree_view-mantine-v2-T08: Visual target in dark drawer — exact path open, exact file selected, exact commit
 *
 * Drawer flow, dark. "Choose report" opens drawer with visual breadcrumb chip row:
 * "Reports / Q4 / Capacity.pdf". Mantine Tree below.
 * Tree: Reports→{Q3→{Headcount.pdf}, Q4→{Capacity.pdf[target], Budget.pdf}}, Archive→{2024}.
 * All collapsed. "Use report" in drawer footer.
 * Success: selected = reports/q4/capacity_pdf,
 *          expanded = exactly {reports, reports/q4}, "Use report" clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, Text, Tree, Group, Button, Drawer, Badge, Box, Stack,
  useTree, type TreeNodeData, type RenderTreeNodePayload,
} from '@mantine/core';
import { IconChevronRight, IconFolder, IconFileText } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const treeData: TreeNodeData[] = [
  {
    value: 'reports', label: 'Reports',
    children: [
      {
        value: 'reports/q3', label: 'Q3',
        children: [{ value: 'reports/q3/headcount_pdf', label: 'Headcount.pdf' }],
      },
      {
        value: 'reports/q4', label: 'Q4',
        children: [
          { value: 'reports/q4/capacity_pdf', label: 'Capacity.pdf' },
          { value: 'reports/q4/budget_pdf', label: 'Budget.pdf' },
        ],
      },
    ],
  },
  {
    value: 'archive', label: 'Archive',
    children: [{ value: 'archive/2024', label: '2024' }],
  },
];

const REQUIRED_EXPANDED = ['reports', 'reports/q4'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const tree = useTree({ initialExpandedState: {} });
  const [selected, setSelected] = useState<string | null>(null);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  const expandedKeys = Object.entries(tree.expandedState)
    .filter(([, v]) => v)
    .map(([k]) => k);

  useEffect(() => {
    if (successFired.current) return;
    if (
      committed &&
      selected === 'reports/q4/capacity_pdf' &&
      setsEqual(expandedKeys, REQUIRED_EXPANDED)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, selected, expandedKeys, onSuccess]);

  const handleUse = () => {
    setCommitted(true);
    setDrawerOpen(false);
  };

  const renderNode = ({ node, expanded, hasChildren, elementProps, tree: tc }: RenderTreeNodePayload) => (
    <Group gap={5} {...elementProps}
      onClick={() => { if (!hasChildren) { setSelected(node.value); setCommitted(false); } }}
      style={{
        ...(elementProps as any).style,
        background: !hasChildren && selected === node.value ? 'var(--mantine-color-blue-light)' : undefined,
        borderRadius: 4, cursor: !hasChildren ? 'pointer' : undefined,
      }}
    >
      {hasChildren ? (
        <IconChevronRight size={16}
          style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 150ms', cursor: 'pointer' }}
          onClick={(e) => { e.stopPropagation(); tc.toggleExpanded(node.value); setCommitted(false); }}
        />
      ) : <span style={{ width: 16 }} />}
      {hasChildren ? <IconFolder size={14} /> : <IconFileText size={14} />}
      <Text size="sm">{node.label}</Text>
    </Group>
  );

  return (
    <Box p="md" maw={520}>
      <Text fw={600} size="lg" mb="md">Report Viewer</Text>
      <Card shadow="xs" padding="sm" withBorder mb="md">
        <Text size="xs" c="dimmed">Current report: none selected</Text>
      </Card>
      <Button onClick={() => setDrawerOpen(true)}>Choose report</Button>

      <Drawer opened={drawerOpen} onClose={() => setDrawerOpen(false)} title="Choose report"
        position="right" size="sm">
        <Stack gap="md" style={{ height: '100%' }}>
          <Card shadow="xs" padding="xs" withBorder>
            <Group gap={4}>
              <Badge size="sm" variant="outline">Reports</Badge>
              <Text size="xs">/</Text>
              <Badge size="sm" variant="outline">Q4</Badge>
              <Text size="xs">/</Text>
              <Badge size="sm" color="blue">Capacity.pdf</Badge>
            </Group>
          </Card>

          <Box style={{ flex: 1 }}>
            <Tree data={treeData} tree={tree} renderNode={renderNode} expandOnClick={false} data-testid="tree-root" />
          </Box>

          <Group justify="flex-end">
            <Button size="xs" variant="default" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button size="xs" onClick={handleUse}>Use report</Button>
          </Group>
        </Stack>
      </Drawer>
    </Box>
  );
}
