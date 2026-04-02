'use client';

/**
 * meter-mantine-T08: Match Primary Storage meter to reference in dashboard and Save (Mantine)
 *
 * Setup Description:
 * A dashboard layout shows multiple cards; the "Storage" card contains three meters and a reference bar.
 * - Layout: dashboard; placement center.
 * - Clutter: high (navigation, card menus, other cards with buttons and charts).
 * - Component: Mantine Progress meters (scalar percent) used as meters.
 * - Instances: 3 meters in the Storage card:
 *   * "Storage Used (Primary)" (interactive target)
 *   * "Storage Used (Secondary)" (interactive distractor)
 *   * "Storage Used (Archive)" (interactive distractor)
 * - Guidance: mixed.
 *   * A thin "Reference level" bar swatch is shown above the list.
 *   * The Primary row has a subtle "Primary" badge, but all bars look similar.
 * - Observability: numeric labels are hidden; hovering a bar shows a tooltip with the exact percent.
 * - Initial state: Primary=20%, Secondary=55%, Archive=80%; reference corresponds to ~72%.
 * - Confirmation: "Save changes" button in the card footer commits the Primary value.
 * - Feedback: after Save, a toast appears and an "Unsaved changes" badge disappears.
 *
 * Success: Storage Used (Primary) matches the reference bar (±1 percentage point). Save changes has been clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Progress, Group, Stack, Button, Grid, Tooltip, Badge, Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { TaskComponentProps } from '../types';

const REFERENCE_VALUE = 72;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [primary, setPrimary] = useState(20);
  const [secondary, setSecondary] = useState(55);
  const [archive, setArchive] = useState(80);
  const [committed, setCommitted] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (committed && Math.abs(primary - REFERENCE_VALUE) <= 1 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [primary, committed, onSuccess]);

  const handlePrimaryClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setPrimary(Math.max(0, Math.min(100, percent)));
    setHasUnsavedChanges(true);
    setCommitted(false);
  };

  const handleSecondaryClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setSecondary(Math.max(0, Math.min(100, percent)));
  };

  const handleArchiveClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setArchive(Math.max(0, Math.min(100, percent)));
  };

  const handleSave = () => {
    setCommitted(true);
    setHasUnsavedChanges(false);
    notifications.show({
      title: 'Success',
      message: 'Storage settings saved',
      color: 'green',
    });
  };

  return (
    <Grid style={{ width: 800 }}>
      {/* Distractor card */}
      <Grid.Col span={4}>
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ height: 200 }}>
          <Text fw={500} size="sm" mb={8}>CPU Usage</Text>
          <Box style={{ height: 100, background: '#f1f3f5', borderRadius: 4 }} />
          <Button size="xs" variant="outline" mt={8}>Refresh</Button>
        </Card>
      </Grid.Col>

      {/* Storage card - target */}
      <Grid.Col span={4}>
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Group gap="xs">
              <Text fw={500} size="sm">Storage</Text>
              {hasUnsavedChanges && <Badge color="orange" size="xs">Unsaved</Badge>}
            </Group>
          </Group>

          {/* Reference bar */}
          <div style={{ marginBottom: 12 }}>
            <Text size="xs" c="dimmed" mb={4}>Reference level</Text>
            <Box style={{ height: 8, background: '#e9ecef', borderRadius: 4, overflow: 'hidden' }}>
              <Box style={{ width: `${REFERENCE_VALUE}%`, height: '100%', background: '#40c057', borderRadius: 4 }} />
            </Box>
          </div>

          <Stack gap="xs">
            {/* Primary meter */}
            <div>
              <Text size="xs" c="dimmed">Storage Used (Primary)</Text>
              <Tooltip label={`${primary}%`}>
                <div
                  onClick={handlePrimaryClick}
                  style={{ cursor: 'pointer' }}
                  data-testid="mantine-meter-storage-primary"
                  data-instance-label="Storage Used (Primary)"
                  data-meter-value={primary}
                  data-meter-committed={committed}
                  role="meter"
                  aria-valuenow={primary}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Storage Used Primary"
                >
                  <Progress value={primary} size="sm" />
                </div>
              </Tooltip>
            </div>

            {/* Secondary meter */}
            <div>
              <Text size="xs" c="dimmed">Storage Used (Secondary)</Text>
              <Tooltip label={`${secondary}%`}>
                <div
                  onClick={handleSecondaryClick}
                  style={{ cursor: 'pointer' }}
                  data-testid="mantine-meter-storage-secondary"
                  data-instance-label="Storage Used (Secondary)"
                  data-meter-value={secondary}
                  role="meter"
                  aria-valuenow={secondary}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Storage Used Secondary"
                >
                  <Progress value={secondary} size="sm" />
                </div>
              </Tooltip>
            </div>

            {/* Archive meter */}
            <div>
              <Text size="xs" c="dimmed">Storage Used (Archive)</Text>
              <Tooltip label={`${archive}%`}>
                <div
                  onClick={handleArchiveClick}
                  style={{ cursor: 'pointer' }}
                  data-testid="mantine-meter-storage-archive"
                  data-instance-label="Storage Used (Archive)"
                  data-meter-value={archive}
                  role="meter"
                  aria-valuenow={archive}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Storage Used Archive"
                >
                  <Progress value={archive} size="sm" />
                </div>
              </Tooltip>
            </div>
          </Stack>

          <Button size="xs" mt="md" onClick={handleSave} data-testid="storage-save">
            Save changes
          </Button>
        </Card>
      </Grid.Col>

      {/* Distractor card */}
      <Grid.Col span={4}>
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ height: 200 }}>
          <Text fw={500} size="sm" mb={8}>Network</Text>
          <Box style={{ height: 100, background: '#f1f3f5', borderRadius: 4 }} />
          <Button size="xs" variant="outline" mt={8} disabled>Configure</Button>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
