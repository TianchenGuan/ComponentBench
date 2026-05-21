'use client';

/**
 * tree_select-mantine-T05: Select three sync folders (checkboxes)
 *
 * Layout: form_section titled "Sync settings" with a few additional controls (low clutter).
 * Target component: composite TreeSelect labeled "Folders to sync" using a checkbox-style Tree.
 * Tree data:
 *   - Sync → Photos → (2023, 2024, 2025), Docs → (Invoices, Taxes, Notes), Music → (Albums, Playlists)
 * Initial state: nothing checked/selected.
 * Clutter (low): the section also contains a "Sync over Wi‑Fi only" toggle.
 *
 * Success: Folders to sync selected set equals {Sync/Photos/2024, Sync/Docs/Taxes, Sync/Music/Playlists}.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, Popover, Tree, Group, Checkbox, Switch, Chip, useTree, type TreeNodeData, type RenderTreeNodePayload } from '@mantine/core';
import { IconChevronRight, IconFolder, IconFile } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const treeData: TreeNodeData[] = [
  {
    value: 'sync',
    label: 'Sync',
    children: [
      {
        value: 'sync/photos',
        label: 'Photos',
        children: [
          { value: 'sync_photos_2023', label: '2023' },
          { value: 'sync_photos_2024', label: '2024' },
          { value: 'sync_photos_2025', label: '2025' },
        ],
      },
      {
        value: 'sync/docs',
        label: 'Docs',
        children: [
          { value: 'sync_docs_invoices', label: 'Invoices' },
          { value: 'sync_docs_taxes', label: 'Taxes' },
          { value: 'sync_docs_notes', label: 'Notes' },
        ],
      },
      {
        value: 'sync/music',
        label: 'Music',
        children: [
          { value: 'sync_music_albums', label: 'Albums' },
          { value: 'sync_music_playlists', label: 'Playlists' },
        ],
      },
    ],
  },
];

const leafLabels: Record<string, string> = {
  sync_photos_2023: '2023',
  sync_photos_2024: '2024',
  sync_photos_2025: '2025',
  sync_docs_invoices: 'Invoices',
  sync_docs_taxes: 'Taxes',
  sync_docs_notes: 'Notes',
  sync_music_albums: 'Albums',
  sync_music_playlists: 'Playlists',
};

const leafValues = new Set(Object.keys(leafLabels));
const TARGET_VALUES = ['sync_photos_2024', 'sync_docs_taxes', 'sync_music_playlists'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [opened, setOpened] = useState(false);
  const [wifiOnly, setWifiOnly] = useState(false);
  const tree = useTree();
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(selectedValues, TARGET_VALUES)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedValues, onSuccess]);

  const toggleValue = (val: string) => {
    setSelectedValues((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const renderNode = ({ node, expanded, hasChildren, elementProps, tree: treeController }: RenderTreeNodePayload) => {
    const isLeaf = leafValues.has(node.value);
    const isChecked = selectedValues.includes(node.value);

    return (
      <Group
        gap={5}
        {...elementProps}
        onClick={(e) => {
          if (hasChildren) {
            treeController.toggleExpanded(node.value);
          } else if (isLeaf) {
            toggleValue(node.value);
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
        {isLeaf ? (
          <Checkbox
            checked={isChecked}
            onChange={() => toggleValue(node.value)}
            onClick={(e) => e.stopPropagation()}
            size="xs"
          />
        ) : (
          <IconFolder size={16} />
        )}
        <Text size="sm">{node.label}</Text>
      </Group>
    );
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }} data-testid="tree-select-card">
      <Text fw={500} size="lg" mb="md">Sync settings</Text>

      <Text size="sm" fw={500} mb={4}>Folders to sync</Text>
      <Popover opened={opened} onChange={setOpened} position="bottom-start" width={380}>
        <Popover.Target>
          <div onClick={() => setOpened(true)} style={{ cursor: 'pointer' }}>
            <TextInput
              placeholder="Select folders"
              value=""
              readOnly
              rightSection={<IconChevronRight size={16} style={{ transform: opened ? 'rotate(90deg)' : 'none' }} />}
              data-testid="tree-select-folders"
            />
            {selectedValues.length > 0 && (
              <Group gap={4} mt={8}>
                {selectedValues.map((v) => (
                  <Chip
                    key={v}
                    checked={false}
                    onClick={() => toggleValue(v)}
                    size="xs"
                  >
                    {leafLabels[v]}
                  </Chip>
                ))}
              </Group>
            )}
          </div>
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

      <Group mt="lg" justify="space-between">
        <Text size="sm">Sync over Wi-Fi only</Text>
        <Switch checked={wifiOnly} onChange={(e) => setWifiOnly(e.currentTarget.checked)} />
      </Group>

      <Text size="xs" c="dimmed" mt="md">Status: Connected</Text>
    </Card>
  );
}
