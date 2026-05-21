'use client';

/**
 * tree_select-mantine-v2-T18: Decoy prefilled neighbor — choose Escalation target only
 *
 * Dashboard panel with two composite Mantine tree-selects side by side: "Current target"
 * prefilled with Company/Engineering/Platform/API, "Escalation target" starts empty.
 * Button "Save targets" commits both. Only Escalation target should change.
 *
 * Success: Escalation = company-engineering-platform-database, Current unchanged, Save clicked.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Card, Text, Button, Group, Badge, TextInput, Popover, Stack, MantineProvider, Tree, useTree,
} from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const treeData = [
  {
    label: 'Company', value: 'company', children: [
      {
        label: 'Engineering', value: 'company-engineering', children: [
          {
            label: 'Platform', value: 'company-engineering-platform', children: [
              { label: 'API', value: 'company-engineering-platform-api' },
              { label: 'Database', value: 'company-engineering-platform-database' },
              { label: 'Cache', value: 'company-engineering-platform-cache' },
            ],
          },
          {
            label: 'Frontend', value: 'company-engineering-frontend', children: [
              { label: 'Web', value: 'company-engineering-frontend-web' },
              { label: 'Mobile', value: 'company-engineering-frontend-mobile' },
            ],
          },
        ],
      },
      {
        label: 'Sales', value: 'company-sales', children: [
          { label: 'Americas', value: 'company-sales-americas' },
          { label: 'EMEA', value: 'company-sales-emea' },
        ],
      },
    ],
  },
];

const LEAF_VALUES = new Set([
  'company-engineering-platform-api', 'company-engineering-platform-database',
  'company-engineering-platform-cache', 'company-engineering-frontend-web',
  'company-engineering-frontend-mobile', 'company-sales-americas', 'company-sales-emea',
]);

function MantineTreeSelect({
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
          readOnly
          value={display}
          placeholder="Select target"
          onClick={() => !disabled && setOpened(true)}
          disabled={disabled}
          style={{ cursor: disabled ? 'default' : 'pointer' }}
        />
      </Popover.Target>
      <Popover.Dropdown>
        <div style={{ maxHeight: 280, overflow: 'auto' }}>
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
  );
}

const CURRENT_INIT = 'company-engineering-platform-api';

export default function T18({ onSuccess }: TaskComponentProps) {
  const [currentTarget] = useState<string>(CURRENT_INIT);
  const [escalation, setEscalation] = useState<string | null>(null);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && escalation === 'company-engineering-platform-database' && currentTarget === CURRENT_INIT) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, escalation, currentTarget, onSuccess]);

  return (
    <MantineProvider>
      <div style={{ padding: 16, maxWidth: 500, marginLeft: 'auto', marginRight: 40 }}>
        <Text fw={700} size="lg" mb="xs">Alert Routing</Text>
        <Group gap="xs" mb="md">
          <Badge variant="light" color="red">P1: 3</Badge>
          <Badge variant="outline">Uptime: 99.92%</Badge>
          <Badge variant="outline" color="gray">Last 24h</Badge>
        </Group>
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Stack gap="md">
            <MantineTreeSelect label="Current target" value={currentTarget} onChange={() => {}} disabled />
            <MantineTreeSelect
              label="Escalation target"
              value={escalation}
              onChange={(v) => { setEscalation(v); setCommitted(false); }}
            />
            <Button onClick={() => setCommitted(true)}>Save targets</Button>
          </Stack>
        </Card>
      </div>
    </MantineProvider>
  );
}
