'use client';

/**
 * tree_grid-mantine-T06: Match reference preview and select Laptop Requests
 *
 * Layout: isolated card anchored near the top-left of the viewport.
 * Component (composite): Mantine Table tree grid with expand/collapse chevrons and single-row selection.
 * Guidance: a reference preview panel sits above the table and shows the target row visually
 * (a highlighted line with indentation) without naming the row in a clickable form.
 * Initial state: People node collapsed; no selection.
 * Distractors: the reference preview also shows a second non-highlighted path as a distractor.
 * Interaction: expand People, expand IT, then select Laptop Requests.
 * Feedback: selected highlight + selected-path readout.
 *
 * Success: Selected row path equals People → IT → Laptop Requests.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Text, ActionIcon, Group, Box, Paper, Stack } from '@mantine/core';
import { IconChevronRight, IconChevronDown, IconFolder, IconFile } from '@tabler/icons-react';
import type { TaskComponentProps, TreeGridRow } from '../types';
import { SERVICE_CATALOG_DATA, getRowPath, pathEquals } from '../types';

interface TreeTableRowProps {
  row: TreeGridRow;
  depth: number;
  expandedKeys: Set<string>;
  selectedKey: string | null;
  onToggleExpand: (key: string) => void;
  onSelect: (key: string) => void;
}

function TreeTableRow({ row, depth, expandedKeys, selectedKey, onToggleExpand, onSelect }: TreeTableRowProps) {
  const isExpanded = expandedKeys.has(row.key);
  const isSelected = selectedKey === row.key;
  const hasChildren = row.children && row.children.length > 0;

  return (
    <>
      <Table.Tr
        style={{
          cursor: 'pointer',
          backgroundColor: isSelected ? '#e6f7ff' : undefined,
        }}
        onClick={() => onSelect(row.key)}
      >
        <Table.Td>
          <Group gap={4} style={{ paddingLeft: depth * 20 }}>
            {hasChildren ? (
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(row.key);
                }}
              >
                {isExpanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
              </ActionIcon>
            ) : (
              <Box style={{ width: 22 }} />
            )}
            <Text size="sm">{row.service}</Text>
          </Group>
        </Table.Td>
        <Table.Td><Text size="sm">{row.owner}</Text></Table.Td>
        <Table.Td><Text size="sm">{row.status}</Text></Table.Td>
      </Table.Tr>
      {hasChildren && isExpanded && row.children!.map(child => (
        <TreeTableRow
          key={child.key}
          row={child}
          depth={depth + 1}
          expandedKeys={expandedKeys}
          selectedKey={selectedKey}
          onToggleExpand={onToggleExpand}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const successFired = useRef(false);

  const selectedPath = selectedKey ? getRowPath(SERVICE_CATALOG_DATA, selectedKey) : [];

  useEffect(() => {
    if (!successFired.current && pathEquals(selectedPath, ['People', 'IT', 'Laptop Requests'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedPath, onSuccess]);

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <Stack>
      {/* Reference Preview Panel */}
      <Paper p="md" withBorder style={{ maxWidth: 300 }} data-reference-id="ref-path-it-laptop">
        <Text size="sm" c="dimmed" mb="sm">Reference Preview</Text>
        <Box style={{ fontSize: 12 }}>
          <Group gap={4} mb={2}>
            <IconFolder size={14} />
            <Text size="xs">People</Text>
          </Group>
          <Group gap={4} mb={2} style={{ paddingLeft: 16 }}>
            <IconFolder size={14} />
            <Text size="xs">HR</Text>
          </Group>
          <Group gap={4} mb={2} style={{ paddingLeft: 16 }}>
            <IconFolder size={14} />
            <Text size="xs">IT</Text>
          </Group>
          <Group 
            gap={4} 
            style={{ 
              paddingLeft: 32, 
              backgroundColor: '#fff3cd',
              padding: '4px 8px 4px 32px',
              borderRadius: 4,
              border: '1px solid #ffc107',
            }}
          >
            <IconFile size={14} />
            <Text size="xs" fw={600}>Laptop Requests</Text>
            <Text size="xs" c="dimmed">← Target</Text>
          </Group>
        </Box>
      </Paper>

      {/* Main Table */}
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }} data-testid="tree-grid-card">
        <Text fw={500} size="lg" mb="md">Service Catalog</Text>
        <Text c="dimmed" size="sm" mb="md">
          Match the reference: select People → IT → Laptop Requests.
        </Text>
        
        {selectedKey && (
          <Text fw={500} size="sm" mb="sm">
            Selected path: {selectedPath.join(' → ')}
          </Text>
        )}
        
        <Table striped={false} data-testid="tree-grid">
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 220 }}>Service</Table.Th>
              <Table.Th style={{ width: 130 }}>Owner</Table.Th>
              <Table.Th style={{ width: 80 }}>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {SERVICE_CATALOG_DATA.map(row => (
              <TreeTableRow
                key={row.key}
                row={row}
                depth={0}
                expandedKeys={expandedKeys}
                selectedKey={selectedKey}
                onToggleExpand={toggleExpand}
                onSelect={setSelectedKey}
              />
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </Stack>
  );
}
