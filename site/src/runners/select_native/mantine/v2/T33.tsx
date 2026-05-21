'use client';

/**
 * select_native-mantine-v2-T33: Dark privacy card — set Crash reports retention to 30 days and apply
 *
 * Compact dark privacy card anchored bottom-right. Three small Mantine NativeSelect controls:
 * "Session logs" (14 days), "Crash reports retention" (7 days → 30 days), "Audit trails" (365 days).
 * "Apply privacy settings" commits; "Reset all" discards.
 *
 * Success: Crash reports retention = "30"/"30 days", others unchanged, Apply clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, NativeSelect, Button, Group, Stack, MantineProvider, Box } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const retentionOptions = [
  { label: '7 days', value: '7' },
  { label: '14 days', value: '14' },
  { label: '30 days', value: '30' },
  { label: '90 days', value: '90' },
  { label: '180 days', value: '180' },
  { label: '365 days', value: '365' },
];

export default function T33({ onSuccess }: TaskComponentProps) {
  const [sessionLogs, setSessionLogs] = useState('14');
  const [crashReports, setCrashReports] = useState('7');
  const [auditTrails, setAuditTrails] = useState('365');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && crashReports === '30' && sessionLogs === '14' && auditTrails === '365') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, crashReports, sessionLogs, auditTrails, onSuccess]);

  const handleReset = () => {
    setSessionLogs('14');
    setCrashReports('7');
    setAuditTrails('365');
    setApplied(false);
  };

  return (
    <MantineProvider forceColorScheme="dark">
      <Box p="lg" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', minHeight: '80vh' }}>
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 340 }}>
          <Text fw={600} size="lg" mb="md">Privacy Settings</Text>

          <Stack gap="sm">
            <NativeSelect
              data-testid="session-logs"
              data-canonical-type="select_native"
              data-selected-value={sessionLogs}
              label="Session logs"
              value={sessionLogs}
              onChange={(e) => { setSessionLogs(e.target.value); setApplied(false); }}
              data={retentionOptions}
              size="xs"
            />

            <NativeSelect
              data-testid="crash-reports"
              data-canonical-type="select_native"
              data-selected-value={crashReports}
              label="Crash reports retention"
              value={crashReports}
              onChange={(e) => { setCrashReports(e.target.value); setApplied(false); }}
              data={retentionOptions}
              size="xs"
            />

            <NativeSelect
              data-testid="audit-trails"
              data-canonical-type="select_native"
              data-selected-value={auditTrails}
              label="Audit trails"
              value={auditTrails}
              onChange={(e) => { setAuditTrails(e.target.value); setApplied(false); }}
              data={retentionOptions}
              size="xs"
            />
          </Stack>

          <Group mt="md" gap="sm">
            <Button size="xs" onClick={() => setApplied(true)}>Apply privacy settings</Button>
            <Button size="xs" variant="outline" onClick={handleReset}>Reset all</Button>
          </Group>
        </Card>
      </Box>
    </MantineProvider>
  );
}
