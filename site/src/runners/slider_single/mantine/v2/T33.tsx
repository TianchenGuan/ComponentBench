'use client';

/**
 * slider_single-mantine-v2-T33: Notification tuning drawer — Secondary=4 + Apply
 */

import React, { useEffect, useState } from 'react';
import { Button, Card, Drawer, Group, Slider, Stack, Text, TextInput } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const marks = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];

export default function T33({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [primaryAlert, setPrimaryAlert] = useState(2);
  const [secondaryAlert, setSecondaryAlert] = useState(1);
  const [appliedPrimary, setAppliedPrimary] = useState(2);
  const [appliedSecondary, setAppliedSecondary] = useState(1);

  useEffect(() => {
    if (appliedSecondary === 4 && appliedPrimary === 2) {
      onSuccess();
    }
  }, [appliedPrimary, appliedSecondary, onSuccess]);

  const open = () => {
    setPrimaryAlert(appliedPrimary);
    setSecondaryAlert(appliedSecondary);
    setDrawerOpen(true);
  };

  const apply = () => {
    setAppliedPrimary(primaryAlert);
    setAppliedSecondary(secondaryAlert);
    setDrawerOpen(false);
  };

  const cancel = () => {
    setPrimaryAlert(appliedPrimary);
    setSecondaryAlert(appliedSecondary);
    setDrawerOpen(false);
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 380 }}>
      <Text fw={600} size="sm" mb="xs">
        Alerts overview
      </Text>
      <Group gap="xs" mb="sm">
        <TextInput size="xs" placeholder="Filter channels…" style={{ flex: 1 }} />
        <Button size="xs" variant="light">
          Mute all
        </Button>
      </Group>
      <Text c="dimmed" size="xs" mb="sm">
        Primary: {appliedPrimary} · Secondary: {appliedSecondary}
      </Text>
      <Button size="sm" onClick={open} data-testid="btn-notification-tuning">
        Notification tuning
      </Button>

      <Drawer opened={drawerOpen} onClose={cancel} title="Notification tuning" position="right" size="md">
        <Stack gap="md" pb={72}>
          <Text size="xs" c="dimmed">
            Adjust per-channel urgency. Changes apply only after you confirm.
          </Text>
          <div>
            <Text fw={500} size="sm" mb="xs">
              Primary alert level
            </Text>
            <Slider
              value={primaryAlert}
              onChange={setPrimaryAlert}
              min={1}
              max={5}
              step={1}
              marks={marks}
              data-testid="slider-alert-primary"
            />
            <Text c="dimmed" size="xs" mt={4}>
              Current: {primaryAlert}
            </Text>
          </div>
          <div>
            <Text fw={500} size="sm" mb="xs">
              Secondary alert level
            </Text>
            <Slider
              value={secondaryAlert}
              onChange={setSecondaryAlert}
              min={1}
              max={5}
              step={1}
              marks={marks}
              data-testid="slider-alert-secondary"
            />
            <Text c="dimmed" size="xs" mt={4}>
              Current: {secondaryAlert}
            </Text>
          </div>
        </Stack>
        <Group justify="flex-end" gap="xs" style={{ position: 'absolute', bottom: 16, right: 16, left: 16 }}>
          <Button variant="default" size="xs" onClick={cancel}>
            Cancel
          </Button>
          <Button size="xs" onClick={apply} data-testid="btn-apply-notification-changes">
            Apply changes
          </Button>
        </Group>
      </Drawer>
    </Card>
  );
}
