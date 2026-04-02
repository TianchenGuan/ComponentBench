'use client';

/**
 * file_dropzone-mui-T01: Upload resume PDF in a MUI-styled dropzone card
 *
 * setup_description: Baseline scene: a centered isolated card (light theme, comfortable spacing, default scale).
 * The dropzone implementation is a MUI Card with a dashed-border Paper area wired via react-dropzone (composite implementation).
 * The drop area is labeled "Upload resume" and contains helper text:
 * "Drag a file here, or click to choose from sample files".
 * Clicking the drop area opens a small in-page MUI Dialog titled "Sample files" (not an OS dialog) with a simple list:
 * - resume-alex-chen.pdf   ← TARGET
 * - project-brief.txt
 * - avatar-green.png
 * After selection, the dialog closes and the chosen file appears below the drop area as a single MUI Chip with:
 * filename text + an "Uploaded" status label + a small remove (×) icon on the chip.
 * Initial state: no selected files.
 *
 * Success: The dropzone labeled "Upload resume" contains exactly one file: resume-alex-chen.pdf with status "uploaded".
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Paper, Dialog, DialogTitle, DialogContent, 
  List, ListItem, ListItemIcon, ListItemText, Chip, Box 
} from '@mui/material';
import { CloudUpload, InsertDriveFile } from '@mui/icons-material';
import type { TaskComponentProps, SampleFile, DropzoneFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'resume-alex-chen.pdf', type: 'application/pdf' },
  { name: 'project-brief.txt', type: 'text/plain' },
  { name: 'avatar-green.png', type: 'image/png' },
];

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<DropzoneFile[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    if (
      files.length === 1 &&
      files[0].name === 'resume-alex-chen.pdf' &&
      files[0].status === 'uploaded'
    ) {
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
    
    setFiles([newFile]);
    
    await simulateUpload(500);
    setFiles([{ ...newFile, status: 'uploaded' }]);
  };

  const handleRemove = (uid: string) => {
    setFiles(prev => prev.filter(f => f.uid !== uid));
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upload resume
        </Typography>
        
        <Paper
          data-testid="dropzone-upload-resume"
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

        {/* File list */}
        {files.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {files.map(file => (
              <Chip
                key={file.uid}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{file.name}</span>
                    {file.status === 'uploaded' && (
                      <Typography variant="caption" color="success.main">
                        Uploaded
                      </Typography>
                    )}
                    {file.status === 'uploading' && (
                      <Typography variant="caption" color="text.secondary">
                        Uploading...
                      </Typography>
                    )}
                  </Box>
                }
                onDelete={() => handleRemove(file.uid)}
                sx={{ maxWidth: '100%' }}
              />
            ))}
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
