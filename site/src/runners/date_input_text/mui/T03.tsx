'use client';

/**
 * date_input_text-mui-T03: MUI DateField clear using clearable control
 * 
 * Layout: isolated_card centered in the viewport.
 * Component: One MUI X DateField labeled "Due date" with clearable behavior enabled.
 * Initial state: pre-filled with 04/05/2026.
 * Sub-controls: a small clear icon button appears inside the field when it has a value (standard MUI X clearable behavior).
 * Distractors: none.
 * Feedback: after clearing, the field shows the placeholder "MM/DD/YYYY" again and the value becomes null.
 * 
 * Success: The "Due date" DateField value is empty/null (no date selected).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs('2026-04-05'));
  const initialRender = useRef(true);

  useEffect(() => {
    // Skip initial render
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    if (value === null) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Task</Typography>
          <Box>
            <Typography component="label" htmlFor="due-date" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Due date
            </Typography>
            <DateField
              value={value}
              onChange={(newValue) => setValue(newValue)}
              format="MM/DD/YYYY"
              clearable
              slotProps={{
                textField: {
                  id: 'due-date',
                  fullWidth: true,
                  placeholder: 'MM/DD/YYYY',
                  inputProps: {
                    'data-testid': 'due-date',
                  },
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
