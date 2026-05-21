'use client';

/**
 * tree_select-mantine-T02: Open folder popover
 *
 * Layout: isolated_card centered titled "Attach file".
 * Target component: composite TreeSelect labeled "Folder":
 *   - Trigger: Mantine TextInput with a chevron icon.
 *   - Dropdown: Mantine Popover containing a Tree.
 * Initial state: Folder is empty.
 * Tree data: Inbox, Shared → (Design, Engineering), Archive
 *
 * Success: The Folder tree selector popover is open and the Tree is visible.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, Popover, Tree, Group, useTree, type TreeNodeData, type RenderTreeNodePayload } from '@mantine/core';
import { IconChevronRight, IconFolder, IconFile } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const treeData: TreeNodeData[] = [
  { value: 'inbox', label: 'Inbox' },
  {
    value: 'shared',
    label: 'Shared',
    children: [
      { value: 'shared/design', label: 'Design' },
      { value: 'shared/engineering', label: 'Engineering' },
    ],
  },
  { value: 'archive', label: 'Archive' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);
  const tree = useTree();
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && opened) {
      successFired.current = true;
      onSuccess();
    }
  }, [opened, onSuccess]);

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
      <Text fw={500} size="lg" mb="md">Attach file</Text>
      <Text size="sm" c="dimmed" mb="md">Select a folder to attach files from.</Text>
      <Text size="sm" fw={500} mb={4}>Folder</Text>
      <Popover opened={opened} onChange={setOpened} position="bottom-start" width={350}>
        <Popover.Target>
          <TextInput
            placeholder="Select a folder"
            value={value || ''}
            onClick={() => setOpened(true)}
            readOnly
            rightSection={<IconChevronRight size={16} style={{ transform: opened ? 'rotate(90deg)' : 'none' }} />}
            data-testid="tree-select-folder"
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
