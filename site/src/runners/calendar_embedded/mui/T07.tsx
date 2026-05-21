'use client';

/**
 * calendar_embedded-mui-T07: Set a delivery date in a form section (with distractors)
 *
 * Layout: form_section centered (light theme, comfortable spacing, default scale) with low clutter.
 * The page shows a "Delivery details" form with several focusable controls (Name input, Address input, and a non-required "Shipping speed" radio group).
 * Under the form fields is a labeled area "Delivery date" containing one embedded MUI X DateCalendar (inline).
 * The calendar starts on February 2026 with no date selected.
 * Month navigation is done via the header arrow buttons; there is no popover or separate date field.
 * A readout below the calendar displays "Delivery date:" and updates to YYYY-MM-DD upon selection.
 * The surrounding form controls are distractors only; success depends solely on the calendar's selected date.
 *
 * Success: The Delivery date calendar selected_date equals 2026-07-09.
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (selectedDate && selectedDate.format('YYYY-MM-DD') === '2026-07-09') {
      onSuccess();
    }
  }, [selectedDate, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 420 }} data-testid="form-card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Delivery details
          </Typography>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Name"
              placeholder="Enter your name"
              size="small"
              data-testid="name-input"
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Address"
              placeholder="Enter your address"
              size="small"
              data-testid="address-input"
            />
          </Box>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Shipping speed</FormLabel>
            <RadioGroup row defaultValue="standard">
              <FormControlLabel value="standard" control={<Radio size="small" />} label="Standard" />
              <FormControlLabel value="express" control={<Radio size="small" />} label="Express" />
            </RadioGroup>
          </FormControl>

          <Box>
            <Typography sx={{ fontWeight: 500, mb: 1 }}>Delivery date</Typography>
            <DateCalendar
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              referenceDate={dayjs('2026-02-01')}
              data-testid="calendar-embedded"
            />
            <Box sx={{ mt: 1, fontSize: 13 }}>
              <Typography component="span" sx={{ fontWeight: 500 }}>
                Delivery date:{' '}
              </Typography>
              <Typography component="span" data-testid="selected-date">
                {selectedDate ? selectedDate.format('YYYY-MM-DD') : '—'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
