'use client';

/**
 * calendar_embedded-mui-T09: Select an end-of-month date in a small calendar inside a table cell
 *
 * Layout: table_cell (light theme) with medium clutter. The page shows a simple table editor with several rows and small icon buttons (edit, filter, sort).
 * In the highlighted table cell ("Due date"), an embedded MUI X DateCalendar is shown inline in a compact container (scale: small).
 * The calendar starts on September 2026 with no selected date.
 * The header month label and navigation arrows are present but slightly compressed due to the small container.
 * Selecting a day highlights it and updates a tiny readout under the calendar labeled "Due date:" (YYYY-MM-DD).
 * Distractors: the surrounding table controls are clickable but should be ignored; only the calendar selection determines success.
 *
 * Success: The Due date calendar selected_date equals 2026-11-30.
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (selectedDate && selectedDate.format('YYYY-MM-DD') === '2026-11-30') {
      onSuccess();
    }
  }, [selectedDate, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 600 }} data-testid="table-card">
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Table Editor</Typography>
            <Box>
              <IconButton size="small" data-testid="edit-btn">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" data-testid="filter-btn">
                <FilterListIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" data-testid="sort-btn">
                <SortIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Task</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Due date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Task A</TableCell>
                  <TableCell>In Progress</TableCell>
                  <TableCell>2026-10-15</TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell>Task B</TableCell>
                  <TableCell>Pending</TableCell>
                  <TableCell data-testid="due-date-cell">
                    <Box sx={{ maxWidth: 280 }}>
                      <DateCalendar
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        referenceDate={dayjs('2026-09-01')}
                        sx={{
                          transform: 'scale(0.85)',
                          transformOrigin: 'top left',
                          width: '100%',
                        }}
                        data-testid="calendar-embedded"
                      />
                      <Box sx={{ fontSize: 12, mt: -2 }}>
                        <Typography component="span" sx={{ fontWeight: 500, fontSize: 12 }}>
                          Due date:{' '}
                        </Typography>
                        <Typography component="span" sx={{ fontSize: 12 }} data-testid="selected-date">
                          {selectedDate ? selectedDate.format('YYYY-MM-DD') : '—'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Task C</TableCell>
                  <TableCell>Completed</TableCell>
                  <TableCell>2026-09-01</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
