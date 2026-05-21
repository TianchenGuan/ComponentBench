'use client';

/**
 * calendar_embedded-mui-T05: Select the starred day (visual reference)
 *
 * Layout: isolated_card centered (light theme, comfortable spacing, default scale).
 * The card contains a single MUI X DateCalendar showing March 2026.
 * A small legend above the calendar shows an icon ★ with the label "Target".
 * Exactly one day cell in the March grid contains the ★ marker in its corner (all other markers, if any, are different shapes/colors).
 * No date is selected initially. Clicking a day selects it and updates the "Selected date:" readout below the calendar.
 * There are no other interactive elements on the page (clutter: none).
 *
 * Success: The selected date equals the date whose day cell contains the ★ Target marker (2026-03-07).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Badge } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import StarIcon from '@mui/icons-material/Star';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const TARGET_DATE = '2026-03-07';

function CustomDay(props: PickersDayProps<Dayjs>) {
  const { day, outsideCurrentMonth, ...other } = props;
  const isTarget = day.format('YYYY-MM-DD') === TARGET_DATE;

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isTarget ? <StarIcon sx={{ fontSize: 12, color: '#ffc107' }} data-target="true" /> : undefined}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (selectedDate && selectedDate.format('YYYY-MM-DD') === TARGET_DATE) {
      onSuccess();
    }
  }, [selectedDate, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 380 }} data-testid="calendar-card">
        <CardContent>
          {/* Legend */}
          <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 13 }}>
            <StarIcon sx={{ fontSize: 16, color: '#ffc107' }} />
            <Typography component="span">Target</Typography>
          </Box>

          <DateCalendar
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            referenceDate={dayjs('2026-03-01')}
            slots={{
              day: CustomDay,
            }}
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
