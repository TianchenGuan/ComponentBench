'use client';

/**
 * data_grid_row_selection-mui-T08: Disambiguate between two grids in a dashboard
 *
 * The scene is a dashboard with two side-by-side cards, each containing a MUI X DataGrid with
 * checkboxSelection:
 *   • Left card: "Open requests"
 *   • Right card: "Closed requests"
 * Both grids have the same columns (Request ID, Title, Owner) and similar-looking IDs (e.g., OR-19 vs CR-19).
 * Spacing is comfortable and scale is default. Additional dashboard clutter includes a date range chip row
 * and a small sparkline chart above the cards (medium clutter), but no interaction is needed.
 * Initial state: no rows selected in either grid. Selection updates immediately on checkbox click.
 * The target rows are CR-19 and CR-22 in the Closed requests grid only.
 *
 * Success: Closed grid selected_row_ids equals ['CR-19', 'CR-22'], Open grid has []
 */

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface RequestData {
  id: string;
  requestId: string;
  title: string;
  owner: string;
}

const openRequestsData: RequestData[] = [
  { id: 'OR-15', requestId: 'OR-15', title: 'Feature request: Dark mode', owner: 'Alice Chen' },
  { id: 'OR-17', requestId: 'OR-17', title: 'Bug: Login timeout', owner: 'Bob Martinez' },
  { id: 'OR-19', requestId: 'OR-19', title: 'Enhancement: Search', owner: 'Carol Williams' },
  { id: 'OR-21', requestId: 'OR-21', title: 'Support: API docs', owner: 'David Kim' },
  { id: 'OR-22', requestId: 'OR-22', title: 'Bug: Export fails', owner: 'Eva Schmidt' },
  { id: 'OR-24', requestId: 'OR-24', title: 'Feature: Notifications', owner: 'Frank Jones' },
];

const closedRequestsData: RequestData[] = [
  { id: 'CR-15', requestId: 'CR-15', title: 'Fixed: Memory leak', owner: 'Grace Liu' },
  { id: 'CR-17', requestId: 'CR-17', title: 'Done: Migration', owner: 'Henry Wilson' },
  { id: 'CR-19', requestId: 'CR-19', title: 'Resolved: SSL cert', owner: 'Iris Chang' },
  { id: 'CR-21', requestId: 'CR-21', title: 'Completed: Backup', owner: 'Jack Brown' },
  { id: 'CR-22', requestId: 'CR-22', title: 'Fixed: Auth issue', owner: 'Karen Lee' },
  { id: 'CR-24', requestId: 'CR-24', title: 'Done: Refactor', owner: 'Leo Garcia' },
];

const columns: GridColDef[] = [
  { field: 'requestId', headerName: 'Request ID', width: 100 },
  { field: 'title', headerName: 'Title', flex: 1 },
  { field: 'owner', headerName: 'Owner', width: 110 },
];

// Simple sparkline chart mock
const SparklineChart = () => (
  <Box sx={{ width: 100, height: 30, display: 'flex', alignItems: 'end', gap: 0.5 }}>
    {[3, 5, 2, 7, 4, 6, 3].map((h, i) => (
      <Box key={i} sx={{ width: 8, height: h * 4, bgcolor: '#1976d2', borderRadius: 0.5 }} />
    ))}
  </Box>
);

export default function T08({ onSuccess }: TaskComponentProps) {
  const [openSelection, setOpenSelection] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });
  const [closedSelection, setClosedSelection] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });

  const openSelectedIds = Array.from(openSelection.ids) as string[];
  const closedSelectedIds = Array.from(closedSelection.ids) as string[];

  // Check success condition
  useEffect(() => {
    if (
      selectionEquals(closedSelectedIds, ['CR-19', 'CR-22']) &&
      selectionEquals(openSelectedIds, [])
    ) {
      onSuccess();
    }
  }, [openSelectedIds, closedSelectedIds, onSuccess]);

  return (
    <Box sx={{ width: 900 }}>
      {/* Dashboard clutter - date chips and sparkline */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip label="Last 7 days" size="small" variant="outlined" />
          <Chip label="All teams" size="small" variant="outlined" />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" color="text.secondary">Trend</Typography>
          <SparklineChart />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Open requests */}
        <Card sx={{ flex: 1 }} data-testid="open-requests-grid">
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              Open requests
            </Typography>
            <div
              style={{ height: 320 }}
              data-selected-row-ids={JSON.stringify(openSelectedIds)}
            >
              <DataGrid
                rows={openRequestsData}
                columns={columns}
                checkboxSelection
                rowSelectionModel={openSelection}
                onRowSelectionModelChange={(newModel) => setOpenSelection(newModel)}
                hideFooter
                disableColumnMenu
              />
            </div>
          </CardContent>
        </Card>

        {/* Closed requests */}
        <Card sx={{ flex: 1 }} data-testid="closed-requests-grid">
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              Closed requests
            </Typography>
            <div
              style={{ height: 320 }}
              data-selected-row-ids={JSON.stringify(closedSelectedIds)}
            >
              <DataGrid
                rows={closedRequestsData}
                columns={columns}
                checkboxSelection
                rowSelectionModel={closedSelection}
                onRowSelectionModelChange={(newModel) => setClosedSelection(newModel)}
                hideFooter
                disableColumnMenu
              />
            </div>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
