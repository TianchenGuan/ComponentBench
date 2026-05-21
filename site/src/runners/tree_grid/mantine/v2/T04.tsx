'use client';

/**
 * tree_grid-mantine-v2-T04: Budget matrix – vertical reveal plus horizontal budget edit and save
 *
 * Mantine composite tree grid with ScrollArea. Hierarchy: Data Centers → US-East → Rack 01-20.
 * Budget column is offscreen right. Expand, scroll to Rack 12, scroll right, edit Budget to "$9,750",
 * commit, click "Save budget".
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Card, Table, Text, ActionIcon, Group, Box, Button, TextInput } from '@mantine/core';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';
import { formatCurrency, pathEquals } from '../../types';

interface BudgetNode { key: string; name: string; budget: number; region: string; status: string; children?: BudgetNode[]; }

function buildTree(): BudgetNode[] {
  const racks: BudgetNode[] = Array.from({ length: 20 }, (_, i) => ({
    key: `dc/us-east/rack-${i + 1}`, name: `Rack ${i + 1}`, budget: 5000 + i * 300,
    region: 'US-East', status: 'Active',
  }));
  return [{
    key: 'dc', name: 'Data Centers', budget: 500000, region: '-', status: 'Active',
    children: [{
      key: 'dc/us-east', name: 'US-East', budget: 200000, region: 'US-East', status: 'Active',
      children: racks,
    }],
  }];
}

function getPath(rows: BudgetNode[], key: string): string[] {
  for (const r of rows) {
    if (r.key === key) return [r.name];
    if (r.children) { const p = getPath(r.children, key); if (p.length) return [r.name, ...p]; }
  }
  return [];
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

function TreeRow({ row, depth, data, expanded, editingKey, editValue, onToggle, onStartEdit, onEditChange, onCommitEdit }: {
  row: BudgetNode; depth: number; data: BudgetNode[]; expanded: Set<string>;
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
        <Table.Td style={{ minWidth: 200 }}>
          <Group gap={4} style={{ paddingLeft: depth * 20 }}>
            {hasKids ? (
              <ActionIcon variant="subtle" size="sm" onClick={() => onToggle(row.key)}>
                {isExp ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
              </ActionIcon>
            ) : <Box style={{ width: 22 }} />}
            <Text size="sm">{row.name}</Text>
          </Group>
        </Table.Td>
        <Table.Td style={{ minWidth: 100 }}><Text size="sm">{row.region}</Text></Table.Td>
        <Table.Td style={{ minWidth: 80 }}><Text size="sm">{row.status}</Text></Table.Td>
        <Table.Td style={{ minWidth: 130 }}>
          {isEditing ? (
            <TextInput
              autoFocus
              size="xs"
              value={editValue}
              onChange={e => onEditChange(e.currentTarget.value)}
              onKeyDown={e => e.key === 'Enter' && onCommitEdit()}
              onBlur={onCommitEdit}
              style={{ width: 110 }}
            />
          ) : (
            <Text size="sm" style={{ cursor: 'pointer' }} onClick={() => onStartEdit(row.key, row.budget)}>
              {formatCurrency(row.budget)}
            </Text>
          )}
        </Table.Td>
      </Table.Tr>
      {hasKids && isExp && row.children!.map(c => (
        <TreeRow key={c.key} row={c} depth={depth + 1} data={data} expanded={expanded}
          editingKey={editingKey} editValue={editValue} onToggle={onToggle}
          onStartEdit={onStartEdit} onEditChange={onEditChange} onCommitEdit={onCommitEdit} />
      ))}
    </>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState(buildTree);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const toggle = (k: string) => setExpanded(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });

  const startEdit = (k: string, v: number) => { setEditingKey(k); setEditValue(formatCurrency(v)); };
  const commitEdit = useCallback(() => {
    if (editingKey) {
      const parsed = parseInt(editValue.replace(/[$,]/g, ''), 10);
      if (!isNaN(parsed)) setData(prev => updateBudget(prev, editingKey, parsed));
      setEditingKey(null);
      setEditValue('');
    }
  }, [editingKey, editValue]);

  useEffect(() => {
    if (successFired.current || !saved) return;
    const node = findNode(data, 'dc/us-east/rack-12');
    if (node && node.budget === 9750) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, data, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 580 }}>
      <Text fw={500} size="lg" mb="sm">Budget matrix</Text>
      <div style={{ maxHeight: 420, overflow: 'auto' }}>
        <div style={{ minWidth: 560 }}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ minWidth: 200 }}>Name</Table.Th>
                <Table.Th style={{ minWidth: 100 }}>Region</Table.Th>
                <Table.Th style={{ minWidth: 80 }}>Status</Table.Th>
                <Table.Th style={{ minWidth: 130 }}>Budget</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.map(r => (
                <TreeRow key={r.key} row={r} depth={0} data={data} expanded={expanded}
                  editingKey={editingKey} editValue={editValue} onToggle={toggle}
                  onStartEdit={startEdit} onEditChange={setEditValue} onCommitEdit={commitEdit} />
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </div>
      <Button fullWidth mt="sm" onClick={() => setSaved(true)}>Save budget</Button>
    </Card>
  );
}
