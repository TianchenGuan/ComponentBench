'use client';

/**
 * data_table_sortable-mui-v2-T07: Users grid – sort Created on through the column menu, not Teams
 *
 * Two DataGrid cards side by side: "Users" and "Teams". Each grid uses MUI's column menu
 * (3-dots on hover) that offers sorting. The Created on column exists in both grids.
 * Dark theme, compact spacing.
 *
 * Success: Users sorted by Created on descending. Teams remains unsorted.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, Typography, Box, createTheme, ThemeProvider } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import type { TaskComponentProps, SortModel } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface UserRow { id: string; name: string; email: string; role: string; createdOn: string; }
interface TeamRow { id: string; teamName: string; lead: string; members: number; createdOn: string; }

const usersData: UserRow[] = [
  { id: '1', name: 'Alice Chen', email: 'alice@co.io', role: 'Admin', createdOn: '2024-01-05' },
  { id: '2', name: 'Bob Torres', email: 'bob@co.io', role: 'Editor', createdOn: '2024-02-12' },
  { id: '3', name: 'Carol Diaz', email: 'carol@co.io', role: 'Viewer', createdOn: '2023-11-20' },
  { id: '4', name: 'Dan Okafor', email: 'dan@co.io', role: 'Editor', createdOn: '2024-01-18' },
  { id: '5', name: 'Eva Singh', email: 'eva@co.io', role: 'Admin', createdOn: '2023-09-03' },
  { id: '6', name: 'Frank Liu', email: 'frank@co.io', role: 'Viewer', createdOn: '2024-02-28' },
  { id: '7', name: 'Grace Kim', email: 'grace@co.io', role: 'Editor', createdOn: '2023-12-15' },
];

const teamsData: TeamRow[] = [
  { id: '1', teamName: 'Engineering', lead: 'Alice', members: 12, createdOn: '2023-06-01' },
  { id: '2', teamName: 'Design', lead: 'Carol', members: 5, createdOn: '2023-08-15' },
  { id: '3', teamName: 'Product', lead: 'Eva', members: 8, createdOn: '2023-10-10' },
  { id: '4', teamName: 'Marketing', lead: 'Bob', members: 6, createdOn: '2024-01-20' },
  { id: '5', teamName: 'Sales', lead: 'Dan', members: 10, createdOn: '2023-07-01' },
];

const userCols: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 130 },
  { field: 'email', headerName: 'Email', width: 150, sortable: false },
  { field: 'role', headerName: 'Role', width: 80, sortable: false },
  { field: 'createdOn', headerName: 'Created on', width: 120 },
];

const teamCols: GridColDef[] = [
  { field: 'teamName', headerName: 'Team', width: 120 },
  { field: 'lead', headerName: 'Lead', width: 80, sortable: false },
  { field: 'members', headerName: 'Members', width: 80, sortable: false },
  { field: 'createdOn', headerName: 'Created on', width: 120 },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [userSort, setUserSort] = useState<GridSortModel>([]);
  const [teamSort, setTeamSort] = useState<GridSortModel>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const usersOk = userSort.length === 1 && userSort[0].field === 'createdOn' && userSort[0].sort === 'desc';
    const teamsOk = teamSort.length === 0;
    if (usersOk && teamsOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [userSort, teamSort, onSuccess]);

  const userSortModel: SortModel = userSort.map((item, idx) => ({
    column_key: item.field === 'createdOn' ? 'created_on' : item.field,
    direction: (item.sort || 'asc') as 'asc' | 'desc',
    priority: idx + 1,
  }));
  const teamSortModel: SortModel = teamSort.map((item, idx) => ({
    column_key: item.field === 'createdOn' ? 'created_on' : item.field,
    direction: (item.sort || 'asc') as 'asc' | 'desc',
    priority: idx + 1,
  }));

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ position: 'absolute', top: 24, right: 24, display: 'flex', gap: 2, width: 780 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Users</Typography>
            <div style={{ height: 360 }}>
              <DataGrid
                rows={usersData}
                columns={userCols}
                sortModel={userSort}
                onSortModelChange={setUserSort}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick
                density="compact"
                data-testid="grid-users"
                data-sort-model={JSON.stringify(userSortModel)}
              />
            </div>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Teams</Typography>
            <div style={{ height: 360 }}>
              <DataGrid
                rows={teamsData}
                columns={teamCols}
                sortModel={teamSort}
                onSortModelChange={setTeamSort}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick
                density="compact"
                data-testid="grid-teams"
                data-sort-model={JSON.stringify(teamSortModel)}
              />
            </div>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
