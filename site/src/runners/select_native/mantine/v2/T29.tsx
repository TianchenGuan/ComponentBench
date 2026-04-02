'use client';

/**
 * select_native-mantine-v2-T29: Diagnostics panel — scroll to Log level, set Warn, and apply
 *
 * Tall diagnostics panel as its own internal scroll region. Top sections contain multiple
 * toggles and read-only fields. Near bottom, "Diagnostics" section has Mantine NativeSelect
 * "Log level" (Trace/Debug/Info/Warn/Error, starts Info). "Apply diagnostics" commits.
 *
 * Success: Log level = "warn"/"Warn", Apply diagnostics clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, NativeSelect, Button, Switch, TextInput, Divider, Stack, Box } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const logLevelOptions = [
  { label: 'Trace', value: 'trace' },
  { label: 'Debug', value: 'debug' },
  { label: 'Info', value: 'info' },
  { label: 'Warn', value: 'warn' },
  { label: 'Error', value: 'error' },
];

export default function T29({ onSuccess }: TaskComponentProps) {
  const [logLevel, setLogLevel] = useState('info');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && logLevel === 'warn') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, logLevel, onSuccess]);

  return (
    <Box p="lg" style={{ display: 'flex', justifyContent: 'center' }}>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{ width: 480, maxHeight: 520, overflow: 'auto' }}
        data-testid="diagnostics-panel"
      >
        <Text fw={600} size="lg" mb="md">System Settings</Text>

        {/* Filler: General */}
        <Text fw={500} size="sm" mt="sm">General</Text>
        <Divider mb="xs" />
        <Stack gap="xs">
          <Switch label="Enable telemetry" defaultChecked />
          <Switch label="Crash reporting" defaultChecked />
          <Switch label="Usage analytics" />
          <TextInput label="Instance name" size="sm" defaultValue="prod-us-east-1" readOnly />
          <TextInput label="Version" size="sm" defaultValue="3.14.2" readOnly />
        </Stack>

        {/* Filler: Network */}
        <Text fw={500} size="sm" mt="lg">Network</Text>
        <Divider mb="xs" />
        <Stack gap="xs">
          <Switch label="Proxy enabled" />
          <TextInput label="Proxy URL" size="sm" defaultValue="https://proxy.internal" readOnly />
          <Switch label="TLS verification" defaultChecked />
          <Switch label="HTTP/2" defaultChecked />
        </Stack>

        {/* Filler: Storage */}
        <Text fw={500} size="sm" mt="lg">Storage</Text>
        <Divider mb="xs" />
        <Stack gap="xs">
          <Switch label="Compression" defaultChecked />
          <Switch label="Deduplication" />
          <TextInput label="Max disk usage" size="sm" defaultValue="500 GB" readOnly />
        </Stack>

        {/* Target section */}
        <Text fw={500} size="sm" mt="lg">Diagnostics</Text>
        <Divider mb="xs" />
        <NativeSelect
          data-testid="log-level"
          data-canonical-type="select_native"
          data-selected-value={logLevel}
          label="Log level"
          value={logLevel}
          onChange={(e) => { setLogLevel(e.target.value); setApplied(false); }}
          data={logLevelOptions}
        />

        <Button mt="md" mb="sm" onClick={() => setApplied(true)}>Apply diagnostics</Button>
      </Card>
    </Box>
  );
}
