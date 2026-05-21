'use client';

/**
 * data_table_paginated-mui-T09: Invite Manager dialog: configure Invited users pagination
 *
 * Layout: **modal_flow**.
 *
 * Outside the modal: a settings page with a single button labeled **Invite Manager**.
 *
 * Inside the modal (after opening): there are TWO paginated tables (instances=2), stacked vertically:
 * 1) **Active users** (top) — MUI X DataGrid with pagination.
 * 2) **Invited users** (bottom) — MUI X DataGrid with pagination.
 *
 * Both grids use the same footer UI: Rows per page select and next/previous arrows.
 *
 * Initial state inside modal:
 * • Active users: page 1, page size 25
 * • Invited users: page 1, page size 25
 *
 * Task target: only the **Invited users** grid should end with page size 10 and page 2.
 *
 * Success: Invited users grid: page size = 10 and current page = 2.
 */

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import {
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import type { TaskComponentProps } from '../types';
import { generateUserData } from '../types';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'User ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 140 },
  { field: 'email', headerName: 'Email', width: 180 },
  { field: 'role', headerName: 'Role', width: 90 },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [activeUsers] = useState(() => generateUserData(100).map(u => ({ ...u, id: `A-${u.id}` })));
  const [invitedUsers] = useState(() => generateUserData(80).map(u => ({ ...u, id: `I-${u.id}` })));
  
  const [modalOpen, setModalOpen] = useState(false);
  
  const [activePagination, setActivePagination] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });
  const [invitedPagination, setInvitedPagination] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });
  
  const [hasSucceeded, setHasSucceeded] = useState(false);

  useEffect(() => {
    // Success when Invited users: page size = 10 and page = 2 (0-indexed: page 1)
    if (
      invitedPagination.pageSize === 10 &&
      invitedPagination.page === 1 &&
      !hasSucceeded
    ) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [invitedPagination, hasSucceeded, onSuccess]);

  return (
    <Box>
      {/* Settings page with button */}
      <Card sx={{ width: 400, p: 2 }}>
        <Typography variant="h6" gutterBottom>User Settings</Typography>
        <Button
          variant="contained"
          onClick={() => setModalOpen(true)}
          data-testid="invite-manager-button"
        >
          Invite Manager
        </Button>
      </Card>

      {/* Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
        data-testid="invite-manager-dialog"
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Invite Manager
          <Box>
            <IconButton size="small" disabled>
              <HelpOutlineIcon />
            </IconButton>
            <IconButton size="small" onClick={() => setModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {/* Active users table */}
          <Typography variant="subtitle1" gutterBottom>Active users</Typography>
          <Box sx={{ height: 250, mb: 3 }} data-testid="table-active-users">
            <DataGrid
              rows={activeUsers}
              columns={columns}
              paginationModel={activePagination}
              onPaginationModelChange={setActivePagination}
              pageSizeOptions={[10, 25]}
              disableRowSelectionOnClick
              density="compact"
              data-current-page={activePagination.page + 1}
              data-page-size={activePagination.pageSize}
            />
          </Box>

          {/* Invited users table */}
          <Typography variant="subtitle1" gutterBottom>Invited users</Typography>
          <Box sx={{ height: 250 }} data-testid="table-invited-users">
            <DataGrid
              rows={invitedUsers}
              columns={columns}
              paginationModel={invitedPagination}
              onPaginationModelChange={setInvitedPagination}
              pageSizeOptions={[10, 25]}
              disableRowSelectionOnClick
              density="compact"
              data-current-page={invitedPagination.page + 1}
              data-page-size={invitedPagination.pageSize}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
