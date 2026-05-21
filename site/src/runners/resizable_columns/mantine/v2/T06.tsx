'use client';

/**
 * Task ID: resizable_columns-mantine-v2-T06
 * Tag overrides: Tags 210px ±4; Default tags table unchanged.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Badge, Card, Group, Select, Stack, Table, Text, Tooltip } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { isWithinTolerance } from '../../types';

interface Column {
  key: string;
  label: string;
  width: number;
}

const DEFAULT_TAGS_INITIAL = 150;
const rows = [
  { id: '1', rule: 'T-01', tags: 'prod', scope: 'All', updated: 'Today' },
  { id: '2', rule: 'T-02', tags: 'beta', scope: 'EU', updated: 'Yesterday' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [defaultCols, setDefaultCols] = useState<Column[]>([
    { key: 'rule', label: 'Rule', width: 88 },
    { key: 'tags', label: 'Tags', width: DEFAULT_TAGS_INITIAL },
    { key: 'scope', label: 'Scope', width: 100 },
    { key: 'updated', label: 'Updated', width: 96 },
  ]);
  const [overrideCols, setOverrideCols] = useState<Column[]>([
    { key: 'rule', label: 'Rule', width: 88 },
    { key: 'tags', label: 'Tags', width: 130 },
    { key: 'scope', label: 'Scope', width: 100 },
    { key: 'updated', label: 'Updated', width: 96 },
  ]);
  const [resizing, setResizing] = useState<{
    table: 'default' | 'override';
    key: string;
    startX: number;
    startWidth: number;
  } | null>(null);
  const [tooltipWidth, setTooltipWidth] = useState<number | null>(null);
  const successFired = useRef(false);

  const defaultTagsW = defaultCols.find(c => c.key === 'tags')?.width ?? DEFAULT_TAGS_INITIAL;
  const overrideTagsW = overrideCols.find(c => c.key === 'tags')?.width ?? 164;

  useEffect(() => {
    const tagsOk = isWithinTolerance(overrideTagsW, 210, 4);
    const defaultPristine = defaultTagsW === DEFAULT_TAGS_INITIAL;
    if (!successFired.current && tagsOk && defaultPristine) {
      successFired.current = true;
      onSuccess();
    }
  }, [defaultTagsW, overrideTagsW, onSuccess]);

  const handleMouseDown = useCallback(
    (table: 'default' | 'override', key: string, e: React.MouseEvent) => {
      e.preventDefault();
      const cols = table === 'default' ? defaultCols : overrideCols;
      const col = cols.find(c => c.key === key);
      if (col) {
        setResizing({ table, key, startX: e.clientX, startWidth: col.width });
        setTooltipWidth(col.width);
      }
    },
    [defaultCols, overrideCols]
  );

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizing.startX;
      const newWidth = Math.max(50, resizing.startWidth + delta);
      setTooltipWidth(newWidth);
      if (resizing.table === 'default') {
        setDefaultCols(prev => prev.map(col => (col.key === resizing.key ? { ...col, width: newWidth } : col)));
      } else {
        setOverrideCols(prev => prev.map(col => (col.key === resizing.key ? { ...col, width: newWidth } : col)));
      }
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

  const miniTable = (
    title: string,
    testId: string,
    cols: Column[],
    table: 'default' | 'override',
    showTagsMonitor: boolean
  ) => (
    <div data-testid={testId}>
      <Text fw={600} size="xs" mb={4}>
        {title}
      </Text>
      {showTagsMonitor && (
        <Text size="xs" c="dimmed" mb={6} data-testid="rc-width-tags-overrides">
          Tags width: {cols.find(c => c.key === 'tags')?.width}px
        </Text>
      )}
      <Table striped highlightOnHover withTableBorder style={{ tableLayout: 'fixed', width: cols.reduce((s, c) => s + c.width, 0) }}>
        <Table.Thead>
          <Table.Tr>
            {cols.map(col => (
              <Table.Th
                key={col.key}
                style={{ width: col.width, position: 'relative', userSelect: 'none', padding: '4px 6px' }}
              >
                <Text size="xs">{col.label}</Text>
                <Tooltip
                  label={`${Math.round(tooltipWidth ?? col.width)}px`}
                  opened={resizing?.table === table && resizing?.key === col.key}
                  position="top"
                >
                  <div
                    data-testid={`rc-handle-${table}-${col.key}`}
                    onMouseDown={e => handleMouseDown(table, col.key, e)}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: 10,
                      cursor: 'col-resize',
                      background:
                        resizing?.table === table && resizing?.key === col.key
                          ? 'rgba(34, 139, 230, 0.25)'
                          : 'rgba(0,0,0,0.04)',
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
              {cols.map(col => (
                <Table.Td key={col.key} style={{ width: col.width, padding: '4px 6px' }}>
                  <Text size="xs">{row[col.key as keyof typeof row]}</Text>
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );

  return (
    <Card padding="sm" withBorder radius="md" maw={720} data-testid="rc-mantine-v2-t06">
      <Text fw={600} size="sm" mb="sm">
        Audit matrix
      </Text>
      <Stack gap={0} style={{ border: '1px solid var(--mantine-color-gray-4)', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: 8, borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
          <Group gap="xs" mb="xs">
            <Badge size="sm" color="yellow" variant="light">
              Review
            </Badge>
            <Badge size="sm" color="gray" variant="outline">
              Staged
            </Badge>
            <Select size="xs" placeholder="Scope" data={['All', 'EU']} w={100} />
            <Select size="xs" placeholder="Owner" data={['Any', 'SRE']} w={100} />
          </Group>
          <Text size="xs" c="dimmed">
            Upper matrix context — not the target tables.
          </Text>
        </div>
        <div style={{ padding: 8, background: 'var(--mantine-color-gray-0)' }} data-testid="rc-audit-lower-cell">
          <Stack gap="sm">
            {miniTable('Default tags', 'rc-table-default-tags', defaultCols, 'default', false)}
            {miniTable('Tag overrides', 'rc-table-tag-overrides', overrideCols, 'override', true)}
          </Stack>
        </div>
      </Stack>
    </Card>
  );
}
