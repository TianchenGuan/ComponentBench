'use client';

/**
 * date_picker_range-mantine-v2-T18: Same-day outage window using allowSingleDateInRange
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Stack, Group, Badge, Button, Switch } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../../types';

const REVIEW_FIXED: [Date, Date] = [new Date(2027, 4, 3), new Date(2027, 4, 9)];

export default function T18({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const [reviewValue] = useState<[Date | null, Date | null]>(REVIEW_FIXED);
  const [outageValue, setOutageValue] = useState<[Date | null, Date | null]>([null, null]);
  const [saved, setSaved] = useState(false);
  const [autoRestart, setAutoRestart] = useState(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved &&
      outageValue[0] &&
      outageValue[1] &&
      dayjs(outageValue[0]).format('YYYY-MM-DD') === '2027-05-12' &&
      dayjs(outageValue[1]).format('YYYY-MM-DD') === '2027-05-12' &&
      dayjs(reviewValue[0]!).format('YYYY-MM-DD') === '2027-05-03' &&
      dayjs(reviewValue[1]!).format('YYYY-MM-DD') === '2027-05-09'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, outageValue, reviewValue, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder maw={520}>
      <Group gap="xs" mb="md" wrap="wrap">
        <Badge>Maintenance</Badge>
        <Badge color="red" variant="light">Outage</Badge>
        <Switch
          size="xs"
          label="Auto-restart"
          checked={autoRestart}
          onChange={(e) => setAutoRestart(e.currentTarget.checked)}
        />
      </Group>

      <Text fw={600} mb="sm" size="sm">Maintenance Panel</Text>

      <Stack gap="md">
        <div>
          <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Review window
          </Text>
          <DatePickerInput
            type="range"
            value={reviewValue}
            valueFormat="YYYY-MM-DD"
            data-testid="review-window-range"
            readOnly
          />
        </div>

        <div>
          <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Outage window
          </Text>
          <DatePickerInput
            type="range"
            value={outageValue}
            onChange={setOutageValue}
            valueFormat="YYYY-MM-DD"
            placeholder="Pick dates range"
            allowSingleDateInRange
            data-testid="outage-window-range"
            defaultDate={new Date(2027, 4, 1)}
          />
          <Text size="xs" c="dimmed" mt={4}>
            Same-day ranges are allowed for single-day outages
          </Text>
        </div>

        <Button
          data-testid="save-maintenance"
          onClick={() => setSaved(true)}
        >
          Save maintenance
        </Button>
      </Stack>
    </Card>
  );
}
