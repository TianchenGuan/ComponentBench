'use client';

/**
 * tree_grid-mantine-T07: Select the highlighted target row from a visual reference (scroll + deep tree)
 *
 * Layout: isolated card centered.
 * Component (composite): Mantine Table tree grid inside a ScrollArea (fixed height; about 9 rows visible).
 * Guidance: a non-interactive reference preview card sits above the table and shows the target row
 * highlighted inside a miniature tree snippet (visual-only guidance).
 * Hierarchy: the target is a deep leaf in Operations → Data Centers → US-West → Rack 21 → Cooling Unit.
 * US-West contains many racks, so reaching Rack 21 requires scrolling inside the table area.
 * Initial state: all groups collapsed; no selection.
 * Interaction: expand/collapse via chevrons; scroll inside the ScrollArea; select by clicking the row.
 * Feedback: selection highlight + selected-path readout beneath the table.
 *
 * Success: Selected row path equals Operations → Data Centers → US-West → Rack 21 → Cooling Unit.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Text, ActionIcon, Group, Box, Paper, ScrollArea, Stack } from '@mantine/core';
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
          <Group gap={4} style={{ paddingLeft: depth * 16 }}>
            {hasChildren ? (
              <ActionIcon
                variant="subtle"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(row.key);
                }}
              >
                {isExpanded ? <IconChevronDown size={12} /> : <IconChevronRight size={12} />}
              </ActionIcon>
            ) : (
              <Box style={{ width: 18 }} />
            )}
            <Text size="xs">{row.service}</Text>
          </Group>
        </Table.Td>
        <Table.Td><Text size="xs">{row.owner}</Text></Table.Td>
        <Table.Td><Text size="xs">{row.status}</Text></Table.Td>
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

export default function T07({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const successFired = useRef(false);

  const selectedPath = selectedKey ? getRowPath(SERVICE_CATALOG_DATA, selectedKey) : [];

  useEffect(() => {
    if (
      !successFired.current &&
      pathEquals(selectedPath, ['Operations', 'Data Centers', 'US-West', 'Rack 21', 'Cooling Unit'])
    ) {
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
      {/* Reference Preview */}
      <Paper p="md" withBorder style={{ maxWidth: 350 }} data-reference-id="ref-deep-cooling-unit">
        <Text size="sm" c="dimmed" mb="sm">Reference Preview (visual)</Text>
        <Box style={{ fontSize: 11, lineHeight: 1.4 }}>
          <Group gap={4} mb={2}><IconFolder size={12} /><Text size="xs">Operations</Text></Group>
          <Group gap={4} mb={2} style={{ paddingLeft: 12 }}><IconFolder size={12} /><Text size="xs">Data Centers</Text></Group>
          <Group gap={4} mb={2} style={{ paddingLeft: 24 }}><IconFolder size={12} /><Text size="xs">US-West</Text></Group>
          <Group gap={4} mb={2} style={{ paddingLeft: 36 }}><IconFolder size={12} /><Text size="xs">Rack 21</Text></Group>
          <Group 
            gap={4} 
            style={{ 
              paddingLeft: 48,
              backgroundColor: '#fff3cd',
              padding: '2px 6px 2px 48px',
              borderRadius: 4,
              border: '1px solid #ffc107',
            }}
          >
            <IconFile size={12} />
            <Text size="xs" fw={600}>Cooling Unit</Text>
          </Group>
        </Box>
      </Paper>

      {/* Main Table with ScrollArea */}
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }} data-testid="tree-grid-card">
        <Text fw={500} size="lg" mb="md">Service Catalog</Text>
        <Text c="dimmed" size="sm" mb="md">
          Select the row that matches the highlighted reference preview.
        </Text>
        
        <ScrollArea h={280} offsetScrollbars>
          <Table striped={false} data-testid="tree-grid">
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 200 }}>Service</Table.Th>
                <Table.Th style={{ width: 100 }}>Owner</Table.Th>
                <Table.Th style={{ width: 70 }}>Status</Table.Th>
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
        </ScrollArea>

        {selectedKey && (
          <Text fw={500} size="sm" mt="sm">
            Selected path: {selectedPath.join(' → ')}
          </Text>
        )}
      </Card>
    </Stack>
  );
}
