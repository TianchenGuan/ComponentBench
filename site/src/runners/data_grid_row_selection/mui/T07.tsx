'use client';

/**
 * data_grid_row_selection-mui-T07: Select rows that match a status color legend
 *
 * A centered isolated card titled "Build jobs" contains a MUI X DataGrid with checkboxSelection enabled.
 * Above the grid, a small legend displays a single orange circular dot next to the text "Select rows with
 * this status dot".
 * In the grid, the first column after the checkbox column is "Status" and renders only a colored dot (no
 * text). Other columns are Job ID and Branch.
 * Spacing is comfortable and scale is default. The grid shows 12 rows, all visible without pagination.
 * Initial state: no rows selected. Exactly 3 rows have the orange dot; the rest use green/gray dots as
 * distractors.
 * Guidance is visual: the target set is defined by matching the dot color in the legend to the dot color
 * in each row.
 *
 * Success: selected_row_ids equals ['job_402', 'job_407', 'job_411']
 */

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, GridRenderCellParams } from '@mui/x-data-grid';
import { Card, CardContent, Typography, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface JobData {
  id: string;
  jobId: string;
  status: 'orange' | 'green' | 'gray';
  branch: string;
}

const jobsData: JobData[] = [
  { id: 'job_401', jobId: 'JOB-401', status: 'green', branch: 'main' },
  { id: 'job_402', jobId: 'JOB-402', status: 'orange', branch: 'feature/auth' },
  { id: 'job_403', jobId: 'JOB-403', status: 'green', branch: 'main' },
  { id: 'job_404', jobId: 'JOB-404', status: 'gray', branch: 'develop' },
  { id: 'job_405', jobId: 'JOB-405', status: 'green', branch: 'main' },
  { id: 'job_406', jobId: 'JOB-406', status: 'gray', branch: 'feature/ui' },
  { id: 'job_407', jobId: 'JOB-407', status: 'orange', branch: 'feature/api' },
  { id: 'job_408', jobId: 'JOB-408', status: 'green', branch: 'main' },
  { id: 'job_409', jobId: 'JOB-409', status: 'gray', branch: 'develop' },
  { id: 'job_410', jobId: 'JOB-410', status: 'green', branch: 'main' },
  { id: 'job_411', jobId: 'JOB-411', status: 'orange', branch: 'feature/db' },
  { id: 'job_412', jobId: 'JOB-412', status: 'green', branch: 'main' },
];

const statusColors: Record<string, string> = {
  orange: '#f5a623',
  green: '#4caf50',
  gray: '#9e9e9e',
};

const StatusDot = ({ status }: { status: string }) => (
  <Box
    sx={{
      width: 12,
      height: 12,
      borderRadius: '50%',
      backgroundColor: statusColors[status] || '#ccc',
    }}
    data-status-color={status}
  />
);

const columns: GridColDef[] = [
  {
    field: 'status',
    headerName: 'Status',
    width: 80,
    renderCell: (params: GridRenderCellParams<JobData>) => (
      <StatusDot status={params.value as string} />
    ),
  },
  { field: 'jobId', headerName: 'Job ID', width: 120 },
  { field: 'branch', headerName: 'Branch', flex: 1 },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });

  const selectedIds = Array.from(selectionModel.ids) as string[];

  // Check success condition
  useEffect(() => {
    if (selectionEquals(selectedIds, ['job_402', 'job_407', 'job_411'])) {
      onSuccess();
    }
  }, [selectedIds, onSuccess]);

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Build jobs
        </Typography>
        
        {/* Legend */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <StatusDot status="orange" />
          <Typography variant="body2">Select rows with this status dot</Typography>
        </Box>

        <div
          style={{ height: 450 }}
          data-testid="jobs-grid"
          data-selected-row-ids={JSON.stringify(selectedIds)}
        >
          <DataGrid
            rows={jobsData}
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
