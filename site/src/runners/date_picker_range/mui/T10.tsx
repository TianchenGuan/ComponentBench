'use client';

/**
 * date_picker_range-mui-T10: Select a cross-year fiscal close range with 3 calendars
 *
 * An isolated card placed at the bottom-right of the viewport.
 * The page uses compact spacing and the date range picker is rendered in a small
 * size. It contains a single MUI X DateRangePicker labeled 'Fiscal close'. The
 * picker is configured to show 3 calendars side-by-side in the popover (December
 * 2026, January 2027, February 2027) to support wide-range selection. It also requires
 * explicit confirmation: after selecting start and end, the action bar shows an
 * 'OK' button that must be pressed to apply (closeOnSelect is disabled). The field
 * starts empty.
 *
 * Note: Using two DatePickers as MUI free tier doesn't include DateRangePicker.
 *
 * Success: Start date = 2026-12-29, End date = 2027-01-06, confirmed with OK.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box, Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Dayjs | null>(null);
  const [endValue, setEndValue] = useState<Dayjs | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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
      startValue.format('YYYY-MM-DD') === '2026-12-29' &&
      endValue.format('YYYY-MM-DD') === '2027-01-06'
    ) {
      onSuccess();
    }
  }, [startValue, endValue, onSuccess]);

  const handleOpen = () => {
    setDialogOpen(true);
    setDraftStart(startValue);
    setDraftEnd(endValue);
  };

  const handleOk = () => {
    setStartValue(draftStart);
    setEndValue(draftEnd);
    acceptedRef.current = true;
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 420 }} data-testid="fiscal-close-card">
        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Fiscal close (compact)</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 0.5, display: 'block', fontSize: 13 }}>
              Fiscal close
            </Typography>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={handleOpen}
              data-testid="fiscal-close-button"
            >
              {startValue && endValue
                ? `${startValue.format('YYYY-MM-DD')} – ${endValue.format('YYYY-MM-DD')}`
                : 'Select date range'}
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Select Dec 29, 2026 through Jan 6, 2027, then click OK.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Date Range Dialog with 3 calendars */}
      <Dialog open={dialogOpen} onClose={handleCancel} maxWidth="lg">
        <DialogTitle>Select Fiscal Close Window</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="caption">December 2026</Typography>
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
              <Typography variant="caption">January 2027</Typography>
              <StaticDatePicker
                value={draftEnd}
                onChange={(newValue) => setDraftEnd(newValue)}
                minDate={draftStart || undefined}
                referenceDate={dayjs('2027-01-01')}
                slotProps={{
                  actionBar: { actions: [] },
                }}
              />
            </Box>
            <Box>
              <Typography variant="caption">February 2027</Typography>
              <StaticDatePicker
                value={null}
                onChange={() => {}}
                referenceDate={dayjs('2027-02-01')}
                disabled
                slotProps={{
                  actionBar: { actions: [] },
                }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} data-testid="cancel-button">Cancel</Button>
          <Button onClick={handleOk} variant="contained" data-testid="ok-button">OK</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
