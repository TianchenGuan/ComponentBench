'use client';

/**
 * datetime_picker_range-mui-v2-T24: Approval window vs Review — match reference card, OK per picker (composite DateTimePicker ×2)
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  TextField,
  MenuItem,
  Divider,
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

export default function T24({ onSuccess }: TaskComponentProps) {
  const [reviewStart] = useState<Dayjs | null>(dayjs('2027-05-30 09:00', 'YYYY-MM-DD HH:mm'));
  const [reviewEnd] = useState<Dayjs | null>(dayjs('2027-05-30 11:00', 'YYYY-MM-DD HH:mm'));
  const [approvalStart, setApprovalStart] = useState<Dayjs | null>(null);
  const [approvalEnd, setApprovalEnd] = useState<Dayjs | null>(null);
  const [region, setRegion] = useState('us-east');

  useEffect(() => {
    if (!approvalStart || !approvalEnd) return;
    const sOk = approvalStart.format('YYYY-MM-DD HH:mm') === '2027-06-01 10:00';
    const eOk = approvalEnd.format('YYYY-MM-DD HH:mm') === '2027-06-01 12:30';
    if (sOk && eOk) {
      onSuccess();
    }
  }, [approvalStart, approvalEnd, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 1, maxWidth: 640 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Approval dashboard
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
          <Card variant="outlined" sx={{ flex: 1, minWidth: 200 }} data-reference="approval-window-reference">
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="caption" color="text.secondary">
                Reference — target window
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                2027-06-01 10:00 → 2027-06-01 12:30
              </Typography>
              <Chip size="small" label="approval-window-reference" sx={{ mt: 1 }} variant="outlined" />
            </CardContent>
          </Card>
          <Card sx={{ flex: 2, minWidth: 280 }}>
            <CardContent>
              <TextField
                select
                size="small"
                label="Region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              >
                <MenuItem value="us-east">US East</MenuItem>
                <MenuItem value="eu-west">EU West</MenuItem>
              </TextField>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 2 }} data-cb-instance="Review window">
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Review window
                </Typography>
                <Stack direction="row" spacing={1}>
                  <DateTimePicker
                    label="Start"
                    value={reviewStart}
                    disabled
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                  <DateTimePicker
                    label="End"
                    value={reviewEnd}
                    disabled
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </Stack>
              </Box>
              <Box data-cb-instance="Approval window">
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Approval window
                </Typography>
                <Stack direction="row" spacing={1}>
                  <DateTimePicker
                    label="Start"
                    value={approvalStart}
                    onChange={(v) => setApprovalStart(v)}
                    closeOnSelect={false}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        inputProps: { 'data-testid': 'dt-approval-start' },
                      },
                      actionBar: { actions: ['cancel', 'accept'] },
                    }}
                  />
                  <DateTimePicker
                    label="End"
                    value={approvalEnd}
                    onChange={(v) => setApprovalEnd(v)}
                    closeOnSelect={false}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        inputProps: { 'data-testid': 'dt-approval-end' },
                      },
                      actionBar: { actions: ['cancel', 'accept'] },
                    }}
                  />
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}
