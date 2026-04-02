'use client';

/**
 * date_picker_range-mui-T08: Match a reference promo window
 *
 * Isolated card centered in the viewport with dark theme. The
 * card is split into two columns:
 * - Left: a 'Reference A' card showing the target window. It contains a small
 *   mini-calendar strip with highlighted days and a caption reading 'Dec 1–Dec 15, 2026'.
 * - Right: a static MUI X date range picker labeled 'Promo window' with two calendars
 *   visible side-by-side (December 2026 and January 2027). The picker has an action
 *   bar with 'Cancel' and 'OK'. The current value is empty.
 *
 * Note: Using two StaticDatePickers as MUI free tier doesn't include StaticDateRangePicker.
 *
 * Success: Start date = 2026-12-01, End date = 2026-12-15, confirmed with OK.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box, Grid, Button, Stack } from '@mui/material';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Dayjs | null>(null);
  const [endValue, setEndValue] = useState<Dayjs | null>(null);
  const [draftStart, setDraftStart] = useState<Dayjs | null>(null);
  const [draftEnd, setDraftEnd] = useState<Dayjs | null>(null);
  const acceptedRef = useRef(false);

  useEffect(() => {
    if (
      acceptedRef.current &&
      startValue &&
      endValue &&
      startValue.isValid() &&
      endValue.isValid() &&
      startValue.format('YYYY-MM-DD') === '2026-12-01' &&
      endValue.format('YYYY-MM-DD') === '2026-12-15'
    ) {
      onSuccess();
    }
  }, [startValue, endValue, onSuccess]);

  const handleOk = () => {
    setStartValue(draftStart);
    setEndValue(draftEnd);
    acceptedRef.current = true;
  };

  const handleCancel = () => {
    setDraftStart(startValue);
    setDraftEnd(endValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 900, maxWidth: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Match the Reference</Typography>
          
          <Grid container spacing={3}>
            {/* Reference card */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 2,
                  border: '2px solid #1976d2',
                  borderRadius: 2,
                  background: '#e3f2fd',
                  height: '100%',
                }}
                data-testid="reference-a-card"
              >
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Reference A
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Target promo window:
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    background: '#1976d2',
                    borderRadius: 1,
                    color: '#fff',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Dec 1–Dec 15
                  </Typography>
                  <Typography variant="body2">2026</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Picker */}
            <Grid item xs={12} md={8}>
              <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
                Promo window
              </Typography>
              <Stack direction="row" spacing={2}>
                <Box>
                  <Typography variant="caption">Start Date</Typography>
                <StaticDatePicker
                  value={draftStart}
                  onChange={(newValue) => setDraftStart(newValue)}
                  referenceDate={dayjs('2026-12-01')}
                  slotProps={{
                    actionBar: { actions: [] },
                  }}
                />
                </Box>
                <Box>
                  <Typography variant="caption">End Date</Typography>
                <StaticDatePicker
                  value={draftEnd}
                  onChange={(newValue) => setDraftEnd(newValue)}
                  minDate={draftStart || undefined}
                  referenceDate={dayjs('2026-12-01')}
                  slotProps={{
                    actionBar: { actions: [] },
                  }}
                />
                </Box>
              </Stack>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button onClick={handleCancel} data-testid="cancel-button">Cancel</Button>
                <Button variant="contained" onClick={handleOk} data-testid="ok-button">OK</Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
