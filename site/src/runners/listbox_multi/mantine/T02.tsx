'use client';

/**
 * listbox_multi-mantine-T02: SMS topics selection (second group)
 *
 * Layout: settings_panel centered with a header "Notifications".
 * Two Mantine Checkbox.Group listboxes are shown (instances=2):
 *   - "Email topics" (left) with several newsletter-type options (some preselected).
 *   - "SMS topics" (right) with options: Delivery updates, Appointment reminders, Security alerts, Billing reminders.
 * Target is the "SMS topics" group.
 * Initial state: SMS topics has none selected; Email topics has "Weekly newsletter" preselected.
 * No overlays. No scrolling.
 * Clutter: a couple of unrelated toggles ("Enable email", "Enable SMS") appear above the groups.
 *
 * Success: The target listbox (SMS topics) has exactly: Delivery updates, Security alerts.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Checkbox, Stack, Group, Switch, Grid } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const emailOptions = ['Weekly newsletter', 'Product updates', 'Tips and tricks', 'Special offers'];
const smsOptions = ['Delivery updates', 'Appointment reminders', 'Security alerts', 'Billing reminders'];
const targetSet = ['Delivery updates', 'Security alerts'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [emailSelected, setEmailSelected] = useState<string[]>(['Weekly newsletter']);
  const [smsSelected, setSmsSelected] = useState<string[]>([]);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(smsSelected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [smsSelected, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 650 }}>
      <Text fw={600} size="lg" mb="md">
        Notifications
      </Text>
      <Group mb="md">
        <Switch
          label="Enable email"
          checked={emailEnabled}
          onChange={(e) => setEmailEnabled(e.currentTarget.checked)}
        />
        <Switch
          label="Enable SMS"
          checked={smsEnabled}
          onChange={(e) => setSmsEnabled(e.currentTarget.checked)}
        />
      </Group>
      <Text size="sm" c="dimmed" mb="md">
        Notifications: Email topics and SMS topics.
      </Text>
      <Grid>
        <Grid.Col span={6}>
          <Text fw={500} mb="xs">
            Email topics
          </Text>
          <Checkbox.Group
            data-testid="listbox-email-topics"
            value={emailSelected}
            onChange={setEmailSelected}
          >
            <Stack gap="xs">
              {emailOptions.map((opt) => (
                <Checkbox key={opt} value={opt} label={opt} />
              ))}
            </Stack>
          </Checkbox.Group>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text fw={500} mb="xs">
            SMS topics
          </Text>
          <Checkbox.Group
            data-testid="listbox-sms-topics"
            value={smsSelected}
            onChange={setSmsSelected}
          >
            <Stack gap="xs">
              {smsOptions.map((opt) => (
                <Checkbox key={opt} value={opt} label={opt} />
              ))}
            </Stack>
          </Checkbox.Group>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
