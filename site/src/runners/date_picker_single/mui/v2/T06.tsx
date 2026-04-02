'use client';

/**
 * date_picker_single-mui-v2-T06: Resolved on in scrollable filters sidebar
 */

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, TextField, FormControlLabel, Switch, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [createdOn, setCreatedOn] = useState<Dayjs | null>(dayjs('2026-01-12'));
  const [resolvedOn, setResolvedOn] = useState<Dayjs | null>(null);
  const [onlyOpen, setOnlyOpen] = useState(false);

  useEffect(() => {
    if (
      resolvedOn &&
      resolvedOn.isValid() &&
      resolvedOn.format('YYYY-MM-DD') === '2026-12-23' &&
      createdOn?.format('YYYY-MM-DD') === '2026-01-12'
    ) {
      onSuccess();
    }
  }, [resolvedOn, createdOn, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', gap: 2, maxWidth: 720, minHeight: 280 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Ticket volume
            </Typography>
            <Box sx={{ height: 200, bgcolor: 'action.hover', borderRadius: 1, mt: 1 }} />
          </CardContent>
        </Card>
        <Card sx={{ width: 280 }}>
          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Typography variant="subtitle2" gutterBottom>
              Filters
            </Typography>
            <Box
              data-testid="filters-sidebar-scroll"
              sx={{ maxHeight: 220, overflowY: 'auto', pr: 0.5 }}
            >
              <Stack spacing={1.5}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <TextField key={i} size="small" fullWidth label={`Filter ${i + 1}`} defaultValue="Any" />
                ))}
                <FormControlLabel
                  control={<Switch size="small" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} />}
                  label="Open only"
                />
                <Box>
                  <Typography component="label" sx={{ fontWeight: 500, fontSize: 13, display: 'block', mb: 0.5 }}>
                    Created on
                  </Typography>
                  <DatePicker
                    value={createdOn}
                    onChange={(v) => setCreatedOn(v)}
                    format="YYYY-MM-DD"
                    readOnly
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        inputProps: { 'data-testid': 'created-on' },
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Typography component="label" sx={{ fontWeight: 500, fontSize: 13, display: 'block', mb: 0.5 }}>
                    Resolved on
                  </Typography>
                  <DatePicker
                    value={resolvedOn}
                    onChange={(v) => setResolvedOn(v)}
                    closeOnSelect={false}
                    format="YYYY-MM-DD"
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        inputProps: { 'data-testid': 'resolved-on' },
                      },
                      actionBar: { actions: ['cancel', 'accept'] },
                    }}
                  />
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
