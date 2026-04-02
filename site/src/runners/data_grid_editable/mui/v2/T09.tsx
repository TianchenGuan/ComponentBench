'use client';

/**
 * data_grid_editable-mui-v2-T09: Multiline notes cell committed with Ctrl+Enter
 *
 * Single DataGrid "Profiles" with a custom multiline Bio edit component.
 * Enter inserts newline; Ctrl+Enter commits.
 * Edit row ID 12 Bio to exactly: "Ships weekly\nEscalate after 5pm"
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Paper, Stack, Chip, ThemeProvider, createTheme, CssBaseline, InputBase } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel, GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface Row { id: number; name: string; bio: string; team: string; }

const initialRows: Row[] = [
  { id: 10, name: 'Alice Brown', bio: 'Backend lead', team: 'Platform' },
  { id: 11, name: 'Bob Johnson', bio: 'Frontend specialist', team: 'UI' },
  { id: 12, name: 'Charlie Wilson', bio: 'On-call rotation', team: 'SRE' },
  { id: 13, name: 'Diana Miller', bio: 'New hire Q2', team: 'Platform' },
  { id: 14, name: 'Edward Norton', bio: '', team: 'Data' },
];

function MultilineEditCell(params: GridRenderEditCellParams) {
  const apiRef = useGridApiContext();
  const { id, field, value } = params;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      apiRef.current.stopCellEditMode({ id, field });
    } else if (e.key === 'Enter') {
      e.stopPropagation();
    }
  };

  return (
    <InputBase
      value={value ?? ''}
      onChange={e => apiRef.current.setEditCellValue({ id, field, value: e.target.value })}
      onKeyDown={handleKeyDown}
      multiline minRows={2} maxRows={4} autoFocus fullWidth
      sx={{ p: 0.5, fontSize: '0.875rem', alignItems: 'flex-start' }}
    />
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const successFired = useRef(false);

  const processRowUpdate = useCallback((newRow: GridRowModel) => {
    const u = newRow as Row;
    setRows(prev => prev.map(r => (r.id === u.id ? u : r)));
    return u;
  }, []);

  useEffect(() => {
    if (successFired.current) return;
    const t = rows.find(r => r.id === 12);
    if (t && t.bio.trim() === 'Ships weekly\nEscalate after 5pm') {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'bio', headerName: 'Bio', width: 220, editable: true, renderEditCell: p => <MultilineEditCell {...p} /> },
    { field: 'team', headerName: 'Team', width: 90 },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack spacing={1} sx={{ p: 2 }}>
        <Stack direction="row" spacing={0.5}>
          <Chip label="5 profiles" size="small" variant="outlined" />
          <Chip label="SRE on-call" size="small" color="warning" variant="outlined" />
        </Stack>
        <Card sx={{ width: 520 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>Profiles</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Double-click Bio to edit. Enter inserts newline; Ctrl+Enter saves.
            </Typography>
            <Box sx={{ height: 320 }}>
              <DataGrid rows={rows} columns={columns}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={e => console.error(e)}
                disableRowSelectionOnClick hideFooter density="compact" />
            </Box>
          </CardContent>
        </Card>
        <Paper sx={{ p: 1 }}>
          <Typography variant="caption" color="text.secondary">Team summary card (read-only)</Typography>
        </Paper>
      </Stack>
    </ThemeProvider>
  );
}
