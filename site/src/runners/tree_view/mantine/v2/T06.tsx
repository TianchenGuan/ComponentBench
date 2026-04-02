'use client';

/**
 * tree_view-mantine-v2-T06: Long policy tree — reveal two offscreen leaves and apply exact checked set
 *
 * Nested scroll, dark, high clutter. Mantine ScrollArea with Tree. Root expanded,
 * Module 01..90. Module 04 checked by default. Targets offscreen.
 * Success: committed checked = exactly {policy/module_72, policy/module_73},
 *          Module 04 NOT checked, "Apply policy targets" clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, Text, Tree, Group, Checkbox, Button, ScrollArea, Box, Paper, Stack,
  useTree, type TreeNodeData, type RenderTreeNodePayload,
} from '@mantine/core';
import { IconChevronRight, IconBox } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

function pad(n: number): string { return String(n).padStart(2, '0'); }

function buildPolicyModules(): TreeNodeData[] {
  return Array.from({ length: 90 }, (_, i) => ({
    value: `policy/module_${pad(i + 1)}`,
    label: `Module ${pad(i + 1)}`,
  }));
}

const treeData: TreeNodeData[] = [
  { value: 'policy_root', label: 'All policy targets', children: buildPolicyModules() },
];

const TARGET_CHECKED = ['policy/module_72', 'policy/module_73'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const tree = useTree({
    initialExpandedState: { policy_root: true },
    initialCheckedState: ['policy/module_04'],
  });
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const leafChecked = tree.checkedState.filter((v) => v !== 'policy_root');
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
        {hasChildren ? (
          <IconChevronRight size={16}
            style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 150ms', cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); tc.toggleExpanded(node.value); }}
          />
        ) : <span style={{ width: 16 }} />}
        <Checkbox.Indicator checked={checked} indeterminate={indeterminate} size="xs"
          onClick={(e) => { e.stopPropagation(); checked ? tc.uncheckNode(node.value) : tc.checkNode(node.value); setCommitted(false); }}
        />
        <IconBox size={14} />
        <Text size="sm">{node.label}</Text>
      </Group>
    );
  };

  return (
    <Box p="md" maw={600} style={{ height: '100vh', overflow: 'auto' }}>
      <Text fw={600} size="lg" mb="md">Policy Manager</Text>

      <Paper p="sm" withBorder mb="md" shadow="xs">
        <Text size="xs" c="dimmed">Compliance status: 88 modules passing, 2 flagged</Text>
      </Paper>
      <Paper p="sm" withBorder mb="md" shadow="xs">
        <Text size="xs" c="dimmed">Last scan: 2026-03-21 14:32 UTC</Text>
      </Paper>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text fw={500} mb="sm">Policy targets</Text>
        <ScrollArea h={300} data-testid="tree-scroll">
          <Tree data={treeData} tree={tree} renderNode={renderNode} expandOnClick={false} data-testid="tree-root" />
        </ScrollArea>
        <Group justify="flex-end" mt="md" style={{ borderTop: '1px solid var(--mantine-color-dark-4)', paddingTop: 12 }}>
          <Button size="xs" onClick={() => setCommitted(true)}>Apply policy targets</Button>
        </Group>
      </Card>
    </Box>
  );
}
