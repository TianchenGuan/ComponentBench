'use client';

/**
 * data_grid_editable-mui-v2-T02: Save the right repeated-name row in the correct grid instance
 *
 * Two side-by-side DataGrids: "Employees" and "Contractors". Row editing with actions.
 * In Contractors, edit row ID 14: Name → "Sam Rivera", Status → "Active", then Save.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, Typography, Stack, Chip, Paper, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import {
  DataGrid, GridColDef, GridRowModel, GridRowModes, GridRowModesModel,
  GridActionsCellItem, GridEventListener, GridRowId, GridRowEditStopReasons,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface Row { id: number; name: string; status: string; team: string; }

const empRows: Row[] = [
  { id: 10, name: 'Sam Chen', status: 'Active', team: 'Alpha' },
  { id: 11, name: 'Riley Park', status: 'Active', team: 'Beta' },
  { id: 12, name: 'Sam Rivera', status: 'Inactive', team: 'Alpha' },
  { id: 13, name: 'Jordan Lee', status: 'Active', team: 'Gamma' },
];

const contractorRows: Row[] = [
  { id: 13, name: 'Sam Chen', status: 'Inactive', team: 'Delta' },
  { id: 14, name: 'Sam Ortiz', status: 'Inactive', team: 'Delta' },
  { id: 15, name: 'Mina Patel', status: 'Active', team: 'Epsilon' },
  { id: 16, name: 'Alex Kim', status: 'Active', team: 'Delta' },
];

function EditableGrid({ title, initialRows: init, onRowsChange, testId }: {
  title: string; initialRows: Row[]; onRowsChange?: (rows: Row[]) => void; testId: string;
}) {
  const [rows, setRows] = useState<Row[]>(init);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) event.defaultMuiPrevented = true;
  };
  const handleEdit = (id: GridRowId) => () => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  const handleSave = (id: GridRowId) => () => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  const handleCancel = (id: GridRowId) => () => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View, ignoreModifications: true } });

  const processRowUpdate = (newRow: GridRowModel) => {
    const u = newRow as Row;
    const next = rows.map(r => (r.id === u.id ? u : r));
    setRows(next);
    onRowsChange?.(next);
    return u;
  };

  const cols: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'name', headerName: 'Name', width: 130, editable: true },
    { field: 'status', headerName: 'Status', width: 100, editable: true, type: 'singleSelect', valueOptions: ['Active', 'Inactive'] },
    { field: 'team', headerName: 'Team', width: 90 },
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
    <Card sx={{ flex: 1 }} data-testid={testId}>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>{title}</Typography>
        <Box sx={{ height: 260 }}>
          <DataGrid rows={rows} columns={cols} editMode="row" rowModesModel={rowModesModel}
            onRowModesModelChange={setRowModesModel} onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate} onProcessRowUpdateError={e => console.error(e)}
            disableRowSelectionOnClick hideFooter density="compact" />
        </Box>
      </CardContent>
    </Card>
  );
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [contractorState, setContractorState] = useState<Row[]>(contractorRows);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const t = contractorState.find(r => r.id === 14);
    if (t && t.name.trim() === 'Sam Rivera' && t.status === 'Active') {
      successFired.current = true;
      onSuccess();
    }
  }, [contractorState, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack spacing={1} sx={{ p: 1 }}>
        <Stack direction="row" spacing={0.5}>
          <Chip label="Headcount: 8" size="small" variant="outlined" />
          <Chip label="Contractors: 4" size="small" variant="outlined" />
        </Stack>
        <Stack direction="row" spacing={2}>
          <EditableGrid title="Employees" initialRows={empRows} testId="employees-grid" />
          <EditableGrid title="Contractors" initialRows={contractorRows} onRowsChange={setContractorState} testId="contractors-grid" />
        </Stack>
        <Paper sx={{ p: 1 }}>
          <Typography variant="caption" color="text.secondary">Shifts this week: 24</Typography>
        </Paper>
      </Stack>
    </ThemeProvider>
  );
}
