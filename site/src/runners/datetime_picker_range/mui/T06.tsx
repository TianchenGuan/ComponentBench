'use client';

/**
 * datetime_picker_range-mui-T06: Shipping window: set range with two pickers in a form
 *
 * Layout: form_section centered. Light theme, comfortable spacing, default scale.
 * Two composite datetime range groups: "Billing window" (pre-filled) and "Shipping window" (empty).
 * Clutter: low—there is a Carrier dropdown and a Notes multiline field that are not required for success.
 *
 * Success: The "Shipping window" picker equals start=2026-06-01T09:00:00, end=2026-06-01T10:30:00 (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, TextField, MenuItem, Stack, Divider } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  // Billing (pre-filled)
  const [billingStart] = useState<Dayjs | null>(dayjs('2026-06-01 08:00', 'YYYY-MM-DD HH:mm'));
  const [billingEnd] = useState<Dayjs | null>(dayjs('2026-06-01 09:00', 'YYYY-MM-DD HH:mm'));
  
  // Shipping (empty, target)
  const [shippingStart, setShippingStart] = useState<Dayjs | null>(null);
  const [shippingEnd, setShippingEnd] = useState<Dayjs | null>(null);
  
  // Clutter controls
  const [carrier, setCarrier] = useState('fedex');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (shippingStart && shippingEnd) {
      const startMatch = shippingStart.format('YYYY-MM-DD HH:mm') === '2026-06-01 09:00';
      const endMatch = shippingEnd.format('YYYY-MM-DD HH:mm') === '2026-06-01 10:30';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [shippingStart, shippingEnd, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 550 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Checkout Options</Typography>

          {/* Clutter controls */}
          <Box sx={{ mb: 2 }}>
            <TextField
              select
              label="Carrier"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            >
              <MenuItem value="fedex">FedEx</MenuItem>
              <MenuItem value="ups">UPS</MenuItem>
              <MenuItem value="dhl">DHL</MenuItem>
            </TextField>
            <TextField
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              multiline
              rows={2}
              fullWidth
              size="small"
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Billing window (pre-filled) */}
          <Box sx={{ mb: 2 }} data-cb-instance="Billing window">
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Billing window
            </Typography>
            <Stack direction="row" spacing={2}>
              <DateTimePicker
                value={billingStart}
                disabled
                label="Start"
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
              <DateTimePicker
                value={billingEnd}
                disabled
                label="End"
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Shipping window (empty, target) */}
          <Box data-cb-instance="Shipping window">
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Shipping window
            </Typography>
            <Stack direction="row" spacing={2}>
              <DateTimePicker
                value={shippingStart}
                onChange={(newValue) => setShippingStart(newValue)}
                label="Start"
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    inputProps: { 'data-testid': 'dt-range-shipping-start' },
                  },
                }}
              />
              <DateTimePicker
                value={shippingEnd}
                onChange={(newValue) => setShippingEnd(newValue)}
                label="End"
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    inputProps: { 'data-testid': 'dt-range-shipping-end' },
                  },
                }}
              />
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
