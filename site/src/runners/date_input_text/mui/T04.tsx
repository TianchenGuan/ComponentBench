'use client';

/**
 * date_input_text-mui-T04: MUI two DateFields in a form section (disambiguate by label)
 * 
 * Layout: form_section centered in the viewport with a header "Schedule".
 * Components: two MUI X DateField inputs stacked with labels:
 *   - "Start date" (pre-filled with 05/10/2026)
 *   - "End date" (empty)
 * Both fields use MM/DD/YYYY and sectioned editing.
 * Distractors (clutter=low): a "Timezone" select (disabled) and a "Notes" multiline field (optional) are visible.
 * Feedback: entering a valid date updates the field's displayed value and removes any placeholder sections.
 * 
 * Success: The "End date" DateField value equals 2026-05-20.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, FormControl, InputLabel, Select, MenuItem, TextField, Stack } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs('2026-05-10'));
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (endDate && endDate.isValid() && endDate.format('YYYY-MM-DD') === '2026-05-20') {
      onSuccess();
    }
  }, [endDate, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 450 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Schedule</Typography>
          
          <Stack spacing={2}>
            <Box>
              <Typography component="label" htmlFor="start-date" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
                Start date
              </Typography>
              <DateField
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="MM/DD/YYYY"
                slotProps={{
                  textField: {
                    id: 'start-date',
                    fullWidth: true,
                    inputProps: {
                      'data-testid': 'start-date',
                    },
                  },
                }}
              />
            </Box>

            <Box>
              <Typography component="label" htmlFor="end-date" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
                End date
              </Typography>
              <DateField
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="MM/DD/YYYY"
                slotProps={{
                  textField: {
                    id: 'end-date',
                    fullWidth: true,
                    placeholder: 'MM/DD/YYYY',
                    inputProps: {
                      'data-testid': 'end-date',
                    },
                  },
                }}
              />
            </Box>

            <FormControl fullWidth disabled>
              <InputLabel id="timezone-label">Timezone</InputLabel>
              <Select
                labelId="timezone-label"
                value="EST"
                label="Timezone"
              >
                <MenuItem value="EST">EST (UTC-5)</MenuItem>
                <MenuItem value="PST">PST (UTC-8)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Notes"
              multiline
              rows={2}
              placeholder="Optional notes..."
              fullWidth
            />
          </Stack>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
