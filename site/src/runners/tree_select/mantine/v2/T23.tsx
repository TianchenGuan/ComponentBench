'use client';

/**
 * tree_select-mantine-v2-T23: Auth row table-cell tree selector with local save
 *
 * Table with two rows: "Auth" (target) and "Billing" (non-target). Each row has a
 * "Policy path" composite Mantine tree-select and a row-local "Save row" button.
 * Select Handbook/Policies/Access/Tokens for the Auth row.
 *
 * Success: Auth = handbook-policies-access-tokens, Billing unchanged, Save row clicked.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Card, Text, Button, Group, Badge, TextInput, Popover,
  MantineProvider, Tree, useTree, Table,
} from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const treeData = [
  {
    label: 'Handbook', value: 'handbook', children: [
      {
        label: 'Policies', value: 'handbook-policies', children: [
          {
            label: 'Access', value: 'handbook-policies-access', children: [
              { label: 'Keys', value: 'handbook-policies-access-keys' },
              { label: 'Tokens', value: 'handbook-policies-access-tokens' },
              { label: 'Sessions', value: 'handbook-policies-access-sessions' },
            ],
          },
          {
            label: 'Billing', value: 'handbook-policies-billing', children: [
              { label: 'Invoices', value: 'handbook-policies-billing-invoices' },
              { label: 'Refunds', value: 'handbook-policies-billing-refunds' },
            ],
          },
          {
            label: 'Data', value: 'handbook-policies-data', children: [
              { label: 'Retention', value: 'handbook-policies-data-retention' },
              { label: 'Encryption', value: 'handbook-policies-data-encryption' },
            ],
          },
        ],
      },
    ],
  },
];

const LEAF_VALUES = new Set([
  'handbook-policies-access-keys', 'handbook-policies-access-tokens',
  'handbook-policies-access-sessions', 'handbook-policies-billing-invoices',
  'handbook-policies-billing-refunds', 'handbook-policies-data-retention',
  'handbook-policies-data-encryption',
]);

function PolicyTreeSelect({
  value, onChange, disabled,
}: {
  value: string | null; onChange: (v: string) => void; disabled?: boolean;
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
          size="xs"
          readOnly
          value={display}
          placeholder="Select policy"
          onClick={() => !disabled && setOpened(true)}
          disabled={disabled}
          style={{ cursor: disabled ? 'default' : 'pointer', minWidth: 200 }}
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

const BILLING_INIT = 'handbook-policies-billing-invoices';

export default function T23({ onSuccess }: TaskComponentProps) {
  const [authValue, setAuthValue] = useState<string | null>(null);
  const [billingValue] = useState<string>(BILLING_INIT);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && authValue === 'handbook-policies-access-tokens' && billingValue === BILLING_INIT) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, authValue, billingValue, onSuccess]);

  return (
    <MantineProvider>
      <div style={{ padding: 16, maxWidth: 650, position: 'absolute', bottom: 40, left: 40 }}>
        <Text fw={600} size="md" mb="xs">Policy Assignments</Text>
        <Group gap="xs" mb="sm">
          <Badge size="xs" variant="outline">Department: Engineering</Badge>
          <Badge size="xs">Review pending</Badge>
        </Group>
        <Card shadow="sm" padding="sm" radius="md" withBorder>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Service</Table.Th>
                <Table.Th>Policy path</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td><Text fw={600} size="sm">Auth</Text></Table.Td>
                <Table.Td>
                  <PolicyTreeSelect value={authValue} onChange={(v) => { setAuthValue(v); setCommitted(false); }} />
                </Table.Td>
                <Table.Td>
                  <Button size="xs" onClick={() => setCommitted(true)}>Save row</Button>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td><Text fw={600} size="sm">Billing</Text></Table.Td>
                <Table.Td>
                  <PolicyTreeSelect value={billingValue} onChange={() => {}} disabled />
                </Table.Td>
                <Table.Td>
                  <Button size="xs" disabled>Save row</Button>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Card>
      </div>
    </MantineProvider>
  );
}
