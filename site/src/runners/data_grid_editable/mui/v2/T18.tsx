'use client';

/**
 * data_grid_editable-mui-v2-T18: Toolbar add-row flow with row save
 *
 * Dark DataGrid "Records" with CRUD toolbar. Click "Add record" to insert a new row.
 * Fill: ID 501, Name "Nova", Age 22, Status "New", then click Save.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, Typography, Button, Stack, Paper, Chip, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  DataGrid, GridColDef, GridRowModel, GridRowModes, GridRowModesModel,
  GridActionsCellItem, GridEventListener, GridRowId, GridRowEditStopReasons,
} from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface Row { _key: string; id: number; name: string; age: number; status: string; isNew?: boolean; }

const initialRows: Row[] = [
  { _key: 'r1', id: 100, name: 'Record A', age: 25, status: 'Active' },
  { _key: 'r2', id: 200, name: 'Record B', age: 32, status: 'New' },
  { _key: 'r3', id: 300, name: 'Record C', age: 41, status: 'Archived' },
  { _key: 'r4', id: 400, name: 'Record D', age: 28, status: 'Active' },
];

export default function T18({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const successFired = useRef(false);

  const editingKey = Object.keys(rowModesModel).find(k => rowModesModel[k]?.mode === GridRowModes.Edit) ?? null;

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) event.defaultMuiPrevented = true;
  };
  const handleSave = (key: GridRowId) => () => setRowModesModel(m => ({ ...m, [key]: { mode: GridRowModes.View } }));
  const handleCancel = (key: GridRowId) => () => {
    setRowModesModel(m => ({ ...m, [key]: { mode: GridRowModes.View, ignoreModifications: true } }));
    const r = rows.find(x => x._key === String(key));
    if (r?.isNew) setRows(prev => prev.filter(x => x._key !== String(key)));
  };

  const handleAddClick = () => {
    if (editingKey !== null) return;
    const newKey = `new-${Date.now()}`;
    setRows(old => [...old, { _key: newKey, id: 0, name: '', age: 0, status: 'New', isNew: true }]);
    setRowModesModel(old => ({ ...old, [newKey]: { mode: GridRowModes.Edit, fieldToFocus: 'id' } }));
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const u = { ...newRow, isNew: false } as Row;
    setRows(prev => prev.map(r => (r._key === newRow._key ? u : r)));
    return u;
  };

  useEffect(() => {
    if (successFired.current) return;
    const t = rows.find(r => r.id === 501);
    if (!t) return;
    const inView = !rowModesModel[t._key] || rowModesModel[t._key]?.mode === GridRowModes.View;
    if (t.name.trim() === 'Nova' && t.age === 22 && t.status === 'New' && !t.isNew && inView) {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, rowModesModel, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80, editable: true, type: 'number' },
    { field: 'name', headerName: 'Name', width: 120, editable: true },
    { field: 'age', headerName: 'Age', width: 80, type: 'number', editable: true },
    { field: 'status', headerName: 'Status', width: 100, editable: true, type: 'singleSelect', valueOptions: ['New', 'Active', 'Archived'] },
    {
      field: 'actions', type: 'actions', headerName: 'Actions', width: 80,
      getActions: (params) => {
        const key = params.row._key;
        if (rowModesModel[key]?.mode === GridRowModes.Edit) {
          return [
            <GridActionsCellItem key="s" icon={<SaveIcon />} label="Save" onClick={handleSave(key)} />,
            <GridActionsCellItem key="c" icon={<CancelIcon />} label="Cancel" onClick={handleCancel(key)} />,
          ];
        }
        return [];
      },
    },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack spacing={1} sx={{ p: 2 }}>
        <Stack direction="row" spacing={0.5}>
          <Chip label={`${rows.length} records`} size="small" variant="outlined" />
          <Chip label="Last sync: 2 min ago" size="small" variant="outlined" />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Records</Typography>
              <Button color="primary" variant="contained" startIcon={<AddIcon />}
                onClick={handleAddClick} disabled={editingKey !== null} sx={{ mb: 1 }} size="small">
                Add record
              </Button>
              <Box sx={{ height: 320 }}>
                <DataGrid rows={rows} columns={columns} editMode="row" rowModesModel={rowModesModel}
                  getRowId={(row) => row._key}
                  onRowModesModelChange={setRowModesModel} onRowEditStop={handleRowEditStop}
                  processRowUpdate={processRowUpdate}
                  onProcessRowUpdateError={e => console.warn(e.message)}
                  disableRowSelectionOnClick hideFooter density="compact" />
              </Box>
            </CardContent>
          </Card>
          <Stack spacing={1} sx={{ width: 160 }}>
            <Paper sx={{ p: 1 }}><Typography variant="caption" color="text.secondary">Quick Stats</Typography><Typography variant="h5">{rows.length}</Typography></Paper>
            <Paper sx={{ p: 1 }}><Typography variant="caption" color="text.secondary">Filters</Typography><Typography variant="body2" color="text.secondary">None</Typography></Paper>
          </Stack>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
}
