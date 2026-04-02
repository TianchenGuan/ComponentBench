'use client';

/**
 * date_picker_range-mui-v2-T16: Start-end specific disabled dates in a scheduler modal
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const isWeekend = (date: Dayjs) => date.day() === 0 || date.day() === 6;

const shouldDisableStartDate = (date: Dayjs) => isWeekend(date);

const shouldDisableEndDate = (date: Dayjs) => {
  if (isWeekend(date)) return true;
  const d = date.format('YYYY-MM-DD');
  return d === '2027-03-17' || d === '2027-03-18';
};

export default function T16({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      accepted &&
      startDate &&
      endDate &&
      startDate.format('YYYY-MM-DD') === '2027-03-11' &&
      endDate.format('YYYY-MM-DD') === '2027-03-16'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [accepted, startDate, endDate, onSuccess]);

  const handleOk = () => {
    setAccepted(true);
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setStartDate(null);
    setEndDate(null);
    setAccepted(false);
    setDialogOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ maxWidth: 480 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Rollout Scheduler</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Schedule your next rollout. Weekends are blocked for start dates;
            additional dates may be blocked for end dates.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip size="small" label="Q1 2027" />
            <Chip size="small" label="Production" color="warning" variant="outlined" />
          </Stack>
          <Button
            variant="contained"
            onClick={() => setDialogOpen(true)}
            data-testid="schedule-rollout-btn"
          >
            Schedule rollout
          </Button>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule rollout</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Some dates are disabled differently for the start and end positions.
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography component="label" sx={{ fontWeight: 500, mb: 0.5, display: 'block', fontSize: 14 }}>
              Rollout dates
            </Typography>
            <Stack direction="row" spacing={2}>
              <DatePicker
                label="Start"
                value={startDate}
                onChange={(v) => { setStartDate(v); setAccepted(false); }}
                shouldDisableDate={shouldDisableStartDate}
                format="YYYY-MM-DD"
                // @ts-expect-error MUI DatePicker version mismatch
                defaultCalendarMonth={dayjs('2027-03-01')}
                closeOnSelect={false}
                slotProps={{
                  textField: { size: 'small', fullWidth: true, inputProps: { 'data-testid': 'rollout-start' } },
                  actionBar: { actions: ['cancel', 'accept'] },
                }}
              />
              <DatePicker
                label="End"
                value={endDate}
                onChange={(v) => { setEndDate(v); setAccepted(false); }}
                shouldDisableDate={shouldDisableEndDate}
                minDate={startDate || undefined}
                format="YYYY-MM-DD"
                // @ts-expect-error MUI DatePicker version mismatch
                defaultCalendarMonth={dayjs('2027-03-01')}
                closeOnSelect={false}
                slotProps={{
                  textField: { size: 'small', fullWidth: true, inputProps: { 'data-testid': 'rollout-end' } },
                  actionBar: { actions: ['cancel', 'accept'] },
                }}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} data-testid="rollout-cancel">Cancel</Button>
          <Button variant="contained" onClick={handleOk} data-testid="rollout-ok">OK</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
