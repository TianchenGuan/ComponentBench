'use client';

/**
 * file_dropzone-mui-T10: Upload the only valid CSV under size limit (error recovery)
 *
 * setup_description: The page is a settings_panel positioned near the bottom-right of the viewport (placement=bottom_right).
 * It uses compact spacing and small scale to reduce target sizes and spacing.
 * The target is a MUI-styled dropzone labeled "Data import" (react-dropzone composite) with strict validation:
 * - Accepts CSV only (accept=.csv)
 * - Maximum file size: 1 MB
 * Clicking the drop area opens a "Sample files" dialog listing 3 similarly named options:
 * - data_export.csv (8 KB)               ← TARGET (valid)
 * - big_data_export.csv (2.5 MB)         (invalid: too large)
 * - data_export.xlsx (300 KB)            (invalid: wrong type)
 * If an invalid file is selected/dropped, the component shows inline error text under the drop area
 * (e.g., "File type not allowed" or "File is too large") and the file is not added to the uploaded list (or is added with status "rejected").
 * The task requires ending with exactly the valid CSV attached and uploaded, and no rejected/error items present.
 * Initial state: empty.
 *
 * Success: The "Data import" dropzone contains exactly one file: data_export.csv with status "uploaded".
 *          No rejected/error files are present.
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Paper, Dialog, DialogTitle, DialogContent, 
  List, ListItem, ListItemIcon, ListItemText, Chip, Box, Alert
} from '@mui/material';
import { CloudUpload, InsertDriveFile, Error as ErrorIcon } from '@mui/icons-material';
import type { TaskComponentProps, SampleFile, DropzoneFile } from '../types';
import { simulateUpload, generateUid } from '../types';

interface ExtendedSampleFile extends SampleFile {
  sizeLabel: string;
  sizeBytes: number;
}

const SAMPLE_FILES: ExtendedSampleFile[] = [
  { name: 'data_export.csv', type: 'text/csv', sizeLabel: '8 KB', sizeBytes: 8 * 1024 },
  { name: 'big_data_export.csv', type: 'text/csv', sizeLabel: '2.5 MB', sizeBytes: 2.5 * 1024 * 1024 },
  { name: 'data_export.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', sizeLabel: '300 KB', sizeBytes: 300 * 1024 },
];

const MAX_SIZE = 1 * 1024 * 1024; // 1 MB

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<DropzoneFile[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    const uploadedFiles = files.filter(f => f.status === 'uploaded');
    const rejectedFiles = files.filter(f => f.status === 'rejected' || f.status === 'error');
    
    if (
      uploadedFiles.length === 1 &&
      uploadedFiles[0].name === 'data_export.csv' &&
      rejectedFiles.length === 0
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleSelectFile = async (sample: ExtendedSampleFile) => {
    setDialogOpen(false);
    setError(null);
    
    // Validate file type
    if (!sample.name.endsWith('.csv')) {
      setError('File type not allowed. Only CSV files are accepted.');
      setFiles([{
        uid: generateUid(),
        name: sample.name,
        status: 'rejected',
      }]);
      return;
    }
    
    // Validate file size
    if (sample.sizeBytes > MAX_SIZE) {
      setError('File is too large. Maximum size is 1 MB.');
      setFiles([{
        uid: generateUid(),
        name: sample.name,
        status: 'rejected',
      }]);
      return;
    }
    
    // Valid file
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
    setError(null);
  };

  return (
    <Card sx={{ width: 320 }}>
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Data import
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
          CSV only, max 1 MB
        </Typography>
        
        <Paper
          data-testid="dropzone-data-import"
          onClick={() => setDialogOpen(true)}
          sx={{
            p: 1.5,
            border: '2px dashed',
            borderColor: error ? 'error.main' : 'grey.300',
            borderRadius: 1,
            cursor: 'pointer',
            textAlign: 'center',
            bgcolor: 'grey.50',
            '&:hover': {
              borderColor: error ? 'error.main' : 'primary.main',
              bgcolor: 'action.hover',
            },
          }}
        >
          <CloudUpload sx={{ fontSize: 28, color: error ? 'error.main' : 'grey.400' }} />
          <Typography variant="caption" color="text.secondary" display="block">
            Click to select
          </Typography>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mt: 1, py: 0 }} icon={<ErrorIcon sx={{ fontSize: 18 }} />}>
            <Typography variant="caption">{error}</Typography>
          </Alert>
        )}

        {files.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {files.map(file => (
              <Chip
                key={file.uid}
                label={file.name}
                onDelete={() => handleRemove(file.uid)}
                color={file.status === 'uploaded' ? 'success' : file.status === 'rejected' ? 'error' : 'default'}
                size="small"
                variant="outlined"
                sx={{ width: '100%' }}
              />
            ))}
          </Box>
        )}

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ py: 1.5 }}>Sample files</DialogTitle>
          <DialogContent sx={{ py: 0 }}>
            <List dense>
              {SAMPLE_FILES.map(file => (
                <ListItem
                  key={file.name}
                  onClick={() => handleSelectFile(file)}
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <InsertDriveFile />
                  </ListItemIcon>
                  <ListItemText 
                    primary={file.name}
                    secondary={file.sizeLabel}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
