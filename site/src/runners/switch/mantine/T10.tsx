'use client';

/**
 * switch-mantine-T10: Visual match with multiple toggles: Diagnostics
 *
 * Layout: dashboard with a two-column layout; the content block is positioned toward the bottom-right of the viewport.
 * A "Reference" card shows a non-interactive Mantine Switch (visual-only reference) with no ON/OFF text.
 * Next to it, a "Telemetry" card contains three interactive Mantine Switch rows:
 *   • "Diagnostics" (target)
 *   • "Crash reports"
 *   • "Performance metrics"
 * Initial state: the reference switch is OFF. "Diagnostics" starts ON, while the other two switches have mixed states.
 * Guidance: visual — the desired state is only indicated by the reference switch position, not by explicit text like "enable/disable".
 * Clutter: medium — the dashboard includes other cards and buttons, but only these switches are relevant.
 * Feedback: toggling any switch updates immediately; no confirmation step.
 */

import React, { useState } from 'react';
import { Card, Switch, Text, Group, Button, Stack, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const referenceState = false; // Reference is OFF
  const [diagnostics, setDiagnostics] = useState(true);
  const [crashReports, setCrashReports] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState(false);

  const handleDiagnosticsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.currentTarget.checked;
    setDiagnostics(newChecked);
    if (newChecked === referenceState) {
      onSuccess();
    }
  };

  return (
    <Box style={{ minHeight: 600 }}>
      {/* Top row placeholder cards */}
      <Group gap="md" mb="md">
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ flex: 1 }}>
          <Text fw={500} size="sm" mb="xs">Overview</Text>
          <Box h={80} bg="gray.1" style={{ borderRadius: 4 }} />
          <Group mt="xs" gap="xs">
            <Button size="xs" variant="light">Refresh</Button>
            <Button size="xs" variant="light">Export</Button>
          </Group>
        </Card>
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ flex: 1 }}>
          <Text fw={500} size="sm" mb="xs">Status</Text>
          <Box h={80} bg="gray.1" style={{ borderRadius: 4 }} />
        </Card>
      </Group>

      {/* Bottom row with Reference and Telemetry cards */}
      <Group gap="md" align="flex-start">
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 180 }}>
          <Text fw={500} size="sm" mb="md">Reference</Text>
          <Box style={{ display: 'flex', justifyContent: 'center' }}>
            <Switch
              checked={referenceState}
              disabled
              data-state={referenceState ? 'on' : 'off'}
              aria-checked={referenceState}
            />
          </Box>
          <Text size="xs" c="dimmed" ta="center" mt="xs">
            Target state
          </Text>
        </Card>
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 280 }}>
          <Text fw={500} size="sm" mb="md">Telemetry</Text>
          <Stack gap="xs">
            <Switch
              checked={diagnostics}
              onChange={handleDiagnosticsChange}
              label="Diagnostics"
              data-testid="diagnostics-switch"
              aria-checked={diagnostics}
            />
            <Switch
              checked={crashReports}
              onChange={(e) => setCrashReports(e.currentTarget.checked)}
              label="Crash reports"
              data-testid="crash-reports-switch"
              aria-checked={crashReports}
            />
            <Switch
              checked={performanceMetrics}
              onChange={(e) => setPerformanceMetrics(e.currentTarget.checked)}
              label="Performance metrics"
              data-testid="performance-metrics-switch"
              aria-checked={performanceMetrics}
            />
          </Stack>
        </Card>
      </Group>
    </Box>
  );
}
