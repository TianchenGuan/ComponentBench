'use client';

/**
 * data_grid_editable-mui-T15: Add a new record using the DataGrid toolbar and save
 *
 * The page is a dark-theme dashboard with multiple widgets (high clutter). The main widget is a MUI X DataGrid titled "Records".
 * The grid is configured for CRUD-style row editing with an integrated toolbar.
 *
 * Toolbar and add-row behavior:
 * - The grid header includes a toolbar with an "Add record" button.
 * - Clicking "Add record" inserts a new row and immediately puts it into row edit mode.
 * - An Actions column shows Save and Cancel controls for the new row.
 * - The new row is only committed to the grid's data model when Save is clicked.
 *
 * Grid details:
 * - Theme dark; comfortable spacing; default scale.
 * - One grid instance.
 * - Columns: ID (editable for new row), Name (editable text), Age (editable number), Status (editable singleSelect: New, Active, Archived), Actions (Save/Cancel).
 * - Initial state: no existing row with ID 501.
 *
 * Clutter:
 * - Additional dashboard cards (charts, notifications, filters) surround the grid but do not affect success.
 */

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, ThemeProvider, createTheme, CssBaseline, Grid, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { DataGrid, GridColDef, GridRowModel, GridRowModes, GridRowModesModel, GridActionsCellItem, GridEventListener, GridRowId, GridRowEditStopReasons, GridToolbarContainer, GridSlotProps } from '@mui/x-data-grid';
import type { TaskComponentProps, RecordsRow } from '../types';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    setRows: React.Dispatch<React.SetStateAction<RecordsRowExtended[]>>;
    setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>;
    editingKey: GridRowId | null;
  }
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface RecordsRowExtended extends RecordsRow {
  isNew?: boolean;
}

const initialRows: RecordsRowExtended[] = [
  { id: 100, name: 'Record A', age: 25, status: 'Active' },
  { id: 200, name: 'Record B', age: 32, status: 'New' },
  { id: 300, name: 'Record C', age: 41, status: 'Archived' },
  { id: 400, name: 'Record D', age: 28, status: 'Active' },
];

function EditToolbar(props: GridSlotProps['toolbar']) {
  const { setRows, setRowModesModel, editingKey } = props;

  const handleClick = () => {
    if (editingKey !== null) return;
    const newId = Date.now();
    setRows((oldRows) => [
      ...oldRows,
      { id: newId, name: '', age: 0, status: 'New', isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [newId]: { mode: GridRowModes.Edit, fieldToFocus: 'id' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleClick}
        disabled={editingKey !== null}
        data-testid="add-record-button"
      >
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function T15({ task, onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<RecordsRowExtended[]>(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [hasSucceeded, setHasSucceeded] = useState(false);

  // Track if any row is in edit mode
  const editingKey = Object.keys(rowModesModel).find(
    (key) => rowModesModel[key]?.mode === GridRowModes.Edit
  ) ?? null;

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
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
    const updatedRow = { ...newRow, isNew: false } as RecordsRowExtended;
    setRows((prevRows) => prevRows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleProcessRowUpdateError = (error: Error) => {
    console.warn('Row update error (safe to ignore):', error.message);
  };

  // Check success condition after rows update
  useEffect(() => {
    const targetRow = rows.find((r) => r.id === 501);
    const isInViewMode = !rowModesModel[501] || rowModesModel[501]?.mode === GridRowModes.View;
    if (
      targetRow &&
      targetRow.name.trim() === 'Nova' &&
      targetRow.age === 22 &&
      targetRow.status === 'New' &&
      !targetRow.isNew &&
      isInViewMode &&
      !hasSucceeded
    ) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [rows, rowModesModel, hasSucceeded, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80, editable: true, type: 'number' },
    { field: 'name', headerName: 'Name', width: 120, editable: true },
    { field: 'age', headerName: 'Age', width: 80, type: 'number', editable: true },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['New', 'Active', 'Archived'],
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

        return [];
      },
    },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Records
              </Typography>
              <Button
                color="primary"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  if (editingKey !== null) return;
                  const newId = 501;
                  setRows((old) => [
                    ...old,
                    { id: newId, name: '', age: 0, status: 'New', isNew: true },
                  ]);
                  setRowModesModel((old) => ({
                    ...old,
                    [newId]: { mode: GridRowModes.Edit, fieldToFocus: 'id' },
                  }));
                }}
                disabled={editingKey !== null}
                data-testid="add-record-button"
                sx={{ mb: 1 }}
              >
                Add record
              </Button>
              <Box sx={{ height: 350 }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  editMode="row"
                  rowModesModel={rowModesModel}
                  onRowModesModelChange={setRowModesModel}
                  onRowEditStop={handleRowEditStop}
                  processRowUpdate={processRowUpdate}
                  onProcessRowUpdateError={handleProcessRowUpdateError}
                  disableRowSelectionOnClick
                  hideFooter
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
            <Typography variant="subtitle2" color="text.secondary">Quick Stats</Typography>
            <Typography variant="h4">{rows.length}</Typography>
            <Typography variant="body2" color="text.secondary">Total records</Typography>
          </Paper>
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
            <Typography variant="subtitle2" color="text.secondary">Notifications</Typography>
            <Typography variant="body2">No new alerts</Typography>
          </Paper>
          <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="subtitle2" color="text.secondary">Filters</Typography>
            <Typography variant="body2" color="text.secondary">None applied</Typography>
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
