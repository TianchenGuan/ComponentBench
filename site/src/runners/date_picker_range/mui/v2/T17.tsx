'use client';

/**
 * date_picker_range-mui-v2-T17: Single-input keyboard range with external apply and sibling preservation
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const SERVICE_A_START = dayjs('2027-04-01');
const SERVICE_A_END = dayjs('2027-04-07');

export default function T17({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const [aStart] = useState<Dayjs>(SERVICE_A_START);
  const [aEnd] = useState<Dayjs>(SERVICE_A_END);

  const [bStart, setBStart] = useState<Dayjs | null>(null);
  const [bEnd, setBEnd] = useState<Dayjs | null>(null);
  const [bApplied, setBApplied] = useState(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      bApplied &&
      bStart &&
      bEnd &&
      bStart.format('YYYY-MM-DD') === '2027-04-10' &&
      bEnd.format('YYYY-MM-DD') === '2027-04-16' &&
      aStart.format('YYYY-MM-DD') === '2027-04-01' &&
      aEnd.format('YYYY-MM-DD') === '2027-04-07'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [bApplied, bStart, bEnd, aStart, aEnd, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ maxWidth: 720 }}>
        <CardContent sx={{ py: 1.5 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }} alignItems="center">
            <Typography variant="subtitle2">Compact Audit Table</Typography>
            <Chip size="small" label="Q2 2027" />
            <Chip size="small" label="Internal" variant="outlined" />
          </Stack>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Audit span</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: 90 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Service A - read-only */}
                <TableRow>
                  <TableCell>Service A</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <DatePicker
                        value={aStart}
                        readOnly
                        format="MM/DD/YYYY"
                        slotProps={{ textField: { size: 'small', sx: { width: 140 }, inputProps: { 'data-testid': 'service-a-start' } } }}
                      />
                      <Typography sx={{ alignSelf: 'center' }}>–</Typography>
                      <DatePicker
                        value={aEnd}
                        readOnly
                        format="MM/DD/YYYY"
                        slotProps={{ textField: { size: 'small', sx: { width: 140 }, inputProps: { 'data-testid': 'service-a-end' } } }}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" disabled>
                      Apply
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Service B - target */}
                <TableRow>
                  <TableCell>Service B</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <DatePicker
                        value={bStart}
                        onChange={(v) => { setBStart(v); setBApplied(false); }}
                        format="MM/DD/YYYY"
                        slotProps={{ textField: { size: 'small', sx: { width: 140 }, inputProps: { 'data-testid': 'service-b-start' } } }}
                      />
                      <Typography sx={{ alignSelf: 'center' }}>–</Typography>
                      <DatePicker
                        value={bEnd}
                        onChange={(v) => { setBEnd(v); setBApplied(false); }}
                        format="MM/DD/YYYY"
                        minDate={bStart || undefined}
                        slotProps={{ textField: { size: 'small', sx: { width: 140 }, inputProps: { 'data-testid': 'service-b-end' } } }}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => setBApplied(true)}
                      data-testid="apply-service-b-row"
                    >
                      Apply
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
