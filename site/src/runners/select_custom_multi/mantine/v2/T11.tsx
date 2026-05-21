'use client';

/**
 * select_custom_multi-mantine-v2-T11: Approved regions drawer with long dropdown
 *
 * Drawer flow, dark theme, compact spacing, bottom-right placement, medium clutter.
 * "Edit region allowlist" opens a Mantine Drawer containing one Combobox-based multiselect
 * labeled "Approved regions". Dropdown has 60+ region labels with internal scroll (~8 visible).
 * Similar labels: APAC-North, APAC-South, APAC-Southeast, EU-Central, EU-Central-DR, EU-West,
 *                 US-East, US-East-DR, US-West, etc.
 * Initial: [APAC-Southeast, US-East]. Target: [APAC-North, APAC-South, EU-Central, US-East].
 * Drawer-local "Save allowlist" commits the final set.
 *
 * Success: Approved regions = {APAC-North, APAC-South, EU-Central, US-East}, Save allowlist clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, Text, MultiSelect, Button, Drawer, Stack, Group, MantineProvider,
} from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const setsEqual = (a: string[], b: string[]) => {
  const sa = new Set(a);
  const sb = new Set(b);
  return sa.size === sb.size && Array.from(sa).every(v => sb.has(v));
};

const regionOptions: string[] = [];
const prefixes = ['APAC', 'EU', 'US', 'LATAM', 'MEA', 'CA', 'AF', 'ANZ'];
const suffixes = ['North', 'South', 'East', 'West', 'Central', 'Southeast', 'Northwest',
  'North-DR', 'South-DR', 'East-DR', 'West-DR', 'Central-DR'];
for (const p of prefixes) {
  for (const s of suffixes) {
    regionOptions.push(`${p}-${s}`);
  }
}

export default function T11({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [approvedRegions, setApprovedRegions] = useState<string[]>(['APAC-Southeast', 'US-East']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(approvedRegions, ['APAC-North', 'APAC-South', 'EU-Central', 'US-East'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, approvedRegions, onSuccess]);

  const handleSave = () => {
    setSaved(true);
    setDrawerOpen(false);
  };

  return (
    <MantineProvider forceColorScheme="dark">
      <div style={{ padding: 16, background: '#1a1a1a', minHeight: '100vh' }}>
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ maxWidth: 480, background: '#242424' }}>
          <Text fw={600} size="lg" mb="sm" c="white">Region Management</Text>
          <Text size="sm" c="dimmed" mb="md">Configure allowed deployment regions for compliance.</Text>
          <Button variant="outline" onClick={() => setDrawerOpen(true)}>Edit region allowlist</Button>
        </Card>

        <Drawer
          opened={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Edit Region Allowlist"
          position="right"
          size="md"
        >
          <Stack gap="md" style={{ height: '100%' }}>
            <MultiSelect
              label="Approved regions"
              searchable
              clearable
              data={regionOptions}
              value={approvedRegions}
              onChange={(v) => { setApprovedRegions(v); setSaved(false); }}
              placeholder="Select approved regions"
              maxDropdownHeight={200}
            />

            <div style={{ marginTop: 'auto' }}>
              <Group justify="flex-end" gap="sm">
                <Button variant="subtle" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save allowlist</Button>
              </Group>
            </div>
          </Stack>
        </Drawer>
      </div>
    </MantineProvider>
  );
}
