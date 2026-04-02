'use client';

/**
 * datetime_picker_single-mui-T10: MUI table-cell edit with explicit OK
 *
 * Layout: table_cell scene with a compact billing table.
 * Clutter (high): table includes columns (Plan, Price, Seats, Expires at, Notes) and a top toolbar with Search + Export buttons (not required).
 * Instances: 2 MUI X DesktopDateTimePicker editors, one per row:
 *   - Row "Plan Basic" → Expires at (distractor)
 *   - Row "Plan Pro" → Expires at  ← TARGET
 * Editing behavior: clicking the Expires at cell opens a popover picker. An action bar is shown with "Cancel" and "OK"; OK is required to commit (closeOnSelect=false).
 * Initial state:
 *   - Plan Basic Expires at: 05/01/2026 12:00 PM (already matches target but wrong row)
 *   - Plan Pro Expires at: 05/01/2026 11:00 AM (must change to 12:00 PM and press OK)
 *
 * Success: The "Expires at" cell in the "Plan Pro" row is committed to 2026-05-01 12:00 PM. OK must be clicked to accept changes for that cell.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, TextField, Table, TableHead, TableBody, TableRow, TableCell, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

interface PlanRow {
  id: string;
  name: string;
  price: string;
  seats: number;
  expiresAt: Dayjs | null;
  notes: string;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<PlanRow[]>([
    {
      id: 'basic',
      name: 'Plan Basic',
      price: '$9/mo',
      seats: 5,
      expiresAt: dayjs('2026-05-01 12:00', 'YYYY-MM-DD HH:mm'),
      notes: 'Standard tier',
    },
    {
      id: 'pro',
      name: 'Plan Pro',
      price: '$29/mo',
      seats: 20,
      expiresAt: dayjs('2026-05-01 11:00', 'YYYY-MM-DD HH:mm'),
      notes: 'Business tier',
    },
  ]);

  useEffect(() => {
    const planPro = data.find((row) => row.id === 'pro');
    if (planPro && planPro.expiresAt && planPro.expiresAt.format('YYYY-MM-DD HH:mm') === '2026-05-01 12:00') {
      onSuccess();
    }
  }, [data, onSuccess]);

  const handleExpiresAtChange = (id: string, datetime: Dayjs | null) => {
    setData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, expiresAt: datetime } : row))
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 800 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Billing Plans</Typography>

          {/* Toolbar (clutter) */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              size="small"
              placeholder="Search..."
              InputProps={{ startAdornment: <SearchIcon fontSize="small" sx={{ mr: 0.5, color: '#999' }} /> }}
              sx={{ width: 200 }}
            />
            <Button size="small" startIcon={<FileDownloadIcon />}>Export</Button>
          </Box>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Plan</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Seats</TableCell>
                <TableCell>Expires at</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} data-testid={`row-${row.id}`}>
                  <TableCell>
                    <Chip label={row.name} size="small" />
                  </TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.seats}</TableCell>
                  <TableCell data-testid={`cell-expires-${row.id}`}>
                    <DateTimePicker
                      value={row.expiresAt}
                      onChange={(datetime) => handleExpiresAtChange(row.id, datetime)}
                      closeOnSelect={false}
                      slotProps={{
                        textField: {
                          size: 'small',
                          sx: { width: 200 },
                          inputProps: { 'data-testid': `dt-expires-${row.id}` },
                        },
                        actionBar: {
                          actions: ['cancel', 'accept'],
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
