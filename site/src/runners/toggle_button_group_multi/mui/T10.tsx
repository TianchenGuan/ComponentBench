'use client';

/**
 * toggle_button_group_multi-mui-T20: Dense dashboard chart overlays
 *
 * Layout: dashboard with controls clustered near the top-right (placement=top_right). 
 * The page includes a chart area, a metric summary row, and several control panels.
 *
 * There are three ToggleButtonGroup (multiple selection) controls with similar styling:
 * 1) "Metric units" (options: USD, EUR, Percent, Count)
 *    - Initial state: USD selected
 * 2) "Highlight" (options: Outliers, Weekends, Holidays)
 *    - Initial state: none selected
 * 3) "Chart overlays" (TARGET) presented as a dense, small-size group (size=small) with 8 options:
 *    - Trend, Average line, Min, Max, Target, Threshold, Annotations, Grid
 *
 * Initial state for "Chart overlays":
 * - Trend and Grid are selected.
 * - All other overlay options are unselected.
 *
 * Clutter (high):
 * - Nearby icon buttons (Refresh, Share), a date range chip, and a search field.
 * - Similar toggle-like controls elsewhere on the dashboard.
 *
 * No Apply/Save step; changes apply immediately. Only the "Chart overlays" group determines success.
 *
 * Success: Chart overlays → Average line, Target, Annotations, Grid (require_correct_instance: true)
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, CardContent, Typography, Box, IconButton, Chip, TextField,
  Grid
} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import RefreshIcon from '@mui/icons-material/Refresh';
import ShareIcon from '@mui/icons-material/Share';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskComponentProps } from '../types';

const METRIC_UNITS = ['USD', 'EUR', 'Percent', 'Count'];
const HIGHLIGHT_OPTIONS = ['Outliers', 'Weekends', 'Holidays'];
const CHART_OVERLAYS = ['Trend', 'Average line', 'Min', 'Max', 'Target', 'Threshold', 'Annotations', 'Grid'];

const TARGET_SET = new Set(['Average line', 'Target', 'Annotations', 'Grid']);

export default function T10({ onSuccess }: TaskComponentProps) {
  const [metricUnits, setMetricUnits] = useState<string[]>(['USD']);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [chartOverlays, setChartOverlays] = useState<string[]>(['Trend', 'Grid']);
  const successFiredRef = useRef(false);

  // Initial states for non-target groups
  const metricUnitsInitial = useRef(['USD']);
  const highlightsInitial = useRef<string[]>([]);

  useEffect(() => {
    if (successFiredRef.current) return;

    // Check if chart overlays has the target set
    const overlaysSet = new Set(chartOverlays);
    const overlaysMatch = overlaysSet.size === TARGET_SET.size && 
      Array.from(TARGET_SET).every(v => overlaysSet.has(v));

    // Check if non-target groups are unchanged
    const metricUnchanged = JSON.stringify([...metricUnits].sort()) === 
      JSON.stringify([...metricUnitsInitial.current].sort());
    const highlightsUnchanged = JSON.stringify([...highlights].sort()) === 
      JSON.stringify([...highlightsInitial.current].sort());

    if (overlaysMatch && metricUnchanged && highlightsUnchanged) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [chartOverlays, metricUnits, highlights, onSuccess]);

  return (
    <Box sx={{ width: 900 }}>
      {/* Header with controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Analytics Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search..."
            InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'grey.500' }} /> }}
            sx={{ width: 150 }}
          />
          <Chip label="Last 30 days" size="small" />
          <IconButton size="small"><RefreshIcon /></IconButton>
          <IconButton size="small"><ShareIcon /></IconButton>
        </Box>
      </Box>

      {/* Metric summary row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={3}>
          <Card variant="outlined">
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="body2" color="text.secondary">Revenue</Typography>
              <Typography variant="h6">$124,500</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card variant="outlined">
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="body2" color="text.secondary">Orders</Typography>
              <Typography variant="h6">1,234</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card variant="outlined">
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="body2" color="text.secondary">Visitors</Typography>
              <Typography variant="h6">45,678</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card variant="outlined">
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="body2" color="text.secondary">Conversion</Typography>
              <Typography variant="h6">2.7%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Left side - chart area */}
        <Grid item xs={8}>
          <Card variant="outlined" sx={{ height: 300 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>Chart Preview</Typography>
              <Box sx={{ 
                height: 220, 
                bgcolor: 'grey.100', 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'grey.500',
              }}>
                [Chart visualization area]
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right side - control panels */}
        <Grid item xs={4}>
          {/* Metric units */}
          <Card variant="outlined" sx={{ mb: 2 }} data-testid="metric-units-card">
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="subtitle2" gutterBottom>Metric units</Typography>
              <ToggleButtonGroup
                value={metricUnits}
                onChange={(_, v) => setMetricUnits(v)}
                size="small"
                sx={{ flexWrap: 'wrap', gap: 0.5 }}
                data-testid="metric-units-group"
              >
                {METRIC_UNITS.map(unit => (
                  <ToggleButton 
                    key={unit} 
                    value={unit}
                    sx={{ fontSize: 11, py: 0.25, px: 1 }}
                    data-testid={`metric-${unit.toLowerCase()}`}
                  >
                    {unit}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </CardContent>
          </Card>

          {/* Highlight */}
          <Card variant="outlined" sx={{ mb: 2 }} data-testid="highlight-card">
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="subtitle2" gutterBottom>Highlight</Typography>
              <ToggleButtonGroup
                value={highlights}
                onChange={(_, v) => setHighlights(v)}
                size="small"
                sx={{ flexWrap: 'wrap', gap: 0.5 }}
                data-testid="highlight-group"
              >
                {HIGHLIGHT_OPTIONS.map(opt => (
                  <ToggleButton 
                    key={opt} 
                    value={opt}
                    sx={{ fontSize: 11, py: 0.25, px: 1 }}
                    data-testid={`highlight-${opt.toLowerCase()}`}
                  >
                    {opt}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </CardContent>
          </Card>

          {/* Chart overlays (TARGET) */}
          <Card variant="outlined" data-testid="chart-overlays-card">
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="subtitle2" gutterBottom>Chart overlays</Typography>
              <Typography variant="caption" color="primary" sx={{ display: 'block', mb: 1 }}>
                Select: Average line, Target, Annotations, Grid
              </Typography>
              <ToggleButtonGroup
                value={chartOverlays}
                onChange={(_, v) => setChartOverlays(v)}
                size="small"
                sx={{ flexWrap: 'wrap', gap: 0.5 }}
                data-testid="chart-overlays-group"
              >
                {CHART_OVERLAYS.map(overlay => (
                  <ToggleButton 
                    key={overlay} 
                    value={overlay}
                    sx={{ fontSize: 10, py: 0.25, px: 0.75 }}
                    data-testid={`overlay-${overlay.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {overlay}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
