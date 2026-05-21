'use client';

/**
 * tabs-mui-T09: Dashboard clutter: Revenue widget to Quarterly
 *
 * Layout: dashboard page with multiple widgets (charts, KPI cards, and a transactions table).
 * Component: a single MUI Tabs component embedded at the top of the "Revenue" chart widget.
 * Tabs in the widget: "Daily", "Weekly", "Monthly", "Quarterly", "Yearly".
 * Initial state: "Monthly" is selected and the chart title reads "Revenue (Monthly)".
 * Clutter: high—there is a date range picker, a search field, a filter dropdown, and several buttons nearby, but none are required.
 * No other tabs components exist elsewhere on the dashboard; only this widget uses tabs.
 * Success: Selected tab is "Quarterly" (value/key: quarterly).
 */

import React, { useState } from 'react';
import { Box, Tabs, Tab, Card, CardContent, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('monthly');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (newValue === 'quarterly') {
      onSuccess();
    }
  };

  return (
    <Box sx={{ width: 800 }}>
      {/* Dashboard header with clutter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <TextField size="small" placeholder="Search..." sx={{ width: 200 }} />
        <TextField size="small" type="date" label="From" InputLabelProps={{ shrink: true }} />
        <TextField size="small" type="date" label="To" InputLabelProps={{ shrink: true }} />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select label="Filter" defaultValue="all">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" size="small">Export</Button>
        <Button variant="contained" size="small">Refresh</Button>
      </Box>

      <Grid container spacing={2}>
        {/* KPI cards */}
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Total Users</Typography>
              <Typography variant="h5">12,458</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Active Sessions</Typography>
              <Typography variant="h5">1,234</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Conversion Rate</Typography>
              <Typography variant="h5">3.2%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Avg. Order Value</Typography>
              <Typography variant="h5">$127</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue widget with tabs */}
        <Grid item xs={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue ({value.charAt(0).toUpperCase() + value.slice(1)})
              </Typography>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={value} onChange={handleChange} aria-label="Revenue tabs">
                  <Tab label="Daily" value="daily" />
                  <Tab label="Weekly" value="weekly" />
                  <Tab label="Monthly" value="monthly" />
                  <Tab label="Quarterly" value="quarterly" />
                  <Tab label="Yearly" value="yearly" />
                </Tabs>
              </Box>
              {/* Placeholder for chart */}
              <Box sx={{ height: 200, bgcolor: 'grey.100', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">[{value.charAt(0).toUpperCase() + value.slice(1)} Revenue Chart]</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Transactions table placeholder */}
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
              <Box sx={{ height: 200, bgcolor: 'grey.100', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">[Transactions Table]</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
