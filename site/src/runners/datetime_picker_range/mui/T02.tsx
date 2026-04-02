'use client';

/**
 * datetime_picker_range-mui-T02: Filters: clear a prefilled date-time range
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing, default scale.
 * Composite of two MUI DateTimePicker inputs with clearable functionality.
 * Initial state: start=04/17/2026 03:30 PM, end=04/21/2026 06:30 PM. No other controls.
 *
 * Success: Both start and end are empty (null).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Stack, IconButton, InputAdornment } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Dayjs | null>(
    dayjs('2026-04-17 15:30', 'YYYY-MM-DD HH:mm')
  );
  const [endValue, setEndValue] = useState<Dayjs | null>(
    dayjs('2026-04-21 18:30', 'YYYY-MM-DD HH:mm')
  );

  useEffect(() => {
    if (startValue === null && endValue === null) {
      onSuccess();
    }
  }, [startValue, endValue, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 500 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Filters</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Created between (An ✕ clear icon appears at the end of each field.)
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
                Start
              </Typography>
              <DateTimePicker
                value={startValue}
                onChange={(newValue) => setStartValue(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    inputProps: { 'data-testid': 'dt-range-start' },
                    InputProps: {
                      endAdornment: startValue ? (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setStartValue(null)}
                            data-testid="clear-start"
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ) : undefined,
                    },
                  },
                }}
              />
            </Box>
            <Box>
              <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
                End
              </Typography>
              <DateTimePicker
                value={endValue}
                onChange={(newValue) => setEndValue(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    inputProps: { 'data-testid': 'dt-range-end' },
                    InputProps: {
                      endAdornment: endValue ? (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setEndValue(null)}
                            data-testid="clear-end"
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ) : undefined,
                    },
                  },
                }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
