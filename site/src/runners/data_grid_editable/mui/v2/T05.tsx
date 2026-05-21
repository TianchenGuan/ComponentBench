'use client';

/**
 * data_grid_editable-mui-v2-T05: Linked fields — change Type, then choose a valid Account
 *
 * Single DataGrid "Ledger" in a settings panel. Row editing with linked Type/Account fields.
 * Changing Type resets Account and changes valid options.
 * Edit row ID 21: Type → "Income", Account → "Sales", then Save.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Paper, Stack, Chip } from '@mui/material';
import {
  DataGrid, GridColDef, GridRowModel, GridRowModes, GridRowModesModel,
  GridActionsCellItem, GridEventListener, GridRowId, GridRowEditStopReasons,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../../types';

const accountsByType: Record<string, string[]> = {
  Income: ['Sales', 'Consulting', 'Interest'],
  Expense: ['Utilities', 'Payroll', 'Rent', 'Travel'],
  Transfer: ['Internal', 'External'],
};

interface Row { id: number; ref: string; type: string; account: string; amount: number; }

const initialRows: Row[] = [
  { id: 20, ref: 'LG-20', type: 'Expense', account: 'Utilities', amount: 450 },
  { id: 21, ref: 'LG-21', type: 'Transfer', account: 'Internal', amount: 1200 },
  { id: 22, ref: 'LG-22', type: 'Income', account: 'Consulting', amount: 3000 },
  { id: 23, ref: 'LG-23', type: 'Expense', account: 'Travel', amount: 800 },
  { id: 24, ref: 'LG-24', type: 'Income', account: 'Sales', amount: 5000 },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const successFired = useRef(false);

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
    setRows(prev => prev.map(r => (r.id === u.id ? u : r)));
    return u;
  }, []);

  useEffect(() => {
    if (successFired.current) return;
    const t = rows.find(r => r.id === 21);
    const inView = !rowModesModel[21] || rowModesModel[21]?.mode === GridRowModes.View;
    if (t && t.type === 'Income' && t.account === 'Sales' && inView) {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, rowModesModel, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'ref', headerName: 'Ref', width: 70 },
    { field: 'type', headerName: 'Type', width: 100, editable: true, type: 'singleSelect', valueOptions: ['Income', 'Expense', 'Transfer'] },
    {
      field: 'account', headerName: 'Account', width: 110, editable: true, type: 'singleSelect',
      valueOptions: ({ row }) => accountsByType[row?.type] ?? [],
    },
    { field: 'amount', headerName: 'Amount', width: 90, type: 'number' },
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
    <Stack direction="row" spacing={2} sx={{ p: 2 }}>
      <Card sx={{ width: 560 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Ledger</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Type and Account are linked — changing Type updates the valid Account list.
          </Typography>
          <Box sx={{ height: 320 }}>
            <DataGrid rows={rows} columns={columns} editMode="row" rowModesModel={rowModesModel}
              onRowModesModelChange={setRowModesModel} onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={e => console.error(e)}
              disableRowSelectionOnClick hideFooter density="compact" />
          </Box>
        </CardContent>
      </Card>
      <Paper sx={{ p: 2, width: 160, alignSelf: 'flex-start' }}>
        <Typography variant="caption" color="text.secondary">Balance</Typography>
        <Typography variant="h5">$6,950</Typography>
        <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
          <Chip label="5 entries" size="small" variant="outlined" />
        </Stack>
      </Paper>
    </Stack>
  );
}
