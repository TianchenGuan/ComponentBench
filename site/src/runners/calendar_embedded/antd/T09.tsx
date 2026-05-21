'use client';

/**
 * calendar_embedded-antd-T09: Pick the visually marked Target day (purple dot)
 *
 * Layout: isolated_card centered (light theme, comfortable spacing, default scale).
 * The card contains a single Ant Design Calendar starting on March 2026.
 * Above the calendar is a small legend with three dot labels:
 *   - Target (purple)
 *   - Busy (orange)
 *   - Holiday (gray)
 * Several dates in March have orange or gray dots. Exactly one date has a purple dot (the Target).
 * The calendar does NOT display a persistent "Selected date" text readout; selection is indicated only by the cell highlight.
 * When you click a day, a short-lived toast appears for ~1s saying "Selected" (without repeating the date).
 * There are no other interactive controls outside the calendar (clutter: none).
 *
 * Success: The selected date equals the date whose cell contains the purple Target dot (March 12, 2026).
 */

import React, { useState, useEffect } from 'react';
import { Card, Calendar, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const TARGET_DATE = '2026-03-12';
const BUSY_DATES = ['2026-03-05', '2026-03-10', '2026-03-20', '2026-03-25'];
const HOLIDAY_DATES = ['2026-03-01', '2026-03-17'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs('2026-03-01'));

  useEffect(() => {
    if (selectedDate && selectedDate.format('YYYY-MM-DD') === TARGET_DATE) {
      onSuccess();
    }
  }, [selectedDate, onSuccess]);

  const handleSelect = (date: Dayjs) => {
    setSelectedDate(date);
    message.info('Selected', 1);
  };

  const handlePanelChange = (date: Dayjs) => {
    setCurrentMonth(date);
  };

  const cellRender = (current: Dayjs) => {
    const dateStr = current.format('YYYY-MM-DD');
    let dotColor: string | null = null;
    let markerType: string | null = null;

    if (dateStr === TARGET_DATE) {
      dotColor = '#722ed1'; // purple
      markerType = 'target';
    } else if (BUSY_DATES.includes(dateStr)) {
      dotColor = '#fa8c16'; // orange
      markerType = 'busy';
    } else if (HOLIDAY_DATES.includes(dateStr)) {
      dotColor = '#8c8c8c'; // gray
      markerType = 'holiday';
    }

    if (dotColor) {
      return (
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: dotColor,
            }}
            data-marker={markerType}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <Card style={{ width: 400 }} data-testid="calendar-card">
      {/* Legend */}
      <div style={{ marginBottom: 12, display: 'flex', gap: 16, fontSize: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#722ed1' }} />
          <span>Target</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#fa8c16' }} />
          <span>Busy</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#8c8c8c' }} />
          <span>Holiday</span>
        </div>
      </div>

      <Calendar
        fullscreen={false}
        value={currentMonth}
        onSelect={handleSelect}
        onPanelChange={handlePanelChange}
        cellRender={cellRender}
        data-testid="calendar-embedded"
      />
    </Card>
  );
}
