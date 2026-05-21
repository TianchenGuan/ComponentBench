'use client';

/**
 * date_input_text-mantine-T09: Mantine match reference date among three inputs and apply
 * 
 * Layout: dashboard scene anchored at the top-right of the viewport.
 * Theme: dark.
 * Components: three Mantine DateInput fields in a panel titled "Maintenance windows":
 *   - "Primary window" (pre-filled with 2026-10-01)
 *   - "Secondary window" (empty)
 *   - "Fallback window" (pre-filled with 2026-10-15)
 * Visual reference: a prominent "Reference banner" above the panel shows the target date in large type:
 *   "OCT 05 2026"
 * Clutter (medium): the dashboard includes a small status chart placeholder and two filter chips; not required.
 * Confirmation: a sticky action bar at the bottom of the panel has "Reset" and a primary button "Apply schedule". Changes are only persisted after "Apply schedule".
 * Feedback: after Apply, a toast "Schedule applied" appears and the sticky bar collapses.
 * 
 * Success: The "Secondary window" DateInput value equals the reference date 2026-10-05 AND user clicked "Apply schedule".
 */

import React, { useState, useRef } from 'react';
import { Card, Text, Button, Group, Badge, Stack, Box, Notification } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [primaryWindow, setPrimaryWindow] = useState<Date | null>(new Date('2026-10-01'));
  const [secondaryWindow, setSecondaryWindow] = useState<Date | null>(null);
  const [fallbackWindow, setFallbackWindow] = useState<Date | null>(new Date('2026-10-15'));
  const [applied, setApplied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const successTriggered = useRef(false);

  const handleApply = () => {
    if (secondaryWindow && dayjs(secondaryWindow).format('YYYY-MM-DD') === '2026-10-05' && !successTriggered.current) {
      successTriggered.current = true;
      setApplied(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      onSuccess();
    } else {
      setApplied(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleReset = () => {
    setPrimaryWindow(new Date('2026-10-01'));
    setSecondaryWindow(null);
    setFallbackWindow(new Date('2026-10-15'));
    setApplied(false);
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
      {/* Toast notification */}
      {showToast && (
        <Notification
          color="green"
          title="Success"
          style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}
          onClose={() => setShowToast(false)}
        >
          Schedule applied
        </Notification>
      )}

      {/* Reference Banner */}
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 360 }}>
        <Box
          data-testid="reference-banner"
          style={{
            textAlign: 'center',
            padding: 16,
            border: '3px solid #228be6',
            borderRadius: 8,
            backgroundColor: '#f8f9fa',
          }}
        >
          <Text size="xs" c="dimmed" mb={4}>REFERENCE BANNER</Text>
          <Text size="xl" fw={700} c="blue" style={{ letterSpacing: 2 }}>
            OCT 05 2026
          </Text>
        </Box>
      </Card>

      {/* Main Panel */}
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 360 }}>
        <Text fw={600} size="lg" mb="md">Maintenance windows</Text>

        <Stack gap="md">
          <div>
            <Text component="label" htmlFor="primary-window" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
              Primary window
            </Text>
            <DateInput
              id="primary-window"
              value={primaryWindow}
              onChange={setPrimaryWindow}
              valueFormat="YYYY-MM-DD"
              placeholder="YYYY-MM-DD"
              data-testid="primary-window"
            />
          </div>

          <div>
            <Text component="label" htmlFor="secondary-window" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
              Secondary window
            </Text>
            <DateInput
              id="secondary-window"
              value={secondaryWindow}
              onChange={setSecondaryWindow}
              valueFormat="YYYY-MM-DD"
              placeholder="YYYY-MM-DD"
              data-testid="secondary-window"
            />
          </div>

          <div>
            <Text component="label" htmlFor="fallback-window" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
              Fallback window
            </Text>
            <DateInput
              id="fallback-window"
              value={fallbackWindow}
              onChange={setFallbackWindow}
              valueFormat="YYYY-MM-DD"
              placeholder="YYYY-MM-DD"
              data-testid="fallback-window"
            />
          </div>

          {/* Filter chips (distractors) */}
          <Group gap="xs">
            <Badge variant="light">Q4 2026</Badge>
            <Badge variant="light">All Servers</Badge>
          </Group>

          {/* Chart placeholder (distractor) */}
          <Box
            style={{
              height: 60,
              backgroundColor: '#f1f3f5',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text size="xs" c="dimmed">Status chart placeholder</Text>
          </Box>

          {/* Action bar */}
          {!applied && (
            <Group justify="flex-end" mt="md" pt="md" style={{ borderTop: '1px solid #e9ecef' }}>
              <Button variant="subtle" onClick={handleReset}>
                Reset
              </Button>
              <Button onClick={handleApply} data-testid="apply-schedule">
                Apply schedule
              </Button>
            </Group>
          )}
        </Stack>
      </Card>
    </Box>
  );
}
