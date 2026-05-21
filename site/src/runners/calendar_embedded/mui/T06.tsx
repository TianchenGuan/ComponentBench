'use client';

/**
 * calendar_embedded-mui-T06: Pick a date in the Secondary calendar (two MUI calendars)
 *
 * Layout: isolated_card centered (light theme, comfortable spacing, default scale).
 * The card contains two MUI X DateCalendar instances arranged side-by-side:
 *   - "Primary" (left)
 *   - "Secondary" (right)
 * Both calendars initially show March 2026 and both start with no selected date.
 * Each instance has its own "Selected date:" readout directly underneath it.
 * The calendars are identical in styling; the only difference is the label above each instance.
 * No other interactive elements are present (clutter: none).
 *
 * Success: Secondary calendar selected_date equals 2026-03-18.
 *          Primary calendar remains unselected (null).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [primaryDate, setPrimaryDate] = useState<Dayjs | null>(null);
  const [secondaryDate, setSecondaryDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (
      secondaryDate &&
      secondaryDate.format('YYYY-MM-DD') === '2026-03-18' &&
      primaryDate === null
    ) {
      onSuccess();
    }
  }, [primaryDate, secondaryDate, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 700 }} data-testid="calendar-card">
        <CardContent>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {/* Primary Calendar */}
            <Box sx={{ flex: 1 }} data-testid="datecalendar-primary">
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Primary</Typography>
              <DateCalendar
                value={primaryDate}
                onChange={(newValue) => setPrimaryDate(newValue)}
                referenceDate={dayjs('2026-03-01')}
              />
              <Box sx={{ mt: 1, fontSize: 13 }}>
                <Typography component="span" sx={{ fontWeight: 500 }}>
                  Selected date:{' '}
                </Typography>
                <Typography component="span" data-testid="primary-selected">
                  {primaryDate ? primaryDate.format('YYYY-MM-DD') : '—'}
                </Typography>
              </Box>
            </Box>

            {/* Secondary Calendar */}
            <Box sx={{ flex: 1 }} data-testid="datecalendar-secondary">
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Secondary</Typography>
              <DateCalendar
                value={secondaryDate}
                onChange={(newValue) => setSecondaryDate(newValue)}
                referenceDate={dayjs('2026-03-01')}
              />
              <Box sx={{ mt: 1, fontSize: 13 }}>
                <Typography component="span" sx={{ fontWeight: 500 }}>
                  Selected date:{' '}
                </Typography>
                <Typography component="span" data-testid="secondary-selected">
                  {secondaryDate ? secondaryDate.format('YYYY-MM-DD') : '—'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
