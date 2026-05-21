'use client';

/**
 * select_native-mantine-v2-T27: Retention dashboard — set Analytics retention to 180 days and apply
 *
 * Dashboard panel with three Mantine NativeSelect controls sharing identical options:
 * "Logs retention" (30 days), "Backups retention" (90 days), "Analytics retention" (30 days → 180 days).
 * "Apply retention settings" commits; "Cancel changes" discards.
 *
 * Success: Analytics retention = "180"/"180 days", others unchanged, Apply clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, NativeSelect, Button, Group, Stack, Badge, Box } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const retentionOptions = [
  { label: '7 days', value: '7' },
  { label: '14 days', value: '14' },
  { label: '30 days', value: '30' },
  { label: '90 days', value: '90' },
  { label: '180 days', value: '180' },
  { label: '365 days', value: '365' },
];

export default function T27({ onSuccess }: TaskComponentProps) {
  const [logsRetention, setLogsRetention] = useState('30');
  const [backupsRetention, setBackupsRetention] = useState('90');
  const [analyticsRetention, setAnalyticsRetention] = useState('30');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && analyticsRetention === '180' && logsRetention === '30' && backupsRetention === '90') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, analyticsRetention, logsRetention, backupsRetention, onSuccess]);

  const handleCancel = () => {
    setLogsRetention('30');
    setBackupsRetention('90');
    setAnalyticsRetention('30');
    setApplied(false);
  };

  return (
    <Box p="lg">
      <Group mb="md" gap="sm">
        <Badge>Active policies: 3</Badge>
        <Badge variant="outline">Storage: 42 GB</Badge>
      </Group>

      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: 460 }}>
        <Text fw={600} size="lg" mb="md">Retention Settings</Text>
        <Text size="sm" c="dimmed" mb="md">
          Configure how long each data category is retained before automatic deletion.
        </Text>

        <Stack gap="md">
          <NativeSelect
            data-testid="logs-retention"
            data-canonical-type="select_native"
            data-selected-value={logsRetention}
            label="Logs retention"
            value={logsRetention}
            onChange={(e) => { setLogsRetention(e.target.value); setApplied(false); }}
            data={retentionOptions}
          />

          <NativeSelect
            data-testid="backups-retention"
            data-canonical-type="select_native"
            data-selected-value={backupsRetention}
            label="Backups retention"
            value={backupsRetention}
            onChange={(e) => { setBackupsRetention(e.target.value); setApplied(false); }}
            data={retentionOptions}
          />

          <NativeSelect
            data-testid="analytics-retention"
            data-canonical-type="select_native"
            data-selected-value={analyticsRetention}
            label="Analytics retention"
            value={analyticsRetention}
            onChange={(e) => { setAnalyticsRetention(e.target.value); setApplied(false); }}
            data={retentionOptions}
          />
        </Stack>

        <Text size="xs" c="dimmed" mt="md">
          Note: reducing retention will trigger a background purge within 24 hours.
        </Text>

        <Group mt="lg" gap="sm">
          <Button onClick={() => setApplied(true)}>Apply retention settings</Button>
          <Button variant="outline" onClick={handleCancel}>Cancel changes</Button>
        </Group>
      </Card>
    </Box>
  );
}
