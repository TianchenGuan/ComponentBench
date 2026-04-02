'use client';

/**
 * date_picker_range-mui-T03: Clear an inline StaticDateRangePicker
 *
 * Isolated card in the center with a static (inline) MUI X date
 * range picker labeled 'Reporting range'. Unlike the popover variant, the calendar
 * grid is always visible (no overlay). The component is prefilled with 04/17/2026
 * – 04/21/2026. Below the calendar there is an action bar containing a 'Clear' button.
 * Clicking 'Clear' resets the range to empty (both start and end become null).
 *
 * Note: Using two StaticDatePickers as MUI free tier doesn't include StaticDateRangePicker.
 *
 * Success: Start date is empty (null), End date is empty (null).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, Stack } from '@mui/material';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Dayjs | null>(dayjs('2026-04-17'));
  const [endValue, setEndValue] = useState<Dayjs | null>(dayjs('2026-04-21'));

  useEffect(() => {
    if (!startValue && !endValue) {
      onSuccess();
    }
  }, [startValue, endValue, onSuccess]);

  const handleClear = () => {
    setStartValue(null);
    setEndValue(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 700 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Reporting range</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block', alignSelf: 'flex-start' }}>
              Reporting range
            </Typography>
            <Stack direction="row" spacing={2}>
              <Box>
                <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>Start Date</Typography>
                <StaticDatePicker
                  value={startValue}
                  onChange={(newValue) => setStartValue(newValue)}
                  slotProps={{
                    actionBar: { actions: [] },
                  }}
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>End Date</Typography>
                <StaticDatePicker
                  value={endValue}
                  onChange={(newValue) => setEndValue(newValue)}
                  minDate={startValue || undefined}
                  slotProps={{
                    actionBar: { actions: [] },
                  }}
                />
              </Box>
            </Stack>
            <Button 
              variant="outlined" 
              onClick={handleClear} 
              sx={{ mt: 2 }}
              data-testid="clear-button"
            >
              Clear
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Current: {startValue && endValue ? `${startValue.format('MM/DD/YYYY')} – ${endValue.format('MM/DD/YYYY')}` : 'Empty'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
