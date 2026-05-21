'use client';

/**
 * select_custom_single-mui-v2-T07: Dark dashboard filters — set Quarter to Q4 and apply
 *
 * Dark analytics dashboard with charts, KPI cards, export buttons.
 * Filter bar with three MUI Select controls: "Region" (EMEA), "Product line" (Core),
 * "Quarter" (Q3 → Q4). Options Q1–Q4. "Apply filters" commits; "Clear charts" is distractor.
 * Region and Product line must remain unchanged.
 *
 * Success: Quarter = "Q4", Region still "EMEA", Product line still "Core", "Apply filters" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Select, MenuItem,
  FormControl, InputLabel, Chip, Divider,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const regionOptions = ['EMEA', 'APAC', 'Americas', 'LATAM'];
const productOptions = ['Core', 'Enterprise', 'Starter', 'Platform'];
const quarterOptions = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [region, setRegion] = useState('EMEA');
  const [productLine, setProductLine] = useState('Core');
  const [quarter, setQuarter] = useState('Q3');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && quarter === 'Q4' && region === 'EMEA' && productLine === 'Core') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, quarter, region, productLine, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: 2, bgcolor: 'background.default', minHeight: '100vh', color: 'text.primary' }}>
        <Typography variant="h5" gutterBottom>Analytics Dashboard</Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          {[{ label: 'Revenue', value: '$1.2M' }, { label: 'Users', value: '34K' }, { label: 'Growth', value: '+12%' }].map((kpi) => (
            <Card key={kpi.label} sx={{ flex: 1 }}>
              <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                <Typography variant="caption" color="text.secondary">{kpi.label}</Typography>
                <Typography variant="h6">{kpi.value}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', py: 1, '&:last-child': { pb: 1 } }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Region</InputLabel>
              <Select value={region} label="Region" onChange={(e) => { setRegion(e.target.value); setApplied(false); }}>
                {regionOptions.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Product line</InputLabel>
              <Select value={productLine} label="Product line" onChange={(e) => { setProductLine(e.target.value); setApplied(false); }}>
                {productOptions.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Quarter</InputLabel>
              <Select value={quarter} label="Quarter" onChange={(e) => { setQuarter(e.target.value); setApplied(false); }}>
                {quarterOptions.map((q) => <MenuItem key={q} value={q}>{q}</MenuItem>)}
              </Select>
            </FormControl>

            <Button variant="contained" size="small" onClick={() => setApplied(true)}>Apply filters</Button>
            <Button variant="outlined" size="small" color="error">Clear charts</Button>
          </CardContent>
        </Card>

        <Card sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Typography color="text.secondary">Revenue trend chart placeholder</Typography>
        </Card>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip label="Auto-refresh: ON" size="small" />
          <Chip label="Export: Ready" size="small" variant="outlined" />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1, alignSelf: 'center' }}>
            Last updated: 3m ago
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
