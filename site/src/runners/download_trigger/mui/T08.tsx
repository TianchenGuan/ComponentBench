'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, IconButton, Snackbar, Alert, Box, Typography, Grid } from '@mui/material';
import { Download } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('roadmap-preview.pptx', 'PowerPoint content');
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  const handleDownload = (id: string) => {
    if (id === 'B' && !completed) {
      setSnackbarOpen(true);
      setCompleted(true);
      onSuccess();
    }
  };

  const patternA = { background: 'linear-gradient(45deg, #ff6b6b, #feca57)', width: '100%', height: 80, borderRadius: 4 };
  const patternB = { background: 'linear-gradient(135deg, #48dbfb, #ff9ff3)', width: '100%', height: 80, borderRadius: 4 };
  const patternC = { background: 'linear-gradient(90deg, #52c41a, #faad14)', width: '100%', height: 80, borderRadius: 4 };
  const referencePattern = { background: 'linear-gradient(135deg, #48dbfb, #ff9ff3)', width: 40, height: 40, borderRadius: 4 };

  return (
    <Card sx={{ width: 500 }}>
      <CardHeader title="Roadmap downloads" subheader={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}><Box sx={referencePattern} /><Typography variant="caption">Reference badge</Typography></Box>} />
      <CardContent>
        <Grid container spacing={2}>
          {[{ id: 'A', pattern: patternA }, { id: 'B', pattern: patternB }, { id: 'C', pattern: patternC }].map(item => (
            <Grid item xs={4} key={item.id}>
              <Card variant="outlined" sx={{ position: 'relative' }}>
                <IconButton size="small" sx={{ position: 'absolute', top: 4, right: 4 }} onClick={(e) => { e.preventDefault(); handleDownload(item.id); }} data-testid={`download-roadmap-${item.id.toLowerCase()}`}>
                  <Download fontSize="small" />
                </IconButton>
                <CardContent sx={{ pt: 4 }}>
                  <Box sx={item.pattern} />
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>Roadmap {item.id}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success">Download started: roadmap-preview.pptx</Alert>
      </Snackbar>
    </Card>
  );
}
