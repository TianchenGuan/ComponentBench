'use client';

/**
 * tree_grid-mantine-T02: Expand Finance group only (Mantine composite)
 *
 * Layout: isolated card centered.
 * Component (composite): Mantine Table with custom tree affordances.
 * Each top-level row has a chevron button to expand/collapse.
 * Initial state: all top-level groups are collapsed; no selection; no filters.
 * Interaction: click the chevron for Finance; other groups should remain collapsed.
 * Feedback: Finance's child rows appear indented directly beneath Finance and the chevron rotates.
 *
 * Success: Expanded row paths set is exactly {Finance}.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Text, ActionIcon, Group, Box } from '@mantine/core';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps, TreeGridRow } from '../types';
import { SERVICE_CATALOG_DATA, setsEqual } from '../types';

interface TreeTableRowProps {
  row: TreeGridRow;
  depth: number;
  expandedKeys: Set<string>;
  onToggleExpand: (key: string) => void;
}

function TreeTableRow({ row, depth, expandedKeys, onToggleExpand }: TreeTableRowProps) {
  const isExpanded = expandedKeys.has(row.key);
  const hasChildren = row.children && row.children.length > 0;

  return (
    <>
      <Table.Tr>
        <Table.Td>
          <Group gap={4} style={{ paddingLeft: depth * 20 }}>
            {hasChildren ? (
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={() => onToggleExpand(row.key)}
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
          onToggleExpand={onToggleExpand}
        />
      ))}
    </>
  );
}

const TOP_LEVEL_KEYS = ['platform', 'finance', 'marketing', 'operations', 'people'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const successFired = useRef(false);

  // Check which top-level keys are expanded
  const expandedTopLevel = Array.from(expandedKeys).filter(k => TOP_LEVEL_KEYS.includes(k));

  useEffect(() => {
    if (!successFired.current && setsEqual(expandedTopLevel, ['finance'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [expandedTopLevel, onSuccess]);

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
        Expand Finance only in the Service Catalog grid.
      </Text>
      
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
              onToggleExpand={toggleExpand}
            />
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
