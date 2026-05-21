'use client';

/**
 * data_table_sortable-mui-T15: Dense table - sort Hours high→low (compact)
 *
 * A compact-density MUI Table (dense padding) in an isolated card titled "Timesheets".
 * - Columns: Employee, Project, Hours, Week.
 * - Hours header uses TableSortLabel.
 * - Initial state: unsorted.
 * - Spacing: compact, scale: small.
 *
 * Distractors: "Show only billable" checkbox.
 * Success: Hours sorted descending.
 */

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
} from '@mui/material';
import type { TaskComponentProps, SortModel } from '../types';

interface TimesheetData {
  id: string;
  employee: string;
  project: string;
  hours: number;
  week: string;
}

const timesheetData: TimesheetData[] = [
  { id: '1', employee: 'Alice Chen', project: 'Website Redesign', hours: 40, week: 'W06' },
  { id: '2', employee: 'Bob Smith', project: 'Mobile App', hours: 35, week: 'W06' },
  { id: '3', employee: 'Carol Davis', project: 'API Integration', hours: 45, week: 'W06' },
  { id: '4', employee: 'David Kim', project: 'Website Redesign', hours: 32, week: 'W06' },
  { id: '5', employee: 'Emma Wilson', project: 'Mobile App', hours: 38, week: 'W06' },
  { id: '6', employee: 'Frank Brown', project: 'Database Migration', hours: 42, week: 'W06' },
  { id: '7', employee: 'Grace Lee', project: 'API Integration', hours: 36, week: 'W06' },
  { id: '8', employee: 'Henry Taylor', project: 'Website Redesign', hours: 28, week: 'W06' },
  { id: '9', employee: 'Iris Johnson', project: 'Mobile App', hours: 44, week: 'W06' },
  { id: '10', employee: 'Jack White', project: 'Database Migration', hours: 40, week: 'W06' },
  { id: '11', employee: 'Karen Martinez', project: 'API Integration', hours: 37, week: 'W06' },
  { id: '12', employee: 'Liam Garcia', project: 'Website Redesign', hours: 41, week: 'W06' },
  { id: '13', employee: 'Mary Robinson', project: 'Mobile App', hours: 33, week: 'W06' },
  { id: '14', employee: 'Nathan Clark', project: 'Database Migration', hours: 39, week: 'W06' },
  { id: '15', employee: 'Olivia Lewis', project: 'API Integration', hours: 46, week: 'W06' },
  { id: '16', employee: 'Peter Hall', project: 'Website Redesign', hours: 30, week: 'W06' },
  { id: '17', employee: 'Quinn Allen', project: 'Mobile App', hours: 43, week: 'W06' },
  { id: '18', employee: 'Rachel Young', project: 'Database Migration', hours: 34, week: 'W06' },
  { id: '19', employee: 'Sam King', project: 'API Integration', hours: 47, week: 'W06' },
  { id: '20', employee: 'Tina Wright', project: 'Website Redesign', hours: 29, week: 'W06' },
  { id: '21', employee: 'Uma Scott', project: 'Mobile App', hours: 48, week: 'W06' },
  { id: '22', employee: 'Victor Adams', project: 'Database Migration', hours: 31, week: 'W06' },
  { id: '23', employee: 'Wendy Baker', project: 'API Integration', hours: 38, week: 'W06' },
  { id: '24', employee: 'Xavier Nelson', project: 'Website Redesign', hours: 35, week: 'W06' },
  { id: '25', employee: 'Yolanda Hill', project: 'Mobile App', hours: 42, week: 'W06' },
];

type SortDirection = 'asc' | 'desc' | undefined;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [order, setOrder] = useState<SortDirection>(undefined);

  const handleSort = (column: string) => {
    if (orderBy === column) {
      if (order === 'asc') {
        setOrder('desc');
      } else if (order === 'desc') {
        setOrder(undefined);
        setOrderBy(null);
      } else {
        setOrder('asc');
      }
    } else {
      setOrderBy(column);
      setOrder('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!orderBy || !order) return timesheetData;
    return [...timesheetData].sort((a, b) => {
      const aVal = a[orderBy as keyof TimesheetData];
      const bVal = b[orderBy as keyof TimesheetData];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return order === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [orderBy, order]);

  // Check success condition
  useEffect(() => {
    if (orderBy === 'hours' && order === 'desc') {
      onSuccess();
    }
  }, [orderBy, order, onSuccess]);

  const sortModel: SortModel = orderBy && order
    ? [{ column_key: orderBy, direction: order, priority: 1 }]
    : [];

  return (
    <Card sx={{ width: 550 }}>
      <CardContent sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
            Timesheets
          </Typography>
          <FormControlLabel
            control={<Checkbox size="small" />}
            label={<Typography variant="caption">Show only billable</Typography>}
          />
        </Box>
        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 350 }}>
          <Table
            size="small"
            stickyHeader
            data-testid="table-timesheets"
            data-sort-model={JSON.stringify(sortModel)}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: 12, py: 0.5 }}>Employee</TableCell>
                <TableCell sx={{ fontSize: 12, py: 0.5 }}>Project</TableCell>
                <TableCell sx={{ fontSize: 12, py: 0.5 }}>
                  <TableSortLabel
                    active={orderBy === 'hours'}
                    direction={orderBy === 'hours' ? order || 'asc' : 'asc'}
                    onClick={() => handleSort('hours')}
                    aria-sort={orderBy === 'hours' ? (order === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    Hours
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontSize: 12, py: 0.5 }}>Week</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ fontSize: 11, py: 0.25 }}>{row.employee}</TableCell>
                  <TableCell sx={{ fontSize: 11, py: 0.25 }}>{row.project}</TableCell>
                  <TableCell sx={{ fontSize: 11, py: 0.25 }}>{row.hours}</TableCell>
                  <TableCell sx={{ fontSize: 11, py: 0.25 }}>{row.week}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
