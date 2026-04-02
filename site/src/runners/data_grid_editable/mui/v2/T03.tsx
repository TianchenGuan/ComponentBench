'use client';

/**
 * data_grid_editable-mui-v2-T03: Conditional validation — scheduled rows require a due date
 *
 * Single DataGrid "Releases" in a modal-like panel. Row editing with validation:
 * if Status is "Scheduled", Due date must be a valid date. Save is blocked while invalid.
 * Edit row ID 9: Status → "Scheduled", Due date → "2026-07-01", then Save.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, Typography, Paper, Stack } from '@mui/material';
import {
  DataGrid, GridColDef, GridRowModel, GridRowModes, GridRowModesModel,
  GridActionsCellItem, GridEventListener, GridRowId, GridRowEditStopReasons,
  GridPreProcessEditCellProps,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../../types';

interface Row { id: number; release: string; status: string; dueDate: string; owner: string; }

const initialRows: Row[] = [
  { id: 7, release: 'v3.1', status: 'Draft', dueDate: '', owner: 'Alice' },
  { id: 8, release: 'v3.2', status: 'Scheduled', dueDate: '2026-06-15', owner: 'Bob' },
  { id: 9, release: 'v4.0', status: 'Draft', dueDate: '', owner: 'Charlie' },
  { id: 10, release: 'v4.1', status: 'Released', dueDate: '2026-05-01', owner: 'Diana' },
  { id: 11, release: 'v4.2', status: 'Draft', dueDate: '', owner: 'Eve' },
];

const isValidDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s));

export default function T03({ onSuccess }: TaskComponentProps) {
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
    if (u.status === 'Scheduled' && !isValidDate(u.dueDate)) {
      throw new Error('Scheduled releases require a valid due date');
    }
    setRows(prev => prev.map(r => (r.id === u.id ? u : r)));
    return u;
  };

  useEffect(() => {
    if (successFired.current) return;
    const t = rows.find(r => r.id === 9);
    const inView = !rowModesModel[9] || rowModesModel[9]?.mode === GridRowModes.View;
    if (t && t.status === 'Scheduled' && t.dueDate === '2026-07-01' && inView) {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, rowModesModel, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'release', headerName: 'Release', width: 90 },
    {
      field: 'status', headerName: 'Status', width: 110, editable: true, type: 'singleSelect',
      valueOptions: ['Draft', 'Scheduled', 'Released'],
    },
    {
      field: 'dueDate', headerName: 'Due date', width: 130, editable: true,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const status = params.otherFieldsProps?.status?.value ?? rows.find(r => r.id === params.id)?.status;
        const hasError = status === 'Scheduled' && !isValidDate(String(params.props.value ?? ''));
        return { ...params.props, error: hasError };
      },
    },
    { field: 'owner', headerName: 'Owner', width: 90 },
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
    <Stack alignItems="center" sx={{ p: 2 }}>
      <Card sx={{ width: 680 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Releases</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            When Status is &quot;Scheduled&quot;, a valid Due date (YYYY-MM-DD) is required for Save.
          </Typography>
          <Box sx={{ height: 340 }}>
            <DataGrid rows={rows} columns={columns} editMode="row" rowModesModel={rowModesModel}
              onRowModesModelChange={setRowModesModel} onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={e => console.warn('Validation blocked save:', e.message)}
              disableRowSelectionOnClick hideFooter density="compact" />
          </Box>
        </CardContent>
      </Card>
      <Paper sx={{ p: 1, mt: 1, width: 680 }}>
        <Typography variant="caption" color="text.secondary">Release summary: 5 total, 2 scheduled</Typography>
      </Paper>
    </Stack>
  );
}
