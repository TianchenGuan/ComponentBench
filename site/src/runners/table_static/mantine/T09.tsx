'use client';

/**
 * table_static-mantine-T09: Expand a nested details row in a settings table
 *
 * The page is a settings_panel with medium clutter: there are headings, short descriptions, and a couple
 * of toggle switches unrelated to success. The main component is a read-only Feature Flags table rendered with Mantine Table.
 * Each row has a small disclosure chevron at the start; expanding shows an inline details row with read-only rollout notes.
 * Spacing is comfortable but the list of flags is moderately dense (~25 rows) and several flags start with "new-". Initial
 * state: all rows collapsed.
 */

import React, { useState } from 'react';
import { Table, Card, Text, Switch, Box, Collapse, ActionIcon } from '@mantine/core';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface FeatureFlagData {
  key: string;
  flag: string;
  status: string;
  rolloutNotes: string;
}

const featureFlagsData: FeatureFlagData[] = [
  { key: 'new-checkout', flag: 'new-checkout', status: 'Enabled', rolloutNotes: 'Rolling out to 50% of users. Monitor conversion rates.' },
  { key: 'new-checkout-v2', flag: 'new-checkout-v2', status: 'Disabled', rolloutNotes: 'Pending QA approval. Target launch: Q2.' },
  { key: 'new-dashboard', flag: 'new-dashboard', status: 'Enabled', rolloutNotes: 'Full rollout complete. A/B test concluded.' },
  { key: 'dark-mode', flag: 'dark-mode', status: 'Enabled', rolloutNotes: 'Available to all users via settings.' },
  { key: 'beta-analytics', flag: 'beta-analytics', status: 'Disabled', rolloutNotes: 'Internal testing only.' },
  { key: 'new-onboarding', flag: 'new-onboarding', status: 'Enabled', rolloutNotes: 'Rolled out to new signups.' },
  { key: 'experimental-ai', flag: 'experimental-ai', status: 'Disabled', rolloutNotes: 'Research phase. No production use.' },
  { key: 'new-search', flag: 'new-search', status: 'Enabled', rolloutNotes: '100% rollout. Old search deprecated.' },
  { key: 'api-v3', flag: 'api-v3', status: 'Enabled', rolloutNotes: 'Available for all API clients.' },
  { key: 'new-notifications', flag: 'new-notifications', status: 'Disabled', rolloutNotes: 'Blocked on push notification infra.' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const successFiredRef = React.useRef(false);

  const handleToggleExpand = (key: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
        // Check for success condition
        if (key === 'new-checkout' && !successFiredRef.current) {
          successFiredRef.current = true;
          onSuccess();
        }
      }
      return newSet;
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }} data-cb-expanded-rows={Array.from(expandedRows).join(',')}>
      <Text fw={600} size="lg" mb="md">Settings</Text>

      {/* Medium clutter: headings and switches */}
      <Box mb="lg">
        <Text fw={500} size="sm" mb="xs">Notifications</Text>
        <Box mb="sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text size="sm">Email notifications</Text>
          <Switch defaultChecked disabled />
        </Box>
        <Box mb="sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text size="sm">Push notifications</Text>
          <Switch disabled />
        </Box>
      </Box>

      <Text fw={500} size="md" mb="sm">Feature Flags</Text>
      <Text size="sm" c="dimmed" mb="md">
        Manage feature flags and rollout configurations.
      </Text>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 40 }} />
            <Table.Th>Flag</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {featureFlagsData.map((row) => (
            <React.Fragment key={row.key}>
              <Table.Tr data-row-key={row.key} data-expanded={expandedRows.has(row.key)}>
                <Table.Td style={{ padding: 4 }}>
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    onClick={() => handleToggleExpand(row.key)}
                    aria-label={expandedRows.has(row.key) ? 'Collapse' : 'Expand'}
                    data-testid={`expand-${row.key}`}
                  >
                    {expandedRows.has(row.key) ? (
                      <IconChevronDown size={16} />
                    ) : (
                      <IconChevronRight size={16} />
                    )}
                  </ActionIcon>
                </Table.Td>
                <Table.Td>{row.flag}</Table.Td>
                <Table.Td>{row.status}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td colSpan={3} style={{ padding: 0 }}>
                  <Collapse in={expandedRows.has(row.key)}>
                    <Box p="sm" style={{ backgroundColor: 'var(--mantine-color-gray-1)' }}>
                      <Text size="sm" c="dimmed">
                        <strong>Rollout notes:</strong> {row.rolloutNotes}
                      </Text>
                    </Box>
                  </Collapse>
                </Table.Td>
              </Table.Tr>
            </React.Fragment>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
