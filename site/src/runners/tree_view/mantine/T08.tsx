'use client';

/**
 * tree_view-mantine-T08: Set parent to indeterminate by checking two children
 *
 * Layout: isolated_card centered titled "Backup". Dark theme is enabled. A Mantine Tree is rendered
 * with custom Checkbox next to each node label. The checkbox indicator can show three states:
 * unchecked, checked, and indeterminate (a small dash).
 *
 * Tree structure:
 * • Server A (value=backup/server-a) [parent]
 *   – Logs (backup/server-a/logs) [REQUIRED]
 *   – Reports (backup/server-a/reports) [REQUIRED]
 *   – Config (backup/server-a/config) [MUST remain unchecked]
 * • Server B (backup/server-b) – Logs, Reports
 *
 * Initial state: Server A is expanded; all checkboxes are OFF.
 * A small inline legend above the tree shows a visual example of an indeterminate checkbox.
 *
 * Success:
 * - Checked nodes equal exactly {backup/server-a/logs, backup/server-a/reports}.
 * - Node 'backup/server-a' is indeterminate (partially checked).
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Tree, Group, Checkbox, Box, useTree, type TreeNodeData, type RenderTreeNodePayload } from '@mantine/core';
import { IconChevronRight, IconServer, IconFile } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const treeData: TreeNodeData[] = [
  {
    value: 'backup/server-a',
    label: 'Server A',
    children: [
      { value: 'backup/server-a/logs', label: 'Logs' },
      { value: 'backup/server-a/reports', label: 'Reports' },
      { value: 'backup/server-a/config', label: 'Config' },
    ],
  },
  {
    value: 'backup/server-b',
    label: 'Server B',
    children: [
      { value: 'backup/server-b/logs', label: 'Logs' },
      { value: 'backup/server-b/reports', label: 'Reports' },
    ],
  },
];

const targetChecked = ['backup/server-a/logs', 'backup/server-a/reports'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const tree = useTree({
    initialExpandedState: { 'backup/server-a': true },
    initialCheckedState: [],
  });
  const successFired = useRef(false);

  useEffect(() => {
    const checkedMatch = setsEqual(tree.checkedState, targetChecked);
    const indeterminateMatch = tree.isNodeIndeterminate('backup/server-a');
    
    if (!successFired.current && checkedMatch && indeterminateMatch) {
      successFired.current = true;
      onSuccess();
    }
  }, [tree.checkedState, tree, onSuccess]);

  const renderNode = ({ node, expanded, hasChildren, elementProps, tree: treeController }: RenderTreeNodePayload) => {
    const isChecked = treeController.isNodeChecked(node.value);
    const isIndeterminate = treeController.isNodeIndeterminate(node.value);

    return (
      <Group gap={5} {...elementProps}>
        <Checkbox.Indicator
          checked={isChecked}
          indeterminate={isIndeterminate}
          onClick={(e) => {
            e.stopPropagation();
            if (isChecked) {
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
        {hasChildren ? <IconServer size={16} /> : <IconFile size={16} />}
        <Text size="sm">{node.label}</Text>
      </Group>
    );
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }} data-testid="tree-card">
      <Text fw={500} size="lg" mb="sm">Backup</Text>
      
      {/* Legend */}
      <Box mb="md" p="xs" style={{ background: 'rgba(0,0,0,0.05)', borderRadius: 4 }}>
        <Group gap="md">
          <Group gap={4}>
            <Checkbox.Indicator size="xs" checked={false} />
            <Text size="xs">Unchecked</Text>
          </Group>
          <Group gap={4}>
            <Checkbox.Indicator size="xs" checked={true} />
            <Text size="xs">Checked</Text>
          </Group>
          <Group gap={4}>
            <Checkbox.Indicator size="xs" indeterminate />
            <Text size="xs">Partial</Text>
          </Group>
        </Group>
      </Box>
      
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
