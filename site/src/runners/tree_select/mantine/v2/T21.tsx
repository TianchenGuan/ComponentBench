'use client';

/**
 * tree_select-mantine-v2-T21: Visual reference among three channels in compact dashboard
 *
 * Dashboard panel with three composite tree-selects: Primary, Secondary, Fallback channel.
 * Reference chip highlights "Channels / Ops / Database". Only Secondary changes.
 * Primary = Channels/Ops/API, Fallback = Channels/Support/Identity.
 *
 * Success: Secondary = channels-ops-database, others unchanged, "Apply channels" clicked.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Card, Text, Button, Group, Badge, TextInput, Popover, Stack,
  MantineProvider, Tree, useTree,
} from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const treeData = [
  {
    label: 'Channels', value: 'channels', children: [
      {
        label: 'Ops', value: 'channels-ops', children: [
          { label: 'API', value: 'channels-ops-api' },
          { label: 'Database', value: 'channels-ops-database' },
          { label: 'Cache', value: 'channels-ops-cache' },
        ],
      },
      {
        label: 'Support', value: 'channels-support', children: [
          { label: 'Identity', value: 'channels-support-identity' },
          { label: 'Billing', value: 'channels-support-billing' },
        ],
      },
      {
        label: 'Infra', value: 'channels-infra', children: [
          { label: 'Network', value: 'channels-infra-network' },
          { label: 'Storage', value: 'channels-infra-storage' },
        ],
      },
    ],
  },
];

const LEAF_VALUES = new Set([
  'channels-ops-api', 'channels-ops-database', 'channels-ops-cache',
  'channels-support-identity', 'channels-support-billing',
  'channels-infra-network', 'channels-infra-storage',
]);

function ChannelTreeSelect({
  label, value, onChange, disabled,
}: {
  label: string; value: string | null; onChange: (v: string) => void; disabled?: boolean;
}) {
  const [opened, setOpened] = useState(false);
  const tree = useTree();

  const display = value ? value.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join(' / ') : '';

  const handleClick = useCallback((val: string) => {
    if (LEAF_VALUES.has(val)) {
      onChange(val);
      setOpened(false);
    }
  }, [onChange]);

  return (
    <Popover opened={opened && !disabled} onChange={setOpened} width={280} position="bottom-start">
      <Popover.Target>
        <TextInput
          label={label}
          size="xs"
          readOnly
          value={display}
          placeholder="Select channel"
          onClick={() => !disabled && setOpened(true)}
          disabled={disabled}
          style={{ cursor: disabled ? 'default' : 'pointer' }}
        />
      </Popover.Target>
      <Popover.Dropdown>
        <div style={{ maxHeight: 260, overflow: 'auto' }}>
          <Tree
            data={treeData}
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
                {hasChildren && <span style={{ fontSize: 12, width: 16 }}>{expanded ? '▼' : '▶'}</span>}
                {!hasChildren && <span style={{ width: 16 }} />}
                <Text size="sm">{node.label}</Text>
              </Group>
            )}
          />
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}

export default function T21({ onSuccess }: TaskComponentProps) {
  const [primary] = useState('channels-ops-api');
  const [secondary, setSecondary] = useState<string | null>(null);
  const [fallback] = useState('channels-support-identity');
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      committed &&
      secondary === 'channels-ops-database' &&
      primary === 'channels-ops-api' &&
      fallback === 'channels-support-identity'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, secondary, primary, fallback, onSuccess]);

  return (
    <MantineProvider>
      <div style={{ padding: 16, maxWidth: 520, margin: '0 auto' }}>
        <Text fw={700} size="lg" mb="xs">Alert Dashboard</Text>
        <Group gap="xs" mb="sm">
          <Badge size="xs" color="red">P1: 2</Badge>
          <Badge size="xs" variant="outline">Active: 14</Badge>
          <Badge size="xs" variant="outline" color="gray">Muted: 3</Badge>
        </Group>
        <Card shadow="xs" padding="xs" radius="sm" withBorder mb="sm" style={{ background: '#e6f7ff' }}>
          <Text size="xs" fw={500}>Reference: <Badge size="xs" color="blue">Channels / Ops / Database</Badge></Text>
        </Card>
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={600} size="sm" mb="sm">Alert Channels</Text>
          <Stack gap="sm">
            <ChannelTreeSelect label="Primary channel" value={primary} onChange={() => {}} disabled />
            <ChannelTreeSelect
              label="Secondary channel"
              value={secondary}
              onChange={(v) => { setSecondary(v); setCommitted(false); }}
            />
            <ChannelTreeSelect label="Fallback channel" value={fallback} onChange={() => {}} disabled />
            <Button size="sm" onClick={() => setCommitted(true)}>Apply channels</Button>
          </Stack>
        </Card>
      </div>
    </MantineProvider>
  );
}
