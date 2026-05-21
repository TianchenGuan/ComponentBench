'use client';

/**
 * data_grid_editable-mui-T06: Edit a row in row-edit mode and save
 *
 * The page is a light-theme form section titled "Employees" with a MUI X DataGrid embedded below a short description paragraph.
 * The grid is configured for row editing (editMode="row") and includes an Actions column.
 *
 * Row editing behavior:
 * - Each row has an Edit icon/button in the Actions column.
 * - Clicking Edit switches the entire row into edit mode (multiple cells become editors).
 * - The Actions column then shows Save and Cancel controls.
 * - Changes are committed only when Save is clicked.
 *
 * Grid details:
 * - One grid instance; comfortable spacing; default scale.
 * - Columns: ID (read-only key), Name (editable text), Role (editable single-select with options: Staff, Manager, Director), Location (read-only), Actions (Edit/Save/Cancel).
 * - Initial state: row ID 7 exists and differs from the target values.
 *
 * Distractors:
 * - A disabled "Export" button sits above the grid but does not affect success.
 */

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel, GridRowModes, GridRowModesModel, GridActionsCellItem, GridEventListener, GridRowId, GridRowEditStopReasons } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import type { TaskComponentProps, EmployeeRow } from '../types';

interface EmployeeRowExtended extends EmployeeRow {
  isNew?: boolean;
}

const initialRows: EmployeeRowExtended[] = [
  { id: 1, name: 'John Smith', role: 'Staff', location: 'New York' },
  { id: 2, name: 'Jane Doe', role: 'Manager', location: 'Los Angeles' },
  { id: 3, name: 'Bob Johnson', role: 'Director', location: 'Chicago' },
  { id: 4, name: 'Alice Brown', role: 'Staff', location: 'Houston' },
  { id: 5, name: 'Charlie Wilson', role: 'Manager', location: 'Phoenix' },
  { id: 6, name: 'Diana Miller', role: 'Staff', location: 'San Antonio' },
  { id: 7, name: 'Edward Norton', role: 'Staff', location: 'Dallas' },
  { id: 8, name: 'Fiona Apple', role: 'Director', location: 'Austin' },
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<EmployeeRowExtended[]>(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false } as EmployeeRowExtended;
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  // Check success condition after rows update
  useEffect(() => {
    const targetRow = rows.find((r) => r.id === 7);
    const isInViewMode = !rowModesModel[7] || rowModesModel[7]?.mode === GridRowModes.View;
    if (
      targetRow &&
      targetRow.name.trim() === 'Riley Park' &&
      targetRow.role === 'Manager' &&
      isInViewMode &&
      !hasSucceeded
    ) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [rows, rowModesModel, hasSucceeded, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70, editable: false },
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Staff', 'Manager', 'Director'],
    },
    { field: 'location', headerName: 'Location', width: 130, editable: false },
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
    <Card sx={{ width: 650 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Employees
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Manage employee information. Click the edit icon to modify a row.
        </Typography>
        <Button variant="outlined" disabled sx={{ mb: 2 }}>
          Export
        </Button>
        <Box sx={{ height: 450 }}>
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
  );
}
