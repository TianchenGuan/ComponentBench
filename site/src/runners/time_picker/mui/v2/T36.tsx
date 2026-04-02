'use client';

/**
 * time_picker-mui-v2-T36: Dashboard filter End time from a visual reference clock card
 *
 * Filter strip: reference clock card (no HH:mm text), Start read-only 09:00, End DesktopTimePicker with OK,
 * Grace period number field.
 *
 * Success: End accepted 17:45; Start remains 09:00.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
} from '@mui/material';
import { LocalizationProvider, DesktopTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

/** Analog clock for 17:45 — hands only (no HH:mm digits on the card). */
function ReferenceClockCard() {
  return (
    <Card variant="outlined" sx={{ width: 140, flexShrink: 0 }} data-testid="end-time-clock-reference">
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="caption" color="text.secondary" display="block" textAlign="center" sx={{ mb: 0.5 }}>
          Reference
        </Typography>
        <svg viewBox="0 0 100 100" width="100%" height="100" aria-hidden>
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" opacity={0.35} />
          {Array.from({ length: 12 }, (_, i) => {
            const ang = ((i * 30 - 90) * Math.PI) / 180;
            const x1 = 50 + 40 * Math.cos(ang);
            const y1 = 50 + 40 * Math.sin(ang);
            const x2 = 50 + 36 * Math.cos(ang);
            const y2 = 50 + 36 * Math.sin(ang);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={i % 3 === 0 ? 2 : 1} opacity={0.45} />;
          })}
          {/* 17:45: hour hand 172.5°, minute 270° from 12 o'clock */}
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="28"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            transform="rotate(172.5 50 50)"
          />
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            transform="rotate(270 50 50)"
          />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
        </svg>
        <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
          Match End time to this face
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function T36({ onSuccess }: TaskComponentProps) {
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs('12:00', 'HH:mm'));
  const [grace, setGrace] = useState('5');
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (endTime && endTime.isValid() && endTime.format('HH:mm') === '17:45') {
      fired.current = true;
      onSuccess();
    }
  }, [endTime, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: 640, ml: 'auto' }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, width: '100%', textAlign: 'right' }}>
          Dashboard filters
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'flex-end', width: '100%' }}>
          <ReferenceClockCard />
          <Card variant="outlined" sx={{ flex: '1 1 280px', minWidth: 260 }}>
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 120px' }}>
                  <Typography component="label" sx={{ fontWeight: 500, fontSize: 12, mb: 0.5, display: 'block' }}>
                    Start time
                  </Typography>
                  <TextField
                    value="09:00"
                    size="small"
                    fullWidth
                    InputProps={{ readOnly: true }}
                    inputProps={{ 'data-testid': 'filter-start-time' }}
                  />
                </Box>
                <Box sx={{ flex: '1 1 120px' }}>
                  <Typography component="label" sx={{ fontWeight: 500, fontSize: 12, mb: 0.5, display: 'block' }}>
                    Grace period
                  </Typography>
                  <TextField
                    value={grace}
                    onChange={(e) => setGrace(e.target.value)}
                    size="small"
                    type="number"
                    fullWidth
                    inputProps={{ 'data-testid': 'grace-period' }}
                  />
                </Box>
              </Box>
              <Box sx={{ mt: 1.5 }}>
                <Typography component="label" sx={{ fontWeight: 500, fontSize: 12, mb: 0.5, display: 'block' }}>
                  End time
                </Typography>
                <DesktopTimePicker
                  value={endTime}
                  onChange={(v) => setEndTime(v)}
                  ampm={false}
                  format="HH:mm"
                  slotProps={{
                    actionBar: { actions: ['cancel', 'accept'] },
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      inputProps: { 'data-testid': 'filter-end-time' },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
