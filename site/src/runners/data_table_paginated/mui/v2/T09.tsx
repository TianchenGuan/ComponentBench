'use client';

/**
 * data_table_paginated-mui-v2-T09: Archived Candidates drawer — page size 10 and page 4
 *
 * Drawer flow: "Candidate Manager" button opens a right-side drawer containing
 * two stacked MUI DataGrid cards: "Current Candidates" and "Archived Candidates".
 * Initial: both page 1 (0-indexed: 0), size 25.
 * Target: Archived Candidates → size 10, page 4 (0-indexed: 3).
 * Current Candidates must remain page 1, size 25.
 */

import React, { useState, useRef, useEffect } from 'react';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import {
  Card, CardContent, Button, Drawer, Typography, IconButton, Chip, Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import type { TaskComponentProps } from '../../types';
import { generateUserData } from '../../types';

const candidateColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 140 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'status', headerName: 'Status', width: 100,
    renderCell: (p) => <Chip label={p.value} size="small" variant="outlined" /> },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [currentRows] = useState(() => generateUserData(100));
  const [archivedRows] = useState(() =>
    generateUserData(120).map((u) => ({ ...u, id: u.id.replace('U-', 'ARC-') })),
  );

  const [currentPM, setCurrentPM] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [archivedPM, setArchivedPM] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      archivedPM.pageSize === 10 && archivedPM.page === 3 &&
      currentPM.pageSize === 25 && currentPM.page === 0
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [archivedPM, currentPM, onSuccess]);

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Button variant="contained" startIcon={<PeopleIcon />} onClick={() => setOpen(true)}>
            Candidate Manager
          </Button>
        </CardContent>
      </Card>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: 680, p: 2 } }}
        data-testid="candidate-drawer"
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Candidate Manager</Typography>
          <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
        </Box>

        <Typography variant="subtitle2" gutterBottom>Current Candidates</Typography>
        <DataGrid
          rows={currentRows}
          columns={candidateColumns}
          paginationModel={currentPM}
          onPaginationModelChange={setCurrentPM}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          sx={{ height: 340, mb: 3 }}
          data-testid="current-candidates-grid"
          data-current-page={currentPM.page + 1}
          data-page-size={currentPM.pageSize}
        />

        <Typography variant="subtitle2" gutterBottom>Archived Candidates</Typography>
        <DataGrid
          rows={archivedRows}
          columns={candidateColumns}
          paginationModel={archivedPM}
          onPaginationModelChange={setArchivedPM}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          sx={{ height: 340 }}
          data-testid="archived-candidates-grid"
          data-current-page={archivedPM.page + 1}
          data-page-size={archivedPM.pageSize}
        />
      </Drawer>
    </Box>
  );
}
