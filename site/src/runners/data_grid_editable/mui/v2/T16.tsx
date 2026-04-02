'use client';

/**
 * data_grid_editable-mui-v2-T16: Wide projects grid — exact currency in offscreen Budget column
 *
 * Wide DataGrid "Projects" with horizontal scroll. Budget column is offscreen.
 * Scroll to Budget for row ID 5 and set it to exactly 1250 (displayed as $1,250.00).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Stack, Paper, Chip, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel, GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';

interface Row { id: number; project: string; lead: string; team: string; forecast: number; spend: number; budget: number; status: string; }

const initialRows: Row[] = [
  { id: 1, project: 'Alpha', lead: 'Alice', team: 'Eng', forecast: 5000, spend: 3200, budget: 4800, status: 'Active' },
  { id: 2, project: 'Beta', lead: 'Bob', team: 'Design', forecast: 2500, spend: 1800, budget: 2200, status: 'Active' },
  { id: 3, project: 'Gamma', lead: 'Charlie', team: 'Data', forecast: 8000, spend: 7500, budget: 7000, status: 'Over' },
  { id: 4, project: 'Delta', lead: 'Diana', team: 'Infra', forecast: 3000, spend: 1200, budget: 3500, status: 'Active' },
  { id: 5, project: 'Epsilon', lead: 'Eve', team: 'SRE', forecast: 1500, spend: 900, budget: 2000, status: 'Active' },
  { id: 6, project: 'Zeta', lead: 'Frank', team: 'Eng', forecast: 4000, spend: 3800, budget: 4200, status: 'Active' },
];

function CurrencyEditCell(params: GridRenderEditCellParams) {
  const apiRef = useGridApiContext();
  const { id, field, value } = params;
  return (
    <TextField type="number" size="small" autoFocus fullWidth value={value ?? ''}
      onChange={e => apiRef.current.setEditCellValue({ id, field, value: Number(e.target.value) })}
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); apiRef.current.stopCellEditMode({ id, field }); } }}
      inputProps={{ step: 0.01 }} sx={{ minWidth: 120 }} />
  );
}

const formatUSD = (v: number) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function T16({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const successFired = useRef(false);

  const processRowUpdate = useCallback((newRow: GridRowModel) => {
    const u = newRow as Row;
    setRows(prev => prev.map(r => (r.id === u.id ? u : r)));
    return u;
  }, []);

  useEffect(() => {
    if (successFired.current) return;
    const t = rows.find(r => r.id === 5);
    if (t && t.budget === 1250) {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'project', headerName: 'Project', width: 100 },
    { field: 'lead', headerName: 'Lead', width: 90 },
    { field: 'team', headerName: 'Team', width: 80 },
    { field: 'status', headerName: 'Status', width: 80 },
    { field: 'forecast', headerName: 'Forecast', width: 110, type: 'number', valueFormatter: (v: number) => formatUSD(v) },
    { field: 'spend', headerName: 'Spend', width: 110, type: 'number', valueFormatter: (v: number) => formatUSD(v) },
    { field: 'budget', headerName: 'Budget', width: 120, type: 'number', editable: true, renderEditCell: p => <CurrencyEditCell {...p} />, valueFormatter: (v: number) => formatUSD(v) },
  ];

  return (
    <Stack spacing={1} sx={{ p: 2, alignItems: 'flex-end' }}>
      <Stack direction="row" spacing={0.5}>
        <Chip label="6 projects" size="small" variant="outlined" />
        <Chip label="1 over budget" size="small" color="error" variant="outlined" />
      </Stack>
      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Projects</Typography>
          <Box sx={{ height: 340, overflow: 'auto' }}>
            <DataGrid rows={rows} columns={columns}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={e => console.error(e)}
              disableRowSelectionOnClick hideFooter density="compact"
              sx={{ minWidth: 850 }} />
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
