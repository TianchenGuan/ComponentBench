'use client';

/**
 * calendar_embedded-mui-T04: Jump by year and month, then pick a day (views: year→month→day)
 *
 * Layout: isolated_card centered (light theme, comfortable spacing, default scale).
 * The card contains a single MUI X DateCalendar configured with three enabled views: year, month, and day.
 * The calendar starts in the year view (openTo='year') with a scrollable list/grid of years.
 * Selecting a year switches to the month view (showing Jan–Dec). Selecting a month then switches to the day grid for that month.
 * No date is selected initially.
 * A persistent readout under the component shows "Selected date:" and updates to YYYY-MM-DD whenever a day is selected.
 * No other interactive elements appear on the page (clutter: none).
 *
 * Success: The selected date equals 2027-09-21.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (selectedDate && selectedDate.format('YYYY-MM-DD') === '2027-09-21') {
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
            views={['year', 'month', 'day']}
            openTo="year"
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
