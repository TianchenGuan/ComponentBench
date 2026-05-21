'use client';

/**
 * data_table_sortable-mui-T14: Settings - sort Active Users by Role A→Z (two grids)
 *
 * Settings panel layout with two DataGrid instances.
 * - Section 1: "Active Users" (target) - columns: Name, Email, Role, Last seen.
 * - Section 2: "Pending Invitations" (distractor) - columns: Email, Invited by, Role, Sent.
 * - Both grids include a "Role" column.
 * - Initial state: both grids unsorted.
 *
 * Success: Active Users Role sorted ascending; Pending Invitations unchanged.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, List, ListItemButton, ListItemText, Switch, FormControlLabel } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import type { TaskComponentProps, SortModel } from '../types';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  lastSeen: string;
}

interface InvitationData {
  id: string;
  email: string;
  invitedBy: string;
  role: string;
  sent: string;
}

const activeUsersData: UserData[] = [
  { id: '1', name: 'Alice Chen', email: 'alice@company.com', role: 'Admin', lastSeen: '2024-02-15' },
  { id: '2', name: 'Bob Smith', email: 'bob@company.com', role: 'Editor', lastSeen: '2024-02-14' },
  { id: '3', name: 'Carol Davis', email: 'carol@company.com', role: 'Viewer', lastSeen: '2024-02-15' },
  { id: '4', name: 'David Kim', email: 'david@company.com', role: 'Editor', lastSeen: '2024-02-13' },
  { id: '5', name: 'Emma Wilson', email: 'emma@company.com', role: 'Admin', lastSeen: '2024-02-12' },
];

const pendingInvitationsData: InvitationData[] = [
  { id: '1', email: 'frank@company.com', invitedBy: 'Alice', role: 'Viewer', sent: '2024-02-10' },
  { id: '2', email: 'grace@company.com', invitedBy: 'Bob', role: 'Editor', sent: '2024-02-11' },
  { id: '3', email: 'henry@company.com', invitedBy: 'Alice', role: 'Admin', sent: '2024-02-12' },
];

const userColumns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 130, sortable: false },
  { field: 'email', headerName: 'Email', width: 180, sortable: false },
  { field: 'role', headerName: 'Role', width: 100 },
  { field: 'lastSeen', headerName: 'Last seen', width: 110, sortable: false },
];

const invitationColumns: GridColDef[] = [
  { field: 'email', headerName: 'Email', width: 180, sortable: false },
  { field: 'invitedBy', headerName: 'Invited by', width: 100, sortable: false },
  { field: 'role', headerName: 'Role', width: 100 },
  { field: 'sent', headerName: 'Sent', width: 110, sortable: false },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [usersSortModel, setUsersSortModel] = useState<GridSortModel>([]);
  const [invitationsSortModel, setInvitationsSortModel] = useState<GridSortModel>([]);

  // Check success condition
  useEffect(() => {
    const usersCorrect = usersSortModel.length === 1 && usersSortModel[0].field === 'role' && usersSortModel[0].sort === 'asc';
    const invitationsUntouched = invitationsSortModel.length === 0;
    if (usersCorrect && invitationsUntouched) {
      onSuccess();
    }
  }, [usersSortModel, invitationsSortModel, onSuccess]);

  const usersCanonicalSort: SortModel = usersSortModel.map((item: GridSortModel[number], idx: number) => ({
    column_key: item.field,
    direction: item.sort || 'asc',
    priority: idx + 1,
  }));

  const invitationsCanonicalSort: SortModel = invitationsSortModel.map((item: GridSortModel[number], idx: number) => ({
    column_key: item.field,
    direction: item.sort || 'asc',
    priority: idx + 1,
  }));

  return (
    <Box sx={{ display: 'flex', width: 900, gap: 3 }}>
      {/* Sidebar */}
      <Card sx={{ width: 200 }}>
        <List>
          <ListItemButton selected>
            <ListItemText primary="Users" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="Security" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="Billing" />
          </ListItemButton>
        </List>
      </Card>

      {/* Main content */}
      <Box sx={{ flex: 1 }}>
        {/* Active Users */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Active Users
              </Typography>
              <FormControlLabel control={<Switch defaultChecked />} label="Show all" />
            </Box>
            <div style={{ height: 250 }}>
              <DataGrid
                rows={activeUsersData}
                columns={userColumns}
                sortModel={usersSortModel}
                onSortModelChange={setUsersSortModel}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                data-testid="grid-active-users"
                data-sort-model={JSON.stringify(usersCanonicalSort)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pending Invitations */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Pending Invitations
              </Typography>
              <FormControlLabel control={<Switch />} label="Include expired" />
            </Box>
            <div style={{ height: 200 }}>
              <DataGrid
                rows={pendingInvitationsData}
                columns={invitationColumns}
                sortModel={invitationsSortModel}
                onSortModelChange={setInvitationsSortModel}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                data-testid="grid-pending-invitations"
                data-sort-model={JSON.stringify(invitationsCanonicalSort)}
              />
            </div>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
