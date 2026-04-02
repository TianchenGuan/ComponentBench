'use client';

/**
 * calendar_embedded-antd-T02: Navigate to a specific month (June 2026)
 *
 * Layout: isolated_card centered (light theme, comfortable spacing, default scale).
 * The card contains a single Ant Design Calendar. It initially renders February 2026.
 * The header shows the current month/year and provides controls to change them (month dropdown, year dropdown, and previous/next navigation arrows).
 * No day is pre-selected and selecting a day is allowed, but it is not required for this task.
 * A small, non-editable label above the calendar reads "Viewing:" and mirrors the calendar's current visible month in the format YYYY-MM.
 * No other interactive elements are present (clutter: none).
 *
 * Success: The Calendar is displaying month 2026-06 (June 2026) in its day grid view.
 */

import React, { useState, useEffect } from 'react';
import { Card, Calendar } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs('2026-02-01'));

  useEffect(() => {
    if (currentMonth.format('YYYY-MM') === '2026-06') {
      onSuccess();
    }
  }, [currentMonth, onSuccess]);

  const handlePanelChange = (date: Dayjs) => {
    setCurrentMonth(date);
  };

  const handleSelect = (date: Dayjs) => {
    setCurrentMonth(date);
  };

  return (
    <Card style={{ width: 400 }} data-testid="calendar-card">
      <div style={{ marginBottom: 12, fontSize: 14 }}>
        <span style={{ fontWeight: 500 }}>Viewing: </span>
        <span data-testid="viewing-month">{currentMonth.format('YYYY-MM')}</span>
      </div>
      <Calendar
        fullscreen={false}
        value={currentMonth}
        onSelect={handleSelect}
        onPanelChange={handlePanelChange}
        data-testid="calendar-embedded"
      />
    </Card>
  );
}
