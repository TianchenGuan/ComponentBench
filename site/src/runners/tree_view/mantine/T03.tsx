'use client';

/**
 * tree_view-mantine-T03: Check package.json for sync
 *
 * Layout: isolated_card centered titled "Sync Selection". Single Mantine Tree uses a custom renderNode
 * that shows a Checkbox before each node label to represent checked state.
 * Clicking the checkbox indicator toggles check/uncheck for that node.
 *
 * Tree roots: "src", "node_modules", and "package.json" (leaf, value=sync/package.json).
 * Initial state: no nodes are checked; all nodes are collapsed; nothing is selected.
 *
 * Success: The checked state includes node value 'sync/package.json'.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Tree, Group, Checkbox, useTree, type TreeNodeData, type RenderTreeNodePayload } from '@mantine/core';
import { IconChevronRight, IconFolder, IconFile } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const treeData: TreeNodeData[] = [
  {
    value: 'sync/src',
    label: 'src',
    children: [
      { value: 'sync/src/index', label: 'index.ts' },
    ],
  },
  {
    value: 'sync/node_modules',
    label: 'node_modules',
    children: [
      { value: 'sync/node_modules/react', label: 'react' },
    ],
  },
  { value: 'sync/package.json', label: 'package.json' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const tree = useTree({
    initialExpandedState: {},
    initialCheckedState: [],
  });
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && tree.checkedState.includes('sync/package.json')) {
      successFired.current = true;
      onSuccess();
    }
  }, [tree.checkedState, onSuccess]);

  const renderNode = ({ node, expanded, hasChildren, elementProps, tree: treeController }: RenderTreeNodePayload) => {
    const checked = treeController.isNodeChecked(node.value);
    
    return (
      <Group gap={5} {...elementProps}>
        <Checkbox.Indicator
          checked={checked}
          onClick={(e) => {
            e.stopPropagation();
            if (checked) {
              treeController.uncheckNode(node.value);
            } else {
              treeController.checkNode(node.value);
            }
          }}
          size="xs"
        />
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
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }} data-testid="tree-card">
      <Text fw={500} size="lg" mb="md">Sync Selection</Text>
      <Tree
        data={treeData}
        tree={tree}
        renderNode={renderNode}
        expandOnClick={false}
        data-testid="tree-root"
      />
    </Card>
  );
}
