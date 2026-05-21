'use client';

/**
 * date_input_text-mui-T05: MUI DateField with dash separator custom format
 * 
 * Layout: isolated_card centered in the viewport.
 * Component: one MUI X DateField labeled "Archive date".
 * Configuration: the field uses a dash-separated display/parse format (YYYY-MM-DD) and shows a placeholder like "YYYY-MM-DD".
 * Initial state: empty.
 * Behavior: sectioned input still applies, but separators are dashes; users can type the full string or edit sections.
 * Distractors: none.
 * Feedback: the value becomes valid only when all sections form a real calendar date.
 * 
 * Success: The "Archive date" DateField value equals 2026-06-30.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.isValid() && value.format('YYYY-MM-DD') === '2026-06-30') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Archive Settings</Typography>
          <Box>
            <Typography component="label" htmlFor="archive-date" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Archive date
            </Typography>
            <DateField
              value={value}
              onChange={(newValue) => setValue(newValue)}
              format="YYYY-MM-DD"
              slotProps={{
                textField: {
                  id: 'archive-date',
                  fullWidth: true,
                  placeholder: 'YYYY-MM-DD',
                  inputProps: {
                    'data-testid': 'archive-date',
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
