'use client';

/**
 * time_picker-mui-T10: Set Overtime cutoff to 23:59 in a table cell
 *
 * A small table titled "Payroll rules" is anchored near the bottom-left of the viewport. The table contains
 * three rows: Regular, Overtime, and Holiday. Each row has a "Cutoff time" cell containing a compact MUI X TimePicker field
 * (single input with an open-picker icon). The pickers use 24-hour HH:mm format and are configured with minutesStep=1 so
 * values like 23:59 are selectable. The table also includes a non-target column (e.g., a read-only "Applies to" tag) creating
 * moderate clutter. The task targets the Overtime row specifically; other rows must remain unchanged for correctness.
 *
 * Scene: layout=table_cell, placement=bottom_left, instances=3, clutter=medium
 *
 * Success: The TimePicker in the "Overtime" row (Cutoff time column) has canonical time value exactly 23:59 (HH:mm, 24-hour).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

interface PayrollRow {
  id: string;
  name: string;
  cutoff: Dayjs | null;
  appliesTo: string;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<PayrollRow[]>([
    { id: 'regular', name: 'Regular', cutoff: dayjs('17:00', 'HH:mm'), appliesTo: 'Weekdays' },
    { id: 'overtime', name: 'Overtime', cutoff: dayjs('22:00', 'HH:mm'), appliesTo: 'All days' },
    { id: 'holiday', name: 'Holiday', cutoff: dayjs('20:00', 'HH:mm'), appliesTo: 'Holidays' },
  ]);

  useEffect(() => {
    const overtime = data.find((row) => row.id === 'overtime');
    if (overtime && overtime.cutoff && overtime.cutoff.format('HH:mm') === '23:59') {
      onSuccess();
    }
  }, [data, onSuccess]);

  const handleCutoffChange = (id: string, newValue: Dayjs | null) => {
    setData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, cutoff: newValue } : row))
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 500 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Payroll rules</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Cutoff time</TableCell>
                  <TableCell>Applies to</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id} data-testid={`row-${row.id}`}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      <TimePicker
                        value={row.cutoff}
                        onChange={(newValue) => handleCutoffChange(row.id, newValue)}
                        ampm={false}
                        slotProps={{
                          textField: {
                            size: 'small',
                            sx: { width: 120 },
                            inputProps: { 'data-testid': `tp-cutoff-${row.id}` },
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={row.appliesTo} size="small" variant="outlined" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            (Set Overtime to 23:59)
          </Typography>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
