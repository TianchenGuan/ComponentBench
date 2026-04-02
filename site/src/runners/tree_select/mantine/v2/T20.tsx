'use client';

/**
 * tree_select-mantine-v2-T20: Search ambiguous Guinea branch with exact apply
 *
 * Inline surface with TextInput + Popover + filter input + Tree. Typing "Guinea" reveals
 * several plausible leaves: Guinea, Equatorial Guinea, Guinea-Bissau. Select
 * Countries/Africa/Guinea-Bissau and click "Save destination".
 *
 * Success: value = countries-africa-guinea-bissau, Save destination clicked.
 */

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Card, Text, Button, TextInput, Popover, Stack, Badge, Group,
  MantineProvider, Tree, useTree,
} from '@mantine/core';
import type { TaskComponentProps } from '../../types';

interface TNode { label: string; value: string; children?: TNode[] }

const fullTree: TNode[] = [
  {
    label: 'Countries', value: 'countries', children: [
      {
        label: 'Africa', value: 'countries-africa', children: [
          { label: 'Ghana', value: 'countries-africa-ghana' },
          { label: 'Guinea', value: 'countries-africa-guinea' },
          { label: 'Guinea-Bissau', value: 'countries-africa-guinea-bissau' },
          { label: 'Equatorial Guinea', value: 'countries-africa-equatorial-guinea' },
          { label: 'Nigeria', value: 'countries-africa-nigeria' },
          { label: 'Kenya', value: 'countries-africa-kenya' },
          { label: 'South Africa', value: 'countries-africa-south-africa' },
        ],
      },
      {
        label: 'Europe', value: 'countries-europe', children: [
          { label: 'France', value: 'countries-europe-france' },
          { label: 'Germany', value: 'countries-europe-germany' },
          { label: 'Spain', value: 'countries-europe-spain' },
        ],
      },
      {
        label: 'Asia', value: 'countries-asia', children: [
          { label: 'Japan', value: 'countries-asia-japan' },
          { label: 'India', value: 'countries-asia-india' },
        ],
      },
    ],
  },
];

const LEAF_VALUES = new Set([
  'countries-africa-ghana', 'countries-africa-guinea', 'countries-africa-guinea-bissau',
  'countries-africa-equatorial-guinea', 'countries-africa-nigeria', 'countries-africa-kenya',
  'countries-africa-south-africa', 'countries-europe-france', 'countries-europe-germany',
  'countries-europe-spain', 'countries-asia-japan', 'countries-asia-india',
]);

function matchNode(node: TNode, q: string): boolean {
  if (node.label.toLowerCase().includes(q)) return true;
  return !!node.children?.some((c) => matchNode(c, q));
}

function filterNodes(nodes: TNode[], q: string): TNode[] {
  if (!q) return nodes;
  return nodes.reduce<TNode[]>((acc, node) => {
    if (matchNode(node, q)) {
      acc.push({ ...node, children: node.children ? filterNodes(node.children, q) : undefined });
    }
    return acc;
  }, []);
}

export default function T20({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);
  const tree = useTree();

  const filtered = useMemo(() => filterNodes(fullTree, search.toLowerCase()), [search]);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && value === 'countries-africa-guinea-bissau') {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, value, onSuccess]);

  const handleClick = useCallback((val: string) => {
    if (LEAF_VALUES.has(val)) {
      setValue(val);
      setOpened(false);
      setSearch('');
      setCommitted(false);
    }
  }, []);

  const display = value
    ? value.split('-').slice(1).map((s) => s[0].toUpperCase() + s.slice(1)).join(' / ')
    : '';

  return (
    <MantineProvider>
      <div style={{ padding: 16, maxWidth: 440, marginLeft: 40 }}>
        <Text fw={700} size="lg" mb="xs">Delivery Settings</Text>
        <Group gap="xs" mb="md">
          <Badge size="sm" variant="outline">Express</Badge>
          <Badge size="sm">Tracking: On</Badge>
        </Group>
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Stack gap="md">
            <Popover opened={opened} onChange={setOpened} width={320} position="bottom-start">
              <Popover.Target>
                <TextInput
                  label="Country"
                  readOnly
                  value={display}
                  placeholder="Click to select country"
                  onClick={() => setOpened(true)}
                  style={{ cursor: 'pointer' }}
                />
              </Popover.Target>
              <Popover.Dropdown>
                <TextInput
                  size="xs"
                  placeholder="Search countries..."
                  value={search}
                  onChange={(e) => setSearch(e.currentTarget.value)}
                  mb="xs"
                  autoFocus
                />
                <div style={{ maxHeight: 250, overflow: 'auto' }}>
                  <Tree
                    data={filtered}
                    tree={tree}
                    levelOffset={23}
                    renderNode={({ node, expanded, hasChildren, elementProps }) => (
                      <Group
                        gap="xs"
                        {...elementProps}
                        onClick={(e) => {
                          elementProps.onClick?.(e);
                          handleClick(node.value);
                        }}
                        style={{ ...elementProps.style, cursor: 'pointer' }}
                      >
                        {hasChildren && (
                          <span style={{ fontSize: 12, width: 16 }}>{expanded ? '▼' : '▶'}</span>
                        )}
                        {!hasChildren && <span style={{ width: 16 }} />}
                        <Text size="sm">{node.label}</Text>
                      </Group>
                    )}
                  />
                </div>
              </Popover.Dropdown>
            </Popover>
            <Button onClick={() => setCommitted(true)}>Save destination</Button>
          </Stack>
        </Card>
      </div>
    </MantineProvider>
  );
}
