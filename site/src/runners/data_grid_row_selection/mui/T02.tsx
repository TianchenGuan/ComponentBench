'use client';

/**
 * data_grid_row_selection-mui-T02: Select multiple rows with checkbox selection
 *
 * Baseline isolated card centered in the viewport titled "Releases". It contains one MUI X DataGrid with
 * checkboxSelection enabled (a checkbox column appears at the left).
 * Spacing is comfortable and scale is default. The grid shows 12 release rows (all visible; no pagination)
 * with columns: Version, Date, Channel.
 * Initial state: no rows selected. Clicking a row checkbox selects it; multiple selections are allowed.
 * The target versions v2.1.0 and v2.3.0 are both visible at once.
 *
 * Success: selected_row_ids equals ['v2.1.0', 'v2.3.0']
 */

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Card, CardContent, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface ReleaseData {
  id: string;
  version: string;
  date: string;
  channel: string;
}

const releasesData: ReleaseData[] = [
  { id: 'v1.9.0', version: 'v1.9.0', date: '2024-01-05', channel: 'Stable' },
  { id: 'v2.0.0', version: 'v2.0.0', date: '2024-01-15', channel: 'Stable' },
  { id: 'v2.1.0', version: 'v2.1.0', date: '2024-01-25', channel: 'Stable' },
  { id: 'v2.2.0', version: 'v2.2.0', date: '2024-02-05', channel: 'Beta' },
  { id: 'v2.3.0', version: 'v2.3.0', date: '2024-02-15', channel: 'Stable' },
  { id: 'v2.4.0', version: 'v2.4.0', date: '2024-02-25', channel: 'Beta' },
  { id: 'v2.5.0', version: 'v2.5.0', date: '2024-03-05', channel: 'Alpha' },
  { id: 'v2.6.0', version: 'v2.6.0', date: '2024-03-15', channel: 'Stable' },
  { id: 'v2.7.0', version: 'v2.7.0', date: '2024-03-25', channel: 'Beta' },
  { id: 'v2.8.0', version: 'v2.8.0', date: '2024-04-05', channel: 'Alpha' },
  { id: 'v2.9.0', version: 'v2.9.0', date: '2024-04-15', channel: 'Stable' },
  { id: 'v3.0.0', version: 'v3.0.0', date: '2024-04-25', channel: 'Beta' },
];

const columns: GridColDef[] = [
  { field: 'version', headerName: 'Version', width: 120 },
  { field: 'date', headerName: 'Date', width: 120 },
  { field: 'channel', headerName: 'Channel', flex: 1 },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });

  const selectedIds = Array.from(selectionModel.ids) as string[];

  // Check success condition
  useEffect(() => {
    if (selectionEquals(selectedIds, ['v2.1.0', 'v2.3.0'])) {
      onSuccess();
    }
  }, [selectedIds, onSuccess]);

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Releases
        </Typography>
        <div
          style={{ height: 500 }}
          data-testid="releases-grid"
          data-selected-row-ids={JSON.stringify(selectedIds)}
        >
          <DataGrid
            rows={releasesData}
            columns={columns}
            checkboxSelection
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={(newModel) => setSelectionModel(newModel)}
            hideFooter
            disableColumnMenu
          />
        </div>
      </CardContent>
    </Card>
  );
}
