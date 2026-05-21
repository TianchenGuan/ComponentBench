'use client';

/**
 * slider_single-mantine-T07: Set Secondary alert level to 4 and Apply (dark drawer)
 * 
 * Layout: drawer_flow in dark theme. The main page shows a "Notifications" card with a button "Open notification tuning".
 * Clicking the button opens a right-side Mantine Drawer overlay (default size).
 * Inside the drawer are TWO Mantine Sliders stacked vertically:
 *   - "Primary alert level" (range 1–5, step=1)
 *   - "Secondary alert level" (range 1–5, step=1)
 * Spacing and scale are defaults; the two sliders are visually similar and close together.
 * Initial state: Primary=3, Secondary=2.
 * Feedback: the label bubble appears while dragging; a small text line under each slider shows "Current: X" after release.
 * A sticky drawer footer contains "Apply changes" and "Cancel". Values are not committed to the main page until Apply changes is clicked.
 * 
 * Success: The 'Secondary alert level' slider value equals 4. The drawer footer button labeled 'Apply changes' must be clicked to commit. The correct instance is required: only the Secondary slider counts.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Slider, Button, Drawer, Group, Stack, MantineProvider } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const marks = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [primaryAlert, setPrimaryAlert] = useState(3);
  const [secondaryAlert, setSecondaryAlert] = useState(2);
  const [appliedPrimary, setAppliedPrimary] = useState(3);
  const [appliedSecondary, setAppliedSecondary] = useState(2);

  useEffect(() => {
    if (appliedSecondary === 4) {
      onSuccess();
    }
  }, [appliedSecondary, onSuccess]);

  const handleOpen = () => {
    setPrimaryAlert(3);
    setSecondaryAlert(2);
    setDrawerOpen(true);
  };

  const handleApply = () => {
    setAppliedPrimary(primaryAlert);
    setAppliedSecondary(secondaryAlert);
    setDrawerOpen(false);
  };

  const handleCancel = () => {
    setPrimaryAlert(appliedPrimary);
    setSecondaryAlert(appliedSecondary);
    setDrawerOpen(false);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
        <Text fw={600} size="lg" mb="md">Notifications</Text>
        <Text c="dimmed" size="sm" mb="md">
          Primary: {appliedPrimary} | Secondary: {appliedSecondary}
        </Text>
        <Button onClick={handleOpen} data-testid="btn-open-notification-drawer">
          Open notification tuning
        </Button>
      </Card>

      <MantineProvider forceColorScheme="dark">
        <Drawer
          opened={drawerOpen}
          onClose={handleCancel}
          title="Notification Tuning"
          position="right"
          size="md"
        >
          <Stack gap="xl" style={{ height: 'calc(100% - 60px)' }}>
            <div>
              <Text fw={500} size="sm" mb="md">Primary alert level</Text>
              <Slider
                value={primaryAlert}
                onChange={setPrimaryAlert}
                min={1}
                max={5}
                step={1}
                marks={marks}
                data-testid="slider-alert-primary"
                mb="xs"
              />
              <Text c="dimmed" size="xs">Current: {primaryAlert}</Text>
            </div>

            <div>
              <Text fw={500} size="sm" mb="md">Secondary alert level</Text>
              <Slider
                value={secondaryAlert}
                onChange={setSecondaryAlert}
                min={1}
                max={5}
                step={1}
                marks={marks}
                data-testid="slider-alert-secondary"
                mb="xs"
              />
              <Text c="dimmed" size="xs">Current: {secondaryAlert}</Text>
            </div>
          </Stack>

          <Group justify="flex-end" mt="xl" style={{ position: 'absolute', bottom: 20, right: 20, left: 20 }}>
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleApply} data-testid="btn-apply-alert-levels">Apply changes</Button>
          </Group>
        </Drawer>
      </MantineProvider>
    </>
  );
}
