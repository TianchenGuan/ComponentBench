'use client';

/**
 * select_custom_multi-mantine-T10: Edit Web app flags in a crowded table
 *
 * Scene context: theme=light, spacing=comfortable, layout=table_cell, placement=center, scale=default, instances=1, guidance=text, clutter=high.
 * Layout: table cell editor with high clutter. The page shows a table titled "Feature flags" with multiple rows.
 * Only the "Web app" row has an editable Enabled flags cell using a Mantine MultiSelect rendered inside the cell.
 * Other rows display read-only text flags.
 * The cell width is limited; when more than 2 flags are selected it shows two pills plus a "+N" overflow.
 * Clicking into the Web app Enabled flags cell opens the dropdown anchored to that cell.
 * Options (16) are short, similar feature names: auth-v2, auth-v3, billing-v1, billing-v2, checkout-a, checkout-b, search-v1, search-v2, search-v2beta, ui-new, ui-newbeta, export-csv, export-pdf, audit-log, rate-limit, rate-limit-strict.
 * Initial state (Web app Enabled flags): auth-v3, billing-v1, ui-new are preselected (must be changed).
 * No explicit Save; changes apply immediately.
 *
 * Success: The selected values in the Web app Enabled flags multi-select are exactly: billing-v2, checkout-b, search-v2, audit-log (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, MultiSelect, Table } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const flagOptions = [
  'auth-v2', 'auth-v3', 'billing-v1', 'billing-v2', 'checkout-a', 'checkout-b',
  'search-v1', 'search-v2', 'search-v2beta', 'ui-new', 'ui-newbeta',
  'export-csv', 'export-pdf', 'audit-log', 'rate-limit', 'rate-limit-strict'
];

interface FeatureRow {
  platform: string;
  flags: string[];
  editable: boolean;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [webAppFlags, setWebAppFlags] = useState<string[]>(['auth-v3', 'billing-v1', 'ui-new']);

  useEffect(() => {
    const targetSet = new Set(['billing-v2', 'checkout-b', 'search-v2', 'audit-log']);
    const currentSet = new Set(webAppFlags);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [webAppFlags, onSuccess]);

  const rows: FeatureRow[] = [
    { platform: 'iOS app', flags: ['auth-v2', 'billing-v1'], editable: false },
    { platform: 'Android app', flags: ['auth-v2', 'billing-v1', 'checkout-a'], editable: false },
    { platform: 'Web app', flags: webAppFlags, editable: true },
    { platform: 'Admin portal', flags: ['audit-log', 'rate-limit'], editable: false },
  ];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }}>
      <Text fw={600} size="lg" mb="md">Feature flags</Text>
      <Table striped withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 120 }}>Platform</Table.Th>
            <Table.Th>Enabled flags</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={row.platform}>
              <Table.Td>{row.platform}</Table.Td>
              <Table.Td>
                {row.editable ? (
                  <MultiSelect
                    data-testid="web-app-flags-select"
                    data={flagOptions}
                    value={webAppFlags}
                    onChange={setWebAppFlags}
                    maxValues={10}
                    placeholder="Select flags"
                    style={{ minWidth: 300 }}
                  />
                ) : (
                  <Text size="sm">{row.flags.join(', ')}</Text>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
