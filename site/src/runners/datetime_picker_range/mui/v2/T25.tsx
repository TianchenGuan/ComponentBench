'use client';

/**
 * datetime_picker_range-mui-v2-T25: Night shift — dark dialog, cross-midnight/month, OK (composite DateTimePicker ×2)
 */

import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Stack,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({
  palette: { mode: 'dark' },
});

export default function T25({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [startValue, setStartValue] = useState<Dayjs | null>(null);
  const [endValue, setEndValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (!startValue || !endValue) return;
    const sOk = startValue.format('YYYY-MM-DD HH:mm') === '2027-01-31 22:00';
    const eOk = endValue.format('YYYY-MM-DD HH:mm') === '2027-02-01 06:30';
    if (sOk && eOk) {
      onSuccess();
    }
  }, [startValue, endValue, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ p: 1 }}>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Edit night shift
          </Button>
          <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Edit night shift</DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Set Night shift window. Use OK in each picker to accept.
              </Typography>
              <Box data-cb-instance="Night shift window">
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Night shift window
                </Typography>
                <Stack spacing={2}>
                  <DateTimePicker
                    label="Start"
                    value={startValue}
                    onChange={(v) => setStartValue(v)}
                    closeOnSelect={false}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        inputProps: { 'data-testid': 'dt-night-start' },
                      },
                      actionBar: { actions: ['cancel', 'accept'] },
                    }}
                  />
                  <DateTimePicker
                    label="End"
                    value={endValue}
                    onChange={(v) => setEndValue(v)}
                    closeOnSelect={false}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        inputProps: { 'data-testid': 'dt-night-end' },
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
    </ThemeProvider>
  );
}
