'use client';

/**
 * tree_grid-mantine-T10: Drawer flow: select two write permissions (instances=2)
 *
 * Layout: drawer_flow.
 * Access: the page shows a single button "Manage permissions". Clicking it opens a right-side Drawer.
 * Inside the drawer: two stacked cards, each containing a composite tree grid:
 *   - Card 1: "Read permissions" (instance A)
 *   - Card 2: "Write permissions" (instance B)
 * Both grids use checkbox selection and a hierarchy with top-level categories Platform, Finance, Operations.
 * Target location: Operations → Security contains several leaf permissions including Deploy, Rotate keys.
 * Initial state: drawer is closed; when opened, both grids are collapsed; Read permissions has
 * "View audit log" pre-selected to increase disambiguation pressure.
 * Clutter: low—drawer header with a close (×) button.
 * Feedback: each grid shows its own selected count badge.
 *
 * Success: In the Write permissions grid, the selected row set equals exactly
 * {Operations/Security/Deploy, Operations/Security/Rotate keys}.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, Card, Table, Text, ActionIcon, Group, Box, Checkbox, Badge, Stack } from '@mantine/core';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

interface PermissionRow {
  key: string;
  name: string;
  children?: PermissionRow[];
}

const PERMISSIONS_DATA: PermissionRow[] = [
  {
    key: 'platform',
    name: 'Platform',
    children: [
      { key: 'platform/api-read', name: 'API Read' },
      { key: 'platform/api-write', name: 'API Write' },
    ],
  },
  {
    key: 'finance',
    name: 'Finance',
    children: [
      { key: 'finance/view-reports', name: 'View reports' },
      { key: 'finance/edit-budgets', name: 'Edit budgets' },
    ],
  },
  {
    key: 'operations',
    name: 'Operations',
    children: [
      {
        key: 'operations/security',
        name: 'Security',
        children: [
          { key: 'operations/security/deploy', name: 'Deploy' },
          { key: 'operations/security/rotate-keys', name: 'Rotate keys' },
          { key: 'operations/security/view-audit-log', name: 'View audit log' },
        ],
      },
    ],
  },
];

interface TreeTableRowProps {
  row: PermissionRow;
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
        <Table.Td style={{ width: 30 }}>
          <Checkbox
            size="xs"
            checked={isSelected}
            onChange={() => onToggleSelect(row.key)}
          />
        </Table.Td>
        <Table.Td>
          <Group gap={4} style={{ paddingLeft: depth * 16 }}>
            {hasChildren ? (
              <ActionIcon
                variant="subtle"
                size="xs"
                onClick={() => onToggleExpand(row.key)}
              >
                {isExpanded ? <IconChevronDown size={12} /> : <IconChevronRight size={12} />}
              </ActionIcon>
            ) : (
              <Box style={{ width: 18 }} />
            )}
            <Text size="xs">{row.name}</Text>
          </Group>
        </Table.Td>
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

interface PermissionGridProps {
  title: string;
  instanceId: string;
  expandedKeys: Set<string>;
  selectedKeys: Set<string>;
  onToggleExpand: (key: string) => void;
  onToggleSelect: (key: string) => void;
}

function PermissionGrid({ title, instanceId, expandedKeys, selectedKeys, onToggleExpand, onToggleSelect }: PermissionGridProps) {
  return (
    <Card shadow="sm" padding="sm" withBorder data-instance={instanceId}>
      <Group justify="space-between" mb="xs">
        <Text fw={500} size="sm">{title}</Text>
        {selectedKeys.size > 0 && (
          <Badge size="sm" variant="light">{selectedKeys.size} selected</Badge>
        )}
      </Group>
      <Table striped={false} data-testid={`${instanceId.toLowerCase().replace(/\s+/g, '-')}-tree-grid`}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 30 }}></Table.Th>
            <Table.Th>Permission</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {PERMISSIONS_DATA.map(row => (
            <TreeTableRow
              key={row.key}
              row={row}
              depth={0}
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              onToggleExpand={onToggleExpand}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}

const TARGET_KEYS = ['operations/security/deploy', 'operations/security/rotate-keys'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [drawerOpened, setDrawerOpened] = useState(false);
  
  // Read permissions state - pre-selected
  const [readExpanded, setReadExpanded] = useState<Set<string>>(new Set());
  const [readSelected, setReadSelected] = useState<Set<string>>(new Set(['operations/security/view-audit-log']));
  
  // Write permissions state - target
  const [writeExpanded, setWriteExpanded] = useState<Set<string>>(new Set());
  const [writeSelected, setWriteSelected] = useState<Set<string>>(new Set());
  
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(Array.from(writeSelected), TARGET_KEYS)) {
      successFired.current = true;
      onSuccess();
    }
  }, [writeSelected, onSuccess]);

  const createToggleExpand = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (key: string) => {
    setter(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const createToggleSelect = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (key: string) => {
    setter(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <Box>
      <Text c="dimmed" size="sm" mb="md">
        Manage permissions: in Write permissions, select Operations → Security → Deploy and Rotate keys.
      </Text>
      
      <Button onClick={() => setDrawerOpened(true)}>
        Manage permissions
      </Button>

      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        title="Permissions"
        position="right"
        size="md"
      >
        <Stack>
          <PermissionGrid
            title="Read permissions"
            instanceId="Read permissions"
            expandedKeys={readExpanded}
            selectedKeys={readSelected}
            onToggleExpand={createToggleExpand(setReadExpanded)}
            onToggleSelect={createToggleSelect(setReadSelected)}
          />
          
          <PermissionGrid
            title="Write permissions"
            instanceId="Write permissions"
            expandedKeys={writeExpanded}
            selectedKeys={writeSelected}
            onToggleExpand={createToggleExpand(setWriteExpanded)}
            onToggleSelect={createToggleSelect(setWriteSelected)}
          />
        </Stack>
      </Drawer>
    </Box>
  );
}
