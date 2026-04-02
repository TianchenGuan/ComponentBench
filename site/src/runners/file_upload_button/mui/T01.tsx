'use client';

/**
 * file_upload_button-mui-T11: Upload a resume PDF with MUI Button-as-label
 *
 * setup_description: A centered isolated card titled "Resume upload" contains a single MUI contained 
 * Button labeled "Upload resume". The button is implemented as a label (component="label") wrapping 
 * a visually hidden <input type="file"> (standard MUI file upload pattern). The input accepts a 
 * single PDF file (accept="application/pdf") and does not allow multiple selection. After a file 
 * is selected, the chosen filename is displayed directly below the button in a one-line helper 
 * text (Typography) that reads "Selected: <filename>". There are no other interactive elements 
 * on the page; initial state shows "Selected: none".
 *
 * Success: The hidden file input contains exactly one file named "resume.pdf".
 *          The on-page helper text reflects "Selected: resume.pdf".
 */

import React, { useState, useEffect } from 'react';
import { 
  Button, Card, CardContent, Typography, Box,
  Dialog, DialogTitle, List, ListItem, ListItemIcon, ListItemText 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import type { TaskComponentProps, SampleFile } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'resume.pdf', type: 'application/pdf' },
  { name: 'cv.pdf', type: 'application/pdf' },
  { name: 'cover_letter.pdf', type: 'application/pdf' },
];

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (selectedFile === 'resume.pdf') {
      setCompleted(true);
      onSuccess();
    }
  }, [selectedFile, completed, onSuccess]);

  const handleSelectFile = (sample: SampleFile) => {
    setSelectedFile(sample.name);
    setPickerOpen(false);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Resume upload
        </Typography>
        
        <Box data-testid="uploader-resume" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={() => setPickerOpen(true)}
          >
            Upload resume
          </Button>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: 1 }}
          >
            Selected: {selectedFile || 'none'}
          </Typography>
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
