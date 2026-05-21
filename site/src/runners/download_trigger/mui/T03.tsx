'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, Button, TextField, Switch, FormControlLabel, Typography, Snackbar, Alert, Stack, Box, IconButton } from '@mui/material';
import { Download, Upload } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('product-images.zip', 'ZIP archive content');
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  const handleDownload = () => {
    if (completed) return;
    setSnackbarOpen(true);
    setCompleted(true);
    onSuccess();
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardHeader title="Product Settings" />
      <CardContent>
        <Stack spacing={2}>
          <TextField label="Title" defaultValue="Product XYZ" size="small" fullWidth />
          <TextField label="SKU" defaultValue="SKU-12345" size="small" fullWidth />
          <FormControlLabel control={<Switch defaultChecked />} label="Published" />
          <FormControlLabel control={<Switch />} label="Featured" />
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Media</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              {[1, 2, 3].map(i => <Box key={i} sx={{ width: 50, height: 50, bgcolor: 'grey.300', borderRadius: 1 }} />)}
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<Download />} onClick={(e) => { e.preventDefault(); handleDownload(); }} data-testid="download-images">
                Download image pack
              </Button>
              <IconButton><Upload /></IconButton>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success">Download started: product-images.zip</Alert>
      </Snackbar>
    </Card>
  );
}
