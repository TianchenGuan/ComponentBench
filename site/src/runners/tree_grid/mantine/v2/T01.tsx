'use client';

/**
 * tree_grid-mantine-v2-T01: EU Region composite grid – deep selected row in the correct of two panels
 *
 * Two stacked Mantine composite tree grids: "US Region" (top) and "EU Region" (bottom).
 * In EU Region, expand Operations → EU-West, select Rack 8, click "Apply region".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Text, ActionIcon, Group, Box, Button, Stack } from '@mantine/core';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

interface RegionNode { key: string; name: string; owner: string; children?: RegionNode[]; }

const EU_DATA: RegionNode[] = [{
  key: 'ops', name: 'Operations', owner: 'Nancy',
  children: [{
    key: 'ops/eu-west', name: 'EU-West', owner: 'Rose',
    children: [
      { key: 'ops/eu-west/rack-7', name: 'Rack 7', owner: 'Tech 7' },
      { key: 'ops/eu-west/rack-8', name: 'Rack 8', owner: 'Tech 8' },
      { key: 'ops/eu-west/rack-9', name: 'Rack 9', owner: 'Tech 9' },
    ],
  }],
}];

const US_DATA: RegionNode[] = [{
  key: 'ops', name: 'Operations', owner: 'Nancy',
  children: [{
    key: 'ops/us-east', name: 'US-East', owner: 'Pat',
    children: [
      { key: 'ops/us-east/rack-7', name: 'Rack 7', owner: 'Tech 7' },
      { key: 'ops/us-east/rack-8', name: 'Rack 8', owner: 'Tech 8' },
    ],
  }],
}];

function getPath(rows: RegionNode[], key: string): string[] {
  for (const r of rows) {
    if (r.key === key) return [r.name];
    if (r.children) { const p = getPath(r.children, key); if (p.length) return [r.name, ...p]; }
  }
  return [];
}

function TreeRow({ row, depth, data, expanded, selectedKey, onToggle, onSelect }: {
  row: RegionNode; depth: number; data: RegionNode[]; expanded: Set<string>;
  selectedKey: string | null; onToggle: (k: string) => void; onSelect: (k: string) => void;
}) {
  const isExp = expanded.has(row.key);
  const isSel = selectedKey === row.key;
  const hasKids = !!row.children?.length;
  return (
    <>
      <Table.Tr
        style={{ cursor: 'pointer', backgroundColor: isSel ? 'var(--mantine-color-blue-light)' : undefined }}
        onClick={() => onSelect(row.key)}
      >
        <Table.Td>
          <Group gap={4} style={{ paddingLeft: depth * 20 }}>
            {hasKids ? (
              <ActionIcon variant="subtle" size="sm" onClick={e => { e.stopPropagation(); onToggle(row.key); }}>
                {isExp ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
              </ActionIcon>
            ) : <Box style={{ width: 22 }} />}
            <Text size="sm">{row.name}</Text>
          </Group>
        </Table.Td>
        <Table.Td><Text size="sm">{row.owner}</Text></Table.Td>
      </Table.Tr>
      {hasKids && isExp && row.children!.map(c => (
        <TreeRow key={c.key} row={c} depth={depth + 1} data={data} expanded={expanded}
          selectedKey={selectedKey} onToggle={onToggle} onSelect={onSelect} />
      ))}
    </>
  );
}

function RegionGrid({ title, data, selectedKey, onSelect, footer }: {
  title: string; data: RegionNode[]; selectedKey: string | null;
  onSelect: (k: string) => void; footer?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggle = (k: string) => setExpanded(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Text fw={500} mb="xs">{title}</Text>
      <Table>
        <Table.Thead><Table.Tr><Table.Th style={{ width: 220 }}>Service</Table.Th><Table.Th>Owner</Table.Th></Table.Tr></Table.Thead>
        <Table.Tbody>
          {data.map(r => <TreeRow key={r.key} row={r} depth={0} data={data} expanded={expanded} selectedKey={selectedKey} onToggle={toggle} onSelect={onSelect} />)}
        </Table.Tbody>
      </Table>
      {footer && <div style={{ marginTop: 8 }}>{footer}</div>}
    </Card>
  );
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const [usKey, setUsKey] = useState<string | null>(null);
  const [euKey, setEuKey] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const euPath = euKey ? getPath(EU_DATA, euKey) : [];

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (pathEquals(euPath, ['Operations', 'EU-West', 'Rack 8'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, euPath, onSuccess]);

  return (
    <Stack gap="md" style={{ width: 500 }}>
      <RegionGrid title="US Region" data={US_DATA} selectedKey={usKey} onSelect={setUsKey} />
      <RegionGrid
        title="EU Region"
        data={EU_DATA}
        selectedKey={euKey}
        onSelect={setEuKey}
        footer={<Button fullWidth onClick={() => setSaved(true)}>Apply region</Button>}
      />
    </Stack>
  );
}
