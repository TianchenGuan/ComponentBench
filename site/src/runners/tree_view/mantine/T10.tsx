'use client';

/**
 * tree_view-mantine-T10: Reset Primary selection tree (clear checks + collapse all) with 2 instances
 *
 * Layout: isolated_card centered titled "Sync settings". Inside the card, two Mantine Tree instances
 * are shown side-by-side:
 * 1) "Primary selection" tree (left, TARGET) with custom Checkbox and chevron expand icons.
 * 2) "Preview" tree (right, distractor) showing a similar file hierarchy but without checkboxes.
 *
 * Target tree (Primary selection) structure:
 * • src (value=sync/src)
 *   – components (sync/src/components)
 *      * Button.tsx (sync/src/components/button)
 *      * Modal.tsx (sync/src/components/modal)
 * • docs (value=sync/docs)
 *   – README.md (sync/docs/readme)
 *   – CHANGELOG.md (sync/docs/changelog)
 *
 * Initial state in Primary selection (TARGET): src and docs are both expanded. Checked by default:
 * Button.tsx and README.md. This makes their parents appear partially checked/indeterminate.
 * The Preview tree on the right has its own expansion/selection state but must be ignored.
 *
 * Success:
 * - In the 'Primary selection' tree instance, no nodes are checked.
 * - In the 'Primary selection' tree instance, no nodes are indeterminate.
 * - In the 'Primary selection' tree instance, no nodes are expanded (tree is fully collapsed).
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Tree, Group, Grid, Checkbox, useTree, type TreeNodeData, type RenderTreeNodePayload } from '@mantine/core';
import { IconChevronRight, IconFolder, IconFile, IconFolderOpen } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const primaryTreeData: TreeNodeData[] = [
  {
    value: 'sync/src',
    label: 'src',
    children: [
      {
        value: 'sync/src/components',
        label: 'components',
        children: [
          { value: 'sync/src/components/button', label: 'Button.tsx' },
          { value: 'sync/src/components/modal', label: 'Modal.tsx' },
        ],
      },
    ],
  },
  {
    value: 'sync/docs',
    label: 'docs',
    children: [
      { value: 'sync/docs/readme', label: 'README.md' },
      { value: 'sync/docs/changelog', label: 'CHANGELOG.md' },
    ],
  },
];

const previewTreeData: TreeNodeData[] = [
  {
    value: 'preview/src',
    label: 'src',
    children: [
      {
        value: 'preview/src/components',
        label: 'components',
        children: [
          { value: 'preview/src/components/button', label: 'Button.tsx' },
          { value: 'preview/src/components/modal', label: 'Modal.tsx' },
        ],
      },
    ],
  },
  {
    value: 'preview/docs',
    label: 'docs',
    children: [
      { value: 'preview/docs/readme', label: 'README.md' },
      { value: 'preview/docs/changelog', label: 'CHANGELOG.md' },
    ],
  },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  // Primary tree state (TARGET)
  const primaryTree = useTree({
    initialExpandedState: { 'sync/src': true, 'sync/src/components': true, 'sync/docs': true },
    initialCheckedState: ['sync/src/components/button', 'sync/docs/readme'],
  });
  
  // Preview tree state (distractor)
  const previewTree = useTree({
    initialExpandedState: { 'preview/src': true, 'preview/docs': true },
    initialSelectedState: [],
  });
  
  const successFired = useRef(false);

  // Check for success condition
  useEffect(() => {
    const noChecks = primaryTree.checkedState.length === 0;
    const expandedNodes = Object.entries(primaryTree.expandedState)
      .filter(([_, isExpanded]) => isExpanded);
    const noExpanded = expandedNodes.length === 0;
    
    // Check if any node is indeterminate
    const hasIndeterminate = primaryTree.isNodeIndeterminate('sync/src') || 
                            primaryTree.isNodeIndeterminate('sync/src/components') ||
                            primaryTree.isNodeIndeterminate('sync/docs');
    
    if (!successFired.current && noChecks && noExpanded && !hasIndeterminate) {
      successFired.current = true;
      onSuccess();
    }
  }, [primaryTree.checkedState, primaryTree.expandedState, primaryTree, onSuccess]);

  const renderPrimaryNode = ({ node, expanded, hasChildren, elementProps, tree: treeController }: RenderTreeNodePayload) => {
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
        {hasChildren ? (
          expanded ? <IconFolderOpen size={16} /> : <IconFolder size={16} />
        ) : (
          <IconFile size={16} />
        )}
        <Text size="sm">{node.label}</Text>
      </Group>
    );
  };

  const renderPreviewNode = ({ node, expanded, hasChildren, elementProps, tree: treeController, selected }: RenderTreeNodePayload) => (
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
      {hasChildren ? (
        expanded ? <IconFolderOpen size={16} /> : <IconFolder size={16} />
      ) : (
        <IconFile size={16} />
      )}
      <Text size="sm">{node.label}</Text>
    </Group>
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }} data-testid="tree-card">
      <Text fw={500} size="lg" mb="md">Sync settings</Text>
      
      <Grid>
        <Grid.Col span={6}>
          <Card withBorder padding="md" data-testid="primary-selection-tree">
            <Text fw={500} size="md" mb="sm">Primary selection</Text>
            <Tree
              data={primaryTreeData}
              tree={primaryTree}
              renderNode={renderPrimaryNode}
              expandOnClick={false}
            />
          </Card>
        </Grid.Col>
        
        <Grid.Col span={6}>
          <Card withBorder padding="md" data-testid="preview-tree">
            <Text fw={500} size="md" mb="sm">Preview</Text>
            <Tree
              data={previewTreeData}
              tree={previewTree}
              renderNode={renderPreviewNode}
              selectOnClick
            />
          </Card>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
