'use client';

/**
 * date_input_text-mui-T09: MUI edit a date field inside a compact table
 * 
 * Layout: table_cell anchored near the top-left of the viewport.
 * Theme/spacing: light theme with compact spacing; small component scale.
 * Table: a compact release plan table with three rows: "v1.0", "v2.0", "v3.0".
 * Component instances: each row contains an inline editable MUI X DateField in the "Release date" column (MM/DD/YYYY).
 * Initial state:
 *   - v1.0: 09/01/2026
 *   - v2.0: empty
 *   - v3.0: 12/15/2026
 * Clutter (high): additional columns ("Owner", "Risk") include chips and icons; not required.
 * Feedback: after a valid date is entered in the v2.0 row, the cell shows the formatted date and briefly displays a small "Edited" indicator on that row.
 * 
 * Success: In the "v2.0" row, the "Release date" field value equals 2026-11-01.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Box } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

interface ReleaseRow {
  version: string;
  date: Dayjs | null;
  owner: string;
  risk: 'low' | 'medium' | 'high';
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<ReleaseRow[]>([
    { version: 'v1.0', date: dayjs('2026-09-01'), owner: 'Alice', risk: 'low' },
    { version: 'v2.0', date: null, owner: 'Bob', risk: 'medium' },
    { version: 'v3.0', date: dayjs('2026-12-15'), owner: 'Carol', risk: 'high' },
  ]);
  const [editedRow, setEditedRow] = useState<string | null>(null);

  useEffect(() => {
    const v2Row = data.find(row => row.version === 'v2.0');
    if (v2Row?.date && v2Row.date.isValid() && v2Row.date.format('YYYY-MM-DD') === '2026-11-01') {
      onSuccess();
    }
  }, [data, onSuccess]);

  const handleDateChange = (version: string, newDate: Dayjs | null) => {
    setData(prev => prev.map(row =>
      row.version === version ? { ...row, date: newDate } : row
    ));
    setEditedRow(version);
    setTimeout(() => setEditedRow(null), 1000);
  };

  const getRiskColor = (risk: string): 'success' | 'warning' | 'error' => {
    switch (risk) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'success';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 580 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Release Plan</Typography>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Version</TableCell>
                  <TableCell>Release date</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Risk</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow
                    key={row.version}
                    data-row-key={row.version}
                    sx={{
                      backgroundColor: editedRow === row.version ? '#e3f2fd' : 'transparent',
                      transition: 'background-color 0.3s',
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {row.version}
                        {editedRow === row.version && (
                          <Chip label="Edited" size="small" color="info" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ minWidth: 180 }}>
                      <DateField
                        value={row.date}
                        onChange={(newDate) => handleDateChange(row.version, newDate)}
                        format="MM/DD/YYYY"
                        slotProps={{
                          textField: {
                            size: 'small',
                            fullWidth: true,
                            placeholder: 'MM/DD/YYYY',
                            inputProps: {
                              'data-testid': `release-date-${row.version.replace('.', '')}`,
                            },
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>{row.owner}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.risk}
                        size="small"
                        color={getRiskColor(row.risk)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
