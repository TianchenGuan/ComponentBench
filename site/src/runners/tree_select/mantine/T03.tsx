'use client';

/**
 * tree_select-mantine-T03: Clear selected path
 *
 * Layout: isolated_card centered titled "New shortcut".
 * Target component: composite TreeSelect labeled "Location".
 * Initial state: Location is pre-filled with "Shared / Design".
 * Configuration: when a value is present, a clear (×) icon button is shown.
 *
 * Success: The Location tree selector has an empty committed selection.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, Popover, Tree, Group, CloseButton, useTree, type TreeNodeData, type RenderTreeNodePayload } from '@mantine/core';
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

const valueLabels: Record<string, string> = {
  'inbox': 'Inbox',
  'shared/design': 'Shared / Design',
  'shared/engineering': 'Shared / Engineering',
  'archive': 'Archive',
};

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('shared/design');
  const [opened, setOpened] = useState(false);
  const tree = useTree();
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && value === null) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleClear = () => {
    setValue(null);
  };

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
      <Text fw={500} size="lg" mb="md">New shortcut</Text>
      <Text size="sm" fw={500} mb={4}>Location</Text>
      <Popover opened={opened} onChange={setOpened} position="bottom-start" width={350}>
        <Popover.Target>
          <TextInput
            placeholder="Select a location"
            value={value ? valueLabels[value] || value : ''}
            onClick={() => setOpened(true)}
            readOnly
            rightSection={
              value ? (
                <CloseButton size="sm" onClick={(e) => { e.stopPropagation(); handleClear(); }} data-testid="clear-button" />
              ) : (
                <IconChevronRight size={16} style={{ transform: opened ? 'rotate(90deg)' : 'none' }} />
              )
            }
            data-testid="tree-select-location"
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
