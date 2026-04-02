'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, List, ListItem, ListItemText, IconButton, Snackbar, Alert, Typography } from '@mui/material';
import { Download, PushPin } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const blobUrlRef = useRef<Record<string, string>>({});

  const items = [
    { id: 'intro', title: 'Introduction', filename: 'introduction.pdf' },
    { id: 'appendixA', title: 'Appendix A', filename: 'appendix-a.pdf' },
    { id: 'appendixB', title: 'Appendix B', filename: 'appendix-b.pdf' },
    { id: 'glossary', title: 'Glossary', filename: 'glossary.pdf' },
    { id: 'references', title: 'References', filename: 'references.pdf' },
  ];

  useEffect(() => {
    items.forEach(item => {
      blobUrlRef.current[item.id] = createMockBlobUrl(item.filename, `${item.title} content`);
    });
    return () => { Object.values(blobUrlRef.current).forEach(url => URL.revokeObjectURL(url)); };
  }, []);

  const handleDownload = (id: string) => {
    if (id === 'appendixB' && !completed) {
      setSnackbarOpen(true);
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', minHeight: '80vh', p: 2 }}>
      <Paper sx={{ width: 300, maxHeight: 200, overflow: 'auto' }} elevation={3}>
        <Box sx={{ p: 1, bgcolor: 'grey.100' }}><Typography variant="subtitle2">Attachments</Typography></Box>
        <List dense>
          {items.map(item => (
            <ListItem key={item.id} secondaryAction={
              <Box>
                <IconButton size="small"><PushPin fontSize="small" /></IconButton>
                <IconButton size="small" onClick={(e) => { e.preventDefault(); handleDownload(item.id); }} data-testid={`download-${item.id}`}>
                  <Download fontSize="small" />
                </IconButton>
              </Box>
            }>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success">Download started: appendix-b.pdf</Alert>
      </Snackbar>
    </Box>
  );
}
