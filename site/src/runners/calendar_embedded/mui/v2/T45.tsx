'use client';

/**
 * calendar_embedded-mui-v2-T45: Review calendar — purple ring target, Apply reveals date
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, Stack } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const TARGET = '2027-03-12';
/** Orange “busy” decoys */
const BUSY = new Set(['2027-03-07', '2027-03-18', '2027-03-25']);
/** Gray “blocked” decoys */
const BLOCKED = new Set(['2027-03-03', '2027-03-14', '2027-03-22']);

function ReviewDay(props: PickersDayProps<Dayjs>) {
  const { day, outsideCurrentMonth, ...other } = props;
  const iso = day.format('YYYY-MM-DD');
  const isTarget = iso === TARGET;
  const busy = BUSY.has(iso);
  const blocked = BLOCKED.has(iso);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        ...(isTarget && {
          borderRadius: '50%',
          outline: '2px solid #9c27b0',
          outlineOffset: 1,
        }),
      }}
      {...(isTarget ? { 'data-reference-id': 'review-calendar-purple-target' as const } : {})}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      {(busy || blocked) && !outsideCurrentMonth && (
        <Box
          component="span"
          sx={{
            position: 'absolute',
            bottom: 2,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 5,
            height: 5,
            borderRadius: '50%',
            bgcolor: busy ? '#ff9800' : '#9e9e9e',
            pointerEvents: 'none',
          }}
        />
      )}
    </Box>
  );
}

export default function T45({ onSuccess }: TaskComponentProps) {
  const [pending, setPending] = useState<Dayjs | null>(null);
  const [applied, setApplied] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (applied && applied.format('YYYY-MM-DD') === TARGET) {
      onSuccess();
    }
  }, [applied, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ maxWidth: 420 }} data-testid="review-dashboard">
        <CardContent>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Review calendar
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 1.5, fontSize: 13, flexWrap: 'wrap' }}>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Box sx={{ width: 14, height: 14, borderRadius: '50%', outline: '2px solid #9c27b0' }} />
              <span>Target</span>
            </Stack>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ff9800' }} />
              <span>Busy</span>
            </Stack>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#9e9e9e' }} />
              <span>Blocked</span>
            </Stack>
          </Stack>
          <DateCalendar
            value={pending}
            onChange={(v) => setPending(v)}
            referenceDate={dayjs('2027-03-01')}
            slots={{ day: ReviewDay }}
            data-testid="calendar-embedded"
          />
          {applied && (
            <Typography variant="body2" sx={{ mt: 2 }} data-testid="applied-review-readout">
              Applied review date: {applied.format('YYYY-MM-DD')}
            </Typography>
          )}
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => setApplied(pending)} data-testid="apply-review-date">
              Apply review date
            </Button>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
