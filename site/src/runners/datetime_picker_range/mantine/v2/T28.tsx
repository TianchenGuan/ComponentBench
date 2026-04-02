'use client';

/**
 * datetime_picker_range-mantine-v2-T28: Reservation vs Fallback — modal DateTimePickers, Save reservations
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Text, Stack, Group, Divider, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../../types';

const FB_START = new Date('2027-02-15T13:00:00');
const FB_END = new Date('2027-02-15T15:00:00');

export default function T28({ onSuccess }: TaskComponentProps) {
  const [fbStart, setFbStart] = useState<Date | null>(FB_START);
  const [fbEnd, setFbEnd] = useState<Date | null>(FB_END);
  const [resStart, setResStart] = useState<Date | null>(null);
  const [resEnd, setResEnd] = useState<Date | null>(null);
  const [saved, setSaved] = useState(false);
  const [noise, setNoise] = useState('');
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current || !saved) return;
    const fbOk =
      dayjs(fbStart).format('YYYY-MM-DD HH:mm') === '2027-02-15 13:00' &&
      dayjs(fbEnd).format('YYYY-MM-DD HH:mm') === '2027-02-15 15:00';
    if (!fbOk || !resStart || !resEnd) return;
    const rs = dayjs(resStart).format('YYYY-MM-DD HH:mm') === '2027-02-14 09:30';
    const re = dayjs(resEnd).format('YYYY-MM-DD HH:mm') === '2027-02-14 11:00';
    if (rs && re) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, fbStart, fbEnd, resStart, resEnd, onSuccess]);

  return (
    <Card withBorder padding="md" radius="md" style={{ maxWidth: 520 }}>
      <Text fw={600} mb="xs">
        Reservation settings
      </Text>
      <TextInput
        label="Search settings"
        placeholder="Filter…"
        value={noise}
        onChange={(e) => setNoise(e.currentTarget.value)}
        size="xs"
        mb="md"
      />
      <Stack gap="lg">
        <div data-cb-instance="Fallback window">
          <Text fw={600} size="sm" mb="xs">
            Fallback window
          </Text>
          <Group grow gap="xs">
            <div>
              <Text size="xs" mb={4}>
                Start
              </Text>
              <DateTimePicker
                value={fbStart}
                onChange={setFbStart}
                dropdownType="modal"
                valueFormat="YYYY-MM-DD HH:mm"
                size="xs"
                data-testid="dt-fallback-start"
              />
            </div>
            <div>
              <Text size="xs" mb={4}>
                End
              </Text>
              <DateTimePicker
                value={fbEnd}
                onChange={setFbEnd}
                dropdownType="modal"
                valueFormat="YYYY-MM-DD HH:mm"
                size="xs"
                data-testid="dt-fallback-end"
              />
            </div>
          </Group>
        </div>
        <Divider />
        <div data-cb-instance="Reservation window">
          <Text fw={600} size="sm" mb="xs">
            Reservation window
          </Text>
          <Group grow gap="xs">
            <div>
              <Text size="xs" mb={4}>
                Start
              </Text>
              <DateTimePicker
                value={resStart}
                onChange={setResStart}
                dropdownType="modal"
                placeholder="Pick start"
                valueFormat="YYYY-MM-DD HH:mm"
                size="xs"
                data-testid="dt-res-start"
              />
            </div>
            <div>
              <Text size="xs" mb={4}>
                End
              </Text>
              <DateTimePicker
                value={resEnd}
                onChange={setResEnd}
                dropdownType="modal"
                placeholder="Pick end"
                valueFormat="YYYY-MM-DD HH:mm"
                size="xs"
                data-testid="dt-res-end"
              />
            </div>
          </Group>
        </div>
      </Stack>
      <Button fullWidth mt="md" onClick={() => setSaved(true)}>
        Save reservations
      </Button>
    </Card>
  );
}
