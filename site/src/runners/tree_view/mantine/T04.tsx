'use client';

/**
 * tree_view-mantine-T04: Check exactly Design and Specs
 *
 * Layout: isolated_card centered titled "Export". Single Mantine Tree with custom Checkbox in
 * renderNode for checked state.
 *
 * Tree structure:
 * • Alpha (value=exp/alpha)
 *   – Design (exp/alpha/design) [REQUIRED]
 *   – Specs (exp/alpha/specs) [REQUIRED]
 *   – Notes (exp/alpha/notes) [distractor]
 * • Beta (exp/beta) – Design, Specs (distractors with same labels)
 *
 * Initial state: Alpha is expanded so its children are visible. The "Notes" checkbox under Alpha
 * is ON by default; all other checkboxes are OFF. The tree is in single-select mode (selection
 * highlight exists but is irrelevant).
 *
 * Success: Checked node values equal exactly {exp/alpha/design, exp/alpha/specs}.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Tree, Group, Checkbox, useTree, type TreeNodeData, type RenderTreeNodePayload } from '@mantine/core';
import { IconChevronRight, IconFolder, IconFile } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const treeData: TreeNodeData[] = [
  {
    value: 'exp/alpha',
    label: 'Alpha',
    children: [
      { value: 'exp/alpha/design', label: 'Design' },
      { value: 'exp/alpha/specs', label: 'Specs' },
      { value: 'exp/alpha/notes', label: 'Notes' },
    ],
  },
  {
    value: 'exp/beta',
    label: 'Beta',
    children: [
      { value: 'exp/beta/design', label: 'Design' },
      { value: 'exp/beta/specs', label: 'Specs' },
    ],
  },
];

const targetSet = ['exp/alpha/design', 'exp/alpha/specs'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const tree = useTree({
    initialExpandedState: { 'exp/alpha': true },
    initialCheckedState: ['exp/alpha/notes'],
  });
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(tree.checkedState, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [tree.checkedState, onSuccess]);

  const renderNode = ({ node, expanded, hasChildren, elementProps, tree: treeController }: RenderTreeNodePayload) => {
    const checked = treeController.isNodeChecked(node.value);
    const indeterminate = treeController.isNodeIndeterminate(node.value);
    
    return (
      <Group gap={5} {...elementProps}>
        <Checkbox.Indicator
          checked={checked}
          indeterminate={indeterminate}
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
      <Text fw={500} size="lg" mb="md">Export</Text>
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
