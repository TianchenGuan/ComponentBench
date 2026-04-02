'use client';

/**
 * date_picker_single-mui-v2-T05: Primary deadline with year/month/day views and OK
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  LinearProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [primary, setPrimary] = useState<Dayjs | null>(null);
  const [secondary, setSecondary] = useState<Dayjs | null>(dayjs('2031-10-03'));
  const [escalation, setEscalation] = useState<Dayjs | null>(dayjs('2031-12-01'));

  useEffect(() => {
    if (
      primary &&
      primary.isValid() &&
      primary.format('YYYY-MM-DD') === '2031-11-21' &&
      secondary?.format('YYYY-MM-DD') === '2031-10-03' &&
      escalation?.format('YYYY-MM-DD') === '2031-12-01'
    ) {
      onSuccess();
    }
  }, [primary, secondary, escalation, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ maxWidth: 480 }}>
        <CardContent sx={{ py: 1.5 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap">
            <Chip size="small" label="Roadmap" />
            <Chip size="small" color="primary" label="Q4" />
            <Chip size="small" variant="outlined" label="Draft" />
          </Stack>
          <LinearProgress variant="determinate" value={44} sx={{ mb: 2, height: 6, borderRadius: 1 }} />
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Deadlines
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography component="label" sx={{ fontWeight: 500, mb: 0.5, display: 'block', fontSize: 14 }}>
              Primary deadline
            </Typography>
            <DatePicker
              value={primary}
              onChange={(v) => setPrimary(v)}
              views={['year', 'month', 'day']}
              closeOnSelect={false}
              format="YYYY-MM-DD"
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  inputProps: { 'data-testid': 'primary-deadline' },
                },
                actionBar: { actions: ['cancel', 'accept'] },
              }}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography component="label" sx={{ fontWeight: 500, mb: 0.5, display: 'block', fontSize: 14 }}>
              Secondary deadline
            </Typography>
            <DatePicker
              value={secondary}
              onChange={(v) => setSecondary(v)}
              format="YYYY-MM-DD"
              readOnly
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  inputProps: { 'data-testid': 'secondary-deadline' },
                },
              }}
            />
          </Box>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 0.5, display: 'block', fontSize: 14 }}>
              Escalation date
            </Typography>
            <DatePicker
              value={escalation}
              onChange={(v) => setEscalation(v)}
              format="YYYY-MM-DD"
              readOnly
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  inputProps: { 'data-testid': 'escalation-date' },
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
