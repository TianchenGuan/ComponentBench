'use client';

/**
 * calendar_embedded-antd-T03: Clear the selected date
 *
 * Layout: isolated_card centered (light theme, comfortable spacing, default scale).
 * The card shows a single Ant Design Calendar on February 2026.
 * One day is pre-selected on load: 2026-02-07 (the day cell is highlighted as selected).
 * Below the calendar, a readout line shows "Selected date: 2026-02-07".
 * To the right of the readout is a small link-style control labeled "Clear selection" that resets the calendar selection to empty (no selected date).
 * There are no other interactive widgets on the page (clutter: none).
 *
 * Success: The Calendar has no selected date (selection cleared / null).
 */

import React, { useState, useEffect } from 'react';
import { Card, Calendar, Button } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs('2026-02-07'));
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs('2026-02-01'));

  useEffect(() => {
    if (selectedDate === null) {
      onSuccess();
    }
  }, [selectedDate, onSuccess]);

  const handleSelect = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const handlePanelChange = (date: Dayjs) => {
    setCurrentMonth(date);
  };

  const handleClear = () => {
    setSelectedDate(null);
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
      <div style={{ marginTop: 16, fontSize: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <span style={{ fontWeight: 500 }}>Selected date: </span>
          <span data-testid="selected-date">
            {selectedDate ? selectedDate.format('YYYY-MM-DD') : '(none)'}
          </span>
        </div>
        <Button 
          type="link" 
          size="small" 
          onClick={handleClear}
          data-testid="clear-selection"
        >
          Clear selection
        </Button>
      </div>
    </Card>
  );
}
