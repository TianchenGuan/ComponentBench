'use client';

/**
 * datetime_picker_range-mui-T10: Dashboard filters: scroll to 'Resolved between' and set range
 *
 * Layout: dashboard with a left-hand Filters sidebar that is vertically scrollable (high clutter).
 * Light theme, comfortable spacing, default scale.
 * There are two DateTimePicker range groups with identical styling: "Created between" (pre-filled, near the top) and "Resolved between" (empty, located further down and not visible until you scroll).
 * Only the "Resolved between" value is checked for success.
 *
 * Success: The "Resolved between" picker equals start=2026-10-15T06:00:00, end=2026-10-15T18:00:00 (local time).
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  // Created (pre-filled)
  const [createdStart] = useState<Dayjs | null>(dayjs('2026-09-01 08:00', 'YYYY-MM-DD HH:mm'));
  const [createdEnd] = useState<Dayjs | null>(dayjs('2026-09-30 17:00', 'YYYY-MM-DD HH:mm'));
  
  // Resolved (empty, target)
  const [resolvedStart, setResolvedStart] = useState<Dayjs | null>(null);
  const [resolvedEnd, setResolvedEnd] = useState<Dayjs | null>(null);
  
  // Clutter controls
  const [status, setStatus] = useState('all');
  const [assignee, setAssignee] = useState('all');
  const [showClosed, setShowClosed] = useState(false);

  useEffect(() => {
    if (resolvedStart && resolvedEnd) {
      const startMatch = resolvedStart.format('YYYY-MM-DD HH:mm') === '2026-10-15 06:00';
      const endMatch = resolvedEnd.format('YYYY-MM-DD HH:mm') === '2026-10-15 18:00';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [resolvedStart, resolvedEnd, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', gap: 2, maxWidth: 900 }}>
        {/* Left sidebar - Filters (scrollable) */}
        <Card sx={{ width: 320, height: 450, overflow: 'auto' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Filters</Typography>

            {/* Status filter */}
            <Box sx={{ mb: 2 }}>
              <TextField
                select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                fullWidth
                size="small"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </TextField>
            </Box>

            {/* Assignee filter */}
            <Box sx={{ mb: 2 }}>
              <TextField
                select
                label="Assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                fullWidth
                size="small"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="john">John Doe</MenuItem>
                <MenuItem value="jane">Jane Smith</MenuItem>
                <MenuItem value="bob">Bob Wilson</MenuItem>
              </TextField>
            </Box>

            {/* Tags */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Tags</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                <Chip label="Bug" size="small" />
                <Chip label="Feature" size="small" variant="outlined" />
                <Chip label="Enhancement" size="small" variant="outlined" />
                <Chip label="Documentation" size="small" variant="outlined" />
              </Box>
            </Box>

            {/* Toggle */}
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={<Switch checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)} size="small" />}
                label="Show closed items"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Created between (pre-filled, near top) */}
            <Box sx={{ mb: 2 }} data-cb-instance="Created between">
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Created between
              </Typography>
              <Stack spacing={1}>
                <DateTimePicker
                  value={createdStart}
                  disabled
                  label="Start"
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
                <DateTimePicker
                  value={createdEnd}
                  disabled
                  label="End"
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </Stack>
            </Box>

            {/* Priority filter */}
            <Box sx={{ mb: 2 }}>
              <TextField
                select
                label="Priority"
                defaultValue="all"
                fullWidth
                size="small"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </TextField>
            </Box>

            {/* Category filter */}
            <Box sx={{ mb: 2 }}>
              <TextField
                select
                label="Category"
                defaultValue="all"
                fullWidth
                size="small"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="frontend">Frontend</MenuItem>
                <MenuItem value="backend">Backend</MenuItem>
                <MenuItem value="infrastructure">Infrastructure</MenuItem>
              </TextField>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Resolved between (empty, below fold - TARGET) */}
            <Box sx={{ mb: 2 }} data-cb-instance="Resolved between">
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Resolved between
              </Typography>
              <Stack spacing={1}>
                <DateTimePicker
                  value={resolvedStart}
                  onChange={(newValue) => setResolvedStart(newValue)}
                  label="Start"
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      inputProps: { 'data-testid': 'dt-range-resolved-start' },
                    },
                  }}
                />
                <DateTimePicker
                  value={resolvedEnd}
                  onChange={(newValue) => setResolvedEnd(newValue)}
                  label="End"
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      inputProps: { 'data-testid': 'dt-range-resolved-end' },
                    },
                  }}
                />
              </Stack>
            </Box>

            {/* More filters to add clutter */}
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Reporter"
                defaultValue=""
                fullWidth
                size="small"
                placeholder="Search..."
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                label="Labels"
                defaultValue=""
                fullWidth
                size="small"
                placeholder="Comma separated..."
              />
            </Box>
          </CardContent>
        </Card>

        {/* Main content area */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Analytics Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">
              Use the filters panel on the left to narrow down results.
              Scroll to find the &quot;Resolved between&quot; filter.
            </Typography>
            <Box sx={{ mt: 2, p: 4, bgcolor: '#f5f5f5', borderRadius: 1, textAlign: 'center' }}>
              <Typography color="text.secondary">Dashboard content area</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
