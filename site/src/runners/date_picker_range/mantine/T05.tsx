'use client';

/**
 * date_picker_range-mantine-T05: Navigate a modal date picker to June 2026
 *
 * Isolated card centered in the viewport with a Mantine DatePickerInput
 * labeled 'Vacation window'. It is configured as a range picker (type='range') and
 * uses dropdownType='modal', meaning the calendar opens in a full modal overlay
 * instead of a small popover. The field is empty. When opened, the modal shows a
 * month header with navigation controls (previous/next). The initial month is February
 * 2026. The goal is to navigate until the header shows June 2026; no dates need
 * to be selected.
 *
 * Success: Calendar modal is open and shows 2026-06 as any visible month.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
  const [isOpen, setIsOpen] = useState(false);
  const successFiredRef = useRef(false);

  // Poll for month changes while the modal is open
  useEffect(() => {
    if (!isOpen) return;

    const checkMonth = () => {
      if (successFiredRef.current) return;
      
      // Search for calendar header buttons/elements containing "June 2026"
      // Mantine calendar renders the month name in a button inside the header
      const candidates = Array.from(document.querySelectorAll(
        'button, [role="button"], [class*="calendarHeader"], [class*="Header"], [class*="month"]'
      ));
      for (const el of candidates) {
        // Only check elements that are inside a calendar/popover/modal overlay, not the page itself
        const inOverlay = el.closest('[class*="Popover"], [class*="Modal"], [class*="Calendar"], [class*="DatePicker"]');
        if (!inOverlay) continue;
        const text = (el.textContent || '').trim();
        if (text === 'June 2026') {
          successFiredRef.current = true;
          onSuccess();
          return;
        }
      }
    };

    checkMonth();
    const interval = setInterval(checkMonth, 200);
    return () => clearInterval(interval);
  }, [isOpen, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Vacation window — opens in modal</Text>
      
      <div>
        <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Vacation window
        </Text>
        <DatePickerInput
          type="range"
          value={value}
          onChange={setValue}
          valueFormat="YYYY-MM-DD"
          placeholder="Pick dates range"
          dropdownType="modal"
          defaultDate={new Date(2026, 1, 1)} // February 2026
          popoverProps={{
            opened: isOpen,
            onChange: setIsOpen,
          }}
          modalProps={{
            opened: isOpen,
            onClose: () => setIsOpen(false),
          }}
          onClick={() => setIsOpen(true)}
          data-testid="vacation-window-range"
        />
        <Text size="xs" c="dimmed" mt={8}>
          Navigate to June 2026 in the calendar modal
        </Text>
      </div>
    </Card>
  );
}
