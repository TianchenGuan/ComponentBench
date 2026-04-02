'use client';

/**
 * date_picker_single-mantine-T04: Set Check-in date in compact form with two pickers
 *
 * Scene: Form section layout (form_section) centered on the page. Theme is light.
 * Spacing is compact so labels and inputs are closer than default.
 *
 * Target components: Two Mantine DatePickerInput controls appear side-by-side in the same row:
 * - "Check-in date" (TARGET) - empty.
 * - "Arrival time" - a plain time dropdown (distractor).
 * Below them there is another DatePickerInput labeled "Check-out date" (distractor) prefilled with a different date.
 *
 * Interaction: The Check-in DatePickerInput opens a popover calendar. Selecting a day sets the value.
 *
 * Clutter: Low (a couple of extra fields and a "Guests" number input).
 *
 * Feedback: Selecting a day updates only the active input; compact spacing makes it easier to click the wrong field.
 *
 * Success: Target instance (Check-in date) must have selected date = 2026-07-04.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Select, NumberInput, Group, Stack } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(new Date('2026-07-10'));
  const [arrivalTime, setArrivalTime] = useState<string | null>('14:00');
  const [guests, setGuests] = useState<number | string>(2);

  useEffect(() => {
    if (checkInDate && dayjs(checkInDate).format('YYYY-MM-DD') === '2026-07-04') {
      onSuccess();
    }
  }, [checkInDate, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="sm">Reservation</Text>
      
      <Stack gap="xs">
        <Group grow gap="xs">
          <div>
            <Text component="label" fw={500} size="xs" mb={2} style={{ display: 'block' }}>
              Check-in date
            </Text>
            <DatePickerInput
              value={checkInDate}
              onChange={setCheckInDate}
              valueFormat="YYYY-MM-DD"
              placeholder="Pick date"
              size="sm"
              data-testid="check-in-date"
            />
          </div>
          <div>
            <Text component="label" fw={500} size="xs" mb={2} style={{ display: 'block' }}>
              Arrival time
            </Text>
            <Select
              value={arrivalTime}
              onChange={setArrivalTime}
              data={['12:00', '13:00', '14:00', '15:00', '16:00']}
              size="sm"
              data-testid="arrival-time"
            />
          </div>
        </Group>

        <div>
          <Text component="label" fw={500} size="xs" mb={2} style={{ display: 'block' }}>
            Check-out date
          </Text>
          <DatePickerInput
            value={checkOutDate}
            onChange={setCheckOutDate}
            valueFormat="YYYY-MM-DD"
            placeholder="Pick date"
            size="sm"
            data-testid="check-out-date"
          />
        </div>

        <div>
          <Text component="label" fw={500} size="xs" mb={2} style={{ display: 'block' }}>
            Guests
          </Text>
          <NumberInput
            value={guests}
            onChange={setGuests}
            min={1}
            max={10}
            size="sm"
            data-testid="guests"
          />
        </div>
      </Stack>
    </Card>
  );
}
