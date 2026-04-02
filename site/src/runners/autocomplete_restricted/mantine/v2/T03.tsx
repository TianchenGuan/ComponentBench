'use client';

/**
 * autocomplete_restricted-mantine-v2-T03
 *
 * Dashboard routing card with three searchable Mantine Selects sharing the same options.
 * withCheckIcon={false} removes the active-option check mark from the dropdown.
 * Success: On-call team = Platform Core, Primary team stays Payments,
 *          Escalation team stays Infra, Apply routing clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Text, Select, Button, Stack, Badge, Group } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const teamOptions = [
  { label: 'Platform Core', value: 'Platform Core' },
  { label: 'Platform Ops', value: 'Platform Ops' },
  { label: 'Product Infra', value: 'Product Infra' },
  { label: 'Payments', value: 'Payments' },
  { label: 'Infra', value: 'Infra' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [primaryTeam, setPrimaryTeam] = useState<string | null>('Payments');
  const [onCallTeam, setOnCallTeam] = useState<string | null>(null);
  const [escalationTeam, setEscalationTeam] = useState<string | null>('Infra');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      applied &&
      onCallTeam === 'Platform Core' &&
      primaryTeam === 'Payments' &&
      escalationTeam === 'Infra'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, onCallTeam, primaryTeam, escalationTeam, onSuccess]);

  return (
    <div style={{ display: 'flex', padding: 24, paddingLeft: 80 }}>
      <div style={{ width: 440 }}>
        <Group mb="sm" gap="xs">
          <Badge color="blue" variant="light">Active</Badge>
          <Badge color="gray" variant="light">v3.2</Badge>
          <Text size="xs" c="dimmed">Last updated 2 hours ago</Text>
        </Group>

        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={600} size="lg" mb="sm">Routing</Text>

          <Stack gap="sm">
            <Text fw={500} size="sm">Primary team</Text>
            <Select
              size="sm"
              placeholder="Select team"
              data={teamOptions}
              value={primaryTeam}
              onChange={(v) => { setPrimaryTeam(v); setApplied(false); }}
              searchable
              withCheckIcon={false}
            />

            <Text fw={500} size="sm">On-call team</Text>
            <Select
              size="sm"
              placeholder="Select team"
              data={teamOptions}
              value={onCallTeam}
              onChange={(v) => { setOnCallTeam(v); setApplied(false); }}
              searchable
              withCheckIcon={false}
            />

            <Text fw={500} size="sm">Escalation team</Text>
            <Select
              size="sm"
              placeholder="Select team"
              data={teamOptions}
              value={escalationTeam}
              onChange={(v) => { setEscalationTeam(v); setApplied(false); }}
              searchable
              withCheckIcon={false}
            />

            <Button size="sm" mt="xs" onClick={() => setApplied(true)}>
              Apply routing
            </Button>
          </Stack>
        </Card>
      </div>
    </div>
  );
}
