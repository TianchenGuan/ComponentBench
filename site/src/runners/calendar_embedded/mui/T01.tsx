'use client';

/**
 * calendar_embedded-mui-T01: Pick a single date (MUI DateCalendar)
 *
 * Layout: isolated_card centered (light theme, comfortable spacing, default scale).
 * The card contains a single MUI X DateCalendar (inline, no popover and no text field).
 * The calendar initially shows February 2026 (referenceDate is set so February is visible) and no day is selected.
 * The header shows the current month and year with left/right arrow buttons to navigate months.
 * Clicking a day selects it (highlighted circle/fill on the day number).
 * A helper line under the calendar reads "Selected date:" and updates immediately to YYYY-MM-DD when a selection is made.
 * No other interactive elements are on the page (clutter: none).
 *
 * Success: The DateCalendar selected date equals 2026-02-14.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (selectedDate && selectedDate.format('YYYY-MM-DD') === '2026-02-14') {
      onSuccess();
    }
  }, [selectedDate, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 380 }} data-testid="calendar-card">
        <CardContent>
          <DateCalendar
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            referenceDate={dayjs('2026-02-01')}
            data-testid="calendar-embedded"
          />
          <Box sx={{ mt: 2, fontSize: 14 }}>
            <Typography component="span" sx={{ fontWeight: 500 }}>
              Selected date:{' '}
            </Typography>
            <Typography component="span" data-testid="selected-date">
              {selectedDate ? selectedDate.format('YYYY-MM-DD') : '—'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
