'use client';

/**
 * date_picker_single-mantine-T08: Match a visual reference in a modal dropdown
 *
 * Scene: Centered isolated card, light theme, comfortable spacing.
 *
 * Reference: A non-interactive "Ticket preview" component shows the target date as a stylized ticket with a large month/day and a small year label (visual reference).
 *
 * Target component: One Mantine DatePickerInput labeled "Conference date", configured with `dropdownType="modal"` so that activating the input opens the calendar inside a Mantine Modal rather than a popover.
 * - Initial state: empty.
 * - Interaction: The modal calendar includes header controls for navigating months/years.
 *
 * Distractors: A checkbox ("I need accessibility accommodations") and a text input ("Badge name") appear below (clutter=low).
 *
 * Feedback: Selecting the date updates the input and closes the modal.
 *
 * Success: Date picker must have selected date = 2028-08-22.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Checkbox, TextInput, Stack, Box } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [conferenceDate, setConferenceDate] = useState<Date | null>(null);
  const [needsAccessibility, setNeedsAccessibility] = useState(false);
  const [badgeName, setBadgeName] = useState('');

  useEffect(() => {
    if (conferenceDate && dayjs(conferenceDate).format('YYYY-MM-DD') === '2028-08-22') {
      onSuccess();
    }
  }, [conferenceDate, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Conference registration</Text>
      
      {/* Visual Reference - Ticket Preview */}
      <Box
        data-testid="ticket-date"
        style={{
          background: '#f0f5ff',
          border: '1px solid #adc6ff',
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        <Text size="xs" c="dimmed" mb="xs">Ticket preview</Text>
        <Box
          style={{
            background: '#1677ff',
            color: '#fff',
            borderRadius: 8,
            padding: '12px 24px',
            display: 'inline-block',
            textAlign: 'center',
          }}
        >
          <Text size="xs" tt="uppercase">Aug</Text>
          <Text size="xl" fw={700} style={{ fontSize: 32, lineHeight: 1 }}>22</Text>
          <Text size="xs">2028</Text>
        </Box>
      </Box>

      <Stack gap="md">
        <div>
          <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Conference date
          </Text>
          <DatePickerInput
            value={conferenceDate}
            onChange={setConferenceDate}
            valueFormat="YYYY-MM-DD"
            placeholder="Pick date"
            dropdownType="modal"
            data-testid="conference-date"
          />
        </div>

        <Checkbox
          label="I need accessibility accommodations"
          checked={needsAccessibility}
          onChange={(e) => setNeedsAccessibility(e.currentTarget.checked)}
          data-testid="accessibility-checkbox"
        />

        <TextInput
          label="Badge name"
          value={badgeName}
          onChange={(e) => setBadgeName(e.currentTarget.value)}
          placeholder="Enter your badge name"
          data-testid="badge-name"
        />
      </Stack>
    </Card>
  );
}
