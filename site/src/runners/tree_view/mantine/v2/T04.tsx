'use client';

/**
 * tree_view-mantine-v2-T04: Reference preview drawer — exact path open and file selected
 *
 * Drawer flow, dark. "Choose asset" opens drawer with reference card "Projects / Strategy / roadmap.pdf"
 * and a Mantine Tree. Tree: Projects→{Strategy→{roadmap.pdf[target], notes.md}, Design},
 * Archive→{2025}. All collapsed. "Use asset" in drawer footer.
 * Success: selected = projects/strategy/roadmap_pdf,
 *          expanded = exactly {projects, projects/strategy}, "Use asset" clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, Text, Tree, Group, Button, Drawer, Badge, Box, Stack,
  useTree, type TreeNodeData, type RenderTreeNodePayload,
} from '@mantine/core';
import { IconChevronRight, IconFolder, IconFile } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const treeData: TreeNodeData[] = [
  {
    value: 'projects', label: 'Projects',
    children: [
      {
        value: 'projects/strategy', label: 'Strategy',
        children: [
          { value: 'projects/strategy/roadmap_pdf', label: 'roadmap.pdf' },
          { value: 'projects/strategy/notes_md', label: 'notes.md' },
        ],
      },
      { value: 'projects/design', label: 'Design' },
    ],
  },
  {
    value: 'archive', label: 'Archive',
    children: [{ value: 'archive/2025', label: '2025' }],
  },
];

const REQUIRED_EXPANDED = ['projects', 'projects/strategy'];

export default function T04({ onSuccess }: TaskComponentProps) {
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
      selected === 'projects/strategy/roadmap_pdf' &&
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
      {hasChildren ? <IconFolder size={14} /> : <IconFile size={14} />}
      <Text size="sm">{node.label}</Text>
    </Group>
  );

  return (
    <Box p="md" maw={520}>
      <Text fw={600} size="lg" mb="md">Asset Manager</Text>
      <Card shadow="xs" padding="sm" withBorder mb="md">
        <Text size="xs" c="dimmed">Current file: presentation.pptx</Text>
      </Card>
      <Button onClick={() => setDrawerOpen(true)}>Choose asset</Button>

      <Drawer opened={drawerOpen} onClose={() => setDrawerOpen(false)} title="Choose asset"
        position="right" size="sm">
        <Stack gap="md" style={{ height: '100%' }}>
          <Card shadow="xs" padding="sm" withBorder>
            <Text size="xs" c="dimmed">Reference preview</Text>
            <Group gap={4} mt="xs">
              <Badge size="sm" variant="outline">Projects</Badge>
              <Text size="xs">/</Text>
              <Badge size="sm" variant="outline">Strategy</Badge>
              <Text size="xs">/</Text>
              <Badge size="sm" color="blue">roadmap.pdf</Badge>
            </Group>
          </Card>

          <Box style={{ flex: 1 }}>
            <Tree data={treeData} tree={tree} renderNode={renderNode} expandOnClick={false} data-testid="tree-root" />
          </Box>

          <Group justify="flex-end">
            <Button size="xs" variant="default" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button size="xs" onClick={handleUse}>Use asset</Button>
          </Group>
        </Stack>
      </Drawer>
    </Box>
  );
}
