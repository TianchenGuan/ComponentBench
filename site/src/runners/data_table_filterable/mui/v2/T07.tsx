'use client';

/**
 * data_table_filterable-mui-v2-T07: Invite Manager – multi-filter Invited users only
 *
 * A modal_flow page. "Invite Manager" opens a MUI Dialog with two DataGrid Pro instances:
 * "Active users" (top) and "Invited users" (bottom). Each grid has a Filters toolbar button.
 * Target: Invited users – Department=Support AND Status=Pending. Active users must stay unfiltered.
 * Filters auto-apply (no confirm).
 */

import React, { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridToolbar, GridFilterModel } from '@mui/x-data-grid';
import {
  Dialog, DialogTitle, DialogContent, Button, Card, CardContent, Typography, Stack,
  Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { TaskComponentProps, FilterModel } from '../../types';

interface UserRow {
  id: number;
  name: string;
  department: string;
  status: string;
  email: string;
}

const deptOptions = ['Engineering', 'Sales', 'Support', 'Marketing', 'Finance'];
const activeStatuses = ['Active', 'On Leave', 'Suspended'];
const inviteStatuses = ['Pending', 'Accepted', 'Expired', 'Revoked'];

const activeUsersData: UserRow[] = [
  { id: 1, name: 'Amy Lin', department: 'Engineering', status: 'Active', email: 'amy@co.io' },
  { id: 2, name: 'Brian Hall', department: 'Sales', status: 'Active', email: 'brian@co.io' },
  { id: 3, name: 'Cathy Vu', department: 'Support', status: 'On Leave', email: 'cathy@co.io' },
  { id: 4, name: 'Dan Mora', department: 'Marketing', status: 'Active', email: 'dan@co.io' },
];

const invitedUsersData: UserRow[] = [
  { id: 101, name: 'Eva Song', department: 'Support', status: 'Pending', email: 'eva@new.io' },
  { id: 102, name: 'Finn Cole', department: 'Engineering', status: 'Accepted', email: 'finn@new.io' },
  { id: 103, name: 'Gina Diaz', department: 'Support', status: 'Expired', email: 'gina@new.io' },
  { id: 104, name: 'Hiro Tanaka', department: 'Finance', status: 'Pending', email: 'hiro@new.io' },
  { id: 105, name: 'Iris Novak', department: 'Support', status: 'Pending', email: 'iris@new.io' },
  { id: 106, name: 'Jack Rowe', department: 'Sales', status: 'Revoked', email: 'jack@new.io' },
];

function makeColumns(statusOpts: string[]): GridColDef[] {
  return [
    { field: 'name', headerName: 'Name', width: 140 },
    { field: 'email', headerName: 'Email', width: 170 },
    { field: 'department', headerName: 'Department', width: 130, type: 'singleSelect', valueOptions: deptOptions },
    { field: 'status', headerName: 'Status', width: 110, type: 'singleSelect', valueOptions: statusOpts },
  ];
}

function toCanonical(tableId: string, fm: GridFilterModel): FilterModel {
  return {
    table_id: tableId,
    logic_operator: (fm.logicOperator?.toUpperCase() as 'AND' | 'OR') || 'OR',
    global_filter: fm.quickFilterValues?.join(' ') || null,
    column_filters: (fm.items || [])
      .filter(i => i.value !== undefined && i.value !== '')
      .map(i => ({
        column: i.field.charAt(0).toUpperCase() + i.field.slice(1),
        operator: i.operator as 'equals',
        value: i.value,
      })),
  };
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<GridFilterModel>({ items: [] });
  const [invDeptFilter, setInvDeptFilter] = useState<GridFilterModel>({ items: [] });
  const [invStatus, setInvStatus] = useState('');
  const successFiredRef = useRef(false);

  const statusFilteredRows = invStatus
    ? invitedUsersData.filter(r => r.status === invStatus)
    : invitedUsersData;

  const combinedInvFilter: GridFilterModel = {
    items: [
      ...invDeptFilter.items,
      ...(invStatus ? [{ id: 99, field: 'status', operator: 'is', value: invStatus }] : []),
    ],
  };

  useEffect(() => {
    if (successFiredRef.current) return;
    const deptItem = invDeptFilter.items.find(
      i => i.field === 'department' && i.operator === 'is' && i.value === 'Support',
    );
    const activeHas = (activeFilter.items || []).some(i => i.value !== undefined && i.value !== '');
    if (deptItem && invStatus === 'Pending' && !activeHas) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [invDeptFilter, invStatus, activeFilter, onSuccess]);

  return (
    <div style={{ padding: 24 }}>
      <Button variant="contained" onClick={() => setOpen(true)}>Invite Manager</Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Invite Manager</DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Active users</Typography>
                <div style={{ height: 250 }}>
                  <DataGrid
                    rows={activeUsersData}
                    columns={makeColumns(activeStatuses)}
                    filterModel={activeFilter}
                    onFilterModelChange={setActiveFilter}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{ toolbar: { showQuickFilter: false } }}
                    disableRowSelectionOnClick
                    density="compact"
                    data-testid="datagrid-active-users"
                    data-filter-model={JSON.stringify(toCanonical('active_users', activeFilter))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Invited users</Typography>
                <FormControl size="small" sx={{ minWidth: 120, mb: 1 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={invStatus}
                    label="Status"
                    onChange={(e: SelectChangeEvent) => setInvStatus(e.target.value)}
                  >
                    <MenuItem value=""><em>All</em></MenuItem>
                    {inviteStatuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>
                <div style={{ height: 300 }}>
                  <DataGrid
                    rows={statusFilteredRows}
                    columns={makeColumns(inviteStatuses)}
                    filterModel={invDeptFilter}
                    onFilterModelChange={setInvDeptFilter}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{ toolbar: { showQuickFilter: false } }}
                    disableRowSelectionOnClick
                    density="compact"
                    data-testid="datagrid-invited-users"
                    data-filter-model={JSON.stringify(toCanonical('invited_users', combinedInvFilter))}
                  />
                </div>
              </CardContent>
            </Card>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
}
