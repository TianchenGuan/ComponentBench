'use client';

/**
 * table_static-mui-T10: Multi-select in the correct table among three widgets
 *
 * A single centered card titled "Metrics" contains three small read-only MUI Table widgets stacked with
 * headings: "Today", "This week", and "This month" (three instances). The card also contains additional non-interactive
 * clutter such as mini charts, summary numbers, and explanatory text blocks around the tables, making visual search noisier.
 * Each table lists days/periods and a value column; labels are similar across the three widgets. In each table, clicking
 * a row toggles selection (multi-select per table); selected rows highlight and set aria-selected="true". Initial state:
 * no rows selected in any widget. Target: select rows Wed and Fri in the "This week" table.
 */

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

interface MetricData {
  key: string;
  period: string;
  value: string;
}

const todayData: MetricData[] = [
  { key: 'Morning', period: 'Morning', value: '1,234' },
  { key: 'Afternoon', period: 'Afternoon', value: '2,567' },
  { key: 'Evening', period: 'Evening', value: '1,890' },
];

const thisWeekData: MetricData[] = [
  { key: 'Mon', period: 'Mon', value: '5,432' },
  { key: 'Tue', period: 'Tue', value: '6,123' },
  { key: 'Wed', period: 'Wed', value: '5,890' },
  { key: 'Thu', period: 'Thu', value: '6,450' },
  { key: 'Fri', period: 'Fri', value: '7,234' },
  { key: 'Sat', period: 'Sat', value: '3,567' },
  { key: 'Sun', period: 'Sun', value: '2,890' },
];

const thisMonthData: MetricData[] = [
  { key: 'Week 1', period: 'Week 1', value: '25,432' },
  { key: 'Week 2', period: 'Week 2', value: '28,123' },
  { key: 'Week 3', period: 'Week 3', value: '31,890' },
  { key: 'Week 4', period: 'Week 4', value: '29,450' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [todaySelected, setTodaySelected] = useState<Set<string>>(new Set());
  const [weekSelected, setWeekSelected] = useState<Set<string>>(new Set());
  const [monthSelected, setMonthSelected] = useState<Set<string>>(new Set());
  const successFiredRef = React.useRef(false);

  const handleToggleSelection = (
    key: string,
    selected: Set<string>,
    setSelected: React.Dispatch<React.SetStateAction<Set<string>>>
  ) => {
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // Check for success condition: Wed and Fri must be selected in "This week"
  useEffect(() => {
    if (weekSelected.has('Wed') && weekSelected.has('Fri') && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [weekSelected, onSuccess]);

  const renderTable = (
    title: string,
    data: MetricData[],
    selected: Set<string>,
    setSelected: React.Dispatch<React.SetStateAction<Set<string>>>,
    instanceLabel: string
  ) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
        {title}
      </Typography>
      <TableContainer component={Paper} variant="outlined" data-cb-instance={instanceLabel}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Period</TableCell>
              <TableCell align="right">Views</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.key}
                onClick={() => handleToggleSelection(row.key, selected, setSelected)}
                aria-selected={selected.has(row.key)}
                data-row-key={row.key}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: selected.has(row.key) ? 'action.selected' : undefined,
                  '&:hover': {
                    backgroundColor: selected.has(row.key) ? 'action.selected' : 'action.hover',
                  },
                }}
              >
                <TableCell>{row.period}</TableCell>
                <TableCell align="right">{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Metrics
        </Typography>

        {/* Clutter: summary statistics */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box sx={{ p: 1.5, backgroundColor: 'grey.100', borderRadius: 1, flex: 1 }}>
            <Typography variant="caption" color="text.secondary">Total Views</Typography>
            <Typography variant="h6">156,234</Typography>
          </Box>
          <Box sx={{ p: 1.5, backgroundColor: 'grey.100', borderRadius: 1, flex: 1 }}>
            <Typography variant="caption" color="text.secondary">Avg Daily</Typography>
            <Typography variant="h6">5,208</Typography>
          </Box>
        </Box>

        {/* Clutter: explanatory text */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Click rows below to select periods for detailed analysis. Multiple selections are supported within each time range.
        </Typography>

        {renderTable('Today', todayData, todaySelected, setTodaySelected, 'Today')}
        {renderTable('This week', thisWeekData, weekSelected, setWeekSelected, 'This week')}
        {renderTable('This month', thisMonthData, monthSelected, setMonthSelected, 'This month')}

        {/* More clutter: footnote */}
        <Typography variant="caption" color="text.secondary">
          * Data updated hourly. Last refresh: 5 minutes ago.
        </Typography>
      </CardContent>
    </Card>
  );
}
