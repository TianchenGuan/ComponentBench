'use client';

/**
 * file_upload_button-mui-T13: Clear a selected file using Chip delete (reset)
 *
 * setup_description: A centered isolated card titled "Attachment" contains a MUI Button labeled 
 * "Choose file" (Button-as-label with hidden input[type=file]). Below the button, the currently 
 * selected file is displayed as a MUI Chip reading "notes.txt" with a small delete (×) icon on 
 * the right. The page loads with notes.txt already selected (the hidden input has that file in 
 * its FileList). Clicking the chip delete icon clears the selection and the UI switches back 
 * to a placeholder text "No file selected".
 *
 * Success: The Attachment uploader has 0 selected files (input.files.length == 0).
 *          The on-page state indicates "No file selected" (chip is removed).
 */

import React, { useState, useEffect } from 'react';
import { 
  Button, Card, CardContent, Typography, Box, Chip,
  Dialog, DialogTitle, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DescriptionIcon from '@mui/icons-material/Description';
import type { TaskComponentProps, SampleFile } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'notes.txt', type: 'text/plain' },
  { name: 'document.txt', type: 'text/plain' },
  { name: 'readme.txt', type: 'text/plain' },
];

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>('notes.txt');
  const [completed, setCompleted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (selectedFile === null) {
      setCompleted(true);
      onSuccess();
    }
  }, [selectedFile, completed, onSuccess]);

  const handleSelectFile = (sample: SampleFile) => {
    setSelectedFile(sample.name);
    setPickerOpen(false);
  };

  const handleDelete = () => {
    setSelectedFile(null);
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Attachment
        </Typography>
        
        <Box data-testid="uploader-attachment" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AttachFileIcon />}
            onClick={() => setPickerOpen(true)}
          >
            Choose file
          </Button>
          
          <Box sx={{ mt: 2 }}>
            {selectedFile ? (
              <Chip
                label={selectedFile}
                onDelete={handleDelete}
                size="medium"
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No file selected
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>

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
