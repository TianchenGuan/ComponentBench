'use client';

/**
 * date_picker_single-mui-T09: Match pay date to reference card and confirm (mobile)
 *
 * Scene: A centered isolated card in light theme with comfortable spacing.
 *
 * Reference: A "Paycheck card" at the top shows the next pay date in two ways (mixed guidance):
 * - A bold text line (e.g., "Next pay date: Mon, May 18, 2026").
 * - A small calendar tile icon showing the month abbreviation and day number.
 *
 * Target component: One MUI X MobileDatePicker labeled "Pay date".
 * - Initial state: empty.
 * - Interaction: Opening the picker shows a modal dialog calendar.
 * - Action bar: Contains "Cancel" and "OK". The date is only committed when "OK" is pressed.
 *
 * Distractors: A non-interactive "Pay cycle" dropdown and a toggle "Email payslip" appear below (clutter=low).
 *
 * Feedback: After pressing "OK", the dialog closes and the Pay date field shows the selected date.
 *
 * Success: Date picker must have selected date = 2026-05-18. Selection must be confirmed by clicking the picker 'OK' control.
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [payDate, setPayDate] = useState<Dayjs | null>(null);
  const [payCycle, setPayCycle] = useState('bi-weekly');
  const [emailPayslip, setEmailPayslip] = useState(true);

  useEffect(() => {
    if (payDate && payDate.isValid() && payDate.format('YYYY-MM-DD') === '2026-05-18') {
      onSuccess();
    }
  }, [payDate, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 450 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Payroll</Typography>

          {/* Visual Reference Card */}
          <Box
            data-testid="paycheck-card"
            sx={{
              background: '#e3f2fd',
              border: '1px solid #90caf9',
              borderRadius: 2,
              p: 2,
              mb: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Paycheck card
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Next pay date: Mon, May 18, 2026
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
              {/* Calendar tile icon */}
              <Box
                sx={{
                  background: '#1976d2',
                  color: '#fff',
                  borderRadius: 1,
                  p: 1,
                  textAlign: 'center',
                  minWidth: 50,
                }}
              >
                <Typography sx={{ fontSize: 10, textTransform: 'uppercase' }}>May</Typography>
                <Typography sx={{ fontSize: 24, fontWeight: 700, lineHeight: 1 }}>18</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Pay date
            </Typography>
            <MobileDatePicker
              value={payDate}
              onChange={(newValue) => setPayDate(newValue)}
              format="YYYY-MM-DD"
              slotProps={{
                textField: {
                  fullWidth: true,
                  placeholder: 'YYYY-MM-DD',
                  inputProps: {
                    'data-testid': 'pay-date',
                  },
                },
              }}
            />
          </Box>

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Pay cycle</InputLabel>
            <Select
              value={payCycle}
              label="Pay cycle"
              onChange={(e) => setPayCycle(e.target.value)}
              data-testid="pay-cycle"
            >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="bi-weekly">Bi-weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={emailPayslip}
                onChange={(e) => setEmailPayslip(e.target.checked)}
                data-testid="email-payslip"
              />
            }
            label="Email payslip"
          />
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
