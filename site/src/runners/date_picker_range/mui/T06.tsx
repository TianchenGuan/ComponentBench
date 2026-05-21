'use client';

/**
 * date_picker_range-mui-T06: Navigate picker to November 2026
 *
 * An isolated card centered in the viewport with one MUI X desktop
 * DateRangePicker labeled 'Archive window'. The field is empty. When opened, the
 * popover shows one calendar month at a time with left/right navigation arrows in
 * the header. The picker starts near February 2026. The goal is to use the month
 * navigation controls until the month label shows 'November 2026'.
 *
 * Note: Using two DatePickers as MUI free tier doesn't include DateRangePicker.
 *
 * Success: Calendar popover is open and shows 2026-11 as any visible month.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Dayjs | null>(null);
  const [endValue, setEndValue] = useState<Dayjs | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const successFiredRef = useRef(false);

  // Poll for month changes while the picker is open
  useEffect(() => {
    if (!isOpen) return;

    const checkMonth = () => {
      if (successFiredRef.current) return;
      
      // Look for MUI calendar header with November 2026
      const monthLabels = document.querySelectorAll('.MuiPickersCalendarHeader-label');
      for (let i = 0; i < monthLabels.length; i++) {
        const label = monthLabels[i];
        const text = label.textContent || '';
        if (text.includes('November') && text.includes('2026')) {
          successFiredRef.current = true;
          onSuccess();
          return;
        }
      }
    };

    checkMonth();
    const interval = setInterval(checkMonth, 200);
    return () => clearInterval(interval);
  }, [isOpen, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 500 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Archive window — navigate calendar</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Archive window
            </Typography>
            <Stack direction="row" spacing={2}>
              <DatePicker
                label="Start"
                value={startValue}
                onChange={(newValue) => setStartValue(newValue)}
                open={isOpen}
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    inputProps: {
                      'data-testid': 'archive-window-start',
                    },
                  },
                }}
              />
              <DatePicker
                label="End"
                value={endValue}
                onChange={(newValue) => setEndValue(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    inputProps: {
                      'data-testid': 'archive-window-end',
                    },
                  },
                }}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Navigate to November 2026
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
