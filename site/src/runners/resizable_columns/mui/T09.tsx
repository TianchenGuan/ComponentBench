'use client';

/**
 * Task ID: resizable_columns-mui-T09
 * Task Name: Three grids: match Primary widths to reference layout
 *
 * Setup Description:
 * Layout: isolated_card, centered, containing three resizable DataGrids (instances=3) and a reference panel.
 * - Reference panel lists target widths.
 * - Grid labels: "Primary (Forecast)" (target), "Secondary (Forecast)", "Tertiary (Forecast)" (distractors).
 * - Columns: Month, Forecast, Actual, Delta.
 *
 * Target widths: Month 120px, Forecast 160px, Actual 160px, Delta 120px.
 *
 * Success Trigger: In Primary, all four columns within ±5px of targets.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box, Paper, Stack } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../types';
import { isWithinTolerance } from '../types';

const rows = [
  { id: 1, month: 'January', forecast: '$10,000', actual: '$9,500', delta: '-5%' },
  { id: 2, month: 'February', forecast: '$12,000', actual: '$12,800', delta: '+7%' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [primaryWidths, setPrimaryWidths] = useState<Record<string, number>>({
    month: 100,
    forecast: 140,
    actual: 140,
    delta: 100,
  });
  const [secondaryWidths, setSecondaryWidths] = useState<Record<string, number>>({
    month: 120,
    forecast: 160,
    actual: 160,
    delta: 120,
  });
  const [tertiaryWidths, setTertiaryWidths] = useState<Record<string, number>>({
    month: 120,
    forecast: 160,
    actual: 160,
    delta: 120,
  });
  const successFired = useRef(false);

  useEffect(() => {
    const monthOk = isWithinTolerance(primaryWidths.month, 120, 5);
    const forecastOk = isWithinTolerance(primaryWidths.forecast, 160, 5);
    const actualOk = isWithinTolerance(primaryWidths.actual, 160, 5);
    const deltaOk = isWithinTolerance(primaryWidths.delta, 120, 5);
    
    if (!successFired.current && monthOk && forecastOk && actualOk && deltaOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [primaryWidths, onSuccess]);

  const createColumns = (widths: Record<string, number>): GridColDef[] => [
    { field: 'month', headerName: 'Month', width: widths.month, resizable: true },
    { field: 'forecast', headerName: 'Forecast', width: widths.forecast, resizable: true },
    { field: 'actual', headerName: 'Actual', width: widths.actual, resizable: true },
    { field: 'delta', headerName: 'Delta', width: widths.delta, resizable: true },
  ];

  return (
    <Card sx={{ width: 700 }} data-testid="rc-container">
      <CardContent>
        <Stack spacing={2}>
          {/* Primary (target) with reference bar directly above */}
          <Box data-testid="rc-grid-forecast-primary">
            <Typography variant="subtitle2" gutterBottom>Reference layout</Typography>
            <Box sx={{ display: 'flex', gap: 0, mb: 1 }} data-testid="rc-reference-panel">
              <Box sx={{ width: 120, bgcolor: '#e3f2fd', p: 0.5, fontSize: 12, textAlign: 'center', border: '1px solid #bbdefb' }}>
                Month (120px)
              </Box>
              <Box sx={{ width: 160, bgcolor: '#e8f5e9', p: 0.5, fontSize: 12, textAlign: 'center', border: '1px solid #c8e6c9' }}>
                Forecast (160px)
              </Box>
              <Box sx={{ width: 160, bgcolor: '#fff3e0', p: 0.5, fontSize: 12, textAlign: 'center', border: '1px solid #ffe0b2' }}>
                Actual (160px)
              </Box>
              <Box sx={{ width: 120, bgcolor: '#fce4ec', p: 0.5, fontSize: 12, textAlign: 'center', border: '1px solid #f8bbd0' }}>
                Delta (120px)
              </Box>
            </Box>
            <Typography variant="subtitle2">Primary (Forecast)</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              Current: Month {Math.round(primaryWidths.month)}px, Forecast {Math.round(primaryWidths.forecast)}px, Actual {Math.round(primaryWidths.actual)}px, Delta {Math.round(primaryWidths.delta)}px
            </Typography>
            <Box sx={{ height: 150, width: Object.values(primaryWidths).reduce((a, b) => a + b, 0) + 2 }}>
              <DataGrid
                rows={rows}
                columns={createColumns(primaryWidths)}
                disableRowSelectionOnClick
                hideFooter
                onColumnWidthChange={(params) => {
                  setPrimaryWidths(prev => ({
                    ...prev,
                    [params.colDef.field]: params.width,
                  }));
                }}
              />
            </Box>
          </Box>

          {/* Secondary (distractor) */}
          <Box data-testid="rc-grid-forecast-secondary">
            <Typography variant="subtitle2">Secondary (Forecast)</Typography>
            <Box sx={{ height: 150, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={createColumns(secondaryWidths)}
                disableRowSelectionOnClick
                hideFooter
                onColumnWidthChange={(params) => {
                  setSecondaryWidths(prev => ({
                    ...prev,
                    [params.colDef.field]: params.width,
                  }));
                }}
              />
            </Box>
          </Box>

          {/* Tertiary (distractor) */}
          <Box data-testid="rc-grid-forecast-tertiary">
            <Typography variant="subtitle2">Tertiary (Forecast)</Typography>
            <Box sx={{ height: 150, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={createColumns(tertiaryWidths)}
                disableRowSelectionOnClick
                hideFooter
                onColumnWidthChange={(params) => {
                  setTertiaryWidths(prev => ({
                    ...prev,
                    [params.colDef.field]: params.width,
                  }));
                }}
              />
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
