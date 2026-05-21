'use client';

/**
 * tree_view-mantine-T01: Expand src folder
 *
 * Layout: isolated_card centered titled "Repository". Single Mantine Tree component with minimal
 * default styling. Expandable nodes show a chevron icon (rendered via renderNode) next to the label.
 *
 * Tree roots: "src" (has children), "node_modules" (has children), and "package.json" (leaf).
 * Initial state: all nodes are collapsed; no node is selected; checked-state UI is not shown.
 *
 * Interaction: clicking the chevron toggles expansion; clicking the row selects the node.
 *
 * Success: The Mantine Tree node with value 'src' is expanded (children visible).
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Tree, Group, useTree, type TreeNodeData, type RenderTreeNodePayload } from '@mantine/core';
import { IconChevronRight, IconFolder, IconFile } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const treeData: TreeNodeData[] = [
  {
    value: 'src',
    label: 'src',
    children: [
      { value: 'src/index.ts', label: 'index.ts' },
      { value: 'src/utils.ts', label: 'utils.ts' },
    ],
  },
  {
    value: 'node_modules',
    label: 'node_modules',
    children: [
      { value: 'node_modules/react', label: 'react' },
      { value: 'node_modules/mantine', label: 'mantine' },
    ],
  },
  { value: 'package.json', label: 'package.json' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const tree = useTree({
    initialExpandedState: {},
  });
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && tree.expandedState['src']) {
      successFired.current = true;
      onSuccess();
    }
  }, [tree.expandedState, onSuccess]);

  const renderNode = ({ node, expanded, hasChildren, elementProps, tree: treeController }: RenderTreeNodePayload) => (
    <Group gap={5} {...elementProps}>
      {hasChildren && (
        <IconChevronRight
          size={16}
          style={{
            transform: expanded ? 'rotate(90deg)' : 'none',
            transition: 'transform 150ms',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            treeController.toggleExpanded(node.value);
          }}
        />
      )}
      {!hasChildren && <span style={{ width: 16 }} />}
      {hasChildren ? <IconFolder size={16} /> : <IconFile size={16} />}
      <Text size="sm">{node.label}</Text>
    </Group>
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }} data-testid="tree-card">
      <Text fw={500} size="lg" mb="md">Repository</Text>
      <Tree
        data={treeData}
        tree={tree}
        renderNode={renderNode}
        data-testid="tree-root"
      />
    </Card>
  );
}
