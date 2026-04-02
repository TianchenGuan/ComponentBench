'use client';

/**
 * select_custom_single-mui-T09: Set Quarter filter to Q4 on a dark dashboard
 *
 * Layout: dashboard in dark theme.
 * The page shows an analytics dashboard with charts and a filter bar at the top.
 *
 * Instances: 3 MUI Select components in the filter bar:
 * - Region (currently EMEA)
 * - Product line (currently Core)
 * - Quarter (currently Q3)  ← TARGET
 *
 * The Quarter select menu contains: Q1, Q2, Q3, Q4.
 *
 * Clutter: multiple charts, KPI cards, and buttons ("Refresh", "Export") are visible and clickable.
 * These are distractors; only the Quarter select's value matters.
 *
 * Feedback: selecting a quarter updates the filter value immediately; charts may re-render but no Apply button is required.
 * Target acquisition is harder due to dark theme contrast and many nearby interactables.
 *
 * Success: The Select labeled "Quarter" in the filter bar has selected value exactly "Q4".
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Grid,
} from '@mui/material';
import { Refresh, Download } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';
import type { TaskComponentProps } from '../types';

const regions = ['EMEA', 'APAC', 'Americas'];
const productLines = ['Core', 'Enterprise', 'Starter'];
const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [region, setRegion] = useState<string>('EMEA');
  const [productLine, setProductLine] = useState<string>('Core');
  const [quarter, setQuarter] = useState<string>('Q3');

  const handleQuarterChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    setQuarter(newValue);
    if (newValue === 'Q4') {
      onSuccess();
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 900 }}>
      {/* Filter Bar */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ py: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="subtitle2" sx={{ mr: 1 }}>Filters:</Typography>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Region</InputLabel>
              <Select
                data-testid="region-select"
                value={region}
                label="Region"
                onChange={(e) => setRegion(e.target.value)}
              >
                {regions.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Product line</InputLabel>
              <Select
                data-testid="product-line-select"
                value={productLine}
                label="Product line"
                onChange={(e) => setProductLine(e.target.value)}
              >
                {productLines.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Quarter</InputLabel>
              <Select
                data-testid="quarter-select"
                value={quarter}
                label="Quarter"
                onChange={handleQuarterChange}
              >
                {quarters.map(q => <MenuItem key={q} value={q}>{q}</MenuItem>)}
              </Select>
            </FormControl>

            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Button size="small" startIcon={<Refresh />}>Refresh</Button>
              <Button size="small" startIcon={<Download />}>Export</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Dashboard Grid */}
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Revenue</Typography>
              <Typography variant="h5">$1.2M</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Orders</Typography>
              <Typography variant="h5">8,432</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Customers</Typography>
              <Typography variant="h5">2,891</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Card sx={{ height: 200 }}>
            <CardContent>
              <Typography variant="subtitle2">Revenue Trend</Typography>
              <Box sx={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                [Chart placeholder]
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ height: 200 }}>
            <CardContent>
              <Typography variant="subtitle2">By Region</Typography>
              <Box sx={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                [Pie chart]
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
