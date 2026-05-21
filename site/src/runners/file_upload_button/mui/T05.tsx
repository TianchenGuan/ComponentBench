'use client';

/**
 * file_upload_button-mui-T15: Confirm removal in a MUI Dialog
 *
 * setup_description: A centered isolated card titled "Data attachment" contains a MUI upload control 
 * (Button-as-label with hidden input) plus a small list area that displays selected/uploaded files. 
 * On page load, the list contains exactly one item: "data_sample.csv" with a trailing trash icon 
 * button labeled "Remove file". Clicking the trash icon opens a MUI Dialog titled "Remove file?" 
 * with two buttons: "Cancel" and "Remove". The file is only removed from the list after clicking 
 * the "Remove" button in the dialog.
 *
 * Success: The "Data attachment" uploader has 0 files remaining in its list.
 *          The removal confirmation dialog was accepted by clicking "Remove".
 */

import React, { useState, useEffect } from 'react';
import { 
  Button, Card, CardContent, Typography, Box, List, ListItem, 
  ListItemText, IconButton, Dialog, DialogTitle, DialogContent, 
  DialogContentText, DialogActions, ListItemIcon
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import type { TaskComponentProps, SampleFile } from '../types';

interface FileItem {
  id: string;
  name: string;
}

const SAMPLE_FILES: SampleFile[] = [
  { name: 'data_sample.csv', type: 'text/csv' },
  { name: 'report.csv', type: 'text/csv' },
  { name: 'export.csv', type: 'text/csv' },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: 'data_sample.csv' }
  ]);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [fileToRemove, setFileToRemove] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [confirmAccepted, setConfirmAccepted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (files.length === 0 && confirmAccepted) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, confirmAccepted, completed, onSuccess]);

  const handleRemoveClick = (fileId: string) => {
    setFileToRemove(fileId);
    setRemoveDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    if (fileToRemove) {
      setConfirmAccepted(true);
      setFiles((prev) => prev.filter((f) => f.id !== fileToRemove));
    }
    setRemoveDialogOpen(false);
    setFileToRemove(null);
  };

  const handleCancelRemove = () => {
    setRemoveDialogOpen(false);
    setFileToRemove(null);
  };

  const handleSelectFile = (sample: SampleFile) => {
    const newFile = {
      id: `new-${Date.now()}`,
      name: sample.name,
    };
    setFiles((prev) => [...prev, newFile]);
    setPickerOpen(false);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Data attachment
        </Typography>
        
        <Box data-testid="uploader-data-attachment" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={() => setPickerOpen(true)}
          >
            Choose file
          </Button>
          
          {files.length > 0 ? (
            <List dense sx={{ mt: 1 }}>
              {files.map((file) => (
                <ListItem
                  key={file.id}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="Remove file"
                      onClick={() => handleRemoveClick(file.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{ bgcolor: 'grey.50', borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemText primary={file.name} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              No files selected
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Confirmation Dialog */}
      <Dialog open={removeDialogOpen} onClose={handleCancelRemove}>
        <DialogTitle>Remove file?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this file?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelRemove}>Cancel</Button>
          <Button onClick={handleConfirmRemove} color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Virtual file picker dialog */}
      <Dialog open={pickerOpen} onClose={() => setPickerOpen(false)}>
        <DialogTitle>Sample files</DialogTitle>
        <List sx={{ minWidth: 300 }}>
          {SAMPLE_FILES.map((file) => (
            <ListItem
              key={file.name}
              component="div"
              onClick={() => handleSelectFile(file)}
              sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
            >
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </Card>
  );
}
