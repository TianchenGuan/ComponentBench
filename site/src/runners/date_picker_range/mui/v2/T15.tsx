'use client';

/**
 * date_picker_range-mui-v2-T15: Cohort comparison cross-year range in a cluttered dashboard
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const PRIMARY_FIXED: [Dayjs, Dayjs] = [dayjs('2026-12-01'), dayjs('2026-12-20')];
const HOLIDAY_FIXED: [Dayjs, Dayjs] = [dayjs('2026-12-24'), dayjs('2026-12-26')];

export default function T15({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const [primaryStart] = useState<Dayjs>(PRIMARY_FIXED[0]);
  const [primaryEnd] = useState<Dayjs>(PRIMARY_FIXED[1]);
  const [holidayStart] = useState<Dayjs>(HOLIDAY_FIXED[0]);
  const [holidayEnd] = useState<Dayjs>(HOLIDAY_FIXED[1]);

  const [compStart, setCompStart] = useState<Dayjs | null>(null);
  const [compEnd, setCompEnd] = useState<Dayjs | null>(null);
  const [compAccepted, setCompAccepted] = useState(false);

  const [region, setRegion] = useState('');
  const [channel, setChannel] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (successFired.current) return;
    if (
      compAccepted &&
      compStart &&
      compEnd &&
      compStart.format('YYYY-MM-DD') === '2026-12-27' &&
      compEnd.format('YYYY-MM-DD') === '2027-01-08'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [compAccepted, compStart, compEnd, onSuccess]);

  const handleOk = () => setCompAccepted(true);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', p: 2 }}>
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ py: 1.5 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap" alignItems="center">
              <Chip size="small" label="Cohort" color="primary" />
              <Chip size="small" label="Q4" variant="outlined" />
              <Chip size="small" label="Active" color="success" />
            </Stack>

            <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="flex-end" useFlexGap>
              {/* Primary period (read-only) */}
              <Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>Primary period</Typography>
                <Stack direction="row" spacing={1}>
                  <DatePicker
                    label="Start"
                    value={primaryStart}
                    readOnly
                    format="YYYY-MM-DD"
                    slotProps={{ textField: { size: 'small', sx: { width: 150 }, inputProps: { 'data-testid': 'primary-start' } } }}
                  />
                  <DatePicker
                    label="End"
                    value={primaryEnd}
                    readOnly
                    format="YYYY-MM-DD"
                    slotProps={{ textField: { size: 'small', sx: { width: 150 }, inputProps: { 'data-testid': 'primary-end' } } }}
                  />
                </Stack>
              </Box>

              {/* Comparison period (target) */}
              <Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>Comparison period</Typography>
                <Stack direction="row" spacing={1} alignItems="flex-end">
                  <DatePicker
                    label="Start"
                    value={compStart}
                    onChange={(v) => { setCompStart(v); setCompAccepted(false); }}
                    format="YYYY-MM-DD"
                    closeOnSelect={false}
                    slotProps={{
                      textField: { size: 'small', sx: { width: 150 }, inputProps: { 'data-testid': 'comparison-start' } },
                      actionBar: { actions: ['cancel', 'accept'] },
                    }}
                  />
                  <DatePicker
                    label="End"
                    value={compEnd}
                    onChange={(v) => { setCompEnd(v); setCompAccepted(false); }}
                    format="YYYY-MM-DD"
                    closeOnSelect={false}
                    slotProps={{
                      textField: { size: 'small', sx: { width: 150 }, inputProps: { 'data-testid': 'comparison-end' } },
                      actionBar: { actions: ['cancel', 'accept'] },
                    }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleOk}
                    data-testid="comparison-ok"
                  >
                    OK
                  </Button>
                </Stack>
              </Box>

              {/* Holiday freeze (read-only) */}
              <Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>Holiday freeze</Typography>
                <Stack direction="row" spacing={1}>
                  <DatePicker
                    label="Start"
                    value={holidayStart}
                    readOnly
                    format="YYYY-MM-DD"
                    slotProps={{ textField: { size: 'small', sx: { width: 150 }, inputProps: { 'data-testid': 'holiday-start' } } }}
                  />
                  <DatePicker
                    label="End"
                    value={holidayEnd}
                    readOnly
                    format="YYYY-MM-DD"
                    slotProps={{ textField: { size: 'small', sx: { width: 150 }, inputProps: { 'data-testid': 'holiday-end' } } }}
                  />
                </Stack>
              </Box>

              {/* Clutter selects */}
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Region</InputLabel>
                <Select value={region} onChange={(e) => setRegion(e.target.value)} label="Region">
                  <MenuItem value="us">US</MenuItem>
                  <MenuItem value="eu">EU</MenuItem>
                  <MenuItem value="apac">APAC</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Channel</InputLabel>
                <Select value={channel} onChange={(e) => setChannel(e.target.value)} label="Channel">
                  <MenuItem value="web">Web</MenuItem>
                  <MenuItem value="mobile">Mobile</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: 140 }}
              />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.disabled' }}>
              Dashboard charts
            </Box>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
