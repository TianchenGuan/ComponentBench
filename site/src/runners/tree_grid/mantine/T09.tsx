'use client';

/**
 * tree_grid-mantine-T09: Reset search, selection, and expansions (small, bottom-right)
 *
 * Layout: isolated card anchored near the bottom-right of the viewport.
 * Scale: small (reduced padding and smaller typography).
 * Component (composite): Mantine Table tree grid with a SearchInput in the header.
 * Initial state (non-default):
 *   - Search field contains "rack".
 *   - Expanded: Operations → Data Centers → US-East is expanded.
 *   - Selected rows: "US-East → Rack 12" is selected.
 * Interaction: clear the SearchInput, deselect the selected row, and collapse any expanded groups.
 * Feedback: when reset, no child rows are visible, search results count disappears, no row highlighted.
 *
 * Success: Search query text is empty, no rows selected, expanded row paths list is empty.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Table, Text, ActionIcon, Group, Box, TextInput, CloseButton } from '@mantine/core';
import { IconChevronRight, IconChevronDown, IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps, TreeGridRow } from '../types';
import { SERVICE_CATALOG_DATA } from '../types';

// Check if row or any descendant matches search
function rowMatchesSearch(row: TreeGridRow, search: string): boolean {
  const normalizedSearch = search.toLowerCase();
  if (row.service.toLowerCase().includes(normalizedSearch)) return true;
  if (row.children) return row.children.some(child => rowMatchesSearch(child, search));
  return false;
}

interface TreeTableRowProps {
  row: TreeGridRow;
  depth: number;
  expandedKeys: Set<string>;
  selectedKey: string | null;
  searchQuery: string;
  onToggleExpand: (key: string) => void;
  onSelect: (key: string | null) => void;
}

function TreeTableRow({ row, depth, expandedKeys, selectedKey, searchQuery, onToggleExpand, onSelect }: TreeTableRowProps) {
  if (searchQuery && !rowMatchesSearch(row, searchQuery)) return null;

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
        onClick={() => onSelect(isSelected ? null : row.key)}
      >
        <Table.Td>
          <Group gap={2} style={{ paddingLeft: depth * 12 }}>
            {hasChildren ? (
              <ActionIcon
                variant="subtle"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(row.key);
                }}
              >
                {isExpanded ? <IconChevronDown size={10} /> : <IconChevronRight size={10} />}
              </ActionIcon>
            ) : (
              <Box style={{ width: 14 }} />
            )}
            <Text size="xs">{row.service}</Text>
          </Group>
        </Table.Td>
        <Table.Td><Text size="xs">{row.status}</Text></Table.Td>
      </Table.Tr>
      {hasChildren && isExpanded && row.children!.map(child => (
        <TreeTableRow
          key={child.key}
          row={child}
          depth={depth + 1}
          expandedKeys={expandedKeys}
          selectedKey={selectedKey}
          searchQuery={searchQuery}
          onToggleExpand={onToggleExpand}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
  // Initial non-default state
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(
    new Set(['operations', 'operations/data-centers', 'operations/data-centers/us-east'])
  );
  const [selectedKey, setSelectedKey] = useState<string | null>('operations/data-centers/us-east/rack-12');
  const [searchQuery, setSearchQuery] = useState('rack');
  const successFired = useRef(false);

  // Count filtered results
  const filteredCount = useMemo(() => {
    if (!searchQuery) return 0;
    let count = 0;
    function countMatches(rows: TreeGridRow[]) {
      for (const row of rows) {
        if (row.service.toLowerCase().includes(searchQuery.toLowerCase())) count++;
        if (row.children) countMatches(row.children);
      }
    }
    countMatches(SERVICE_CATALOG_DATA);
    return count;
  }, [searchQuery]);

  useEffect(() => {
    const isReset =
      searchQuery.trim() === '' &&
      selectedKey === null &&
      expandedKeys.size === 0;

    if (!successFired.current && isReset) {
      successFired.current = true;
      onSuccess();
    }
  }, [searchQuery, selectedKey, expandedKeys, onSuccess]);

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        Array.from(next).forEach(k => {
          if (k === key || k.startsWith(key + '/')) next.delete(k);
        });
        if (selectedKey && (selectedKey.startsWith(key + '/') )) {
          setSelectedKey(null);
        }
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <Card 
      shadow="sm" 
      padding="sm" 
      radius="md" 
      withBorder 
      style={{ width: 320 }} 
      data-testid="tree-grid-card"
    >
      <Text fw={500} size="sm" mb="xs">Service Catalog</Text>
      <Text c="dimmed" size="xs" mb="xs">
        Reset the grid (empty search, no selection, all collapsed).
      </Text>
      
      <Group mb="xs">
        <TextInput
          placeholder="Search..."
          leftSection={<IconSearch size={12} />}
          rightSection={searchQuery && (
            <CloseButton size="xs" onClick={() => setSearchQuery('')} />
          )}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          size="xs"
          style={{ flex: 1 }}
        />
        {searchQuery && (
          <Text size="xs" c="dimmed">({filteredCount})</Text>
        )}
      </Group>
      
      <Box style={{ height: 200, overflowY: 'auto' }}>
        <Table striped={false} data-testid="tree-grid">
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 180 }}>Service</Table.Th>
              <Table.Th style={{ width: 60 }}>Status</Table.Th>
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
                searchQuery={searchQuery}
                onToggleExpand={toggleExpand}
                onSelect={setSelectedKey}
              />
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Card>
  );
}
