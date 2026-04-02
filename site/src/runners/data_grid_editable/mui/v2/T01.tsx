'use client';

/**
 * data_grid_editable-mui-v2-T01: Compact employees grid — edit one row and save
 *
 * Single MUI X DataGrid "Employees" in a settings panel, row editing with actions column.
 * Edit row ID 7: Name → "Riley Park", Role → "Manager", then Save.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, Typography, Paper, Chip, Stack } from '@mui/material';
import {
  DataGrid, GridColDef, GridRowModel, GridRowModes, GridRowModesModel,
  GridActionsCellItem, GridEventListener, GridRowId, GridRowEditStopReasons,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../../types';

interface Row { id: number; name: string; role: string; department: string; }

const initialRows: Row[] = [
  { id: 1, name: 'John Smith', role: 'Staff', department: 'Engineering' },
  { id: 2, name: 'Jane Doe', role: 'Manager', department: 'Design' },
  { id: 3, name: 'Bob Johnson', role: 'Director', department: 'Product' },
  { id: 4, name: 'Alice Brown', role: 'Staff', department: 'Engineering' },
  { id: 5, name: 'Charlie Wilson', role: 'Manager', department: 'Sales' },
  { id: 6, name: 'Diana Miller', role: 'Staff', department: 'Design' },
  { id: 7, name: 'Riley Chen', role: 'Staff', department: 'Engineering' },
  { id: 8, name: 'Fiona Apple', role: 'Director', department: 'Product' },
  { id: 9, name: 'Riley Parker', role: 'Staff', department: 'Sales' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const successFired = useRef(false);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };
  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };
  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View, ignoreModifications: true } });
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updated = newRow as Row;
    setRows(prev => prev.map(r => (r.id === updated.id ? updated : r)));
    return updated;
  };

  useEffect(() => {
    if (successFired.current) return;
    const t = rows.find(r => r.id === 7);
    const inView = !rowModesModel[7] || rowModesModel[7]?.mode === GridRowModes.View;
    if (t && t.name.trim() === 'Riley Park' && t.role === 'Manager' && inView) {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, rowModesModel, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 60, editable: false },
    { field: 'name', headerName: 'Name', width: 140, editable: true },
    { field: 'role', headerName: 'Role', width: 110, editable: true, type: 'singleSelect', valueOptions: ['Staff', 'Manager', 'Director'] },
    { field: 'department', headerName: 'Department', width: 120, editable: false },
    {
      field: 'actions', type: 'actions', headerName: 'Actions', width: 80,
      getActions: ({ id }) => {
        if (rowModesModel[id]?.mode === GridRowModes.Edit) {
          return [
            <GridActionsCellItem key="save" icon={<SaveIcon />} label="Save" onClick={handleSaveClick(id)} />,
            <GridActionsCellItem key="cancel" icon={<CancelIcon />} label="Cancel" onClick={handleCancelClick(id)} />,
          ];
        }
        return [<GridActionsCellItem key="edit" icon={<EditIcon />} label="Edit" onClick={handleEditClick(id)} />];
      },
    },
  ];

  return (
    <Stack direction="row" spacing={2} sx={{ p: 2, justifyContent: 'flex-end' }}>
      <Card sx={{ width: 560 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Employees</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Manage team members. Click Edit to modify a row.
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
            <Chip label="Active: 7" size="small" color="success" variant="outlined" />
            <Chip label="On leave: 2" size="small" variant="outlined" />
          </Stack>
          <Box sx={{ height: 400 }}>
            <DataGrid
              rows={rows} columns={columns} editMode="row" rowModesModel={rowModesModel}
              onRowModesModelChange={setRowModesModel} onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={e => console.error(e)}
              disableRowSelectionOnClick hideFooter density="compact"
            />
          </Box>
        </CardContent>
      </Card>
      <Paper sx={{ p: 2, width: 160, alignSelf: 'flex-start' }}>
        <Typography variant="caption" color="text.secondary">Headcount</Typography>
        <Typography variant="h5">{rows.length}</Typography>
      </Paper>
    </Stack>
  );
}
