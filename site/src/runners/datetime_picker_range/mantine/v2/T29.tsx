'use client';

/**
 * datetime_picker_range-mantine-v2-T29: Resolved between in scrollable filters sidebar — Apply filters
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Text, Stack, Group, Paper } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../../types';

const CREATED_START = new Date('2027-10-01T00:00:00');
const CREATED_END = new Date('2027-10-07T23:59:00');

export default function T29({ onSuccess }: TaskComponentProps) {
  const [cStart, setCStart] = useState<Date | null>(CREATED_START);
  const [cEnd, setCEnd] = useState<Date | null>(CREATED_END);
  const [rStart, setRStart] = useState<Date | null>(null);
  const [rEnd, setREnd] = useState<Date | null>(null);
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current || !applied) return;
    const cOk =
      dayjs(cStart).format('YYYY-MM-DD HH:mm') === '2027-10-01 00:00' &&
      dayjs(cEnd).format('YYYY-MM-DD HH:mm') === '2027-10-07 23:59';
    if (!cOk || !rStart || !rEnd) return;
    const rs = dayjs(rStart).format('YYYY-MM-DD HH:mm') === '2027-10-15 06:00';
    const re = dayjs(rEnd).format('YYYY-MM-DD HH:mm') === '2027-10-15 18:00';
    if (rs && re) {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, cStart, cEnd, rStart, rEnd, onSuccess]);

  return (
    <Group align="flex-start" gap="md" wrap="nowrap" style={{ maxWidth: 720 }}>
      <Paper withBorder p="md" style={{ flex: 1, minHeight: 320 }}>
        <Text size="sm" c="dimmed">
          Ticket list (scroll the filters panel on the right →)
        </Text>
        <Text mt="md" fw={500}>
          Sample tickets
        </Text>
        <Stack gap={4} mt="sm">
          {['INC-1001', 'INC-1002', 'INC-1003', 'INC-1004'].map((id) => (
            <Text key={id} size="sm">
              {id} — open
            </Text>
          ))}
        </Stack>
      </Paper>
      <Paper withBorder p="xs" style={{ width: 280, height: 260, display: 'flex', flexDirection: 'column' }}>
        <Text fw={600} size="sm" mb="xs">
          Filters
        </Text>
        <Box
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: 4,
          }}
          data-testid="filters-sidebar-scroll"
        >
          <Box style={{ height: 140 }} />
          <div data-cb-instance="Created between">
            <Text fw={600} size="xs" mb={6}>
              Created between
            </Text>
            <Stack gap="xs" mb="lg">
              <DateTimePicker
                value={cStart}
                onChange={setCStart}
                dropdownType="modal"
                valueFormat="YYYY-MM-DD HH:mm"
                size="xs"
                label="Start"
                data-testid="dt-created-start"
              />
              <DateTimePicker
                value={cEnd}
                onChange={setCEnd}
                dropdownType="modal"
                valueFormat="YYYY-MM-DD HH:mm"
                size="xs"
                label="End"
                data-testid="dt-created-end"
              />
            </Stack>
          </div>
          <div data-cb-instance="Resolved between">
            <Text fw={600} size="xs" mb={6}>
              Resolved between
            </Text>
            <Stack gap="xs">
              <DateTimePicker
                value={rStart}
                onChange={setRStart}
                dropdownType="modal"
                placeholder="Start"
                valueFormat="YYYY-MM-DD HH:mm"
                size="xs"
                label="Start"
                data-testid="dt-resolved-start"
              />
              <DateTimePicker
                value={rEnd}
                onChange={setREnd}
                dropdownType="modal"
                placeholder="End"
                valueFormat="YYYY-MM-DD HH:mm"
                size="xs"
                label="End"
                data-testid="dt-resolved-end"
              />
            </Stack>
          </div>
        </Box>
        <Button fullWidth size="xs" mt="sm" onClick={() => setApplied(true)}>
          Apply filters
        </Button>
      </Paper>
    </Group>
  );
}
