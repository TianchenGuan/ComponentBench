'use client';

/**
 * autocomplete_restricted-mui-T09: Dashboard filter: set region for the Sales chart
 *
 * setup_description:
 * The page is a lightweight **dashboard** with three small charts stacked vertically:
 * - "Sales" chart
 * - "Support tickets" chart
 * - "Website traffic" chart
 *
 * Above each chart is a small filter row containing a Material UI Autocomplete of the same canonical type:
 * 1) Sales **Region** (Autocomplete)  ← target
 * 2) Support tickets Region (Autocomplete)
 * 3) Website traffic Region (Autocomplete)
 *
 * All three share the same options: AMER, EMEA, APAC.
 * - Theme: light; spacing: comfortable; size: default.
 * - Initial state: all three are set to AMER.
 * - Selecting an option updates only that chart's filter; no Apply button.
 *
 * The agent must choose the correct instance (the Region filter associated with the Sales chart) and set it to APAC.
 *
 * Success: The Sales Region Autocomplete has selected value "APAC".
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import type { TaskComponentProps } from '../types';

const regions = ['AMER', 'EMEA', 'APAC'];

interface ChartData {
  title: string;
  testId: string;
  region: string;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [charts, setCharts] = useState<ChartData[]>([
    { title: 'Sales', testId: 'filters.sales.region', region: 'AMER' },
    { title: 'Support tickets', testId: 'filters.support.region', region: 'AMER' },
    { title: 'Website traffic', testId: 'filters.traffic.region', region: 'AMER' },
  ]);
  const successFired = useRef(false);

  useEffect(() => {
    const salesChart = charts.find(c => c.title === 'Sales');
    if (!successFired.current && salesChart?.region === 'APAC') {
      successFired.current = true;
      onSuccess();
    }
  }, [charts, onSuccess]);

  const handleRegionChange = (index: number, newValue: string) => {
    setCharts(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], region: newValue };
      return updated;
    });
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Dashboard
        </Typography>
        <Stack spacing={3}>
          {charts.map((chart, index) => (
            <Box key={chart.title}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                  {chart.title}
                </Typography>
                <Autocomplete
                  data-testid={chart.testId}
                  options={regions}
                  value={chart.region}
                  onChange={(_event, newValue) => handleRegionChange(index, newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Region" size="small" sx={{ width: 150 }} />
                  )}
                  freeSolo={false}
                  disableClearable
                  size="small"
                />
              </Box>
              {/* Mock chart placeholder */}
              <Box
                sx={{
                  height: 60,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {chart.title} chart ({chart.region})
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
