'use client';

/**
 * tree_view-mantine-T06: Scroll to and select Module 32
 *
 * Layout: isolated_card centered titled "Modules". A Mantine ScrollArea contains a Mantine Tree
 * with a fixed height so the tree has its own internal scrollbar.
 *
 * Tree content: root node "All modules" (expanded) contains 50 leaf nodes labeled "Module 01"
 * through "Module 50". The target is "Module 32" (value=modules/32).
 *
 * Initial state: "Module 01" is selected by default; Module 32 is offscreen and requires scrolling
 * within the ScrollArea to reach.
 *
 * Success: The selected node value equals 'modules/32'.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Tree, Group, ScrollArea, useTree, type TreeNodeData, type RenderTreeNodePayload } from '@mantine/core';
import { IconChevronRight, IconFolder, IconPackage } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

// Generate 50 module children
const moduleChildren: TreeNodeData[] = Array.from({ length: 50 }, (_, i) => ({
  value: `modules/${String(i + 1).padStart(2, '0')}`,
  label: `Module ${String(i + 1).padStart(2, '0')}`,
}));

const treeData: TreeNodeData[] = [
  {
    value: 'modules/all',
    label: 'All modules',
    children: moduleChildren,
  },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const tree = useTree({
    initialExpandedState: { 'modules/all': true },
    initialSelectedState: ['modules/01'],
  });
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && tree.selectedState.includes('modules/32')) {
      successFired.current = true;
      onSuccess();
    }
  }, [tree.selectedState, onSuccess]);

  const renderNode = ({ node, expanded, hasChildren, elementProps, tree: treeController, selected }: RenderTreeNodePayload) => (
    <Group
      gap={5}
      {...elementProps}
      style={{
        ...elementProps.style,
        backgroundColor: selected ? '#e6f4ff' : undefined,
        borderRadius: 4,
        padding: '2px 4px',
        cursor: 'pointer',
      }}
      data-testid={`tree-node-${node.value}`}
    >
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
      {hasChildren ? <IconFolder size={16} /> : <IconPackage size={16} />}
      <Text size="sm">{node.label}</Text>
    </Group>
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }} data-testid="tree-card">
      <Text fw={500} size="lg" mb="md">Modules</Text>
      <ScrollArea h={300} data-testid="tree-scroll-area">
        <Tree
          data={treeData}
          tree={tree}
          renderNode={renderNode}
          selectOnClick
          data-testid="tree-root"
        />
      </ScrollArea>
    </Card>
  );
}
