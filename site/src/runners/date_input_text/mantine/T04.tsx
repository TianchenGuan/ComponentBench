'use client';

/**
 * date_input_text-mantine-T04: Mantine two DateInputs in a form section
 * 
 * Layout: form_section centered in the viewport with header "Booking".
 * Components: two Mantine DateInput fields side-by-side:
 *   - "Start date" (pre-filled with 2026-05-10)
 *   - "End date" (empty)
 * Both use valueFormat YYYY-MM-DD and allow free-form typing; calendar dropdown is available but optional.
 * Distractors (clutter=low): a "Guests" number input and a "Room type" select are shown but not required.
 * Feedback: after committing a valid date, the End date input shows the new value.
 * 
 * Success: The "End date" DateInput value equals 2026-05-20.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, NumberInput, Select, Stack } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [startDate, setStartDate] = useState<Date | null>(new Date('2026-05-10'));
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<string | number>(2);

  useEffect(() => {
    if (endDate && dayjs(endDate).format('YYYY-MM-DD') === '2026-05-20') {
      onSuccess();
    }
  }, [endDate, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Booking</Text>
      
      <Stack gap="md">
        <div>
          <Text component="label" htmlFor="start-date" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Start date
          </Text>
          <DateInput
            id="start-date"
            value={startDate}
            onChange={setStartDate}
            valueFormat="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            data-testid="start-date"
          />
        </div>

        <div>
          <Text component="label" htmlFor="end-date" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            End date
          </Text>
          <DateInput
            id="end-date"
            value={endDate}
            onChange={setEndDate}
            valueFormat="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            data-testid="end-date"
          />
        </div>

        <NumberInput
          label="Guests"
          value={guests}
          onChange={setGuests}
          min={1}
          max={10}
        />

        <Select
          label="Room type"
          placeholder="Select room"
          data={['Standard', 'Deluxe', 'Suite']}
          defaultValue="Standard"
        />
      </Stack>
    </Card>
  );
}
