'use client';

/**
 * data_grid_editable-mui-T14: Autocomplete selection in the correct grid instance
 *
 * The page contains two MUI X DataGrids in a dashboard layout:
 *
 * - Left card: "Team A" assignments grid.
 * - Right card: "Team B" assignments grid.
 *
 * Both grids are editable and share similar columns. The task targets the Team B grid only.
 *
 * Team B grid details:
 * - Columns: Task (read-only key, e.g., T-13), Title (read-only), Assignee (editable), Due (read-only).
 * - The Assignee cell uses a custom Autocomplete editor (MUI Autocomplete) inside the DataGrid:
 *   - When editing, a text field appears.
 *   - Typing filters a long list of people (dozens of options).
 *   - Selecting a suggestion commits the value.
 *
 * Scene configuration:
 * - Light theme; comfortable spacing; default scale.
 * - Two grid instances; medium clutter from other cards and headers.
 *
 * Initial state:
 * - In Team B, task T-13 exists and Assignee is not Jordan Lee.
 */

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Autocomplete, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel, GridRenderEditCellParams } from '@mui/x-data-grid';
import type { TaskComponentProps, MuiTeamAssignmentRow } from '../types';

// Generate 40 team members
const teamMembers = [
  'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Edward Norton',
  'Fiona Apple', 'George Lucas', 'Hannah Montana', 'Ivan Petrov', 'Julia Roberts',
  'Kevin Hart', 'Laura Palmer', 'Michael Scott', 'Nancy Drew', 'Oliver Twist',
  'Patricia Arquette', 'Quentin Tarantino', 'Rachel Green', 'Samuel Jackson', 'Tina Turner',
  'Uma Thurman', 'Victor Hugo', 'Wendy Williams', 'Xavier Woods', 'Yvonne Strahovski',
  'Zachary Quinto', 'Amy Adams', 'Brad Pitt', 'Cate Blanchett', 'Daniel Craig',
  'Emma Stone', 'Frank Sinatra', 'Gal Gadot', 'Hugh Jackman', 'Idris Elba',
  'Jordan Lee', 'Kate Winslet', 'Leonardo DiCaprio', 'Margot Robbie', 'Natalie Portman',
];

const teamARows: MuiTeamAssignmentRow[] = [
  { id: 'A-1', title: 'Design review', assignee: 'Alice Johnson', due: '2026-02-10' },
  { id: 'A-2', title: 'Code audit', assignee: 'Bob Smith', due: '2026-02-12' },
  { id: 'A-3', title: 'Documentation', assignee: 'Charlie Brown', due: '2026-02-15' },
];

const teamBRows: MuiTeamAssignmentRow[] = [
  { id: 'T-11', title: 'API integration', assignee: 'Diana Prince', due: '2026-02-08' },
  { id: 'T-12', title: 'Testing', assignee: 'Edward Norton', due: '2026-02-10' },
  { id: 'T-13', title: 'Performance tuning', assignee: 'Fiona Apple', due: '2026-02-12' },
  { id: 'T-14', title: 'Security review', assignee: 'George Lucas', due: '2026-02-14' },
];

// Custom Autocomplete editor component
function AssigneeEditCell(props: GridRenderEditCellParams) {
  const { id, value, field, hasFocus } = props;
  const apiRef = props.api;

  const handleChange = (_: any, newValue: string | null) => {
    if (newValue) {
      apiRef.setEditCellValue({ id, field, value: newValue });
      apiRef.stopCellEditMode({ id, field });
    }
  };

  return (
    <Autocomplete
      value={value || ''}
      onChange={handleChange}
      options={teamMembers}
      autoHighlight
      openOnFocus
      renderInput={(params) => (
        <TextField {...params} variant="standard" autoFocus={hasFocus} size="small" />
      )}
      sx={{ width: '100%' }}
    />
  );
}

const teamAColumns: GridColDef[] = [
  { field: 'id', headerName: 'Task', width: 70, editable: false },
  { field: 'title', headerName: 'Title', width: 130, editable: false },
  { field: 'assignee', headerName: 'Assignee', width: 140, editable: true },
  { field: 'due', headerName: 'Due', width: 100, editable: false },
];

const teamBColumns: GridColDef[] = [
  { field: 'id', headerName: 'Task', width: 70, editable: false },
  { field: 'title', headerName: 'Title', width: 130, editable: false },
  {
    field: 'assignee',
    headerName: 'Assignee',
    width: 150,
    editable: true,
    renderEditCell: (params) => <AssigneeEditCell {...params} />,
  },
  { field: 'due', headerName: 'Due', width: 100, editable: false },
];

export default function T14({ task, onSuccess }: TaskComponentProps) {
  const [teamA, setTeamA] = useState<MuiTeamAssignmentRow[]>(teamARows);
  const [teamB, setTeamB] = useState<MuiTeamAssignmentRow[]>(teamBRows);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const processTeamAUpdate = (newRow: GridRowModel) => {
    const updatedRow = newRow as MuiTeamAssignmentRow;
    setTeamA((prev) => prev.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const processTeamBUpdate = (newRow: GridRowModel) => {
    const updatedRow = newRow as MuiTeamAssignmentRow;
    setTeamB((prev) => prev.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
    return updatedRow;
  };

  // Check success condition after Team B update
  useEffect(() => {
    const targetRow = teamB.find((r) => r.id === 'T-13');
    if (targetRow && targetRow.assignee.trim() === 'Jordan Lee' && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [teamB, hasSucceeded, onSuccess]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Card data-testid="team-a-grid">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Team A
            </Typography>
            <Box sx={{ height: 250 }}>
              <DataGrid
                rows={teamA}
                columns={teamAColumns}
                processRowUpdate={processTeamAUpdate}
                onProcessRowUpdateError={(error) => console.error(error)}
                disableRowSelectionOnClick
                hideFooter
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card data-testid="team-b-grid">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Team B
            </Typography>
            <Box sx={{ height: 250 }}>
              <DataGrid
                rows={teamB}
                columns={teamBColumns}
                processRowUpdate={processTeamBUpdate}
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
