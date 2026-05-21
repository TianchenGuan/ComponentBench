'use client';

/**
 * Task ID: resizable_columns-mantine-v2-T08
 * Settings panel: API key column 171px ±3; adjacent Name separator and tooltip icon.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ActionIcon, Card, Group, Switch, Table, Text, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';
import { isWithinTolerance } from '../../types';

interface Column {
  key: string;
  label: string;
  width: number;
}

const rows = [
  { id: '1', name: 'Prod API', api_key: 'pk_live_••••', scope: 'Read', updated: 'Today' },
  { id: '2', name: 'Staging', api_key: 'pk_test_••••', scope: 'Write', updated: 'Yesterday' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<Column[]>([
    { key: 'name', label: 'Name', width: 120 },
    { key: 'api_key', label: 'API key', width: 138 },
    { key: 'scope', label: 'Scope', width: 100 },
    { key: 'updated', label: 'Updated', width: 100 },
  ]);
  const [resizing, setResizing] = useState<{ key: string; startX: number; startWidth: number } | null>(null);
  const [tooltipWidth, setTooltipWidth] = useState<number | null>(null);
  const successFired = useRef(false);

  const apiKeyW = columns.find(c => c.key === 'api_key')?.width ?? 138;

  useEffect(() => {
    if (!successFired.current && isWithinTolerance(apiKeyW, 171, 3)) {
      successFired.current = true;
      onSuccess();
    }
  }, [apiKeyW, onSuccess]);

  const handleMouseDown = useCallback(
    (key: string, e: React.MouseEvent) => {
      e.preventDefault();
      const col = columns.find(c => c.key === key);
      if (col) {
        setResizing({ key, startX: e.clientX, startWidth: col.width });
        setTooltipWidth(col.width);
      }
    },
    [columns]
  );

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizing.startX;
      const newWidth = Math.max(60, resizing.startWidth + delta);
      setTooltipWidth(newWidth);
      setColumns(prev => prev.map(col => (col.key === resizing.key ? { ...col, width: newWidth } : col)));
    };

    const handleMouseUp = () => {
      setResizing(null);
      setTooltipWidth(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing]);

  return (
    <Card padding="sm" withBorder radius="md" maw={640} data-testid="rc-mantine-v2-t08">
      <Group justify="space-between" mb="sm" wrap="wrap" gap="xs">
        <Text fw={600} size="sm">
          Integration settings
        </Text>
        <Group gap="xs">
          <Switch size="xs" label="Rotate" defaultChecked />
          <Switch size="xs" label="Alerts" />
        </Group>
      </Group>
      <Text size="xs" c="dimmed" mb="xs">
        Webhooks · IP allowlists · Quotas · HMAC · Retry policy · Key rotation · Break-glass · SCIM · SSO · Audit
        export · DPA · Regions · Data residency · Log streaming · Incident hooks.
      </Text>
      <Card withBorder padding="xs" radius="sm" mb="sm" bg="gray.0">
        <Text size="xs" fw={500}>
          Help
        </Text>
        <Text size="xs" c="dimmed">
          Credential tables support column resizing for wide tokens. Avoid mistaking the info icon for the resize grip.
        </Text>
      </Card>
      <Text fw={600} size="sm" mb="xs">
        Credentials
      </Text>
      <Text size="xs" c="dimmed" mb="sm" data-testid="rc-width-api-key">
        API key width: {apiKeyW}px
      </Text>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            {columns.map(col => (
              <Table.Th
                key={col.key}
                style={{ width: col.width, position: 'relative', userSelect: 'none', padding: '6px 8px' }}
              >
                <Group gap={4} wrap="nowrap" align="center" justify="space-between" pr={6}>
                  <Text span size="sm" fw={500}>
                    {col.label}
                  </Text>
                  {col.key === 'api_key' && (
                    <Tooltip label="Masked secret; rotate from Security">
                      <ActionIcon size="xs" variant="subtle" color="gray" aria-label="API key info">
                        <IconInfoCircle size={14} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>
                <Tooltip
                  label={`${Math.round(tooltipWidth ?? col.width)}px`}
                  opened={resizing?.key === col.key}
                  position="top"
                >
                  <div
                    data-testid={`rc-handle-${col.key}`}
                    onMouseDown={e => handleMouseDown(col.key, e)}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: 12,
                      cursor: 'col-resize',
                      background:
                        resizing?.key === col.key ? 'rgba(34, 139, 230, 0.25)' : 'rgba(0,0,0,0.04)',
                      borderLeft: '1px solid var(--mantine-color-gray-4)',
                    }}
                  />
                </Tooltip>
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map(row => (
            <Table.Tr key={row.id}>
              {columns.map(col => (
                <Table.Td key={col.key} style={{ width: col.width, padding: '6px 8px' }}>
                  {row[col.key as keyof typeof row]}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
