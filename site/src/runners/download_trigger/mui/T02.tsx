'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, Link, Typography, Snackbar, Alert, Stack } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('terms-of-service.txt', 'Terms of Service...');
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  const handleDownload = () => {
    if (completed) return;
    setSnackbarOpen(true);
    setCompleted(true);
    onSuccess();
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardHeader title="Legal" />
      <CardContent>
        <Stack spacing={2}>
          <Link href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); handleDownload(); }} data-testid="download-terms" style={{ cursor: 'pointer' }}>
            Download Terms
          </Link>
          <Link href="#" onClick={(e) => e.preventDefault()}>View Terms online</Link>
          <Typography variant="caption" color="text.secondary">Text file</Typography>
        </Stack>
      </CardContent>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success">Download started: terms-of-service.txt</Alert>
      </Snackbar>
    </Card>
  );
}
