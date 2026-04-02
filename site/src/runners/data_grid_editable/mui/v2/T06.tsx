'use client';

/**
 * data_grid_editable-mui-v2-T06: Linked fields in the correct grid instance
 *
 * Two side-by-side DataGrids: "Payroll" and "Reimbursements" (dark theme).
 * Both use linked Type/Account fields. In Reimbursements, edit row ID 31:
 * Type → "Expense", Account → "Utilities", then Save.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const accountsByType: Record<string, string[]> = {
  Income: ['Sales', 'Consulting', 'Interest'],
  Expense: ['Utilities', 'Payroll', 'Rent', 'Travel'],
  Transfer: ['Internal', 'External'],
};

interface Row { id: number; ref: string; type: string; account: string; amount: number; }

const payrollRows: Row[] = [
  { id: 30, ref: 'PY-30', type: 'Expense', account: 'Payroll', amount: 5000 },
  { id: 31, ref: 'PY-31', type: 'Expense', account: 'Payroll', amount: 4200 },
  { id: 32, ref: 'PY-32', type: 'Transfer', account: 'Internal', amount: 1500 },
];

const reimbursementRows: Row[] = [
  { id: 30, ref: 'RB-30', type: 'Income', account: 'Consulting', amount: 800 },
  { id: 31, ref: 'RB-31', type: 'Transfer', account: 'Internal', amount: 600 },
  { id: 32, ref: 'RB-32', type: 'Expense', account: 'Travel', amount: 350 },
  { id: 33, ref: 'RB-33', type: 'Income', account: 'Sales', amount: 1200 },
];

function LinkedGrid({ title, initRows, onRowsChange, testId }: {
  title: string; initRows: Row[]; onRowsChange?: (rows: Row[]) => void; testId: string;
}) {
  const [rows, setRows] = useState<Row[]>(initRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) event.defaultMuiPrevented = true;
  };
  const handleEdit = (id: GridRowId) => () => setRowModesModel(m => ({ ...m, [id]: { mode: GridRowModes.Edit } }));
  const handleSave = (id: GridRowId) => () => setRowModesModel(m => ({ ...m, [id]: { mode: GridRowModes.View } }));
  const handleCancel = (id: GridRowId) => () => setRowModesModel(m => ({ ...m, [id]: { mode: GridRowModes.View, ignoreModifications: true } }));

  const processRowUpdate = useCallback((newRow: GridRowModel, oldRow: GridRowModel) => {
    const u = { ...newRow } as Row;
    if (u.type !== oldRow.type) {
      const valid = accountsByType[u.type] ?? [];
      if (!valid.includes(u.account)) u.account = valid[0] ?? '';
    }
    const next = rows.map(r => (r.id === u.id ? u : r));
    setRows(next);
    onRowsChange?.(next);
    return u;
  }, [rows, onRowsChange]);

  const cols: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'ref', headerName: 'Ref', width: 70 },
    { field: 'type', headerName: 'Type', width: 100, editable: true, type: 'singleSelect', valueOptions: ['Income', 'Expense', 'Transfer'] },
    { field: 'account', headerName: 'Account', width: 100, editable: true, type: 'singleSelect', valueOptions: ({ row }) => accountsByType[row?.type] ?? [] },
    { field: 'amount', headerName: 'Amount', width: 80, type: 'number' },
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

export default function T06({ onSuccess }: TaskComponentProps) {
  const [reimbState, setReimbState] = useState<Row[]>(reimbursementRows);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const t = reimbState.find(r => r.id === 31);
    if (t && t.type === 'Expense' && t.account === 'Utilities') {
      successFired.current = true;
      onSuccess();
    }
  }, [reimbState, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack spacing={1} sx={{ p: 1 }}>
        <Stack direction="row" spacing={0.5}>
          <Chip label="Payroll: 3" size="small" variant="outlined" />
          <Chip label="Reimbursements: 4" size="small" variant="outlined" />
        </Stack>
        <Stack direction="row" spacing={2}>
          <LinkedGrid title="Payroll" initRows={payrollRows} testId="payroll-grid" />
          <LinkedGrid title="Reimbursements" initRows={reimbursementRows} onRowsChange={setReimbState} testId="reimbursements-grid" />
        </Stack>
        <Paper sx={{ p: 1 }}>
          <Typography variant="caption" color="text.secondary">Fiscal quarter: Q2 2026</Typography>
        </Paper>
      </Stack>
    </ThemeProvider>
  );
}
