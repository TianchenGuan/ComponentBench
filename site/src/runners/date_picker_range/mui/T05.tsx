'use client';

/**
 * date_picker_range-mui-T05: Use a shortcut chip to set a sprint window
 *
 * Isolated card centered in the viewport containing a static (always-visible)
 * MUI X date range picker labeled 'Sprint window'. On the left side of the calendar
 * is a shortcuts column with clickable items (chips), including:
 * - 'Sprint 1 (01/12/2026–01/23/2026)'
 * - 'Sprint 2 (01/26/2026–02/06/2026)'
 * - 'Sprint 3 (02/09/2026–02/20/2026)'
 * - 'Reset'
 * The picker has an action bar at the bottom with 'Cancel' and 'OK'. Clicking
 * a shortcut updates the highlighted range; clicking OK is required to accept/apply
 * the currently highlighted range.
 *
 * Note: Using two StaticDatePickers with shortcuts as MUI free tier doesn't include StaticDateRangePicker.
 *
 * Success: Start date = 2026-02-09, End date = 2026-02-20 (confirmed with OK)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box, Button, Stack, Chip, Divider } from '@mui/material';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
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
      startValue.format('YYYY-MM-DD') === '2026-02-09' &&
      endValue.format('YYYY-MM-DD') === '2026-02-20'
    ) {
      onSuccess();
    }
  }, [startValue, endValue, onSuccess]);

  const shortcuts = [
    { label: 'Sprint 1 (01/12/2026–01/23/2026)', start: dayjs('2026-01-12'), end: dayjs('2026-01-23') },
    { label: 'Sprint 2 (01/26/2026–02/06/2026)', start: dayjs('2026-01-26'), end: dayjs('2026-02-06') },
    { label: 'Sprint 3 (02/09/2026–02/20/2026)', start: dayjs('2026-02-09'), end: dayjs('2026-02-20') },
  ];

  const handleShortcut = (start: Dayjs, end: Dayjs) => {
    setDraftStart(start);
    setDraftEnd(end);
  };

  const handleReset = () => {
    setDraftStart(null);
    setDraftEnd(null);
  };

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
      <Card sx={{ width: 1000 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Sprint window — choose a shortcut</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Shortcuts */}
            <Box sx={{ minWidth: 220 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Shortcuts</Typography>
              <Stack spacing={1}>
                {shortcuts.map((shortcut) => (
                  <Chip
                    key={shortcut.label}
                    label={shortcut.label}
                    onClick={() => handleShortcut(shortcut.start, shortcut.end)}
                    variant={
                      draftStart?.format('YYYY-MM-DD') === shortcut.start.format('YYYY-MM-DD') &&
                      draftEnd?.format('YYYY-MM-DD') === shortcut.end.format('YYYY-MM-DD')
                        ? 'filled'
                        : 'outlined'
                    }
                    color="primary"
                    sx={{ justifyContent: 'flex-start' }}
                  />
                ))}
                <Chip
                  label="Reset"
                  onClick={handleReset}
                  variant="outlined"
                  color="error"
                />
              </Stack>
            </Box>
            
            <Divider orientation="vertical" flexItem />
            
            {/* Calendars */}
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={2}>
                <Box>
                  <Typography variant="caption">Start Date</Typography>
                  <StaticDatePicker
                    value={draftStart}
                    onChange={(newValue) => setDraftStart(newValue)}
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
                    slotProps={{
                      actionBar: { actions: [] },
                    }}
                  />
                </Box>
              </Stack>
              
              {/* Action Bar */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button onClick={handleCancel} data-testid="cancel-button">Cancel</Button>
                <Button variant="contained" onClick={handleOk} data-testid="ok-button">OK</Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
