'use client';

/**
 * calendar_embedded-antd-T06: Set an event date inside a form section
 *
 * Layout: form_section centered (light theme, comfortable spacing, default scale) with low clutter.
 * The page shows an "Event details" form with several non-required fields (Title text input, Location text input, a non-functional "Timezone" dropdown).
 * Below these fields is a labeled section "Event date" containing a single embedded Ant Design Calendar (not a popover).
 * The calendar initially displays February 2026 and has no selected date.
 * The calendar header includes month/year selectors; changing month/year updates the grid immediately.
 * Beneath the calendar is a compact readout "Event date:" which mirrors the selected date in YYYY-MM-DD when a day is selected.
 * Distractors: the form fields are clickable/focusable but do not affect task success; only the calendar selection matters.
 *
 * Success: The Event date calendar's selected date equals 2026-09-09.
 */

import React, { useState, useEffect } from 'react';
import { Card, Calendar, Input, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs('2026-02-01'));

  useEffect(() => {
    if (selectedDate && selectedDate.format('YYYY-MM-DD') === '2026-09-09') {
      onSuccess();
    }
  }, [selectedDate, onSuccess]);

  const handleSelect = (date: Dayjs) => {
    setSelectedDate(date);
    setCurrentMonth(date);
  };

  const handlePanelChange = (date: Dayjs) => {
    setCurrentMonth(date);
  };

  return (
    <Card title="Event details" style={{ width: 450 }} data-testid="form-card">
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>Title</label>
        <Input placeholder="Event title" data-testid="title-input" />
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>Location</label>
        <Input placeholder="Event location" data-testid="location-input" />
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>Timezone</label>
        <Select
          style={{ width: '100%' }}
          placeholder="Select timezone"
          options={[
            { value: 'utc', label: 'UTC' },
            { value: 'est', label: 'EST' },
            { value: 'pst', label: 'PST' },
          ]}
          data-testid="timezone-select"
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: 8 }}>Event date</label>
        <Calendar
          fullscreen={false}
          value={currentMonth}
          onSelect={handleSelect}
          onPanelChange={handlePanelChange}
          data-testid="calendar-embedded"
        />
        <div style={{ marginTop: 8, fontSize: 13 }}>
          <span style={{ fontWeight: 500 }}>Event date: </span>
          <span data-testid="selected-date">
            {selectedDate ? selectedDate.format('YYYY-MM-DD') : '—'}
          </span>
        </div>
      </div>
    </Card>
  );
}
