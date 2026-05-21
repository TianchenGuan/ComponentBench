'use client';

/**
 * date_picker_single-mui-T07: Set a dashboard filter date (bottom-left, cluttered)
 *
 * Scene: A dashboard layout with a left filter sidebar and a main content area containing charts and a small data table (clutter=high).
 * The filter sidebar is anchored near the bottom-left of the viewport (placement=bottom_left).
 * Theme is light; spacing is comfortable. The date field uses a smaller size variant (scale=small) to fit the sidebar.
 *
 * Target component: One MUI X DesktopDatePicker labeled "Created on".
 * - Initial state: empty.
 * - Interaction: Clicking the small field opens a popover calendar. Selecting a day commits immediately.
 *
 * Distractors: Nearby filters include a keyword search box, a status dropdown, and several checkboxes.
 * The main area contains interactive chart tooltips that may capture attention but are not required.
 *
 * Feedback: The chosen date appears in the field; a small "Filters updated" toast appears but does not affect success.
 *
 * Success: Date picker must have selected date = 2026-06-30.
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Snackbar,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [createdOn, setCreatedOn] = useState<Dayjs | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [status, setStatus] = useState('all');
  const [filters, setFilters] = useState({ active: true, archived: false, pending: true });
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (createdOn && createdOn.isValid() && createdOn.format('YYYY-MM-DD') === '2026-06-30') {
      onSuccess();
    }
  }, [createdOn, onSuccess]);

  const handleDateChange = (newValue: Dayjs | null) => {
    setCreatedOn(newValue);
    if (newValue) {
      setShowToast(true);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Filter Sidebar */}
        <Card sx={{ width: 250, flexShrink: 0 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontSize: 14 }}>
              Analytics dashboard
            </Typography>

            <TextField
              label="Search"
              size="small"
              fullWidth
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{ 'data-testid': 'search-keyword' }}
            />

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
                data-testid="status-filter"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ mb: 2 }}>
              <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block', fontSize: 12 }}>
                Created on
              </Typography>
              <DatePicker
                value={createdOn}
                onChange={handleDateChange}
                format="YYYY-MM-DD"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    placeholder: 'YYYY-MM-DD',
                    inputProps: {
                      'data-testid': 'filter-created-on',
                    },
                  },
                }}
              />
            </Box>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={filters.active}
                    onChange={(e) => setFilters({ ...filters, active: e.target.checked })}
                  />
                }
                label={<Typography sx={{ fontSize: 12 }}>Show active</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={filters.archived}
                    onChange={(e) => setFilters({ ...filters, archived: e.target.checked })}
                  />
                }
                label={<Typography sx={{ fontSize: 12 }}>Show archived</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={filters.pending}
                    onChange={(e) => setFilters({ ...filters, pending: e.target.checked })}
                  />
                }
                label={<Typography sx={{ fontSize: 12 }}>Show pending</Typography>}
              />
            </FormGroup>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dashboard Content
            </Typography>
            <Box sx={{ height: 200, background: '#f5f5f5', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Typography color="text.secondary">Chart placeholder</Typography>
            </Box>
            <Box sx={{ height: 100, background: '#f5f5f5', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Data table placeholder</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={showToast}
        autoHideDuration={2000}
        onClose={() => setShowToast(false)}
        message="Filters updated"
      />
    </LocalizationProvider>
  );
}
