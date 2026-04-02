'use client';

/**
 * data_grid_editable-mui-T13: Set a date using an in-cell date picker
 *
 * The page is a light-theme dashboard card titled "Schedule" containing one MUI X DataGrid.
 * The dashboard has moderate clutter: a sidebar list of teams and a small legend card, but they are not required.
 *
 * Date editing behavior:
 * - The Start date column is editable and uses a date-picker popover as the cell editor.
 * - Activating the Start date cell opens a calendar popover anchored to the cell, allowing selection of a specific date.
 * - After selecting a date, the cell shows the formatted date (e.g., "2026-04-01" or "Apr 1, 2026") and commits when the editor closes (Enter, click outside, or an OK action depending on the picker configuration).
 *
 * Guidance:
 * - Above the grid is a helper text showing the canonical date format used in the grid (mixed guidance: text + example).
 *
 * Initial state:
 * - Row ID 9 exists and Start date is not April 1, 2026.
 */

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Paper, List, ListItem, ListItemText } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import type { TaskComponentProps, ScheduleRow } from '../types';

const initialRows: ScheduleRow[] = [
  { id: 7, task: 'Planning', startDate: '2026-03-01', owner: 'Alice' },
  { id: 8, task: 'Development', startDate: '2026-03-15', owner: 'Bob' },
  { id: 9, task: 'Testing', startDate: '2026-03-20', owner: 'Charlie' },
  { id: 10, task: 'Deployment', startDate: '2026-04-15', owner: 'Diana' },
];

// Custom date editor component
function DateEditInputCell(props: any) {
  const { id, value, field, hasFocus } = props;
  const apiRef = props.api;

  const handleChange = (newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      apiRef.setEditCellValue({ id, field, value: newValue.format('YYYY-MM-DD') });
      apiRef.stopCellEditMode({ id, field });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={value ? dayjs(value) : null}
        onChange={handleChange}
        slotProps={{
          textField: {
            variant: 'standard',
            size: 'small',
            autoFocus: hasFocus,
          },
        }}
      />
    </LocalizationProvider>
  );
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 60, editable: false },
  { field: 'task', headerName: 'Task', width: 120, editable: false },
  {
    field: 'startDate',
    headerName: 'Start date',
    width: 150,
    editable: true,
    renderEditCell: (params) => <DateEditInputCell {...params} />,
  },
  { field: 'owner', headerName: 'Owner', width: 100, editable: false },
];

export default function T13({ task, onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<ScheduleRow[]>(initialRows);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = newRow as ScheduleRow;
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
    return updatedRow;
  };

  // Check success condition after rows update
  useEffect(() => {
    const targetRow = rows.find((r) => r.id === 9);
    if (targetRow && targetRow.startDate === '2026-04-01' && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [rows, hasSucceeded, onSuccess]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Paper sx={{ p: 1 }}>
          <Typography variant="subtitle2" gutterBottom>Teams</Typography>
          <List dense>
            <ListItem><ListItemText primary="Alpha Team" /></ListItem>
            <ListItem><ListItemText primary="Beta Team" /></ListItem>
            <ListItem><ListItemText primary="Gamma Team" /></ListItem>
          </List>
        </Paper>
        <Paper sx={{ p: 1, mt: 1 }}>
          <Typography variant="subtitle2" gutterBottom>Legend</Typography>
          <Typography variant="caption" color="text.secondary">
            Dates in ISO format: YYYY-MM-DD
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Schedule
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Date format: YYYY-MM-DD (e.g., 2026-04-01)
            </Typography>
            <Box sx={{ height: 280 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={(error) => console.error(error)}
                disableRowSelectionOnClick
                hideFooter
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
