'use client';

/**
 * tree_select-mantine-T08: Dark theme: expand repo/src (no selection)
 *
 * Theme: dark.
 * Layout: isolated_card centered titled "Browse repository".
 * Target component: composite TreeSelect labeled "Repository"; empty on load.
 * Popover contents: Mantine Tree with explicit expand/collapse chevrons.
 * Tree data:
 *   - repo → src → (components, hooks, pages), package.json
 * Initial state: collapsed; popover closed.
 *
 * Success: The Repository popover is open, and expanded nodes include repo and repo/src, making "pages" visible.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, Popover, Tree, Group, useTree, type TreeNodeData, type RenderTreeNodePayload, MantineProvider } from '@mantine/core';
import { IconChevronRight, IconFolder, IconFile } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const treeData: TreeNodeData[] = [
  {
    value: 'repo',
    label: 'repo',
    children: [
      {
        value: 'repo/src',
        label: 'src',
        children: [
          { value: 'repo/src/components', label: 'components' },
          { value: 'repo/src/hooks', label: 'hooks' },
          { value: 'repo/src/pages', label: 'pages' },
        ],
      },
      { value: 'repo/package.json', label: 'package.json' },
    ],
  },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);
  const tree = useTree({
    initialExpandedState: {},
  });
  const successFired = useRef(false);

  useEffect(() => {
    // Success when popover is open AND both 'repo' and 'repo/src' are expanded
    if (
      !successFired.current &&
      opened &&
      tree.expandedState['repo'] &&
      tree.expandedState['repo/src']
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [opened, tree.expandedState, onSuccess]);

  const renderNode = ({ node, expanded, hasChildren, elementProps, tree: treeController }: RenderTreeNodePayload) => (
    <Group
      gap={5}
      {...elementProps}
      style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 4 }}
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
      <Text
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          // For this task, clicking label should NOT close - only expand/select for observation
          if (!hasChildren) {
            setValue(node.value);
            // Don't close - task is about expansion
          }
        }}
      >
        {node.label}
      </Text>
    </Group>
  );

  return (
    <MantineProvider forceColorScheme="dark">
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400, background: '#1a1a1a' }} data-testid="tree-select-card">
        <Text fw={500} size="lg" mb="md" c="white">Browse repository</Text>
        <Text size="sm" fw={500} mb={4} c="white">Repository</Text>
        <Popover opened={opened} onChange={setOpened} position="bottom-start" width={350}>
          <Popover.Target>
            <TextInput
              placeholder="Select a file"
              value={value || ''}
              onClick={() => setOpened(true)}
              readOnly
              rightSection={<IconChevronRight size={16} style={{ transform: opened ? 'rotate(90deg)' : 'none' }} />}
              data-testid="tree-select-repository"
            />
          </Popover.Target>
          <Popover.Dropdown style={{ background: '#2a2a2a' }}>
            <Tree
              data={treeData}
              tree={tree}
              renderNode={renderNode}
              data-testid="tree-view"
            />
          </Popover.Dropdown>
        </Popover>
      </Card>
    </MantineProvider>
  );
}
