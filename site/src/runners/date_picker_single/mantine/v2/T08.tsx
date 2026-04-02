'use client';

/**
 * date_picker_single-mantine-v2-T08: Launch date modal DatePickerInput + Save schedule
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, SegmentedControl, Switch, Group, Badge, Button } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [launch, setLaunch] = useState<Date | null>(null);
  const [retire, setRetire] = useState<Date | null>(new Date(2036, 2, 1));
  const [saved, setSaved] = useState(false);
  const [channel, setChannel] = useState('stable');
  const [beta, setBeta] = useState(false);

  useEffect(() => {
    if (
      saved &&
      launch &&
      dayjs(launch).format('YYYY-MM-DD') === '2035-11-23' &&
      retire &&
      dayjs(retire).format('YYYY-MM-DD') === '2036-03-01'
    ) {
      onSuccess();
    }
  }, [saved, launch, retire, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder maw={480}>
      <Group gap="xs" mb="md" wrap="wrap">
        <Badge>Release</Badge>
        <Badge color="blue" variant="light">
          Train
        </Badge>
        <SegmentedControl size="xs" value={channel} onChange={setChannel} data={['stable', 'canary']} />
        <Switch size="xs" label="Beta" checked={beta} onChange={(e) => setBeta(e.currentTarget.checked)} />
      </Group>
      <Text fw={600} mb="sm" size="sm">
        Schedule
      </Text>
      <Stack gap="md">
        <div>
          <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Launch date
          </Text>
          <DatePickerInput
            value={launch}
            onChange={setLaunch}
            valueFormat="YYYY-MM-DD"
            placeholder="Select date"
            dropdownType="modal"
            data-testid="launch-date"
          />
        </div>
        <div>
          <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Retire date
          </Text>
          <DatePickerInput
            value={retire}
            onChange={setRetire}
            valueFormat="YYYY-MM-DD"
            data-testid="retire-date"
            readOnly
          />
        </div>
        <Button data-testid="save-schedule" onClick={() => setSaved(true)}>
          Save schedule
        </Button>
      </Stack>
    </Card>
  );
}
