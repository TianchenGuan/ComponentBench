'use client';

/**
 * date_picker_range-mantine-T04: Use a presets list to set conference dates
 *
 * A form_section layout with light theme and comfortable spacing.
 * The main control is a Mantine DatePickerInput labeled 'Conference dates' configured
 * with type='range'. When opened, the calendar dropdown shows a presets list next
 * to the calendar with clickable items:
 * - 'Conference (Mar 18–Mar 22, 2026)'
 * - 'Training week (Apr 6–Apr 10, 2026)'
 * - 'Customer visits (May 4–May 8, 2026)'
 * - 'Reset'
 * Selecting a preset immediately fills the input with the preset range (no separate
 * Apply/OK). Other form fields (Company name, Email) are present as low clutter.
 *
 * Success: Start date = 2026-03-18, End date = 2026-03-22 (Conference dates instance)
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, TextInput, Stack, Group, UnstyledButton, Box } from '@mantine/core';
import { DatePickerInput, DatesProvider } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (
      value[0] &&
      value[1] &&
      dayjs(value[0]).format('YYYY-MM-DD') === '2026-03-18' &&
      dayjs(value[1]).format('YYYY-MM-DD') === '2026-03-22'
    ) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const presets = [
    { label: 'Conference (Mar 18–Mar 22, 2026)', value: [new Date(2026, 2, 18), new Date(2026, 2, 22)] as [Date, Date] },
    { label: 'Training week (Apr 6–Apr 10, 2026)', value: [new Date(2026, 3, 6), new Date(2026, 3, 10)] as [Date, Date] },
    { label: 'Customer visits (May 4–May 8, 2026)', value: [new Date(2026, 4, 4), new Date(2026, 4, 8)] as [Date, Date] },
  ];

  const handlePresetClick = (presetValue: [Date, Date]) => {
    setValue(presetValue);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }}>
      <Text fw={600} size="lg" mb="md">Event Registration</Text>
      
      <Stack gap="md">
        <TextInput
          label="Company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.currentTarget.value)}
          placeholder="Enter company name"
          data-testid="company-name"
        />

        <div>
          <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Conference dates — presets available
          </Text>
          <DatePickerInput
            type="range"
            value={value}
            onChange={setValue}
            valueFormat="MMM DD, YYYY"
            placeholder="Pick dates range"
            defaultDate={new Date(2026, 2, 1)} // March 2026
            data-testid="conference-dates-range"
          />
          
          {/* Presets */}
          <Box mt="sm">
            <Text size="xs" c="dimmed" mb={4}>Quick presets:</Text>
            <Group gap="xs">
              {presets.map((preset) => (
                <UnstyledButton
                  key={preset.label}
                  onClick={() => handlePresetClick(preset.value)}
                  style={{
                    padding: '4px 8px',
                    fontSize: 12,
                    background: '#f0f0f0',
                    borderRadius: 4,
                    border: '1px solid #ddd',
                  }}
                  data-testid={`preset-${preset.label.split(' ')[0].toLowerCase()}`}
                >
                  {preset.label}
                </UnstyledButton>
              ))}
              <UnstyledButton
                onClick={() => setValue([null, null])}
                style={{
                  padding: '4px 8px',
                  fontSize: 12,
                  background: '#fff0f0',
                  borderRadius: 4,
                  border: '1px solid #fcc',
                }}
                data-testid="preset-reset"
              >
                Reset
              </UnstyledButton>
            </Group>
          </Box>
        </div>

        <TextInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          placeholder="Enter email"
          data-testid="email"
        />
      </Stack>
    </Card>
  );
}
