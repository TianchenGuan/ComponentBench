'use client';

/**
 * file_upload_button-mui-T16: Upload a file by matching a reference (MUI)
 *
 * setup_description: A centered isolated card titled "Submit supporting file" contains a single 
 * MUI Button labeled "Upload" implemented as a label with a hidden file input. To the right, a 
 * Reference card displays the target file's name and an icon (the reference is non-interactive). 
 * The instruction relies on the reference (visual/mixed guidance) rather than embedding the 
 * filename in the prompt. After selection, a line of text under the button shows "Selected: <filename>".
 *
 * Success: The uploader labeled "Upload" has exactly one selected file whose name matches the 
 *          filename shown in the Reference card ("supporting_doc.pdf").
 */

import React, { useState, useEffect } from 'react';
import { 
  Button, Card, CardContent, Typography, Box, Paper,
  Dialog, DialogTitle, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import type { TaskComponentProps, SampleFile } from '../types';

const REFERENCE_FILE = 'supporting_doc.pdf';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'supporting_doc.pdf', type: 'application/pdf' },
  { name: 'additional_info.pdf', type: 'application/pdf' },
  { name: 'evidence.pdf', type: 'application/pdf' },
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (selectedFile === REFERENCE_FILE) {
      setCompleted(true);
      onSuccess();
    }
  }, [selectedFile, completed, onSuccess]);

  const handleSelectFile = (sample: SampleFile) => {
    setSelectedFile(sample.name);
    setPickerOpen(false);
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Submit supporting file
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
          {/* Uploader */}
          <Box data-testid="uploader-upload" sx={{ flex: 1 }}>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={() => setPickerOpen(true)}
            >
              Upload
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Selected: {selectedFile || 'none'}
            </Typography>
          </Box>
          
          {/* Reference card */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              bgcolor: 'grey.100', 
              minWidth: 180,
              borderRadius: 2 
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Reference
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <DescriptionIcon color="primary" />
              <Typography variant="body2" data-testid="reference-file-name">
                {REFERENCE_FILE}
              </Typography>
            </Box>
          </Paper>
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
