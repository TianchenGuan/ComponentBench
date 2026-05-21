'use client';

/**
 * data_grid_editable-mui-T11: Cancel a row edit in dark theme
 *
 * The page is a dark-theme "Employees" section containing a single MUI X DataGrid configured for row editing (editMode="row").
 *
 * Row editing behavior:
 * - Row ID 4 has an Edit control in the Actions column.
 * - When a row enters edit mode, Save and Cancel controls appear in the Actions column.
 * - Cancel exits edit mode and discards changes, restoring the previous committed values.
 *
 * Grid details:
 * - Theme: dark.
 * - Comfortable spacing; default scale.
 * - One grid instance.
 * - Columns: ID (read-only key), Name (editable), Role (editable singleSelect), Actions (Edit/Save/Cancel).
 * - Initial committed state for row ID 4 includes Role = "Designer".
 *
 * No other required controls are present; a non-interactive header and helper text are distractors only.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, Typography, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel, GridRowModes, GridRowModesModel, GridActionsCellItem, GridEventListener, GridRowId, GridRowEditStopReasons } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface EmployeeDarkRow {
  id: number;
  name: string;
  role: 'Staff' | 'Manager' | 'Director' | 'Designer';
}

const initialRows: EmployeeDarkRow[] = [
  { id: 1, name: 'John Smith', role: 'Staff' },
  { id: 2, name: 'Jane Doe', role: 'Manager' },
  { id: 3, name: 'Bob Johnson', role: 'Director' },
  { id: 4, name: 'Alice Brown', role: 'Designer' },
  { id: 5, name: 'Charlie Wilson', role: 'Staff' },
];

export default function T11({ task, onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<EmployeeDarkRow[]>(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const wasEditingRef = useRef<boolean>(false);
  const lastOutcomeRef = useRef<Record<number, 'saved' | 'canceled'>>({});

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    if (id === 4) {
      wasEditingRef.current = true;
    }
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    lastOutcomeRef.current[id as number] = 'saved';
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    lastOutcomeRef.current[id as number] = 'canceled';

    // Check success condition: ID 4 Cancel clicked while in edit mode
    if (id === 4 && wasEditingRef.current && !hasSucceeded) {
      // Verify Role is still "Designer" (original value)
      const originalRow = rows.find((r) => r.id === 4);
      if (originalRow && originalRow.role === 'Designer') {
        setHasSucceeded(true);
        onSuccess();
      }
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = newRow as EmployeeDarkRow;
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70, editable: false },
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Staff', 'Manager', 'Director', 'Designer'],
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
              data-testid={`row-save-${id}`}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              data-testid={`row-cancel-${id}`}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
            data-testid={`row-edit-${id}`}
          />,
        ];
      },
    },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Card sx={{ width: 500, bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Employees
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Click Edit to modify employee details. Use Cancel to discard changes.
          </Typography>
          <Box sx={{ height: 350 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={setRowModesModel}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={(error) => console.error(error)}
              disableRowSelectionOnClick
              hideFooter
            />
          </Box>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
