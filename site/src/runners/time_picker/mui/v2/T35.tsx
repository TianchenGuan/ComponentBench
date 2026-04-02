'use client';

/**
 * time_picker-mui-v2-T35: Static time picker confirmation with sibling field preserved
 *
 * Planner card: inline StaticTimePicker for End time (17:00 → 22:35) with Cancel/OK action bar.
 * Start time read-only 09:00; metadata text field is a distractor.
 *
 * Success: End accepted 22:35; Start remains 09:00.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box, TextField } from '@mui/material';
import { LocalizationProvider, StaticTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

export default function T35({ onSuccess }: TaskComponentProps) {
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs('17:00', 'HH:mm'));
  const [meta, setMeta] = useState('Weekly sync');
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (endTime && endTime.isValid() && endTime.format('HH:mm') === '22:35') {
      fired.current = true;
      onSuccess();
    }
  }, [endTime, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 440 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Planner panel
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
            End time uses the inline picker — confirm with OK.
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ flex: '1 1 160px' }}>
              <Typography component="label" sx={{ fontWeight: 500, mb: 0.5, display: 'block', fontSize: 13 }}>
                Start time
              </Typography>
              <TextField
                value="09:00"
                fullWidth
                size="small"
                InputProps={{ readOnly: true }}
                inputProps={{ 'data-testid': 'tp-planner-start' }}
              />
            </Box>
            <Box sx={{ flex: '1 1 200px' }}>
              <Typography component="label" sx={{ fontWeight: 500, mb: 0.5, display: 'block', fontSize: 13 }}>
                Session title
              </Typography>
              <TextField
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
                fullWidth
                size="small"
                placeholder="Title"
              />
            </Box>
          </Box>

          <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block', fontSize: 13 }}>
            End time
          </Typography>
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1, maxWidth: 360 }}>
            <StaticTimePicker
              value={endTime}
              onChange={(v) => setEndTime(v)}
              ampm={false}
              displayStaticWrapperAs="desktop"
              slotProps={{
                actionBar: { actions: ['cancel', 'accept'] },
              }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Set End time to 22:35 and press OK on the picker.
          </Typography>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
