'use client';

/**
 * date_input_text-mui-T07: MUI match a date from a shipping label preview
 * 
 * Layout: dashboard-style card centered in the viewport.
 * Left side: a MUI X DateField labeled "Ship date" (MM/DD/YYYY).
 * Right side: a "Shipping label preview" panel that visually prints the target date in bold, uppercase stamp style:
 *   "SEP 09 2026"
 * Initial state: Ship date field is empty.
 * Clutter (low): a disabled "Carrier" dropdown is visible under the preview (not required).
 * Feedback: when a valid date is entered, the date field updates; the preview's "Ship date" line also updates (cosmetic).
 * 
 * Success: The "Ship date" value equals the reference date 2026-09-09.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.isValid() && value.format('YYYY-MM-DD') === '2026-09-09') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 560 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Shipping Dashboard</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Box>
                <Typography component="label" htmlFor="ship-date" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
                  Ship date
                </Typography>
                <DateField
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  format="MM/DD/YYYY"
                  slotProps={{
                    textField: {
                      id: 'ship-date',
                      fullWidth: true,
                      placeholder: 'MM/DD/YYYY',
                      inputProps: {
                        'data-testid': 'ship-date',
                      },
                    },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box
                data-testid="shipping-label-preview"
                sx={{
                  border: '2px solid #1976d2',
                  borderRadius: 1,
                  p: 2,
                  textAlign: 'center',
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  SHIPPING LABEL PREVIEW
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#1976d2',
                    letterSpacing: 1,
                  }}
                >
                  SEP 09 2026
                </Typography>
                {value && value.isValid() && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Ship date: {value.format('MM/DD/YYYY')}
                  </Typography>
                )}
              </Box>

              <FormControl fullWidth disabled sx={{ mt: 2 }} size="small">
                <InputLabel id="carrier-label">Carrier</InputLabel>
                <Select
                  labelId="carrier-label"
                  value="USPS"
                  label="Carrier"
                >
                  <MenuItem value="USPS">USPS</MenuItem>
                  <MenuItem value="FedEx">FedEx</MenuItem>
                  <MenuItem value="UPS">UPS</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
