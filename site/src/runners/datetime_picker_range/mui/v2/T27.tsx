'use client';

/**
 * datetime_picker_range-mui-v2-T27: Freeze window — role-aware shouldDisableDate (start: weekdays blocked; end: Saturdays blocked)
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

/** Start picker: only weekend dates selectable (Mon–Fri disabled). */
function disableForStart(date: Dayjs): boolean {
  const d = date.day();
  return d >= 1 && d <= 5;
}

/** End picker: Saturdays disabled; Sun–Fri allowed. */
function disableForEnd(date: Dayjs): boolean {
  return date.day() === 6;
}

export default function T27({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [startValue, setStartValue] = useState<Dayjs | null>(null);
  const [endValue, setEndValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (!startValue || !endValue) return;
    const sOk = startValue.format('YYYY-MM-DD HH:mm') === '2027-03-14 09:00';
    const eOk = endValue.format('YYYY-MM-DD HH:mm') === '2027-03-21 18:00';
    if (sOk && eOk) {
      onSuccess();
    }
  }, [startValue, endValue, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 1 }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Freeze schedule
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Freeze schedule</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Some dates are disabled depending on start vs end. Target: Mar 14, 2027 9:00 AM → Mar 21, 2027 6:00 PM.
            </Typography>
            <Box data-cb-instance="Freeze window">
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Freeze window
              </Typography>
              <Stack spacing={2}>
                <DateTimePicker
                  label="Start"
                  value={startValue}
                  onChange={(v) => setStartValue(v)}
                  shouldDisableDate={disableForStart}
                  closeOnSelect={false}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      inputProps: { 'data-testid': 'dt-freeze-start' },
                    },
                    actionBar: { actions: ['cancel', 'accept'] },
                  }}
                />
                <DateTimePicker
                  label="End"
                  value={endValue}
                  onChange={(v) => setEndValue(v)}
                  shouldDisableDate={disableForEnd}
                  closeOnSelect={false}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      inputProps: { 'data-testid': 'dt-freeze-end' },
                    },
                    actionBar: { actions: ['cancel', 'accept'] },
                  }}
                />
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
