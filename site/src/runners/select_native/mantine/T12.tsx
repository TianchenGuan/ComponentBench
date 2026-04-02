'use client';

/**
 * select_native-mantine-T12: Set Analytics retention to 180 days and Apply (multi-instance)
 *
 * Layout: a "Retention" dashboard with several cards and metrics (clutter high).
 * The target card contains THREE Mantine NativeSelect controls (same canonical type) for different retention policies:
 * 1) "Logs retention"
 * 2) "Backups retention"
 * 3) "Analytics retention"  ← TARGET
 *
 * Each select has the same options (label → value):
 * - 7 days → 7
 * - 30 days → 30
 * - 90 days → 90
 * - 180 days → 180  ← TARGET OPTION
 * - 365 days → 365
 *
 * Initial state:
 * - Logs retention: 30 days
 * - Backups retention: 90 days
 * - Analytics retention: 30 days
 *
 * Below the selects are two buttons: "Apply" and "Cancel changes".
 * Feedback: selecting an option updates the field immediately, but changes are not committed until "Apply" is clicked.
 * Clicking Apply shows a toast "Retention updated".
 *
 * Success: The target native select labeled "Analytics retention" has selected option value '180' AND user clicks 'Apply'.
 */

import React, { useState } from 'react';
import { Card, Text, NativeSelect, Button, Group, Stack, Box, Grid, Notification } from '@mantine/core';
import { IconDatabase, IconCloudUpload, IconChartBar, IconCheck } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const retentionOptions = [
  { label: '7 days', value: '7' },
  { label: '30 days', value: '30' },
  { label: '90 days', value: '90' },
  { label: '180 days', value: '180' },
  { label: '365 days', value: '365' },
];

export default function T12({ onSuccess }: TaskComponentProps) {
  const [logsRetention, setLogsRetention] = useState<string>('30');
  const [backupsRetention, setBackupsRetention] = useState<string>('90');
  const [analyticsRetention, setAnalyticsRetention] = useState<string>('30');
  const [showToast, setShowToast] = useState(false);

  const handleApply = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    if (analyticsRetention === '180') {
      onSuccess();
    }
  };

  const handleCancel = () => {
    setLogsRetention('30');
    setBackupsRetention('90');
    setAnalyticsRetention('30');
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }}>
        <Text fw={600} size="lg" mb="md">Retention Dashboard</Text>

        <Grid mb="md">
          {/* Metrics cards as distractors */}
          <Grid.Col span={4}>
            <Box p="sm" style={{ border: '1px solid #e0e0e0', borderRadius: 8 }}>
              <Group gap="xs" mb="xs">
                <IconDatabase size={16} color="#228be6" />
                <Text size="sm" c="dimmed">Storage used</Text>
              </Group>
              <Text fw={600}>42.5 GB</Text>
            </Box>
          </Grid.Col>
          <Grid.Col span={4}>
            <Box p="sm" style={{ border: '1px solid #e0e0e0', borderRadius: 8 }}>
              <Group gap="xs" mb="xs">
                <IconCloudUpload size={16} color="#228be6" />
                <Text size="sm" c="dimmed">Last backup</Text>
              </Group>
              <Text fw={600}>2 hours ago</Text>
            </Box>
          </Grid.Col>
          <Grid.Col span={4}>
            <Box p="sm" style={{ border: '1px solid #e0e0e0', borderRadius: 8 }}>
              <Group gap="xs" mb="xs">
                <IconChartBar size={16} color="#228be6" />
                <Text size="sm" c="dimmed">Events today</Text>
              </Group>
              <Text fw={600}>12,453</Text>
            </Box>
          </Grid.Col>
        </Grid>

        <Box p="md" style={{ border: '1px solid #e0e0e0', borderRadius: 8 }}>
          <Text fw={500} mb="md">Retention Policies</Text>
          
          <Stack gap="md">
            <NativeSelect
              data-testid="logs-retention"
              data-canonical-type="select_native"
              data-selected-value={logsRetention}
              label="Logs retention"
              value={logsRetention}
              onChange={(e) => setLogsRetention(e.target.value)}
              data={retentionOptions}
            />

            <NativeSelect
              data-testid="backups-retention"
              data-canonical-type="select_native"
              data-selected-value={backupsRetention}
              label="Backups retention"
              value={backupsRetention}
              onChange={(e) => setBackupsRetention(e.target.value)}
              data={retentionOptions}
            />

            <NativeSelect
              data-testid="analytics-retention"
              data-canonical-type="select_native"
              data-selected-value={analyticsRetention}
              label="Analytics retention"
              value={analyticsRetention}
              onChange={(e) => setAnalyticsRetention(e.target.value)}
              data={retentionOptions}
            />
          </Stack>

          <Group justify="flex-end" mt="lg">
            <Button variant="default" onClick={handleCancel}>Cancel changes</Button>
            <Button onClick={handleApply}>Apply</Button>
          </Group>
        </Box>
      </Card>

      {showToast && (
        <Notification
          icon={<IconCheck size={20} />}
          color="teal"
          title="Success"
          style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
          onClose={() => setShowToast(false)}
        >
          Retention updated
        </Notification>
      )}
    </>
  );
}
