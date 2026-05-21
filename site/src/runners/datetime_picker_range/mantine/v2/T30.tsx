'use client';

/**
 * datetime_picker_range-mantine-v2-T30: Incident window — visual reference card, high-contrast panel, Save panel
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Text, Stack, Group, Paper, Divider } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../../types';

const MAINT_START = new Date('2027-09-12T09:00:00');
const MAINT_END = new Date('2027-09-12T12:00:00');

export default function T30({ onSuccess }: TaskComponentProps) {
  const [mStart, setMStart] = useState<Date | null>(MAINT_START);
  const [mEnd, setMEnd] = useState<Date | null>(MAINT_END);
  const [iStart, setIStart] = useState<Date | null>(null);
  const [iEnd, setIEnd] = useState<Date | null>(null);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current || !saved) return;
    const mOk =
      dayjs(mStart).format('YYYY-MM-DD HH:mm') === '2027-09-12 09:00' &&
      dayjs(mEnd).format('YYYY-MM-DD HH:mm') === '2027-09-12 12:00';
    if (!mOk || !iStart || !iEnd) return;
    const is = dayjs(iStart).format('YYYY-MM-DD HH:mm') === '2027-09-09 21:00';
    const ie = dayjs(iEnd).format('YYYY-MM-DD HH:mm') === '2027-09-10 01:30';
    if (is && ie) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, mStart, mEnd, iStart, iEnd, onSuccess]);

  const hc = {
    bg: '#000',
    fg: '#fff',
    border: '#fff',
    muted: '#ccc',
  };

  return (
    <Stack gap="sm" style={{ maxWidth: 560 }}>
      <Paper
        withBorder
        p="sm"
        data-reference="incident-window-reference"
        style={{ backgroundColor: hc.bg, borderColor: hc.border, color: hc.fg }}
      >
        <Text size="xs" style={{ color: hc.muted }}>
          Reference — incident window
        </Text>
        <Text fw={700} size="sm" mt={4}>
          2027-09-09 21:00 → 2027-09-10 01:30
        </Text>
      </Paper>
      <Card
        padding="sm"
        radius="sm"
        withBorder
        style={{
          backgroundColor: hc.bg,
          borderColor: hc.border,
          color: hc.fg,
        }}
      >
        <Text fw={600} size="sm" mb="xs">
          Incident panel
        </Text>
        <Divider color={hc.border} mb="sm" />
        <div data-cb-instance="Maintenance window">
          <Text fw={600} size="xs" mb={6}>
            Maintenance window
          </Text>
          <Group grow gap="xs" mb="md">
            <DateTimePicker
              value={mStart}
              onChange={setMStart}
              valueFormat="YYYY-MM-DD HH:mm"
              size="xs"
              label="Start"
              styles={{ input: { backgroundColor: '#111', color: '#fff', borderColor: '#666' } }}
              data-testid="dt-maint-start"
            />
            <DateTimePicker
              value={mEnd}
              onChange={setMEnd}
              valueFormat="YYYY-MM-DD HH:mm"
              size="xs"
              label="End"
              styles={{ input: { backgroundColor: '#111', color: '#fff', borderColor: '#666' } }}
              data-testid="dt-maint-end"
            />
          </Group>
        </div>
        <Divider color={hc.border} mb="sm" />
        <div data-cb-instance="Incident window">
          <Text fw={600} size="xs" mb={6}>
            Incident window
          </Text>
          <Group grow gap="xs">
            <DateTimePicker
              value={iStart}
              onChange={setIStart}
              placeholder="Start"
              valueFormat="YYYY-MM-DD HH:mm"
              size="xs"
              label="Start"
              styles={{ input: { backgroundColor: '#111', color: '#fff', borderColor: '#666' } }}
              data-testid="dt-incident-start"
            />
            <DateTimePicker
              value={iEnd}
              onChange={setIEnd}
              placeholder="End"
              valueFormat="YYYY-MM-DD HH:mm"
              size="xs"
              label="End"
              styles={{ input: { backgroundColor: '#111', color: '#fff', borderColor: '#666' } }}
              data-testid="dt-incident-end"
            />
          </Group>
        </div>
        <Button fullWidth mt="md" color="yellow" c="black" onClick={() => setSaved(true)}>
          Save panel
        </Button>
      </Card>
    </Stack>
  );
}
