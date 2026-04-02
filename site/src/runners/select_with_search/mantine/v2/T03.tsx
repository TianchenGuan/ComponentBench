'use client';

/**
 * select_with_search-mantine-v2-T03: Top-position dropdown in compact corner card
 *
 * Small card at bottom-right. One searchable Mantine Select "Time zone" with
 * comboboxProps={{ position: 'top', middlewares: { flip: false } }}.
 * Options: UTC+05:30 — Kolkata, UTC+05:45 — Kathmandu, UTC+06:00 — Dhaka,
 * UTC+05:00 — Karachi. Initial: UTC+00:00 — UTC.
 * "Apply timezone" commits.
 * Success: Time zone = "UTC+05:45 — Kathmandu", Apply timezone clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Select, Button, Badge, Group } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const timezoneOptions = [
  'UTC-12:00 — Baker Island',
  'UTC-11:00 — Pago Pago',
  'UTC-10:00 — Honolulu',
  'UTC-09:30 — Marquesas Islands',
  'UTC-09:00 — Anchorage',
  'UTC-08:00 — Los Angeles',
  'UTC-07:00 — Denver',
  'UTC-06:00 — Chicago',
  'UTC-05:00 — New York',
  'UTC-04:00 — Santiago',
  'UTC-03:30 — St. John\'s',
  'UTC-03:00 — São Paulo',
  'UTC-02:00 — South Georgia',
  'UTC-01:00 — Azores',
  'UTC+00:00 — UTC',
  'UTC+00:00 — Reykjavik',
  'UTC+01:00 — London (BST)',
  'UTC+01:00 — Lagos',
  'UTC+02:00 — Berlin',
  'UTC+02:00 — Cairo',
  'UTC+02:00 — Johannesburg',
  'UTC+03:00 — Moscow',
  'UTC+03:00 — Nairobi',
  'UTC+03:30 — Tehran',
  'UTC+04:00 — Dubai',
  'UTC+04:00 — Baku',
  'UTC+04:30 — Kabul',
  'UTC+05:00 — Karachi',
  'UTC+05:00 — Tashkent',
  'UTC+05:30 — Kolkata',
  'UTC+05:30 — Colombo',
  'UTC+05:45 — Kathmandu',
  'UTC+06:00 — Dhaka',
  'UTC+06:00 — Almaty',
  'UTC+06:30 — Yangon',
  'UTC+07:00 — Bangkok',
  'UTC+07:00 — Jakarta',
  'UTC+08:00 — Singapore',
  'UTC+08:00 — Shanghai',
  'UTC+08:00 — Perth',
  'UTC+08:45 — Eucla',
  'UTC+09:00 — Tokyo',
  'UTC+09:00 — Seoul',
  'UTC+09:30 — Adelaide',
  'UTC+10:00 — Sydney',
  'UTC+10:00 — Guam',
  'UTC+10:30 — Lord Howe Island',
  'UTC+11:00 — Noumea',
  'UTC+12:00 — Auckland',
  'UTC+12:45 — Chatham Islands',
  'UTC+13:00 — Apia',
  'UTC+14:00 — Kiritimati',
].map((tz) => ({ value: tz, label: tz }));

export default function T03({ onSuccess }: TaskComponentProps) {
  const [timezone, setTimezone] = useState<string | null>('UTC+00:00 — UTC');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && timezone === 'UTC+05:45 — Kathmandu') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, timezone, onSuccess]);

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', minHeight: '80vh' }}>
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 300 }}>
        <Text fw={600} size="sm" mb="sm">Time Zone</Text>

        <Select
          label="Time zone"
          searchable
          size="xs"
          data={timezoneOptions}
          value={timezone}
          onChange={(val) => { setTimezone(val); setApplied(false); }}
          comboboxProps={{ position: 'top', middlewares: { flip: false } }}
          mb="sm"
        />

        <Group gap="xs" mb="sm">
          <Badge size="xs" variant="light">Format: 24h</Badge>
          <Badge size="xs" variant="outline">DST: Auto</Badge>
        </Group>

        <Button size="xs" fullWidth onClick={() => setApplied(true)}>
          Apply timezone
        </Button>
      </Card>
    </div>
  );
}
