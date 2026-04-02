'use client';

/**
 * select_native-mantine-T09: Scroll to Log level and set to Warn
 *
 * Layout: a settings panel with internal scrolling (the panel content is longer than the viewport).
 * Sections include "General", "Editor", and "Diagnostics" with various toggles and read-only fields as clutter.
 *
 * The target is a Mantine NativeSelect labeled "Log level" located in the "Diagnostics" section near the bottom.
 * Options (label → value):
 * - Trace → trace
 * - Debug → debug
 * - Info → info
 * - Warn → warn  ← TARGET
 * - Error → error
 *
 * Initial state: Info is selected.
 * Clutter: medium — nearby toggles like "Enable telemetry" and "Show debug overlay" are present but irrelevant.
 * Feedback: immediate; no Save/Apply.
 *
 * Success: The target native select has selected option value 'warn' (label 'Warn').
 */

import React, { useState } from 'react';
import { Card, Text, NativeSelect, TextInput, Switch, Stack, Divider, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const logLevelOptions = [
  { label: 'Trace', value: 'trace' },
  { label: 'Debug', value: 'debug' },
  { label: 'Info', value: 'info' },
  { label: 'Warn', value: 'warn' },
  { label: 'Error', value: 'error' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [logLevel, setLogLevel] = useState<string>('info');
  const [telemetry, setTelemetry] = useState(true);
  const [debugOverlay, setDebugOverlay] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [lineNumbers, setLineNumbers] = useState(true);

  const handleLogLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setLogLevel(value);
    if (value === 'warn') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450, maxHeight: 400, overflow: 'auto' }}>
      <Text fw={600} size="lg" mb="md">Settings</Text>

      {/* General Section */}
      <Box mb="md">
        <Text fw={500} size="sm" c="blue" mb="sm">General</Text>
        <Stack gap="sm">
          <TextInput
            label="Display name"
            defaultValue="Developer"
            size="sm"
          />
          <TextInput
            label="Workspace path"
            defaultValue="/home/user/projects"
            size="sm"
            readOnly
          />
        </Stack>
      </Box>

      <Divider my="md" />

      {/* Editor Section */}
      <Box mb="md">
        <Text fw={500} size="sm" c="blue" mb="sm">Editor</Text>
        <Stack gap="sm">
          <Switch
            label="Auto-save"
            checked={autoSave}
            onChange={(e) => setAutoSave(e.currentTarget.checked)}
          />
          <Switch
            label="Show line numbers"
            checked={lineNumbers}
            onChange={(e) => setLineNumbers(e.currentTarget.checked)}
          />
        </Stack>
      </Box>

      <Divider my="md" />

      {/* Diagnostics Section - TARGET */}
      <Box>
        <Text fw={500} size="sm" c="blue" mb="sm">Diagnostics</Text>
        <Stack gap="sm">
          <Switch
            label="Enable telemetry"
            checked={telemetry}
            onChange={(e) => setTelemetry(e.currentTarget.checked)}
          />
          <Switch
            label="Show debug overlay"
            checked={debugOverlay}
            onChange={(e) => setDebugOverlay(e.currentTarget.checked)}
          />
          <NativeSelect
            data-testid="log-level-select"
            data-canonical-type="select_native"
            data-selected-value={logLevel}
            label="Log level"
            value={logLevel}
            onChange={handleLogLevelChange}
            data={logLevelOptions}
            size="sm"
          />
        </Stack>
      </Box>
    </Card>
  );
}
