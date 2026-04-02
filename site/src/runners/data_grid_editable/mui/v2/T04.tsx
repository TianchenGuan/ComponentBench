'use client';

/**
 * data_grid_editable-mui-v2-T04: Threshold row — keep Warning below Critical and save
 *
 * Single DataGrid "Alert thresholds" on an inline surface. Row editing with validation:
 * Critical must remain > Warning. Edit row ID 12: Warning → 70, Critical → 85, then Save.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, Typography, Paper, Stack, Chip } from '@mui/material';
import {
  DataGrid, GridColDef, GridRowModel, GridRowModes, GridRowModesModel,
  GridActionsCellItem, GridEventListener, GridRowId, GridRowEditStopReasons,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../../types';

interface Row { id: number; metric: string; warning: number; critical: number; unit: string; }

const initialRows: Row[] = [
  { id: 10, metric: 'CPU Usage', warning: 60, critical: 80, unit: '%' },
  { id: 11, metric: 'Memory', warning: 65, critical: 90, unit: '%' },
  { id: 12, metric: 'Disk I/O', warning: 50, critical: 75, unit: 'ms' },
  { id: 13, metric: 'Network Latency', warning: 40, critical: 60, unit: 'ms' },
  { id: 14, metric: 'Error Rate', warning: 5, critical: 10, unit: '%' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const successFired = useRef(false);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) event.defaultMuiPrevented = true;
  };
  const handleEdit = (id: GridRowId) => () => setRowModesModel(m => ({ ...m, [id]: { mode: GridRowModes.Edit } }));
  const handleSave = (id: GridRowId) => () => setRowModesModel(m => ({ ...m, [id]: { mode: GridRowModes.View } }));
  const handleCancel = (id: GridRowId) => () => setRowModesModel(m => ({ ...m, [id]: { mode: GridRowModes.View, ignoreModifications: true } }));

  const processRowUpdate = (newRow: GridRowModel) => {
    const u = newRow as Row;
    if (u.critical <= u.warning) {
      throw new Error('Critical must be greater than Warning');
    }
    setRows(prev => prev.map(r => (r.id === u.id ? u : r)));
    return u;
  };

  useEffect(() => {
    if (successFired.current) return;
    const t = rows.find(r => r.id === 12);
    const inView = !rowModesModel[12] || rowModesModel[12]?.mode === GridRowModes.View;
    if (t && t.warning === 70 && t.critical === 85 && inView) {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, rowModesModel, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'metric', headerName: 'Metric', width: 130 },
    { field: 'warning', headerName: 'Warning', width: 90, type: 'number', editable: true },
    { field: 'critical', headerName: 'Critical', width: 90, type: 'number', editable: true },
    { field: 'unit', headerName: 'Unit', width: 60 },
    {
      field: 'actions', type: 'actions', headerName: 'Actions', width: 80,
      getActions: ({ id }) => {
        if (rowModesModel[id]?.mode === GridRowModes.Edit) {
          return [
            <GridActionsCellItem key="s" icon={<SaveIcon />} label="Save" onClick={handleSave(id)} />,
            <GridActionsCellItem key="c" icon={<CancelIcon />} label="Cancel" onClick={handleCancel(id)} />,
          ];
        }
        return [<GridActionsCellItem key="e" icon={<EditIcon />} label="Edit" onClick={handleEdit(id)} />];
      },
    },
  ];

  return (
    <Stack direction="row" spacing={2} sx={{ p: 2, justifyContent: 'flex-end', alignItems: 'flex-start' }}>
      <Stack spacing={1} sx={{ width: 160 }}>
        <Paper sx={{ p: 1 }}><Typography variant="caption">P99 Latency</Typography><Typography variant="h6">42 ms</Typography></Paper>
        <Paper sx={{ p: 1 }}><Typography variant="caption">Error Rate</Typography><Typography variant="h6">0.3%</Typography></Paper>
      </Stack>
      <Card sx={{ width: 560 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Alert thresholds</Typography>
          <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
            <Chip label="5 metrics" size="small" variant="outlined" />
            <Chip label="2 breached" size="small" color="error" variant="outlined" />
          </Stack>
          <Box sx={{ height: 320 }}>
            <DataGrid rows={rows} columns={columns} editMode="row" rowModesModel={rowModesModel}
              onRowModesModelChange={setRowModesModel} onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={e => console.warn('Validation:', e.message)}
              disableRowSelectionOnClick hideFooter density="compact" />
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
