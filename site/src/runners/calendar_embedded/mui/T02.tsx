'use client';

/**
 * calendar_embedded-mui-T02: Navigate to May 2026 (month navigation arrows)
 *
 * Layout: isolated_card centered (light theme, comfortable spacing, default scale).
 * A single MUI X DateCalendar is embedded and starts on February 2026.
 * The only navigation controls are the previous/next month arrow buttons in the calendar header.
 * Day selection is enabled but not required.
 * A small label above the calendar reads "Viewing:" and mirrors the current visible month as YYYY-MM for clarity.
 * There are no other page controls (clutter: none).
 *
 * Success: The DateCalendar is displaying 2026-05 (May 2026) in day-grid view.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs('2026-02-01'));

  useEffect(() => {
    if (currentMonth.format('YYYY-MM') === '2026-05') {
      onSuccess();
    }
  }, [currentMonth, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 380 }} data-testid="calendar-card">
        <CardContent>
          <Box sx={{ mb: 1.5, fontSize: 14 }}>
            <Typography component="span" sx={{ fontWeight: 500 }}>
              Viewing:{' '}
            </Typography>
            <Typography component="span" data-testid="viewing-month">
              {currentMonth.format('YYYY-MM')}
            </Typography>
          </Box>
          <DateCalendar
            value={null}
            onChange={() => {}}
            referenceDate={currentMonth}
            onMonthChange={(month) => setCurrentMonth(month)}
            data-testid="calendar-embedded"
          />
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
