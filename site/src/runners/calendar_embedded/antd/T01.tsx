'use client';

/**
 * calendar_embedded-antd-T01: Pick a single date (payday)
 *
 * Layout: isolated_card centered in the viewport (light theme, comfortable spacing, default scale).
 * The card title reads "Project calendar". Inside the card is an Ant Design Calendar component showing February 2026 by default.
 * The calendar header includes month and year controls (month selector + year selector) and left/right navigation arrows.
 * No date is selected initially; only the standard hover/active styling appears when interacting.
 * Below the calendar there is a small readout line labeled "Selected date:" which updates live to an ISO date (YYYY-MM-DD) when a day cell is selected.
 * There are no other interactive elements on the page (no clutter/distractors).
 *
 * Success: The AntD Calendar's selected date equals 2026-02-13.
 */

import React, { useState, useEffect } from 'react';
import { Card, Calendar } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs('2026-02-01'));

  useEffect(() => {
    if (selectedDate && selectedDate.format('YYYY-MM-DD') === '2026-02-13') {
      onSuccess();
    }
  }, [selectedDate, onSuccess]);

  const handleSelect = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const handlePanelChange = (date: Dayjs) => {
    setCurrentMonth(date);
  };

  return (
    <Card title="Project calendar" style={{ width: 400 }} data-testid="calendar-card">
      <Calendar
        fullscreen={false}
        value={currentMonth}
        onSelect={handleSelect}
        onPanelChange={handlePanelChange}
        data-testid="calendar-embedded"
      />
      <div style={{ marginTop: 16, fontSize: 14 }}>
        <span style={{ fontWeight: 500 }}>Selected date: </span>
        <span data-testid="selected-date">
          {selectedDate ? selectedDate.format('YYYY-MM-DD') : '—'}
        </span>
      </div>
    </Card>
  );
}
