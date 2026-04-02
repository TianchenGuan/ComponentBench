'use client';

/**
 * data_table_filterable-mui-v2-T11: Activity grid – filter production + sort by duration
 *
 * A dark dashboard_panel with one MUI DataGrid "Activity" plus KPI counters.
 * The grid has no filter toolbar; filtering is via column-menu 3-dots.
 * Target: filter Environment=Production AND sort Duration descending.
 */

import React, { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import { Card, CardContent, Typography, Stack, Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import type { TaskComponentProps, FilterModel } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface ActivityRow {
  id: number;
  name: string;
  environment: string;
  status: string;
  duration: number;
  timestamp: string;
}

const envOptions = ['Production', 'Staging', 'Development', 'QA'];
const statusOptions = ['Success', 'Failed', 'Running', 'Cancelled'];

const activityData: ActivityRow[] = [
  { id: 1, name: 'deploy-api', environment: 'Production', status: 'Success', duration: 120, timestamp: '14:02' },
  { id: 2, name: 'deploy-web', environment: 'Production', status: 'Failed', duration: 45, timestamp: '14:05' },
  { id: 3, name: 'test-suite', environment: 'Staging', status: 'Success', duration: 300, timestamp: '13:50' },
  { id: 4, name: 'deploy-api', environment: 'Staging', status: 'Failed', duration: 60, timestamp: '13:40' },
  { id: 5, name: 'migrate-db', environment: 'Production', status: 'Failed', duration: 90, timestamp: '13:30' },
  { id: 6, name: 'build-assets', environment: 'Development', status: 'Success', duration: 180, timestamp: '13:20' },
  { id: 7, name: 'lint-check', environment: 'QA', status: 'Cancelled', duration: 10, timestamp: '13:10' },
  { id: 8, name: 'deploy-worker', environment: 'Production', status: 'Running', duration: 200, timestamp: '14:10' },
];

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Job', width: 140 },
  { field: 'environment', headerName: 'Environment', width: 130, type: 'singleSelect', valueOptions: envOptions },
  { field: 'status', headerName: 'Status', width: 110, type: 'singleSelect', valueOptions: statusOptions },
  { field: 'duration', headerName: 'Duration (s)', width: 110, type: 'number' },
  { field: 'timestamp', headerName: 'Time', width: 90 },
];

export default function T11({ onSuccess }: TaskComponentProps) {
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (successFiredRef.current) return;
    const hasEnvProd = (filterModel.items || []).some(
      i => i.field === 'environment' && i.operator === 'is' && i.value === 'Production',
    );
    const hasDurDesc = sortModel.some(s => s.field === 'duration' && s.sort === 'desc');
    if (hasEnvProd && hasDurDesc) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [filterModel, sortModel, onSuccess]);

  const canonicalModel: FilterModel = {
    table_id: 'activity',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: (filterModel.items || [])
      .filter(i => i.value !== undefined && i.value !== '')
      .map(i => ({
        column: i.field.charAt(0).toUpperCase() + i.field.slice(1),
        operator: 'equals' as const,
        value: i.value,
      })),
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div style={{ width: 750, padding: 16, background: '#121212' }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Box sx={{ p: 1, border: '1px solid #333', borderRadius: 1, flex: 1 }}>
            <Typography variant="caption" color="textSecondary">Success rate</Typography>
            <Typography variant="h6">62.5%</Typography>
          </Box>
          <Box sx={{ p: 1, border: '1px solid #333', borderRadius: 1, flex: 1 }}>
            <Typography variant="caption" color="textSecondary">Avg duration</Typography>
            <Typography variant="h6">126s</Typography>
          </Box>
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Activity</Typography>
            <div style={{ height: 370 }}>
              <DataGrid
                rows={activityData}
                columns={columns}
                filterModel={filterModel}
                onFilterModelChange={setFilterModel}
                sortModel={sortModel}
                onSortModelChange={setSortModel}
                disableRowSelectionOnClick
                density="compact"
                data-testid="datagrid-activity"
                data-filter-model={JSON.stringify(canonicalModel)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}
