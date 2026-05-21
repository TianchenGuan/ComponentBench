'use client';

/**
 * Task ID: resizable_columns-mantine-v2-T04
 * Regional accounts: match Name 172, Region 198, Tier 122 (±5) — reference_layout_id mantine_regional_accounts_strip_v2
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Stack, Table, Text, Tooltip } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { allWidthsMatch } from '../../types';

interface Column {
  key: string;
  label: string;
  width: number;
}

const TARGETS = { name: 172, region: 198, tier: 122 };
const TOL = 5;

const rowGlobal = [
  { id: '1', name: 'Globex', region: 'EU', tier: 'A', plan: 'Ent' },
  { id: '2', name: 'Initech', region: 'US', tier: 'B', plan: 'Growth' },
];
const rowRegional = [
  { id: '1', name: 'Acme Co', region: 'West', tier: 'Gold', plan: 'Plus' },
  { id: '2', name: 'Beta LLC', region: 'East', tier: 'Silver', plan: 'Std' },
];
const rowArchived = [
  { id: '1', name: 'OldCo', region: 'APAC', tier: 'Bronze', plan: 'Legacy' },
  { id: '2', name: 'Former', region: 'LATAM', tier: 'Bronze', plan: 'Legacy' },
];

function baseCols(wName: number, wRegion: number, wTier: number): Column[] {
  return [
    { key: 'name', label: 'Name', width: wName },
    { key: 'region', label: 'Region', width: wRegion },
    { key: 'tier', label: 'Tier', width: wTier },
    { key: 'plan', label: 'Plan', width: 100 },
  ];
}

/** Pixel boundaries for mantine_regional_accounts_strip_v2 (Name | Region | Tier | Plan) */
function ReferenceStrip({ widthPx }: { widthPx: number }) {
  const marks = [TARGETS.name, TARGETS.name + TARGETS.region, TARGETS.name + TARGETS.region + TARGETS.tier];
  return (
    <div
      style={{
        position: 'relative',
        width: widthPx,
        height: 10,
        borderRadius: 4,
        background: 'linear-gradient(90deg, var(--mantine-color-indigo-1), var(--mantine-color-violet-1))',
        marginBottom: 8,
      }}
    >
      {marks.map((x, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: Math.min(x, widthPx - 1),
            top: -2,
            bottom: -2,
            width: 3,
            marginLeft: -1.5,
            background: 'var(--mantine-color-indigo-6)',
            borderRadius: 1,
            boxShadow: '0 0 0 1px rgba(255,255,255,0.8)',
          }}
        />
      ))}
    </div>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [globalCols] = useState(() => baseCols(160, 170, 130));
  const [regionalCols, setRegionalCols] = useState(() => baseCols(120, 240, 100));
  const [archivedCols] = useState(() => baseCols(150, 180, 140));
  const [resizing, setResizing] = useState<{ key: string; startX: number; startWidth: number } | null>(null);
  const [tooltipWidth, setTooltipWidth] = useState<number | null>(null);
  const successFired = useRef(false);

  const nameW = regionalCols.find(c => c.key === 'name')?.width ?? 0;
  const regionW = regionalCols.find(c => c.key === 'region')?.width ?? 0;
  const tierW = regionalCols.find(c => c.key === 'tier')?.width ?? 0;

  useEffect(() => {
    const ok = allWidthsMatch({ name: nameW, region: regionW, tier: tierW }, TARGETS, TOL);
    if (!successFired.current && ok) {
      successFired.current = true;
      onSuccess();
    }
  }, [nameW, regionW, tierW, onSuccess]);

  const handleMouseDown = useCallback(
    (key: string, e: React.MouseEvent) => {
      e.preventDefault();
      const col = regionalCols.find(c => c.key === key);
      if (col) {
        setResizing({ key, startX: e.clientX, startWidth: col.width });
        setTooltipWidth(col.width);
      }
    },
    [regionalCols]
  );

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizing.startX;
      const newWidth = Math.max(50, resizing.startWidth + delta);
      setTooltipWidth(newWidth);
      setRegionalCols(prev => prev.map(col => (col.key === resizing.key ? { ...col, width: newWidth } : col)));
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

  const renderTable = (
    title: string,
    cols: Column[],
    data: typeof rowRegional,
    testId: string,
    interactive: boolean,
    stripWidth?: number
  ) => (
    <div data-testid={testId}>
      <Text fw={600} size="sm" mb={stripWidth != null ? 4 : 'xs'}>
        {title}
      </Text>
      {stripWidth != null && <ReferenceStrip widthPx={stripWidth} />}
      <Table striped highlightOnHover withTableBorder style={{ tableLayout: 'fixed', width: cols.reduce((s, c) => s + c.width, 0) }}>
        <Table.Thead>
          <Table.Tr>
            {cols.map(col => (
              <Table.Th
                key={col.key}
                style={{ width: col.width, position: 'relative', userSelect: 'none', padding: '6px 8px' }}
              >
                {col.label}
                {interactive ? (
                  <Tooltip
                    label={`${Math.round(tooltipWidth ?? col.width)}px`}
                    opened={resizing?.key === col.key}
                    position="top"
                  >
                    <div
                      data-testid={`rc-handle-regional-${col.key}`}
                      onMouseDown={e => handleMouseDown(col.key, e)}
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: 10,
                        cursor: 'col-resize',
                        background:
                          resizing?.key === col.key ? 'rgba(34, 139, 230, 0.25)' : 'rgba(0,0,0,0.04)',
                        borderLeft: '1px solid var(--mantine-color-gray-4)',
                      }}
                    />
                  </Tooltip>
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: 8,
                      background: 'rgba(0,0,0,0.04)',
                      borderLeft: '1px solid var(--mantine-color-gray-4)',
                    }}
                  />
                )}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map(row => (
            <Table.Tr key={row.id}>
              {cols.map(col => (
                <Table.Td key={col.key} style={{ width: col.width, padding: '6px 8px' }}>
                  {row[col.key as keyof typeof row]}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );

  return (
    <Card padding="sm" radius="md" withBorder maw={720} data-testid="rc-mantine-v2-t04">
      <Text fw={600} size="sm" mb="sm">
        Preview layouts
      </Text>
      <Text size="xs" c="dimmed" mb="md">
        Ops digest · SLA · Assignments · Territories · Credits · Renewals · Support load · Training queue · Approvals
        · Vendor risk · Data quality · Incidents · Cost centers · Budget variance · Headcount plan · Seat usage ·
        License true-up · API errors · Webhooks · Secrets rotation · Access reviews.
      </Text>
      <Stack gap="lg">
        {renderTable('Global accounts', globalCols, rowGlobal, 'rc-preview-global', false)}
        {renderTable(
          'Regional accounts',
          regionalCols,
          rowRegional,
          'rc-preview-regional',
          true,
          TARGETS.name + TARGETS.region + TARGETS.tier + 100
        )}
        {renderTable('Archived accounts', archivedCols, rowArchived, 'rc-preview-archived', false)}
      </Stack>
    </Card>
  );
}
