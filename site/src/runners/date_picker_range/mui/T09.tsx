'use client';

/**
 * date_picker_range-mui-T09: Set Cohort comparison range in a busy dashboard
 *
 * A dashboard layout with high clutter: top navigation, a left
 * sidebar, multiple charts, and a dense filter row. In the filter row there are
 * three MUI X DateRangePickers (instances=3) with identical styling and placeholders:
 * • 'Signup window' (prefilled)
 * • 'Cohort comparison' (empty — target)
 * • 'Export window' (prefilled)
 * Other distractors in the same row include two Select dropdowns and an 'Apply
 * filters' button (does not affect success). The target picker is anchored near
 * the top-left area of the viewport.
 *
 * Note: Using two DatePickers per range as MUI free tier doesn't include DateRangePicker.
 *
 * Success: Cohort comparison instance has start=2026-01-05, end=2026-01-19
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const DRAWER_WIDTH = 180;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [signupStart, setSignupStart] = useState<Dayjs | null>(dayjs('2025-12-01'));
  const [signupEnd, setSignupEnd] = useState<Dayjs | null>(dayjs('2025-12-31'));
  const [cohortStart, setCohortStart] = useState<Dayjs | null>(null);
  const [cohortEnd, setCohortEnd] = useState<Dayjs | null>(null);
  const [exportStart, setExportStart] = useState<Dayjs | null>(dayjs('2026-02-01'));
  const [exportEnd, setExportEnd] = useState<Dayjs | null>(dayjs('2026-02-28'));
  const [metric, setMetric] = useState('revenue');
  const [segment, setSegment] = useState('all');

  useEffect(() => {
    if (
      cohortStart &&
      cohortEnd &&
      cohortStart.isValid() &&
      cohortEnd.isValid() &&
      cohortStart.format('YYYY-MM-DD') === '2026-01-05' &&
      cohortEnd.format('YYYY-MM-DD') === '2026-01-19'
    ) {
      onSuccess();
    }
  }, [cohortStart, cohortEnd, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* App Bar */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6">Growth Dashboard</Typography>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              mt: 8,
            },
          }}
        >
          <List>
            <ListItemButton><ListItemText primary="Overview" /></ListItemButton>
            <ListItemButton selected><ListItemText primary="Cohorts" /></ListItemButton>
            <ListItemButton><ListItemText primary="Funnels" /></ListItemButton>
            <ListItemButton><ListItemText primary="Reports" /></ListItemButton>
          </List>
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 2, mt: 8, ml: `${DRAWER_WIDTH}px`, background: '#f5f5f5' }}>
          {/* Filter Bar */}
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Date filters</Typography>
              <Grid container spacing={2} alignItems="flex-end">
                <Grid item xs={12} md={2}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Signup window</Typography>
                  <Stack direction="row" spacing={1}>
                    <DatePicker
                      value={signupStart}
                      onChange={setSignupStart}
                      slotProps={{ textField: { size: 'small', inputProps: { 'data-testid': 'signup-start' } } }}
                    />
                    <DatePicker
                      value={signupEnd}
                      onChange={setSignupEnd}
                      slotProps={{ textField: { size: 'small', inputProps: { 'data-testid': 'signup-end' } } }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Cohort comparison</Typography>
                  <Stack direction="row" spacing={1}>
                    <DatePicker
                      value={cohortStart}
                      onChange={setCohortStart}
                      slotProps={{ textField: { size: 'small', inputProps: { 'data-testid': 'cohort-start' } } }}
                    />
                    <DatePicker
                      value={cohortEnd}
                      onChange={setCohortEnd}
                      minDate={cohortStart || undefined}
                      slotProps={{ textField: { size: 'small', inputProps: { 'data-testid': 'cohort-end' } } }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Export window</Typography>
                  <Stack direction="row" spacing={1}>
                    <DatePicker
                      value={exportStart}
                      onChange={setExportStart}
                      slotProps={{ textField: { size: 'small', inputProps: { 'data-testid': 'export-start' } } }}
                    />
                    <DatePicker
                      value={exportEnd}
                      onChange={setExportEnd}
                      slotProps={{ textField: { size: 'small', inputProps: { 'data-testid': 'export-end' } } }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Metric</InputLabel>
                    <Select value={metric} onChange={(e) => setMetric(e.target.value)} label="Metric">
                      <MenuItem value="revenue">Revenue</MenuItem>
                      <MenuItem value="users">Users</MenuItem>
                      <MenuItem value="sessions">Sessions</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Segment</InputLabel>
                    <Select value={segment} onChange={(e) => setSegment(e.target.value)} label="Segment">
                      <MenuItem value="all">All Users</MenuItem>
                      <MenuItem value="new">New Users</MenuItem>
                      <MenuItem value="returning">Returning</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button variant="contained" fullWidth data-testid="apply-filters">
                    Apply filters
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Chart placeholders */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: 200 }}>
                <CardContent>
                  <Typography color="text.secondary">Chart 1 placeholder</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: 200 }}>
                <CardContent>
                  <Typography color="text.secondary">Chart 2 placeholder</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
