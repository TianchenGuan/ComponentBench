'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Drawer, List, ListItem, ListItemText, Snackbar, Alert, Typography, IconButton } from '@mui/material';
import { Close, Download } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const blobUrlRef = useRef<Record<string, string>>({});

  useEffect(() => {
    blobUrlRef.current = {
      quick: createMockBlobUrl('quick-export.csv', 'Quick export CSV'),
      full: createMockBlobUrl('full-backup.zip', 'Full backup ZIP'),
    };
    return () => { Object.values(blobUrlRef.current).forEach(url => URL.revokeObjectURL(url)); };
  }, []);

  const handleDownload = (type: string) => {
    if (type === 'full' && !completed) {
      setSnackbarOpen(true);
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', p: 2 }}>
      <Button variant="contained" onClick={() => setDrawerOpen(true)} data-testid="open-export-center">
        Open Export Center
      </Button>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 300, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Export Center</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}><Close /></IconButton>
          </Box>
          <List>
            <ListItem>
              <Button variant="outlined" fullWidth startIcon={<Download />} onClick={(e) => { e.preventDefault(); handleDownload('quick'); }}>
                Quick export (.csv)
              </Button>
            </ListItem>
            <ListItem>
              <Button variant="contained" fullWidth startIcon={<Download />} onClick={(e) => { e.preventDefault(); handleDownload('full'); }} data-testid="download-full-backup">
                Full backup (.zip)
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success">Download started: full-backup.zip</Alert>
      </Snackbar>
    </Box>
  );
}
