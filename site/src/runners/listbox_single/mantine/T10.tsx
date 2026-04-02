'use client';

/**
 * listbox_single-mantine-T10: Three filters: set Notifications to Mentions only
 *
 * Scene: light theme, comfortable spacing, isolated_card layout, placed at center of the viewport.
 * Component scale is default. Page contains 3 instance(s) of this listbox type; guidance is mixed; clutter is none.
 * A centered isolated card titled "Notification filters" contains three compact NavLink-based listboxes stacked
 * vertically, each with a label above it. (1) "Notifications" options: "All activity", "Mentions only", "None"
 * (initial: "All activity"). (2) "Digest" options: "Off", "Daily", "Weekly" (initial: "Weekly").
 * (3) "Channel" options: "Email", "Push", "SMS" (initial: "Email"). Above the first list, a helper line reads:
 * "Choose the option that limits alerts to mentions." This provides mixed guidance (text hint + the visible option
 * label). The task targets the listbox labeled "Notifications".
 *
 * Success: Selected option value equals: mentions_only (in Notifications)
 * require_correct_instance: true
 */

import React, { useState } from 'react';
import { Card, Text, NavLink, Stack, Divider } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const notificationOptions = [
  { value: 'all_activity', label: 'All activity' },
  { value: 'mentions_only', label: 'Mentions only' },
  { value: 'none', label: 'None' },
];

const digestOptions = [
  { value: 'off', label: 'Off' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
];

const channelOptions = [
  { value: 'email', label: 'Email' },
  { value: 'push', label: 'Push' },
  { value: 'sms', label: 'SMS' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [notifications, setNotifications] = useState<string>('all_activity');
  const [digest, setDigest] = useState<string>('weekly');
  const [channel, setChannel] = useState<string>('email');

  const handleNotificationsSelect = (value: string) => {
    setNotifications(value);
    if (value === 'mentions_only') {
      onSuccess();
    }
  };

  const handleDigestSelect = (value: string) => {
    setDigest(value);
  };

  const handleChannelSelect = (value: string) => {
    setChannel(value);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 360 }}>
      <Text fw={600} size="lg" mb="xs">Notification filters</Text>
      <Text size="sm" c="dimmed" mb="md">
        Choose the option that limits alerts to mentions.
      </Text>

      {/* Notifications listbox */}
      <Text fw={500} size="sm" mb="xs">Notifications</Text>
      <Stack
        gap="xs"
        data-cb-listbox-root
        data-cb-instance="notifications"
        data-cb-selected-value={notifications}
        role="listbox"
        mb="md"
      >
        {notificationOptions.map(opt => (
          <NavLink
            key={opt.value}
            label={opt.label}
            active={notifications === opt.value}
            onClick={() => handleNotificationsSelect(opt.value)}
            data-cb-option-value={opt.value}
            role="option"
            aria-selected={notifications === opt.value}
          />
        ))}
      </Stack>

      <Divider my="sm" />

      {/* Digest listbox */}
      <Text fw={500} size="sm" mb="xs">Digest</Text>
      <Stack
        gap="xs"
        data-cb-listbox-root
        data-cb-instance="digest"
        data-cb-selected-value={digest}
        role="listbox"
        mb="md"
      >
        {digestOptions.map(opt => (
          <NavLink
            key={opt.value}
            label={opt.label}
            active={digest === opt.value}
            onClick={() => handleDigestSelect(opt.value)}
            data-cb-option-value={opt.value}
            role="option"
            aria-selected={digest === opt.value}
          />
        ))}
      </Stack>

      <Divider my="sm" />

      {/* Channel listbox */}
      <Text fw={500} size="sm" mb="xs">Channel</Text>
      <Stack
        gap="xs"
        data-cb-listbox-root
        data-cb-instance="channel"
        data-cb-selected-value={channel}
        role="listbox"
      >
        {channelOptions.map(opt => (
          <NavLink
            key={opt.value}
            label={opt.label}
            active={channel === opt.value}
            onClick={() => handleChannelSelect(opt.value)}
            data-cb-option-value={opt.value}
            role="option"
            aria-selected={channel === opt.value}
          />
        ))}
      </Stack>
    </Card>
  );
}
