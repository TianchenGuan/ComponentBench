'use client';

/**
 * select_with_search-mui-v2-T03: Tertiary KPI only in a three-select dashboard strip
 *
 * Dashboard panel with 3 MUI Autocomplete fields in a horizontal KPI strip:
 * - Primary KPI — Revenue
 * - Secondary KPI — Customer Satisfaction
 * - Tertiary KPI — (empty)
 * Options: Net Promoter Score, Customer Satisfaction, Revenue, Churn Rate, Response Time.
 * "Apply KPIs" commits the strip.
 * Success: Tertiary KPI = "Net Promoter Score", others unchanged, Apply KPIs clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardContent, CardActions, Typography, Autocomplete, TextField, Button, Box, Chip, Divider,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const kpiOptions = [
  'Net Promoter Score',
  'Customer Satisfaction',
  'Revenue',
  'Churn Rate',
  'Response Time',
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [primaryKpi, setPrimaryKpi] = useState<string | null>('Revenue');
  const [secondaryKpi, setSecondaryKpi] = useState<string | null>('Customer Satisfaction');
  const [tertiaryKpi, setTertiaryKpi] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      applied &&
      tertiaryKpi === 'Net Promoter Score' &&
      primaryKpi === 'Revenue' &&
      secondaryKpi === 'Customer Satisfaction'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, tertiaryKpi, primaryKpi, secondaryKpi, onSuccess]);

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: 700 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>KPI Configuration</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select key performance indicators for the dashboard.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Autocomplete
              sx={{ flex: 1 }}
              options={kpiOptions}
              value={primaryKpi}
              onChange={(_e, val) => { setPrimaryKpi(val); setApplied(false); }}
              renderInput={(params) => (
                <TextField {...params} label="Primary KPI" placeholder="Search KPIs..." size="small" />
              )}
            />
            <Autocomplete
              sx={{ flex: 1 }}
              options={kpiOptions}
              value={secondaryKpi}
              onChange={(_e, val) => { setSecondaryKpi(val); setApplied(false); }}
              renderInput={(params) => (
                <TextField {...params} label="Secondary KPI" placeholder="Search KPIs..." size="small" />
              )}
            />
            <Autocomplete
              sx={{ flex: 1 }}
              options={kpiOptions}
              value={tertiaryKpi}
              onChange={(_e, val) => { setTertiaryKpi(val); setApplied(false); }}
              renderInput={(params) => (
                <TextField {...params} label="Tertiary KPI" placeholder="Search KPIs..." size="small" />
              )}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label="Dashboard v2.4" size="small" />
            <Chip label="Auto-refresh: ON" size="small" variant="outlined" />
            <Chip label="Period: Q4 2025" size="small" variant="outlined" />
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
          <Button variant="contained" onClick={() => setApplied(true)}>
            Apply KPIs
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
