'use client';

/**
 * tree_view-mantine-T09: Open drawer and select Finance > Invoices
 *
 * Layout: drawer_flow. The main page shows a button labeled "Choose folders". Clicking it opens
 * a Mantine Drawer anchored on the right side of the viewport.
 *
 * Inside the drawer:
 * • Header: "Choose folders" with a close (X) icon.
 * • Body: a Mantine Tree titled "Folder tree" with root nodes "Finance", "HR", "Engineering".
 *   Finance has children "Invoices", "Budgets", "Payroll".
 *
 * Initial state: the drawer is closed. When opened, all roots are collapsed and nothing is selected.
 * The drawer also contains helper text below the tree (clutter=low), but no other required actions.
 *
 * Success: Within the drawer's folder tree, the selected node value equals 'folders/finance/invoices'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Tree, Group, Button, Drawer, useTree, type TreeNodeData, type RenderTreeNodePayload } from '@mantine/core';
import { IconChevronRight, IconFolder, IconFile, IconFolderOpen } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const treeData: TreeNodeData[] = [
  {
    value: 'folders/finance',
    label: 'Finance',
    children: [
      { value: 'folders/finance/invoices', label: 'Invoices' },
      { value: 'folders/finance/budgets', label: 'Budgets' },
      { value: 'folders/finance/payroll', label: 'Payroll' },
    ],
  },
  {
    value: 'folders/hr',
    label: 'HR',
    children: [
      { value: 'folders/hr/benefits', label: 'Benefits' },
      { value: 'folders/hr/recruiting', label: 'Recruiting' },
    ],
  },
  {
    value: 'folders/engineering',
    label: 'Engineering',
    children: [
      { value: 'folders/engineering/docs', label: 'Docs' },
      { value: 'folders/engineering/code', label: 'Code' },
    ],
  },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const tree = useTree({
    initialExpandedState: {},
    initialSelectedState: [],
  });
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && tree.selectedState.includes('folders/finance/invoices')) {
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
      {hasChildren ? (
        expanded ? <IconFolderOpen size={16} /> : <IconFolder size={16} />
      ) : (
        <IconFile size={16} />
      )}
      <Text size="sm">{node.label}</Text>
    </Group>
  );

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 300 }} data-testid="main-card">
        <Text fw={500} size="lg" mb="md">Folder Selection</Text>
        <Text size="sm" c="dimmed" mb="md">
          Click the button below to choose folders.
        </Text>
        <Button onClick={() => setDrawerOpened(true)} data-testid="open-drawer-button">
          Choose folders
        </Button>
      </Card>

      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        title="Choose folders"
        position="right"
        size="md"
        data-testid="folder-drawer"
      >
        <Text fw={500} size="md" mb="sm">Folder tree</Text>
        <Tree
          data={treeData}
          tree={tree}
          renderNode={renderNode}
          selectOnClick
          data-testid="drawer-tree-root"
        />
        
        {/* Helper text (clutter) */}
        <Text size="xs" c="dimmed" mt="lg">
          Select a folder to set it as the destination. You can expand folders to see their contents.
        </Text>
      </Drawer>
    </>
  );
}
