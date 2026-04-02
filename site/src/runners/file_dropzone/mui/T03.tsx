'use client';

/**
 * file_dropzone-mui-T03: Clear all attachments using a Clear button
 *
 * setup_description: Baseline scene: centered isolated card, light theme, comfortable spacing, default scale.
 * The dropzone is a MUI Card section labeled "Attachments" (react-dropzone composite).
 * Under the dashed drop area, there is a file list rendered as MUI Chips and a small action row containing a "Clear" button.
 * Initial state: two uploaded files are already present as chips:
 * - project-brief.txt (uploaded)
 * - data_export.csv (uploaded)
 * Clicking the "Clear" button removes all chips at once and returns the dropzone to its empty state.
 * No confirmation dialog is used for this task.
 *
 * Success: The dropzone labeled "Attachments" has no files (no chips/items listed).
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Paper, Dialog, DialogTitle, DialogContent, 
  List, ListItem, ListItemIcon, ListItemText, Chip, Box, Button
} from '@mui/material';
import { CloudUpload, InsertDriveFile } from '@mui/icons-material';
import type { TaskComponentProps, SampleFile, DropzoneFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'project-brief.txt', type: 'text/plain' },
  { name: 'data_export.csv', type: 'text/csv' },
  { name: 'notes.txt', type: 'text/plain' },
];

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<DropzoneFile[]>([
    { uid: 'initial-1', name: 'project-brief.txt', status: 'uploaded' },
    { uid: 'initial-2', name: 'data_export.csv', status: 'uploaded' },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    if (files.length === 0) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleSelectFile = async (sample: SampleFile) => {
    setDialogOpen(false);
    
    const newFile: DropzoneFile = {
      uid: generateUid(),
      name: sample.name,
      status: 'uploading',
    };
    
    setFiles(prev => [...prev, newFile]);
    
    await simulateUpload(500);
    setFiles(prev => prev.map(f => f.uid === newFile.uid ? { ...f, status: 'uploaded' as const } : f));
  };

  const handleRemove = (uid: string) => {
    setFiles(prev => prev.filter(f => f.uid !== uid));
  };

  const handleClear = () => {
    setFiles([]);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Attachments
        </Typography>
        
        <Paper
          data-testid="dropzone-attachments"
          onClick={() => setDialogOpen(true)}
          sx={{
            p: 3,
            border: '2px dashed',
            borderColor: 'grey.300',
            borderRadius: 2,
            cursor: 'pointer',
            textAlign: 'center',
            bgcolor: 'grey.50',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            },
          }}
        >
          <CloudUpload sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Drag a file here, or click to choose from sample files
          </Typography>
        </Paper>

        {files.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {files.map(file => (
                <Chip
                  key={file.uid}
                  label={file.name}
                  onDelete={() => handleRemove(file.uid)}
                  color={file.status === 'uploaded' ? 'success' : 'default'}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
            <Button size="small" color="error" onClick={handleClear}>
              Clear
            </Button>
          </Box>
        )}

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Sample files</DialogTitle>
          <DialogContent>
            <List>
              {SAMPLE_FILES.map(file => (
                <ListItem
                  key={file.name}
                  onClick={() => handleSelectFile(file)}
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <ListItemIcon>
                    <InsertDriveFile />
                  </ListItemIcon>
                  <ListItemText primary={file.name} />
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
