'use client';

/**
 * file_dropzone-mui-T07: Upload ID back image to the correct instance (two dropzones)
 *
 * setup_description: A centered isolated card (light theme, comfortable spacing) contains two MUI-styled dropzones arranged in a two-column grid:
 * - Left: "ID front"
 * - Right: "ID back"  ← TARGET
 * Both are react-dropzone composites with accept=image/* and maxCount=1.
 * Clicking inside either drop area opens the same in-page "Sample files" dialog listing:
 * - id-front.jpg
 * - id-back.jpg   ← TARGET
 * - selfie.jpg
 * After selection, the chosen dropzone shows an image thumbnail and a chip with filename + uploaded status.
 * Initial state: both instances are empty.
 *
 * Success: Only the "ID back" dropzone contains id-back.jpg (status: uploaded).
 *          The "ID front" dropzone remains empty.
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Paper, Dialog, DialogTitle, DialogContent, 
  List, ListItem, ListItemIcon, ListItemText, Chip, Box, Grid
} from '@mui/material';
import { CloudUpload, Image as ImageIcon } from '@mui/icons-material';
import type { TaskComponentProps, SampleFile, DropzoneFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'id-front.jpg', type: 'image/jpeg' },
  { name: 'id-back.jpg', type: 'image/jpeg' },
  { name: 'selfie.jpg', type: 'image/jpeg' },
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [frontFiles, setFrontFiles] = useState<DropzoneFile[]>([]);
  const [backFiles, setBackFiles] = useState<DropzoneFile[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDropzone, setActiveDropzone] = useState<'front' | 'back' | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    if (
      frontFiles.length === 0 &&
      backFiles.length === 1 &&
      backFiles[0].name === 'id-back.jpg' &&
      backFiles[0].status === 'uploaded'
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [frontFiles, backFiles, completed, onSuccess]);

  const handleOpenDialog = (dropzone: 'front' | 'back') => {
    setActiveDropzone(dropzone);
    setDialogOpen(true);
  };

  const handleSelectFile = async (sample: SampleFile) => {
    setDialogOpen(false);
    
    const newFile: DropzoneFile = {
      uid: generateUid(),
      name: sample.name,
      status: 'uploading',
    };
    
    const setFiles = activeDropzone === 'front' ? setFrontFiles : setBackFiles;
    setFiles([newFile]);
    
    await simulateUpload(500);
    setFiles([{ ...newFile, status: 'uploaded' }]);
    
    setActiveDropzone(null);
  };

  const handleRemove = (dropzone: 'front' | 'back', uid: string) => {
    const setFiles = dropzone === 'front' ? setFrontFiles : setBackFiles;
    setFiles(prev => prev.filter(f => f.uid !== uid));
  };

  const renderDropzone = (
    label: string, 
    files: DropzoneFile[], 
    dropzone: 'front' | 'back',
    testId: string
  ) => (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>
      <Paper
        data-testid={testId}
        onClick={() => handleOpenDialog(dropzone)}
        sx={{
          p: 2,
          border: '2px dashed',
          borderColor: 'grey.300',
          borderRadius: 2,
          cursor: 'pointer',
          textAlign: 'center',
          bgcolor: 'grey.50',
          minHeight: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
      >
        <CloudUpload sx={{ fontSize: 32, color: 'grey.400' }} />
        <Typography variant="caption" color="text.secondary">
          Click to upload
        </Typography>
      </Paper>
      
      {files.length > 0 && (
        <Box sx={{ mt: 1 }}>
          {files.map(file => (
            <Chip
              key={file.uid}
              label={file.name}
              onDelete={() => handleRemove(dropzone, file.uid)}
              color={file.status === 'uploaded' ? 'success' : 'default'}
              size="small"
              sx={{ width: '100%' }}
            />
          ))}
        </Box>
      )}
    </Box>
  );

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ID Verification
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {renderDropzone('ID front', frontFiles, 'front', 'dropzone-id-front')}
          </Grid>
          <Grid item xs={6}>
            {renderDropzone('ID back', backFiles, 'back', 'dropzone-id-back')}
          </Grid>
        </Grid>

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
                    <ImageIcon />
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
