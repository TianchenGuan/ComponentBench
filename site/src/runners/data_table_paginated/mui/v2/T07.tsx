'use client';

/**
 * data_table_paginated-mui-v2-T07: Invite Manager dialog — Invited users page size and page
 *
 * Modal flow: "Invite Manager" opens a MUI Dialog with two stacked DataGrids:
 * "Active users" on top, "Invited users" below.
 * Initial: both page 1 (0-indexed: 0), size 25.
 * Target: Invited users → size 10, page 2 (0-indexed: 1).
 * Active users must remain page 1, size 25.
 */

import React, { useState, useRef, useEffect } from 'react';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import {
  Card, CardContent, Button, Dialog, DialogTitle, DialogContent, Typography,
  IconButton, Chip, Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import type { TaskComponentProps } from '../../types';
import { generateUserData } from '../../types';

const userColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 140 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'role', headerName: 'Role', width: 100,
    renderCell: (p) => <Chip label={p.value} size="small" variant="outlined" /> },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [activeRows] = useState(() => generateUserData(100));
  const [invitedRows] = useState(() =>
    generateUserData(80).map((u) => ({ ...u, id: u.id.replace('U-', 'INV-') })),
  );

  const [activePM, setActivePM] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [invitedPM, setInvitedPM] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      invitedPM.pageSize === 10 && invitedPM.page === 1 &&
      activePM.pageSize === 25 && activePM.page === 0
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [invitedPM, activePM, onSuccess]);

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setOpen(true)}>
            Invite Manager
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth data-testid="invite-dialog">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          Invite Manager
          <HelpOutlineIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <IconButton sx={{ ml: 'auto' }} onClick={() => setOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>Active users</Typography>
          <DataGrid
            rows={activeRows}
            columns={userColumns}
            paginationModel={activePM}
            onPaginationModelChange={setActivePM}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            sx={{ height: 350, mb: 3 }}
            data-testid="active-users-grid"
            data-current-page={activePM.page + 1}
            data-page-size={activePM.pageSize}
          />

          <Typography variant="subtitle2" gutterBottom>Invited users</Typography>
          <DataGrid
            rows={invitedRows}
            columns={userColumns}
            paginationModel={invitedPM}
            onPaginationModelChange={setInvitedPM}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            sx={{ height: 350 }}
            data-testid="invited-users-grid"
            data-current-page={invitedPM.page + 1}
            data-page-size={invitedPM.pageSize}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
