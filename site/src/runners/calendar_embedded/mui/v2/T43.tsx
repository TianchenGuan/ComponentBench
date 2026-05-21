'use client';

/**
 * calendar_embedded-mui-v2-T43: StaticDatePicker dark maintenance panel, OK confirms 2032-12-28
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack, Alert } from '@mui/material';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const TARGET = '2032-12-28';

export default function T43({ onSuccess }: TaskComponentProps) {
  const [pending, setPending] = useState<Dayjs | null>(null);
  const [confirmed, setConfirmed] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (confirmed && confirmed.format('YYYY-MM-DD') === TARGET) {
      onSuccess();
    }
  }, [confirmed, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card
        sx={{
          maxWidth: 400,
          bgcolor: '#1f1f1f',
          color: '#fff',
          '& .MuiPickersLayout-root': { bgcolor: '#1f1f1f' },
          '& .MuiPickersCalendarHeader-label': { color: '#fff' },
          '& .MuiDayCalendar-weekDayLabel': { color: '#999' },
          '& .MuiPickersDay-root': { color: '#fff' },
          '& .MuiPickersDay-root:hover': { bgcolor: '#333' },
          '& .MuiPickersDay-root.Mui-selected': { bgcolor: '#1976d2' },
          '& .MuiPickersYear-yearButton': { color: '#fff' },
          '& .MuiPickersMonth-monthButton': { color: '#fff' },
          '& .MuiIconButton-root': { color: '#fff' },
          '& .MuiDialogActions-root': { bgcolor: '#1f1f1f' },
        }}
        data-testid="maintenance-panel"
      >
        <CardContent>
          <Stack spacing={1.5} sx={{ mb: 1 }}>
            <Alert severity="warning" sx={{ bgcolor: '#2c2100', color: '#ffe08a', '& .MuiAlert-icon': { color: '#ffc107' } }}>
              Maintenance window scheduling
            </Alert>
            <Stack direction="row" gap={0.75} flexWrap="wrap">
              <Chip size="small" label="Sev-2" color="warning" variant="outlined" sx={{ borderColor: '#666', color: '#ccc' }} />
              <Chip size="small" label="Network" variant="outlined" sx={{ borderColor: '#666', color: '#ccc' }} />
              <Chip size="small" label="Read-only" variant="outlined" sx={{ borderColor: '#666', color: '#ccc' }} />
            </Stack>
            <Typography variant="body2" color="grey.400">
              Outage summary: upstream provider maintenance; coordinate customer comms before locking date.
            </Typography>
          </Stack>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600 }} data-testid="maintenance-date-label">
            Maintenance date
          </Typography>
          <StaticDatePicker
            value={pending}
            onChange={(v) => setPending(v)}
            onAccept={(v) => setConfirmed(v)}
            referenceDate={dayjs('2026-02-01')}
            slotProps={{
              actionBar: { actions: ['cancel', 'accept'] },
            }}
            data-testid="calendar-embedded"
          />
          <Box sx={{ px: 1, pb: 1, fontSize: 14 }}>
            <Typography component="span" sx={{ fontWeight: 500 }}>
              Accepted date:{' '}
            </Typography>
            <Typography component="span" data-testid="accepted-maintenance-date">
              {confirmed ? confirmed.format('YYYY-MM-DD') : '(none)'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
