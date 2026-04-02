'use client';

/**
 * tree_view-mantine-T02: Select src > components > Button.tsx
 *
 * Layout: isolated_card centered titled "Repository". One Mantine Tree with file-like nodes.
 *
 * Tree structure:
 * • src (value=src)
 *   – components (value=src/components)
 *      * Button.tsx (value=src/components/button) [TARGET]
 *      * Modal.tsx (value=src/components/modal)
 *   – hooks (value=src/hooks)
 * • package.json (value=package.json)
 *
 * Initial state: all nodes are collapsed; selectedState is empty.
 * Selecting a node applies a selected style (data-selected attribute on the row).
 *
 * Success: The selected node value equals 'src/components/button'.
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
      {
        value: 'src/components',
        label: 'components',
        children: [
          { value: 'src/components/button', label: 'Button.tsx' },
          { value: 'src/components/modal', label: 'Modal.tsx' },
        ],
      },
      {
        value: 'src/hooks',
        label: 'hooks',
        children: [
          { value: 'src/hooks/useAuth', label: 'useAuth.ts' },
        ],
      },
    ],
  },
  { value: 'package.json', label: 'package.json' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const tree = useTree({
    initialExpandedState: {},
    initialSelectedState: [],
  });
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && tree.selectedState.includes('src/components/button')) {
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
        selectOnClick
        data-testid="tree-root"
      />
    </Card>
  );
}
