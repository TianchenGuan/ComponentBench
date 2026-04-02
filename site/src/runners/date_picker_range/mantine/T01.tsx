'use client';

/**
 * date_picker_range-mantine-T01: Open Trip dates dropdown
 *
 * Baseline isolated card centered in the viewport with a single
 * Mantine DatePickerInput configured with type='range' and labeled 'Trip dates'.
 * Theme is light with comfortable spacing. The input starts empty and shows a placeholder
 * 'Pick dates range'. Clicking the input opens a Popover dropdown containing a calendar
 * month grid for selecting a start and end date. No other interactive elements are
 * present.
 *
 * Success: The picker overlay/popover is open for the 'Trip dates' instance.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      onSuccess();
    }
  }, [isOpen, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Trip dates</Text>
      
      <div>
        <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Trip dates
        </Text>
        <DatePickerInput
          type="range"
          value={value}
          onChange={setValue}
          placeholder="Pick dates range"
          popoverProps={{
            opened: isOpen,
            onOpen: () => setIsOpen(true),
            onClose: () => setIsOpen(false),
          }}
          onClick={() => setIsOpen(true)}
          data-testid="trip-dates-range"
        />
      </div>
    </Card>
  );
}
