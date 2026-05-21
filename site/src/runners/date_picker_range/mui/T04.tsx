'use client';

/**
 * date_picker_range-mui-T04: Type start and end into a multi-input field
 *
 * A form_section layout for product settings. The date range control
 * is a MUI X DateRangePicker configured with a MultiInputDateRangeField, rendering
 * two separate text fields labeled 'Start' and 'End' with placeholders 'MM/DD/YYYY'.
 * The calendar popover can be opened, but the intended path is keyboard input. The
 * range is considered set when both fields contain valid dates and the picker commits
 * the value (pressing Enter or blurring the field). Other fields on the form (SKU
 * text input, 'Active' checkbox) are present as low clutter but are not required.
 *
 * Note: Using two DatePickers as MUI free tier doesn't include DateRangePicker.
 *
 * Success: Start date = 2026-05-01, End date = 2026-05-31 (Warranty period instance)
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, TextField, Checkbox, FormControlLabel, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Dayjs | null>(null);
  const [endValue, setEndValue] = useState<Dayjs | null>(null);
  const [sku, setSku] = useState('');
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (
      startValue &&
      endValue &&
      startValue.isValid() &&
      endValue.isValid() &&
      startValue.format('YYYY-MM-DD') === '2026-05-01' &&
      endValue.format('YYYY-MM-DD') === '2026-05-31'
    ) {
      onSuccess();
    }
  }, [startValue, endValue, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 500 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Product Settings</Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Enter SKU"
              fullWidth
              inputProps={{ 'data-testid': 'sku-input' }}
            />
            
            <Box>
              <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
                Warranty period
              </Typography>
              <Stack direction="row" spacing={2}>
                <DatePicker
                  label="Start"
                  value={startValue}
                  onChange={(newValue) => setStartValue(newValue)}
                  format="MM/DD/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      helperText: 'MM/DD/YYYY',
                      inputProps: {
                        'data-testid': 'warranty-start',
                      },
                    },
                  }}
                />
                <DatePicker
                  label="End"
                  value={endValue}
                  onChange={(newValue) => setEndValue(newValue)}
                  format="MM/DD/YYYY"
                  minDate={startValue || undefined}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      helperText: 'MM/DD/YYYY',
                      inputProps: {
                        'data-testid': 'warranty-end',
                      },
                    },
                  }}
                />
              </Stack>
            </Box>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  data-testid="active-checkbox"
                />
              }
              label="Active"
            />
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
