'use client';

/**
 * tree_grid-mantine-T08: Dark mode: edit Budget to $9,750 and click Save
 *
 * Layout: isolated card centered.
 * Theme & density: dark theme with compact spacing.
 * Component (composite): Mantine Table tree grid. The Budget column supports inline edit:
 * clicking a Budget cell turns it into a text input and shows two small buttons: "Save" and "Cancel".
 * Initial state: Operations branch collapsed; Rack 12 Budget currently shows "$8,000".
 * Formatting helper: a hint above the table says "Currency format: $9,750".
 * Interaction: expand Operations → Data Centers → US-East; click the Rack 12 Budget cell;
 * type $9,750; click Save.
 * Feedback: after Save, the input disappears, the cell shows the formatted value, and a toast appears.
 *
 * Success: Budget cell for Operations → Data Centers → US-East → Rack 12 equals display value "$9,750".
 * The edit is committed (Save was applied; cell is not in edit mode).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Text, ActionIcon, Group, Box, TextInput, Button, MantineProvider } from '@mantine/core';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import type { TaskComponentProps } from '../types';
import { formatCurrency, parseCurrency } from '../types';

interface BudgetRow {
  key: string;
  name: string;
  budget: number;
  children?: BudgetRow[];
}

// Generate budget data
function generateBudgetData(): BudgetRow[] {
  const usEastRacks: BudgetRow[] = [];
  for (let i = 1; i <= 15; i++) {
    usEastRacks.push({
      key: `operations/data-centers/us-east/rack-${i}`,
      name: `Rack ${i}`,
      budget: 7000 + i * 100,
    });
  }

  return [
    {
      key: 'platform',
      name: 'Platform',
      budget: 50000,
      children: [
        { key: 'platform/api-gateway', name: 'API Gateway', budget: 15000 },
        { key: 'platform/auth-service', name: 'Auth Service', budget: 20000 },
      ],
    },
    {
      key: 'operations',
      name: 'Operations',
      budget: 120000,
      children: [
        {
          key: 'operations/data-centers',
          name: 'Data Centers',
          budget: 100000,
          children: [
            {
              key: 'operations/data-centers/us-east',
              name: 'US-East',
              budget: 50000,
              children: usEastRacks,
            },
          ],
        },
      ],
    },
  ];
}

const TARGET_KEY = 'operations/data-centers/us-east/rack-12';
const TARGET_VALUE = 9750;

interface TreeTableRowProps {
  row: BudgetRow;
  depth: number;
  expandedKeys: Set<string>;
  editingKey: string | null;
  editingValue: string;
  onToggleExpand: (key: string) => void;
  onStartEdit: (key: string, value: number) => void;
  onChangeEdit: (value: string) => void;
  onSave: (key: string) => void;
  onCancel: () => void;
}

function TreeTableRow({ 
  row, depth, expandedKeys, editingKey, editingValue,
  onToggleExpand, onStartEdit, onChangeEdit, onSave, onCancel 
}: TreeTableRowProps) {
  const isExpanded = expandedKeys.has(row.key);
  const isEditing = editingKey === row.key;
  const hasChildren = row.children && row.children.length > 0;

  return (
    <>
      <Table.Tr>
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
        <Table.Td>
          {isEditing ? (
            <Group gap={4}>
              <TextInput
                size="xs"
                value={editingValue}
                onChange={(e) => onChangeEdit(e.currentTarget.value)}
                style={{ width: 80 }}
                autoFocus
              />
              <Button size="xs" variant="filled" color="blue" onClick={() => onSave(row.key)}>
                Save
              </Button>
              <Button size="xs" variant="subtle" onClick={onCancel}>
                Cancel
              </Button>
            </Group>
          ) : (
            <Text 
              size="xs" 
              style={{ cursor: 'pointer' }}
              onClick={() => onStartEdit(row.key, row.budget)}
            >
              {formatCurrency(row.budget)}
            </Text>
          )}
        </Table.Td>
      </Table.Tr>
      {hasChildren && isExpanded && row.children!.map(child => (
        <TreeTableRow
          key={child.key}
          row={child}
          depth={depth + 1}
          expandedKeys={expandedKeys}
          editingKey={editingKey}
          editingValue={editingValue}
          onToggleExpand={onToggleExpand}
          onStartEdit={onStartEdit}
          onChangeEdit={onChangeEdit}
          onSave={onSave}
          onCancel={onCancel}
        />
      ))}
    </>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<BudgetRow[]>(generateBudgetData);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const successFired = useRef(false);

  // Find target row value
  const findBudget = (rows: BudgetRow[], key: string): number | null => {
    for (const row of rows) {
      if (row.key === key) return row.budget;
      if (row.children) {
        const found = findBudget(row.children, key);
        if (found !== null) return found;
      }
    }
    return null;
  };

  const currentTargetValue = findBudget(data, TARGET_KEY);

  useEffect(() => {
    if (!successFired.current && currentTargetValue === TARGET_VALUE && editingKey !== TARGET_KEY) {
      successFired.current = true;
      onSuccess();
    }
  }, [currentTargetValue, editingKey, onSuccess]);

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const updateBudget = (rows: BudgetRow[], key: string, newBudget: number): BudgetRow[] => {
    return rows.map(row => {
      if (row.key === key) return { ...row, budget: newBudget };
      if (row.children) return { ...row, children: updateBudget(row.children, key, newBudget) };
      return row;
    });
  };

  const handleSave = (key: string) => {
    const parsed = parseCurrency(editingValue);
    if (parsed !== null) {
      setData(prev => updateBudget(prev, key, parsed));
      notifications.show({ message: 'Budget saved', color: 'green' });
    }
    setEditingKey(null);
    setEditingValue('');
  };

  return (
    <MantineProvider defaultColorScheme="dark">
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 450, backgroundColor: '#1a1b1e' }} data-testid="tree-grid-card">
        <Text fw={500} size="md" mb="xs" c="white">Service Catalog</Text>
        <Text c="dimmed" size="xs" mb="xs">
          Set US-East / Rack 12 Budget to $9,750 and Save.
        </Text>
        <Text c="dimmed" size="xs" mb="md">
          Currency format: $9,750
        </Text>
        
        <Table striped={false} data-testid="tree-grid">
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 180 }}>Name</Table.Th>
              <Table.Th style={{ width: 180 }}>Budget</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map(row => (
              <TreeTableRow
                key={row.key}
                row={row}
                depth={0}
                expandedKeys={expandedKeys}
                editingKey={editingKey}
                editingValue={editingValue}
                onToggleExpand={toggleExpand}
                onStartEdit={(key, value) => {
                  setEditingKey(key);
                  setEditingValue(formatCurrency(value));
                }}
                onChangeEdit={setEditingValue}
                onSave={handleSave}
                onCancel={() => {
                  setEditingKey(null);
                  setEditingValue('');
                }}
              />
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </MantineProvider>
  );
}
