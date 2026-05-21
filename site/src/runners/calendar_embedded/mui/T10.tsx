'use client';

/**
 * calendar_embedded-mui-T10: Scroll the year list (descending) to reach 1999
 *
 * Layout: isolated_card anchored near the top-left of the viewport (light theme, comfortable spacing, default scale).
 * The card contains a single MUI X DateCalendar configured to start in year view with a long scrollable year list.
 * The year list is shown in descending order (latest years first), spanning roughly 1900–2099.
 * No day is selected at any point; this task is only about setting the calendar's active year by choosing it from the list.
 * A label above the component shows "Viewing year:" and mirrors the currently active year as a 4-digit number.
 * There are no other interactive elements (clutter: none).
 *
 * Success: The calendar's active/displayed year equals 1999 (as reflected by the 'Viewing year' label).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [currentYear, setCurrentYear] = useState<number>(2026);

  useEffect(() => {
    if (currentYear === 1999) {
      onSuccess();
    }
  }, [currentYear, onSuccess]);

  const handleYearChange = (date: Dayjs) => {
    setCurrentYear(date.year());
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 380 }} data-testid="calendar-card">
        <CardContent>
          <Box sx={{ mb: 1.5, fontSize: 14 }}>
            <Typography component="span" sx={{ fontWeight: 500 }}>
              Viewing year:{' '}
            </Typography>
            <Typography component="span" data-testid="viewing-year">
              {currentYear}
            </Typography>
          </Box>
          <DateCalendar
            value={null}
            onChange={() => {}}
            onYearChange={handleYearChange}
            views={['year']}
            openTo="year"
            yearsOrder="desc"
            minDate={dayjs('1900-01-01')}
            maxDate={dayjs('2099-12-31')}
            referenceDate={dayjs('2026-01-01')}
            data-testid="calendar-embedded"
          />
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
