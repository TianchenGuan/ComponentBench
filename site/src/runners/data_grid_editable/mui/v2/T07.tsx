'use client';

/**
 * data_grid_editable-mui-v2-T07: Autocomplete owner selection in a compact tasks grid
 *
 * Single DataGrid "Tasks" with custom Autocomplete edit component for Owner column.
 * Set Owner for row ID 18 to "Jordan Lee". Cell editing auto-commits on selection.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Stack, Chip, Paper, Autocomplete, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel, GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';

const PEOPLE = [
  'Jordan Lee', 'Jordan Li', 'Jordan Levin', 'Jordan Lewis',
  'Alex Kim', 'Alex Chen', 'Dana Kim', 'Dana Chen',
  'Mina Patel', 'Nina Patel', 'Sam Rivera', 'Riley Park',
  'Priya Shah', 'Mia Ortiz', 'Charlie Wilson', 'Fiona Apple',
];

interface Row { id: number; task: string; owner: string; status: string; }

const initialRows: Row[] = [
  { id: 15, task: 'Design review', owner: 'Alex Kim', status: 'Open' },
  { id: 16, task: 'API refactor', owner: 'Dana Kim', status: 'In Progress' },
  { id: 17, task: 'Load testing', owner: 'Sam Rivera', status: 'Open' },
  { id: 18, task: 'Auth upgrade', owner: 'Mina Patel', status: 'Open' },
  { id: 19, task: 'Deploy pipeline', owner: 'Jordan Li', status: 'Done' },
  { id: 20, task: 'Docs update', owner: 'Riley Park', status: 'In Progress' },
];

function AutocompleteEditCell(params: GridRenderEditCellParams) {
  const apiRef = useGridApiContext();
  const { id, field, value } = params;

  return (
    <Autocomplete
      value={value as string ?? ''}
      onChange={(_e, newValue) => {
        apiRef.current.setEditCellValue({ id, field, value: newValue ?? '' });
        apiRef.current.stopCellEditMode({ id, field });
      }}
      options={PEOPLE}
      renderInput={(p) => <TextField {...p} size="small" autoFocus />}
      size="small" fullWidth openOnFocus freeSolo={false}
      sx={{ minWidth: 160 }}
    />
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const successFired = useRef(false);

  const processRowUpdate = useCallback((newRow: GridRowModel) => {
    const u = newRow as Row;
    setRows(prev => prev.map(r => (r.id === u.id ? u : r)));
    return u;
  }, []);

  useEffect(() => {
    if (successFired.current) return;
    const t = rows.find(r => r.id === 18);
    if (t && t.owner.trim() === 'Jordan Lee') {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'task', headerName: 'Task', width: 140 },
    { field: 'owner', headerName: 'Owner', width: 170, editable: true, renderEditCell: (p) => <AutocompleteEditCell {...p} /> },
    { field: 'status', headerName: 'Status', width: 100 },
  ];

  return (
    <Stack spacing={1} sx={{ p: 2 }}>
      <Stack direction="row" spacing={0.5}>
        <Chip label="6 tasks" size="small" variant="outlined" />
        <Chip label="2 open" size="small" color="warning" variant="outlined" />
      </Stack>
      <Card sx={{ width: 520 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Tasks</Typography>
          <Box sx={{ height: 340 }}>
            <DataGrid rows={rows} columns={columns}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={e => console.error(e)}
              disableRowSelectionOnClick hideFooter density="compact" />
          </Box>
        </CardContent>
      </Card>
      <Paper sx={{ p: 1, width: 520 }}>
        <Typography variant="caption" color="text.secondary">Sprint velocity: 18 pts</Typography>
      </Paper>
    </Stack>
  );
}
