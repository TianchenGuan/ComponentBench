'use client';

/**
 * file_dropzone-mui-T09: Cancel the 'Remove all' confirmation in a dark-mode dialog
 *
 * setup_description: The UI is in dark theme. A modal dialog titled "Edit attachments" is open on load (modal_flow).
 * Inside the dialog is one MUI-styled dropzone section labeled "Attachments" (react-dropzone composite) with a file list.
 * Initial state: two files are already attached and shown as chips/list items:
 * - project-brief.txt (uploaded)
 * - data_export.csv (uploaded)
 * Above the list there is a destructive text button "Remove all".
 * Clicking "Remove all" opens a confirmation dialog (second overlay layer) with message "Remove all attachments?"
 * and two buttons: "Remove" (destructive) and "Cancel".
 * The task specifically requires clicking "Cancel", which closes the confirmation and leaves the attachments unchanged.
 * No other dialog buttons (e.g., Save/Close) are required for success.
 *
 * Success: The 'Remove all' confirmation was opened and 'Cancel' was clicked at least once.
 *          The Attachments dropzone still contains project-brief.txt and data_export.csv, both with status "uploaded".
 */

import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Typography, Paper, 
  Chip, Box, Button, ThemeProvider, createTheme, CssBaseline
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import type { TaskComponentProps, DropzoneFile } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<DropzoneFile[]>([
    { uid: 'initial-1', name: 'project-brief.txt', status: 'uploaded' },
    { uid: 'initial-2', name: 'data_export.csv', status: 'uploaded' },
  ]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [cancelClicked, setCancelClicked] = useState(false);

  // Initialize event counter on window
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as typeof window & { __cb_events?: Record<string, number> }).__cb_events = 
        (window as typeof window & { __cb_events?: Record<string, number> }).__cb_events || {};
      (window as typeof window & { __cb_events: Record<string, number> }).__cb_events.remove_all_cancelled = 0;
    }
  }, []);

  useEffect(() => {
    if (completed) return;
    
    const hasProjectBrief = files.some(f => f.name === 'project-brief.txt' && f.status === 'uploaded');
    const hasDataExport = files.some(f => f.name === 'data_export.csv' && f.status === 'uploaded');
    
    if (cancelClicked && files.length === 2 && hasProjectBrief && hasDataExport) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, cancelClicked, completed, onSuccess]);

  const handleRemoveAll = () => {
    setFiles([]);
    setConfirmOpen(false);
  };

  const handleCancel = () => {
    setCancelClicked(true);
    setConfirmOpen(false);
    if (typeof window !== 'undefined') {
      (window as typeof window & { __cb_events: Record<string, number> }).__cb_events.remove_all_cancelled++;
    }
  };

  const handleRemoveOne = (uid: string) => {
    setFiles(prev => prev.filter(f => f.uid !== uid));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      
      {/* Main dialog - always open */}
      <Dialog 
        open={true} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { bgcolor: 'background.paper' } }}
      >
        <DialogTitle>Edit attachments</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" gutterBottom>
            Attachments
          </Typography>
          
          <Paper
            data-testid="dropzone-attachments"
            sx={{
              p: 2,
              border: '2px dashed',
              borderColor: 'grey.700',
              borderRadius: 2,
              textAlign: 'center',
              bgcolor: 'grey.900',
              mb: 2,
            }}
          >
            <CloudUpload sx={{ fontSize: 32, color: 'grey.600' }} />
            <Typography variant="body2" color="text.secondary">
              Drag files here
            </Typography>
          </Paper>

          {files.length > 0 && (
            <>
              <Button 
                color="error" 
                size="small" 
                onClick={() => setConfirmOpen(true)}
                sx={{ mb: 1 }}
              >
                Remove all
              </Button>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {files.map(file => (
                  <Chip
                    key={file.uid}
                    label={file.name}
                    onDelete={() => handleRemoveOne(file.uid)}
                    color="success"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Remove all attachments?</DialogTitle>
        <DialogContent>
          <Typography>
            This will remove all attached files. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button color="error" onClick={handleRemoveAll}>Remove</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
