'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, IconButton, Menu, MenuItem, ListItemText, Snackbar, Alert, Popover, Box, createTheme, ThemeProvider } from '@mui/material';
import { MoreVert, ChevronRight } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('settings-bundle.json', '{"settings": {}}');
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  const handleExportItemClick = (item: string) => {
    setAnchorEl(null);
    setExportAnchorEl(null);
    if (item === 'settings' && !completed) {
      setSnackbarOpen(true);
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Card sx={{ width: 350, bgcolor: 'grey.900' }}>
        <CardHeader title="Settings tools" sx={{ py: 1 }} action={
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} data-testid="overflow-menu">
            <MoreVert />
          </IconButton>
        } />
        <CardContent sx={{ py: 1 }} />
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => { setAnchorEl(null); setExportAnchorEl(null); }}>
          <MenuItem onClick={() => setAnchorEl(null)}>Copy</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Share</MenuItem>
          <MenuItem onClick={(e) => setExportAnchorEl(e.currentTarget)} data-testid="export-menu-item">
            <ListItemText>Export</ListItemText>
            <ChevronRight />
          </MenuItem>
        </Menu>
        <Popover open={Boolean(exportAnchorEl)} anchorEl={exportAnchorEl} onClose={() => setExportAnchorEl(null)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
          <Box sx={{ py: 1 }}>
            <MenuItem onClick={() => handleExportItemClick('settings')} data-testid="settings-bundle-item" sx={{ fontSize: '0.875rem' }}>Settings bundle (.json)</MenuItem>
            <MenuItem onClick={() => handleExportItemClick('theme')} sx={{ fontSize: '0.875rem' }}>Theme tokens (.json)</MenuItem>
            <MenuItem onClick={() => handleExportItemClick('shortcuts')} sx={{ fontSize: '0.875rem' }}>Shortcuts (.txt)</MenuItem>
          </Box>
        </Popover>
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
          <Alert severity="success">Download started: settings-bundle.json</Alert>
        </Snackbar>
      </Card>
    </ThemeProvider>
  );
}
