'use client';

/**
 * date_picker_single-mantine-v2-T10: Go-live date vs presets + reference (high-contrast panel)
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Group, Button, Box } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [freeze, setFreeze] = useState<Date | null>(dayjs('2027-02-01').toDate());
  const [goLive, setGoLive] = useState<Date | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (
      saved &&
      goLive &&
      dayjs(goLive).format('YYYY-MM-DD') === '2027-02-14' &&
      freeze &&
      dayjs(freeze).format('YYYY-MM-DD') === '2027-02-01'
    ) {
      onSuccess();
    }
  }, [saved, goLive, freeze, onSuccess]);

  const preset = (d: Date) => () => setGoLive(d);

  return (
    <Card
      padding="md"
      radius="md"
      withBorder
      maw={480}
      style={{
        background: '#000',
        borderColor: '#ff0',
        borderWidth: 2,
        color: '#fff',
      }}
    >
      <Text fw={700} mb="md" c="yellow" size="lg">
        Launch panel
      </Text>
      <Group gap="xs" mb="md" wrap="wrap">
        <Button size="compact-xs" variant="outline" color="yellow" onClick={preset(dayjs().add(1, 'day').toDate())}>
          Tomorrow
        </Button>
        <Button size="compact-xs" variant="outline" color="yellow" onClick={preset(dayjs().add(1, 'week').toDate())}>
          Next week
        </Button>
        <Button size="compact-xs" variant="outline" color="yellow" onClick={preset(dayjs().endOf('month').toDate())}>
          End of month
        </Button>
      </Group>
      <Box
        data-testid="go-live-reference"
        mb="lg"
        p="md"
        style={{
          border: '2px solid #0ff',
          borderRadius: 8,
          textAlign: 'center',
          background: '#0a0a0a',
        }}
      >
        <Text size="xs" c="dimmed" tt="uppercase">
          Target window
        </Text>
        <Text fw={800} style={{ fontSize: 36, lineHeight: 1.1, color: '#0ff' }}>
          14
        </Text>
        <Text fw={600} size="sm">
          February
        </Text>
        <Text size="xs" c="dimmed">
          2027
        </Text>
      </Box>
      <Stack gap="md">
        <div>
          <Text component="label" fw={600} size="sm" mb={4} style={{ display: 'block' }} c="yellow">
            Freeze date
          </Text>
          <DatePickerInput
            value={freeze}
            onChange={setFreeze}
            valueFormat="YYYY-MM-DD"
            size="xs"
            data-testid="freeze-date"
            readOnly
          />
        </div>
        <div>
          <Text component="label" fw={600} size="sm" mb={4} style={{ display: 'block' }} c="yellow">
            Go-live date
          </Text>
          <DatePickerInput
            value={goLive}
            onChange={setGoLive}
            valueFormat="YYYY-MM-DD"
            placeholder="Select date"
            size="xs"
            data-testid="go-live-date"
          />
        </div>
        <Button color="yellow" c="black" data-testid="save-panel" onClick={() => setSaved(true)}>
          Save panel
        </Button>
      </Stack>
    </Card>
  );
}
