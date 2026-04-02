'use client';

/**
 * calendar_embedded-mui-T08: Pick a date and confirm with OK (StaticDatePicker, dark theme)
 *
 * Layout: isolated_card centered in a dark theme (comfortable spacing, default scale).
 * The card contains a MUI X StaticDatePicker rendered inline (no popover, no text field).
 * The picker shows the calendar grid and also includes an action bar at the bottom with two buttons: "Cancel" and "OK".
 * Interaction is staged: clicking a day changes a pending selection highlight, but the committed value only updates when "OK" is pressed.
 * A readout line beneath the component says "Confirmed date:" and updates to YYYY-MM-DD only after OK is clicked (initially shows "(none)").
 * The calendar starts around February 2026, so reaching 2032-12 requires using the internal year/month navigation (year view and/or repeated month navigation).
 * No other interactive elements exist on the page (clutter: none).
 *
 * Success: The committed/confirmed date equals 2032-12-28.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [pendingDate, setPendingDate] = useState<Dayjs | null>(null);
  const [confirmedDate, setConfirmedDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (confirmedDate && confirmedDate.format('YYYY-MM-DD') === '2032-12-28') {
      onSuccess();
    }
  }, [confirmedDate, onSuccess]);

  const handleAccept = (value: Dayjs | null) => {
    setConfirmedDate(value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card
        sx={{
          width: 380,
          bgcolor: '#1f1f1f',
          color: '#fff',
          '& .MuiPickersLayout-root': {
            bgcolor: '#1f1f1f',
          },
          '& .MuiPickersCalendarHeader-label': {
            color: '#fff',
          },
          '& .MuiDayCalendar-weekDayLabel': {
            color: '#999',
          },
          '& .MuiPickersDay-root': {
            color: '#fff',
          },
          '& .MuiPickersDay-root:hover': {
            bgcolor: '#333',
          },
          '& .MuiPickersDay-root.Mui-selected': {
            bgcolor: '#1976d2',
          },
          '& .MuiPickersYear-yearButton': {
            color: '#fff',
          },
          '& .MuiPickersMonth-monthButton': {
            color: '#fff',
          },
          '& .MuiIconButton-root': {
            color: '#fff',
          },
          '& .MuiDialogActions-root': {
            bgcolor: '#1f1f1f',
          },
        }}
        data-testid="calendar-card"
      >
        <CardContent sx={{ p: 0 }}>
          <StaticDatePicker
            value={pendingDate}
            onChange={(newValue) => setPendingDate(newValue)}
            onAccept={handleAccept}
            referenceDate={dayjs('2026-02-01')}
            slotProps={{
              actionBar: {
                actions: ['cancel', 'accept'],
              },
            }}
            data-testid="calendar-embedded"
          />
          <Box sx={{ px: 2, pb: 2, fontSize: 14 }}>
            <Typography component="span" sx={{ fontWeight: 500 }}>
              Confirmed date:{' '}
            </Typography>
            <Typography component="span" data-testid="confirmed-date">
              {confirmedDate ? confirmedDate.format('YYYY-MM-DD') : '(none)'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
