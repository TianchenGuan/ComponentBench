'use client';

/**
 * tree_grid-mantine-v2-T07: Quarterly Budget grid only – exact formatted budget edit in right panel
 *
 * Two side-by-side composite tree grids: "Monthly Budget" and "Quarterly Budget".
 * In Quarterly Budget, expand US-East, edit Rack 4 Budget to "$4,500", commit, click "Save quarterly budget".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Table, Text, ActionIcon, Group, Box, Button, TextInput, Stack } from '@mantine/core';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';
import { formatCurrency } from '../../types';

interface BudgetNode { key: string; name: string; budget: number; children?: BudgetNode[]; }

function makeTree(): BudgetNode[] {
  return [{
    key: 'us-east', name: 'US-East', budget: 100000,
    children: [
      { key: 'us-east/rack-4', name: 'Rack 4', budget: 3000 },
      { key: 'us-east/rack-5', name: 'Rack 5', budget: 3500 },
    ],
  }];
}

function findNode(rows: BudgetNode[], key: string): BudgetNode | null {
  for (const r of rows) {
    if (r.key === key) return r;
    if (r.children) { const f = findNode(r.children, key); if (f) return f; }
  }
  return null;
}

function updateBudget(rows: BudgetNode[], key: string, budget: number): BudgetNode[] {
  return rows.map(r => {
    if (r.key === key) return { ...r, budget };
    if (r.children) return { ...r, children: updateBudget(r.children, key, budget) };
    return r;
  });
}

function BudgetTreeRow({ row, depth, expanded, editingKey, editValue, onToggle, onStartEdit, onEditChange, onCommitEdit }: {
  row: BudgetNode; depth: number; expanded: Set<string>;
  editingKey: string | null; editValue: string;
  onToggle: (k: string) => void; onStartEdit: (k: string, v: number) => void;
  onEditChange: (v: string) => void; onCommitEdit: () => void;
}) {
  const isExp = expanded.has(row.key);
  const hasKids = !!row.children?.length;
  const isEditing = editingKey === row.key;
  return (
    <>
      <Table.Tr>
        <Table.Td>
          <Group gap={4} style={{ paddingLeft: depth * 20 }}>
            {hasKids ? (
              <ActionIcon variant="subtle" size="sm" onClick={() => onToggle(row.key)}>
                {isExp ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
              </ActionIcon>
            ) : <Box style={{ width: 22 }} />}
            <Text size="sm">{row.name}</Text>
          </Group>
        </Table.Td>
        <Table.Td>
          {isEditing ? (
            <TextInput autoFocus size="xs" value={editValue}
              onChange={e => onEditChange(e.currentTarget.value)}
              onKeyDown={e => e.key === 'Enter' && onCommitEdit()}
              onBlur={onCommitEdit}
              style={{ width: 110 }} />
          ) : (
            <Text size="sm" style={{ cursor: 'pointer' }} onClick={() => onStartEdit(row.key, row.budget)}>
              {formatCurrency(row.budget)}
            </Text>
          )}
        </Table.Td>
      </Table.Tr>
      {hasKids && isExp && row.children!.map(c => (
        <BudgetTreeRow key={c.key} row={c} depth={depth + 1} expanded={expanded}
          editingKey={editingKey} editValue={editValue} onToggle={onToggle}
          onStartEdit={onStartEdit} onEditChange={onEditChange} onCommitEdit={onCommitEdit} />
      ))}
    </>
  );
}

function BudgetGrid({ title, data, onDataChange, footer }: {
  title: string; data: BudgetNode[]; onDataChange: (d: BudgetNode[]) => void; footer: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const toggle = (k: string) => setExpanded(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const startEdit = (k: string, v: number) => { setEditingKey(k); setEditValue(formatCurrency(v)); };
  const commitEdit = useCallback(() => {
    if (editingKey) {
      const parsed = parseInt(editValue.replace(/[$,]/g, ''), 10);
      if (!isNaN(parsed)) onDataChange(updateBudget(data, editingKey, parsed));
      setEditingKey(null); setEditValue('');
    }
  }, [editingKey, editValue, data, onDataChange]);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ flex: 1, minWidth: 260 }}>
      <Text fw={500} size="sm" mb="xs">{title}</Text>
      <Table>
        <Table.Thead><Table.Tr><Table.Th>Name</Table.Th><Table.Th>Budget</Table.Th></Table.Tr></Table.Thead>
        <Table.Tbody>
          {data.map(r => (
            <BudgetTreeRow key={r.key} row={r} depth={0} expanded={expanded}
              editingKey={editingKey} editValue={editValue} onToggle={toggle}
              onStartEdit={startEdit} onEditChange={setEditValue} onCommitEdit={commitEdit} />
          ))}
        </Table.Tbody>
      </Table>
      <div style={{ marginTop: 8 }}>{footer}</div>
    </Card>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [monthlyData, setMonthlyData] = useState(makeTree);
  const [quarterlyData, setQuarterlyData] = useState(makeTree);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current || !saved) return;
    const node = findNode(quarterlyData, 'us-east/rack-4');
    if (node && node.budget === 4500) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, quarterlyData, onSuccess]);

  return (
    <Group align="flex-start" gap="md">
      <BudgetGrid
        title="Monthly Budget"
        data={monthlyData}
        onDataChange={setMonthlyData}
        footer={<Button size="xs" variant="subtle" fullWidth>Save monthly budget</Button>}
      />
      <BudgetGrid
        title="Quarterly Budget"
        data={quarterlyData}
        onDataChange={setQuarterlyData}
        footer={<Button size="xs" fullWidth onClick={() => setSaved(true)}>Save quarterly budget</Button>}
      />
    </Group>
  );
}
