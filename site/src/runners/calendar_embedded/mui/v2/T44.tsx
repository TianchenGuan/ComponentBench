'use client';

/**
 * calendar_embedded-mui-v2-T44: Billing + Shipping DateCalendars, external Apply
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, Stack, Chip } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const TARGET = '2027-04-19';
const REF = dayjs('2027-02-01');

export default function T44({ onSuccess }: TaskComponentProps) {
  const [shipPend, setShipPend] = useState<Dayjs | null>(null);
  const [billPend, setBillPend] = useState<Dayjs | null>(null);
  const [shipApp, setShipApp] = useState<Dayjs | null>(null);
  const [billApp, setBillApp] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (
      billApp?.format('YYYY-MM-DD') === TARGET &&
      shipApp === null
    ) {
      onSuccess();
    }
  }, [billApp, shipApp, onSuccess]);

  const apply = () => {
    setShipApp(shipPend);
    setBillApp(billPend);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          transform: 'scale(0.88)',
          transformOrigin: 'top center',
          maxWidth: 720,
        }}
        data-testid="shipping-workspace"
      >
        <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mb: 1 }}>
          <Chip size="small" label="LTL" />
          <Chip size="small" label="Backorder" color="warning" variant="outlined" />
          <Chip size="small" label="Intl hold" />
        </Stack>
        <Card data-testid="logistics-card">
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Logistics calendars
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box data-testid="shipping-calendar-wrap">
                <Typography fontWeight={600} mb={1}>
                  Shipping calendar
                </Typography>
                <DateCalendar
                  value={shipPend}
                  onChange={(v) => setShipPend(v)}
                  referenceDate={REF}
                  data-testid="shipping-calendar"
                />
                <Typography variant="caption" display="block" mt={1}>
                  Applied: {shipApp ? shipApp.format('YYYY-MM-DD') : '—'}
                </Typography>
              </Box>
              <Box data-testid="billing-calendar-wrap">
                <Typography fontWeight={600} mb={1}>
                  Billing calendar
                </Typography>
                <DateCalendar
                  value={billPend}
                  onChange={(v) => setBillPend(v)}
                  referenceDate={REF}
                  data-testid="billing-calendar"
                />
                <Typography variant="caption" display="block" mt={1}>
                  Applied: {billApp ? billApp.format('YYYY-MM-DD') : '—'}
                </Typography>
              </Box>
            </Stack>
            <Box mt={2}>
              <Button variant="contained" onClick={apply} data-testid="apply-changes">
                Apply changes
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
