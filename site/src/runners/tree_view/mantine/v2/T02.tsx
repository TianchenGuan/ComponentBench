'use client';

/**
 * tree_view-mantine-v2-T02: Modules tree in ScrollArea — reveal Module 72 and use that selection
 *
 * Nested scroll, dark, high clutter. Two panels stacked: "Active modules" (top, distractor),
 * "Archived modules" (bottom, target in ScrollArea). 90 leaves. Module 01 selected by default.
 * Module 72 below fold. "Use module" under target panel.
 * Success: selected = modules/archive/72 in target tree, Active modules unchanged, "Use module" clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Tree, Group, Button, ScrollArea, Box, useTree, type TreeNodeData, type RenderTreeNodePayload } from '@mantine/core';
import { IconChevronRight, IconBox } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';

function pad(n: number): string { return String(n).padStart(2, '0'); }

function buildModules(prefix: string, count: number): TreeNodeData[] {
  return Array.from({ length: count }, (_, i) => ({
    value: `${prefix}/${pad(i + 1)}`,
    label: `Module ${pad(i + 1)}`,
  }));
}

const activeData: TreeNodeData[] = [
  { value: 'active_root', label: 'All active modules', children: buildModules('modules/active', 10) },
];

const archiveData: TreeNodeData[] = [
  { value: 'archive_root', label: 'All archived modules', children: buildModules('modules/archive', 90) },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const activeTree = useTree({ initialExpandedState: { active_root: true } });
  const archiveTree = useTree({ initialExpandedState: { archive_root: true } });
  const [archiveSelected, setArchiveSelected] = useState<string>('modules/archive/01');
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && archiveSelected === 'modules/archive/72') {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, archiveSelected, onSuccess]);

  const makeRenderNode = (onSelect?: (val: string) => void, selectedVal?: string) =>
    ({ node, expanded, hasChildren, elementProps, tree: tc }: RenderTreeNodePayload) => (
      <Group gap={5} {...elementProps}
        onClick={() => { if (!hasChildren && onSelect) onSelect(node.value); }}
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
        <IconBox size={14} />
        <Text size="sm">{node.label}</Text>
      </Group>
    );

  return (
    <Box p="md" maw={500}>
      <Text fw={600} size="lg" mb="md">Module Manager</Text>

      <Card shadow="xs" padding="sm" withBorder mb="md">
        <Text fw={500} size="sm" mb="xs">Active modules</Text>
        <Tree data={activeData} tree={activeTree} renderNode={makeRenderNode()} />
      </Card>

      <Card shadow="xs" padding="sm" withBorder>
        <Text fw={500} size="sm" mb="xs">Archived modules</Text>
        <ScrollArea h={280} data-testid="tree-scroll">
          <Tree data={archiveData} tree={archiveTree}
            renderNode={makeRenderNode((v) => { setArchiveSelected(v); setCommitted(false); }, archiveSelected)}
            data-testid="tree-root"
          />
        </ScrollArea>
        <Group justify="flex-end" mt="md">
          <Button size="xs" onClick={() => setCommitted(true)}>Use module</Button>
        </Group>
      </Card>
    </Box>
  );
}
