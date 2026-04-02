'use client';

/**
 * tree_grid-mantine-T03: Select Billing and Invoicing (checkbox selection)
 *
 * Layout: isolated card centered.
 * Component (composite): Mantine Table tree grid with a leading checkbox column for multi-select.
 * Initial state: groups collapsed; no rows selected.
 * Interaction: expand Finance; check the boxes for Billing and Invoicing; do not select any other rows.
 * Feedback: a "Selected: N" badge appears in the table header; checked boxes remain visible when scrolling.
 *
 * Success: Selected row set equals exactly {Finance/Billing, Finance/Invoicing}.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Text, ActionIcon, Group, Box, Checkbox, Badge } from '@mantine/core';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps, TreeGridRow } from '../types';
import { SERVICE_CATALOG_DATA, setsEqual } from '../types';

interface TreeTableRowProps {
  row: TreeGridRow;
  depth: number;
  expandedKeys: Set<string>;
  selectedKeys: Set<string>;
  onToggleExpand: (key: string) => void;
  onToggleSelect: (key: string) => void;
}

function TreeTableRow({ row, depth, expandedKeys, selectedKeys, onToggleExpand, onToggleSelect }: TreeTableRowProps) {
  const isExpanded = expandedKeys.has(row.key);
  const isSelected = selectedKeys.has(row.key);
  const hasChildren = row.children && row.children.length > 0;

  return (
    <>
      <Table.Tr>
        <Table.Td style={{ width: 40 }}>
          <Checkbox
            checked={isSelected}
            onChange={() => onToggleSelect(row.key)}
          />
        </Table.Td>
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
          selectedKeys={selectedKeys}
          onToggleExpand={onToggleExpand}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </>
  );
}

const TARGET_KEYS = ['finance/billing', 'finance/invoicing'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(Array.from(selectedKeys), TARGET_KEYS)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedKeys, onSuccess]);

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

  const toggleSelect = (key: string) => {
    setSelectedKeys(prev => {
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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 750 }} data-testid="tree-grid-card">
      <Group justify="space-between" mb="md">
        <Text fw={500} size="lg">Service Catalog</Text>
        {selectedKeys.size > 0 && (
          <Badge variant="light">Selected: {selectedKeys.size}</Badge>
        )}
      </Group>
      <Text c="dimmed" size="sm" mb="md">
        Select Finance → Billing and Finance → Invoicing (exactly two).
      </Text>
      
      <Table striped={false} data-testid="tree-grid">
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 40 }}></Table.Th>
            <Table.Th style={{ width: 200 }}>Service</Table.Th>
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
              selectedKeys={selectedKeys}
              onToggleExpand={toggleExpand}
              onToggleSelect={toggleSelect}
            />
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
