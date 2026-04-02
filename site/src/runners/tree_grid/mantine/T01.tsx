'use client';

/**
 * tree_grid-mantine-T01: Select API Gateway row (Mantine composite)
 *
 * Layout: isolated card centered.
 * Component (composite): a Mantine Table styled as a tree grid. The first column contains
 * an expand/collapse chevron (ActionIcon) for parent rows and indentation for children;
 * remaining columns show Owner, Status, and Last updated.
 * Selection: single-row selection is enabled; clicking a row highlights it.
 * Initial state: all top-level groups are collapsed; no row is selected.
 * Distractors: none; only a short read-only description below the card title.
 * Feedback: highlighted row + a small "Selected path:" text below the table.
 *
 * Success: Selected row path equals Platform → API Gateway.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Text, ActionIcon, Group, Box } from '@mantine/core';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';
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
        data-row-path={getRowPath(SERVICE_CATALOG_DATA, row.key).join('/')}
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

export default function T01({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const successFired = useRef(false);

  const selectedPath = selectedKey ? getRowPath(SERVICE_CATALOG_DATA, selectedKey) : [];

  useEffect(() => {
    if (!successFired.current && pathEquals(selectedPath, ['Platform', 'API Gateway'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedPath, onSuccess]);

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
        Select "Platform → API Gateway" in the Service Catalog grid.
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
              onToggleExpand={toggleExpand}
              onSelect={setSelectedKey}
            />
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
