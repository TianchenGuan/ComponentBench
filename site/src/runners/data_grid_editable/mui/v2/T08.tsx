'use client';

/**
 * data_grid_editable-mui-v2-T08: Autocomplete in Team B, not Team A
 *
 * Two side-by-side DataGrids: "Team A" and "Team B". Both have Autocomplete Assignee editors.
 * In Team B, set Assignee for task T-13 to "Jordan Lee", then click "Apply Team B changes".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Stack, Chip, Paper, Button, Autocomplete, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel, GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';

const PEOPLE = [
  'Jordan Lee', 'Jordan Li', 'Jordan Levin', 'Jordan Lewis',
  'Alex Kim', 'Dana Kim', 'Mina Patel', 'Nina Patel',
  'Sam Rivera', 'Riley Park', 'Priya Shah', 'Mia Ortiz',
];

interface Row { id: string; title: string; assignee: string; status: string; }

const teamARows: Row[] = [
  { id: 'T-11', title: 'Design sprint', assignee: 'Alex Kim', status: 'Active' },
  { id: 'T-12', title: 'Code review', assignee: 'Dana Kim', status: 'Active' },
  { id: 'T-13', title: 'QA sign-off', assignee: 'Sam Rivera', status: 'Blocked' },
];

const teamBRows: Row[] = [
  { id: 'T-11', title: 'API docs', assignee: 'Mina Patel', status: 'Active' },
  { id: 'T-12', title: 'Load test', assignee: 'Riley Park', status: 'Done' },
  { id: 'T-13', title: 'Infra setup', assignee: 'Nina Patel', status: 'Active' },
  { id: 'T-14', title: 'Deploy prep', assignee: 'Jordan Li', status: 'Active' },
];

function AutocompleteEditCell(params: GridRenderEditCellParams) {
  const apiRef = useGridApiContext();
  const { id, field, value } = params;
  return (
    <Autocomplete
      value={value as string ?? ''}
      onChange={(_e, v) => { apiRef.current.setEditCellValue({ id, field, value: v ?? '' }); apiRef.current.stopCellEditMode({ id, field }); }}
      options={PEOPLE}
      renderInput={p => <TextField {...p} size="small" autoFocus />}
      size="small" fullWidth openOnFocus freeSolo={false} sx={{ minWidth: 150 }}
    />
  );
}

function TeamGrid({ title, initRows, onRowsChange, applyLabel, onApply, testId }: {
  title: string; initRows: Row[]; onRowsChange?: (rows: Row[]) => void;
  applyLabel: string; onApply?: () => void; testId: string;
}) {
  const [rows, setRows] = useState<Row[]>(initRows);
  const processRowUpdate = useCallback((newRow: GridRowModel) => {
    const u = newRow as Row;
    const next = rows.map(r => (r.id === u.id ? u : r));
    setRows(next);
    onRowsChange?.(next);
    return u;
  }, [rows, onRowsChange]);

  const cols: GridColDef[] = [
    { field: 'id', headerName: 'Task ID', width: 70 },
    { field: 'title', headerName: 'Title', width: 120 },
    { field: 'assignee', headerName: 'Assignee', width: 160, editable: true, renderEditCell: p => <AutocompleteEditCell {...p} /> },
    { field: 'status', headerName: 'Status', width: 80 },
  ];

  return (
    <Card sx={{ flex: 1 }} data-testid={testId}>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>{title}</Typography>
        <Box sx={{ height: 250 }}>
          <DataGrid rows={rows} columns={cols} processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={e => console.error(e)}
            disableRowSelectionOnClick hideFooter density="compact" />
        </Box>
        <Button variant="contained" size="small" fullWidth sx={{ mt: 1 }} onClick={onApply}>
          {applyLabel}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [teamBState, setTeamBState] = useState<Row[]>(teamBRows);
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current || !applied) return;
    const t = teamBState.find(r => r.id === 'T-13');
    if (t && t.assignee.trim() === 'Jordan Lee') {
      successFired.current = true;
      onSuccess();
    }
  }, [teamBState, applied, onSuccess]);

  return (
    <Stack spacing={1} sx={{ p: 1 }}>
      <Stack direction="row" spacing={0.5}>
        <Chip label="Team A: 3" size="small" variant="outlined" />
        <Chip label="Team B: 4" size="small" variant="outlined" />
        <Chip label="On-call: 2" size="small" variant="outlined" />
      </Stack>
      <Stack direction="row" spacing={2}>
        <TeamGrid title="Team A" initRows={teamARows} applyLabel="Apply Team A changes" testId="team-a-grid" />
        <TeamGrid title="Team B" initRows={teamBRows} onRowsChange={setTeamBState}
          applyLabel="Apply Team B changes" onApply={() => setApplied(true)} testId="team-b-grid" />
      </Stack>
      <Paper sx={{ p: 1 }}>
        <Typography variant="caption" color="text.secondary">On-call summary: 2 engineers rotating</Typography>
      </Paper>
    </Stack>
  );
}
