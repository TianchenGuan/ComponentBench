'use client';

/**
 * calendar_embedded-mantine-v2-T48: Team B only, global Apply; A/C stay null
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Button, Group, Stack, Badge } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../../types';

const START = new Date(2027, 1, 1);
const TARGET = '2027-05-04';

type Team = 'A' | 'B' | 'C';

export default function T48({ onSuccess }: TaskComponentProps) {
  const [pending, setPending] = useState<Record<Team, Date | null>>({ A: null, B: null, C: null });
  const [applied, setApplied] = useState<Record<Team, Date | null>>({ A: null, B: null, C: null });

  useEffect(() => {
    if (
      applied.B &&
      dayjs(applied.B).format('YYYY-MM-DD') === TARGET &&
      applied.A === null &&
      applied.C === null
    ) {
      onSuccess();
    }
  }, [applied, onSuccess]);

  const apply = () => setApplied({ ...pending });

  const cal = (team: Team, label: string) => (
    <Card key={team} padding="sm" withBorder style={{ flex: 1, minWidth: 200 }} data-testid={`team-card-${team}`}>
      <Text fw={600} size="sm" mb="xs">
        {label}
      </Text>
      <Calendar
        defaultDate={START}
        maxLevel="decade"
        minLevel="month"
        size="sm"
        getDayProps={(date) => ({
          selected: pending[team] ? dayjs(date).isSame(pending[team], 'day') : false,
          onClick: () => setPending((p) => ({ ...p, [team]: date })),
        })}
        data-testid={team === 'B' ? 'calendar-embedded' : `calendar-team-${team}`}
      />
      <Text size="xs" c="dimmed" mt="xs" data-testid={`applied-team-${team}`}>
        Applied: {applied[team] ? dayjs(applied[team]).format('YYYY-MM-DD') : '—'}
      </Text>
    </Card>
  );

  return (
    <Stack gap="md" maw={960} data-testid="quarterly-planning-dashboard">
      <Group justify="space-between" align="flex-start">
        <Text fw={700} size="lg">
          Quarterly planning
        </Text>
        <Group gap="xs">
          <Badge size="sm" color="blue" variant="light">
            FY27 Q2
          </Badge>
          <Badge size="sm" variant="outline">
            Draft
          </Badge>
        </Group>
      </Group>
      <Text size="xs" c="dimmed">
        Status: capacity models refreshed — confirm team commit dates before locking the portfolio view.
      </Text>
      <Group align="flex-start" gap="md" wrap="wrap">
        {cal('A', 'Team A')}
        {cal('B', 'Team B')}
        {cal('C', 'Team C')}
      </Group>
      <Button onClick={apply} data-testid="apply-changes">
        Apply changes
      </Button>
    </Stack>
  );
}
