'use client';

/**
 * calendar_embedded-antd-T10: Scroll the year dropdown to reach 2038 and pick a date
 *
 * Layout: isolated_card placed near the bottom-left of the viewport (light theme).
 * Spacing mode is compact, making the calendar header controls and dropdown options tighter.
 * The card contains a single Ant Design Calendar starting on February 2026 with no selected date.
 * The header provides a year dropdown and month dropdown. The year dropdown contains a long, scrollable list of years.
 * Selecting a year/month immediately updates the grid; selecting a day highlights it and updates a small "Selected date:" readout below the calendar.
 * No other page elements are interactive (clutter: none).
 *
 * Success: The calendar's selected date equals 2038-10-02.
 */

import React, { useState, useEffect } from 'react';
import { Card, Calendar } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs('2026-02-01'));

  useEffect(() => {
    if (
      selectedDate &&
      selectedDate.format('YYYY-MM-DD') === '2038-10-02' &&
      currentMonth.format('YYYY-MM') === '2038-10'
    ) {
      onSuccess();
    }
  }, [selectedDate, currentMonth, onSuccess]);

  const handleSelect = (date: Dayjs) => {
    setSelectedDate(date);
    setCurrentMonth(date);
  };

  const handlePanelChange = (date: Dayjs) => {
    setCurrentMonth(date);
  };

  return (
    <Card style={{ width: 360 }} data-testid="calendar-card">
      <Calendar
        fullscreen={false}
        value={currentMonth}
        onSelect={handleSelect}
        onPanelChange={handlePanelChange}
        data-testid="calendar-embedded"
      />
      <div style={{ marginTop: 12, fontSize: 13 }}>
        <span style={{ fontWeight: 500 }}>Selected date: </span>
        <span data-testid="selected-date">
          {selectedDate ? selectedDate.format('YYYY-MM-DD') : '—'}
        </span>
      </div>
    </Card>
  );
}
