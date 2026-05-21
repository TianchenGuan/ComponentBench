'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, CardContent, CardHeader, Typography, Snackbar, Alert, Box, Stack } from '@mui/material';
import { Download, OpenInNew } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('receipt-7781.pdf', 'Receipt #7781 PDF Content');
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  const handleDownload = () => {
    if (completed) return;
    setSnackbarOpen(true);
    setCompleted(true);
    onSuccess();
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Receipt #7781" />
      <CardContent>
        <Stack spacing={2}>
          <Button variant="contained" startIcon={<Download />} onClick={(e) => { e.preventDefault(); handleDownload(); }} data-testid="download-button">
            Download receipt
          </Button>
          <Button variant="outlined" startIcon={<OpenInNew />} onClick={() => setShowDetails(!showDetails)}>
            Open details
          </Button>
          <Typography variant="caption" color="text.secondary">PDF file</Typography>
          {showDetails && (
            <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">Receipt details: $150.00 - January 20, 2026</Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success">Download started: receipt-7781.pdf</Alert>
      </Snackbar>
    </Card>
  );
}
