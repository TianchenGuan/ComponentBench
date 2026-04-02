'use client';

/**
 * tree_select-mantine-v2-T24: High-clutter four-instance backup taxonomy panel
 *
 * Settings panel with 4 composite Mantine tree-selects stacked: Primary, Backup, Customer,
 * Internal taxonomy. Only "Backup taxonomy" starts empty; others are prefilled.
 * Select Catalog/Hardware/Storage/Snapshots and click "Save panel".
 *
 * Success: Backup = catalog-hardware-storage-snapshots, others unchanged, Save panel clicked.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Card, Text, Button, Group, Badge, TextInput, Popover, Stack,
  Switch, SegmentedControl, Pill, MantineProvider, Tree, useTree,
} from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const treeData = [
  {
    label: 'Catalog', value: 'catalog', children: [
      {
        label: 'Hardware', value: 'catalog-hardware', children: [
          {
            label: 'Compute', value: 'catalog-hardware-compute', children: [
              { label: 'VMs', value: 'catalog-hardware-compute-vms' },
              { label: 'Containers', value: 'catalog-hardware-compute-containers' },
            ],
          },
          {
            label: 'Storage', value: 'catalog-hardware-storage', children: [
              { label: 'Snapshots', value: 'catalog-hardware-storage-snapshots' },
              { label: 'Volumes', value: 'catalog-hardware-storage-volumes' },
              { label: 'Backups', value: 'catalog-hardware-storage-backups' },
            ],
          },
        ],
      },
      {
        label: 'Support', value: 'catalog-support', children: [
          {
            label: 'Tickets', value: 'catalog-support-tickets', children: [
              { label: 'Priority', value: 'catalog-support-tickets-priority' },
              { label: 'Normal', value: 'catalog-support-tickets-normal' },
            ],
          },
        ],
      },
      {
        label: 'Ops', value: 'catalog-ops', children: [
          {
            label: 'Alerts', value: 'catalog-ops-alerts', children: [
              { label: 'Sev1', value: 'catalog-ops-alerts-sev1' },
              { label: 'Sev2', value: 'catalog-ops-alerts-sev2' },
            ],
          },
        ],
      },
    ],
  },
];

const LEAF_VALUES = new Set([
  'catalog-hardware-compute-vms', 'catalog-hardware-compute-containers',
  'catalog-hardware-storage-snapshots', 'catalog-hardware-storage-volumes',
  'catalog-hardware-storage-backups', 'catalog-support-tickets-priority',
  'catalog-support-tickets-normal', 'catalog-ops-alerts-sev1', 'catalog-ops-alerts-sev2',
]);

function TaxonomyTreeSelect({
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
    <Popover opened={opened && !disabled} onChange={setOpened} width={300} position="bottom-start">
      <Popover.Target>
        <TextInput
          label={label}
          size="xs"
          readOnly
          value={display}
          placeholder="Select taxonomy"
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

const PRIMARY_INIT = 'catalog-hardware-compute-vms';
const CUSTOMER_INIT = 'catalog-support-tickets-priority';
const INTERNAL_INIT = 'catalog-ops-alerts-sev1';

export default function T24({ onSuccess }: TaskComponentProps) {
  const [primary] = useState(PRIMARY_INIT);
  const [backup, setBackup] = useState<string | null>(null);
  const [customer] = useState(CUSTOMER_INIT);
  const [internal] = useState(INTERNAL_INIT);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      committed &&
      backup === 'catalog-hardware-storage-snapshots' &&
      primary === PRIMARY_INIT &&
      customer === CUSTOMER_INIT &&
      internal === INTERNAL_INIT
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, backup, primary, customer, internal, onSuccess]);

  return (
    <MantineProvider forceColorScheme="light">
      <div style={{ padding: 16, maxWidth: 480, marginLeft: 60, background: '#fff', filter: 'contrast(1.1)' }}>
        <Text fw={700} size="lg" mb="xs">Taxonomy Panel</Text>
        <Group gap="xs" mb="xs" wrap="wrap">
          <Switch size="xs" defaultChecked label="Auto-tag" />
          <SegmentedControl size="xs" data={['All', 'Active', 'Archive']} defaultValue="All" />
        </Group>
        <Group gap={4} mb="sm" wrap="wrap">
          <Pill size="xs">Region: US-East</Pill>
          <Pill size="xs">Tier: Pro</Pill>
          <Pill size="xs">Sync: ON</Pill>
          <Badge size="xs" variant="outline">Updated 2h ago</Badge>
        </Group>
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Stack gap="sm">
            <TaxonomyTreeSelect label="Primary taxonomy" value={primary} onChange={() => {}} disabled />
            <TaxonomyTreeSelect
              label="Backup taxonomy"
              value={backup}
              onChange={(v) => { setBackup(v); setCommitted(false); }}
            />
            <TaxonomyTreeSelect label="Customer taxonomy" value={customer} onChange={() => {}} disabled />
            <TaxonomyTreeSelect label="Internal taxonomy" value={internal} onChange={() => {}} disabled />
            <Button size="sm" onClick={() => setCommitted(true)}>Save panel</Button>
          </Stack>
        </Card>
      </div>
    </MantineProvider>
  );
}
