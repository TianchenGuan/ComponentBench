'use client';

/**
 * calendar_embedded-mui-T03: Clear the selected date (MUI DateCalendar)
 *
 * Layout: isolated_card centered (light theme, comfortable spacing, default scale).
 * The card contains a single MUI X DateCalendar showing February 2026.
 * A date is pre-selected on load: 2026-02-02 (the day has the selected styling).
 * Under the calendar, a readout says "Selected date: 2026-02-02".
 * Next to the readout is a small button labeled "Clear date" (with a clear/close icon). Clicking it resets the selection to empty (null).
 * No other interactive components are shown (clutter: none).
 *
 * Success: The calendar has no selected date (value is null).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ClearIcon from '@mui/icons-material/Clear';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs('2026-02-02'));

  useEffect(() => {
    if (selectedDate === null) {
      onSuccess();
    }
  }, [selectedDate, onSuccess]);

  const handleClear = () => {
    setSelectedDate(null);
  };

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
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ fontSize: 14 }}>
              <Typography component="span" sx={{ fontWeight: 500 }}>
                Selected date:{' '}
              </Typography>
              <Typography component="span" data-testid="selected-date">
                {selectedDate ? selectedDate.format('YYYY-MM-DD') : '(none)'}
              </Typography>
            </Box>
            <Button
              size="small"
              startIcon={<ClearIcon />}
              onClick={handleClear}
              data-testid="clear-date"
            >
              Clear date
            </Button>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
