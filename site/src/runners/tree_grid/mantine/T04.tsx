'use client';

/**
 * tree_grid-mantine-T04: Search 'q2' then select Q2 Launch
 *
 * Layout: isolated card centered.
 * Component (composite): Mantine Table tree grid with a small SearchInput embedded in the
 * table header area (above the column headers) as part of the component wrapper.
 * Search behavior: typing filters visible rows by Service name (case-insensitive) and keeps
 * ancestor rows visible for context.
 * Initial state: search field is empty; all groups collapsed; no selection.
 * Interaction: click into the search field, type q2; expand Marketing and Campaigns if needed;
 * click the Q2 Launch row to select.
 * Feedback: a "Filtered results" count appears next to the search field; selected row highlight remains.
 *
 * Success: Search query text equals "q2" and selected row path equals Marketing → Campaigns → Q2 Launch.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Table, Text, ActionIcon, Group, Box, TextInput, Badge } from '@mantine/core';
import { IconChevronRight, IconChevronDown, IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps, TreeGridRow } from '../types';
import { SERVICE_CATALOG_DATA, getRowPath, pathEquals } from '../types';

// Check if row or any descendant matches search
function rowMatchesSearch(row: TreeGridRow, search: string): boolean {
  const normalizedSearch = search.toLowerCase();
  if (row.service.toLowerCase().includes(normalizedSearch)) {
    return true;
  }
  if (row.children) {
    return row.children.some(child => rowMatchesSearch(child, search));
  }
  return false;
}

interface TreeTableRowProps {
  row: TreeGridRow;
  depth: number;
  expandedKeys: Set<string>;
  selectedKey: string | null;
  searchQuery: string;
  onToggleExpand: (key: string) => void;
  onSelect: (key: string) => void;
}

function TreeTableRow({ row, depth, expandedKeys, selectedKey, searchQuery, onToggleExpand, onSelect }: TreeTableRowProps) {
  // Filter by search
  if (searchQuery && !rowMatchesSearch(row, searchQuery)) {
    return null;
  }

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
        <Table.Td><Text size="sm">{row.lastUpdated}</Text></Table.Td>
      </Table.Tr>
      {hasChildren && (isExpanded || searchQuery) && row.children!.map(child => (
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

export default function T04({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const successFired = useRef(false);

  const selectedPath = selectedKey ? getRowPath(SERVICE_CATALOG_DATA, selectedKey) : [];

  // Count filtered results
  const filteredCount = useMemo(() => {
    if (!searchQuery) return 0;
    let count = 0;
    function countMatches(rows: TreeGridRow[]) {
      for (const row of rows) {
        if (row.service.toLowerCase().includes(searchQuery.toLowerCase())) {
          count++;
        }
        if (row.children) countMatches(row.children);
      }
    }
    countMatches(SERVICE_CATALOG_DATA);
    return count;
  }, [searchQuery]);

  useEffect(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    if (
      !successFired.current &&
      normalizedQuery === 'q2' &&
      pathEquals(selectedPath, ['Marketing', 'Campaigns', 'Q2 Launch'])
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [searchQuery, selectedPath, onSuccess]);

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }} data-testid="tree-grid-card">
      <Text fw={500} size="lg" mb="md">Service Catalog</Text>
      <Text c="dimmed" size="sm" mb="md">
        Search q2 in the grid, then select Marketing → Campaigns → Q2 Launch.
      </Text>
      
      <Group mb="md">
        <TextInput
          placeholder="Search services..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          style={{ width: 250 }}
        />
        {searchQuery && <Badge variant="light">Filtered: {filteredCount}</Badge>}
      </Group>

      {selectedKey && (
        <Text fw={500} size="sm" mb="sm">
          Selected path: {selectedPath.join(' → ')}
        </Text>
      )}
      
      <Table striped={false} data-testid="tree-grid">
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 220 }}>Service</Table.Th>
            <Table.Th style={{ width: 150 }}>Owner</Table.Th>
            <Table.Th style={{ width: 100 }}>Status</Table.Th>
            <Table.Th style={{ width: 120 }}>Last updated</Table.Th>
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
    </Card>
  );
}
