'use client';

/**
 * calendar_embedded-mantine-v2-T47: Customer purple marker; Internal static; Apply calendars
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Button, Stack, Group, Box } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../../types';

const TARGET = '2027-05-18';
const BUSY = new Set(['2027-05-06', '2027-05-24']);
const BLOCKED = new Set(['2027-05-09', '2027-05-21']);

function internalDayStyle(): React.CSSProperties {
  return { position: 'relative' as const };
}

function customerDayStyle(date: Date): React.CSSProperties {
  const k = dayjs(date).format('YYYY-MM-DD');
  const base: React.CSSProperties = { position: 'relative' as const };
  if (k === TARGET) {
    return { ...base, boxShadow: '0 0 0 2px #ce93d8', borderRadius: 8 };
  }
  return base;
}

function dayDecorator(date: Date) {
  const k = dayjs(date).format('YYYY-MM-DD');
  if (BUSY.has(k)) {
    return (
      <Box
        component="span"
        pos="absolute"
        bottom={2}
        left="50%"
        style={{ transform: 'translateX(-50%)', width: 5, height: 5, borderRadius: 999, background: '#ff9800' }}
      />
    );
  }
  if (BLOCKED.has(k)) {
    return (
      <Box
        component="span"
        pos="absolute"
        bottom={2}
        left="50%"
        style={{ transform: 'translateX(-50%)', width: 5, height: 5, borderRadius: 999, background: '#757575' }}
      />
    );
  }
  return null;
}

export default function T47({ onSuccess }: TaskComponentProps) {
  const [custPending, setCustPending] = useState<Date | null>(null);
  const [custApplied, setCustApplied] = useState<Date | null>(null);

  useEffect(() => {
    if (custApplied && dayjs(custApplied).format('YYYY-MM-DD') === TARGET) {
      onSuccess();
    }
  }, [custApplied, onSuccess]);

  return (
    <Stack gap="md" maw={360} data-testid="dark-settings-calendars">
      <Card padding="sm" withBorder bg="dark.7">
        <Text fw={600} size="sm" mb="xs">
          Internal calendar
        </Text>
        <Calendar
          static
          defaultDate={new Date(2027, 4, 1)}
          size="sm"
          getDayProps={() => ({
            style: internalDayStyle(),
          })}
          renderDay={(date) => (
            <Box pos="relative" w="100%" h="100%" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text size="xs">{date.getDate()}</Text>
              {dayDecorator(date)}
            </Box>
          )}
          data-testid="internal-calendar"
        />
        <Text size="xs" c="dimmed" mt="xs">
          Applied: —
        </Text>
      </Card>
      <Card padding="sm" withBorder bg="dark.7">
        <Text fw={600} size="sm" mb="xs">
          Customer calendar
        </Text>
        <Group gap="xs" mb="xs" style={{ fontSize: 11 }}>
          <Group gap={4}>
            <Box w={12} h={12} style={{ borderRadius: 4, boxShadow: '0 0 0 2px #ce93d8' }} />
            <span>Target</span>
          </Group>
          <Group gap={4}>
            <Box w={6} h={6} style={{ borderRadius: 99, background: '#ff9800' }} />
            <span>Busy</span>
          </Group>
          <Group gap={4}>
            <Box w={6} h={6} style={{ borderRadius: 99, background: '#757575' }} />
            <span>Blocked</span>
          </Group>
        </Group>
        <Calendar
          defaultDate={new Date(2027, 1, 1)}
          maxLevel="decade"
          minLevel="month"
          size="sm"
          getDayProps={(date) => {
            const k = dayjs(date).format('YYYY-MM-DD');
            const isT = k === TARGET;
            return {
              style: customerDayStyle(date),
              selected: custPending ? dayjs(date).isSame(custPending, 'day') : false,
              onClick: () => setCustPending(date),
              ...(isT ? { 'data-reference-id': 'customer-calendar-purple-target' } : {}),
            };
          }}
          renderDay={(date) => (
            <Box pos="relative" w="100%" h="100%" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text size="xs">{date.getDate()}</Text>
              {dayDecorator(date)}
            </Box>
          )}
          data-testid="calendar-embedded"
        />
        <Text size="xs" c="dimmed" mt="xs">
          Applied: {custApplied ? dayjs(custApplied).format('YYYY-MM-DD') : '—'}
        </Text>
      </Card>
      <Button size="sm" onClick={() => setCustApplied(custPending)} data-testid="apply-calendars">
        Apply calendars
      </Button>
    </Stack>
  );
}
