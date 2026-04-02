'use client';

/**
 * tree_select-mantine-T01: Pick src/components (basic composite)
 *
 * Layout: isolated_card centered titled "Open file".
 * Implementation: composite TreeSelect built from:
 *   - a Mantine TextInput trigger labeled "Path",
 *   - a Mantine Popover dropdown,
 *   - a Mantine Tree component inside the popover.
 * Initial state: no path selected; placeholder "Select a path" is shown.
 * Tree data:
 *   - repo → src → (components, hooks, pages), package.json, README.md
 * Behavior: clicking a leaf node selects it and closes the popover.
 *
 * Success: The Path tree selector committed selection equals leaf path [repo, src, components]
 * with value 'repo/src/components'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, Popover, Tree, Group, useTree, type TreeNodeData, type RenderTreeNodePayload } from '@mantine/core';
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
      { value: 'repo/README.md', label: 'README.md' },
    ],
  },
];

const leafValues = new Set(['repo/src/components', 'repo/src/hooks', 'repo/src/pages', 'repo/package.json', 'repo/README.md']);

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);
  const tree = useTree();
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && value === 'repo/src/components') {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  const renderNode = ({ node, expanded, hasChildren, elementProps, tree: treeController }: RenderTreeNodePayload) => (
    <Group
      gap={5}
      {...elementProps}
      onClick={(e) => {
        if (hasChildren) {
          treeController.toggleExpanded(node.value);
        } else {
          setValue(node.value);
          setOpened(false);
        }
        e.stopPropagation();
      }}
      style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 4 }}
    >
      {hasChildren && (
        <IconChevronRight
          size={16}
          style={{
            transform: expanded ? 'rotate(90deg)' : 'none',
            transition: 'transform 150ms',
          }}
        />
      )}
      {!hasChildren && <span style={{ width: 16 }} />}
      {hasChildren ? <IconFolder size={16} /> : <IconFile size={16} />}
      <Text size="sm">{node.label}</Text>
    </Group>
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }} data-testid="tree-select-card">
      <Text fw={500} size="lg" mb="md">Open file</Text>
      <Text size="sm" fw={500} mb={4}>Path</Text>
      <Popover opened={opened} onChange={setOpened} position="bottom-start" width={350}>
        <Popover.Target>
          <TextInput
            placeholder="Select a path"
            value={value || ''}
            onClick={() => setOpened(true)}
            readOnly
            rightSection={<IconChevronRight size={16} style={{ transform: opened ? 'rotate(90deg)' : 'none' }} />}
            data-testid="tree-select-path"
          />
        </Popover.Target>
        <Popover.Dropdown>
          <Tree
            data={treeData}
            tree={tree}
            renderNode={renderNode}
            data-testid="tree-view"
          />
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
}
