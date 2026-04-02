'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Link, Snackbar, Alert, Stack } from '@mui/material';
import { Download } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('user-export.csv', 'id,name,email');
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  const handleConfirm = () => {
    if (completed) return;
    setDialogOpen(false);
    setSnackbarOpen(true);
    setCompleted(true);
    onSuccess();
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="User export" />
      <CardContent>
        <Stack spacing={2}>
          <Button variant="contained" startIcon={<Download />} onClick={() => setDialogOpen(true)} data-testid="download-user-export">
            Download user export
          </Button>
          <Link href="#">Learn more</Link>
        </Stack>
      </CardContent>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm download</DialogTitle>
        <DialogContent>
          <DialogContentText>This file contains sensitive data. Are you sure you want to download it?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained" data-testid="confirm-download">Download</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success">Download started: user-export.csv</Alert>
      </Snackbar>
    </Card>
  );
}
