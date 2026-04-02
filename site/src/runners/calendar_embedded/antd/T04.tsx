'use client';

/**
 * calendar_embedded-antd-T04: Select the date indicated by a reference chip
 *
 * Layout: isolated_card centered (light theme, comfortable spacing, default scale).
 * The card contains a single Ant Design Calendar set to February 2026.
 * Above the calendar header is a small "Target" chip: a blue pill showing the text "Target: 2026-02-18 (Wed)".
 * Inside the calendar grid, the target day cell (February 18) also shows a small blue dot in the corner (rendered via dateCellRender), matching the chip color.
 * No date is selected initially. A "Selected date:" readout below the calendar updates live when you select a day.
 * No other components are on the page (clutter: none).
 *
 * Success: The selected date equals the Target chip date (2026-02-18).
 */

import React, { useState, useEffect } from 'react';
import { Card, Calendar, Tag } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const TARGET_DATE = '2026-02-18';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs('2026-02-01'));

  useEffect(() => {
    if (selectedDate && selectedDate.format('YYYY-MM-DD') === TARGET_DATE) {
      onSuccess();
    }
  }, [selectedDate, onSuccess]);

  const handleSelect = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const handlePanelChange = (date: Dayjs) => {
    setCurrentMonth(date);
  };

  const cellRender = (current: Dayjs) => {
    if (current.format('YYYY-MM-DD') === TARGET_DATE) {
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
              backgroundColor: '#1677ff',
            }}
            data-marker="target"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <Card style={{ width: 400 }} data-testid="calendar-card">
      <div style={{ marginBottom: 12 }}>
        <Tag color="blue" data-testid="target-chip" data-target-date={TARGET_DATE}>
          Target: 2026-02-18 (Wed)
        </Tag>
      </div>
      <Calendar
        fullscreen={false}
        value={currentMonth}
        onSelect={handleSelect}
        onPanelChange={handlePanelChange}
        cellRender={cellRender}
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
