'use client';

/**
 * calendar_embedded-antd-T07: Navigate month with corner placement (December 2026)
 *
 * Layout: isolated_card anchored near the top-right of the viewport (light theme, comfortable spacing, default scale).
 * A single Ant Design Calendar is embedded in the card. It initially shows February 2026.
 * The card is intentionally positioned away from the center, so the header controls are closer to the screen edge.
 * The calendar header provides month/year selectors and navigation arrows to change the visible month.
 * A small label above the calendar reads "Currently viewing:" and mirrors the visible month as YYYY-MM.
 * No other widgets are present (clutter: none).
 *
 * Success: The calendar is displaying 2026-12 (December 2026) in day-grid view.
 */

import React, { useState, useEffect } from 'react';
import { Card, Calendar } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs('2026-02-01'));

  useEffect(() => {
    if (currentMonth.format('YYYY-MM') === '2026-12') {
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
    <Card style={{ width: 380 }} data-testid="calendar-card">
      <div style={{ marginBottom: 12, fontSize: 14 }}>
        <span style={{ fontWeight: 500 }}>Currently viewing: </span>
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
