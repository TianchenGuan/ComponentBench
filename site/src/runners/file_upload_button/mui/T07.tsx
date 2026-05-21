'use client';

/**
 * file_upload_button-mui-T17: Open the file preview dialog for an uploaded image
 *
 * setup_description: A centered isolated card titled "Screenshot" contains an upload button 
 * (MUI Button-as-label) and a single pre-selected image file named "screenshot.webp". Next 
 * to the filename is a small text button labeled "Preview". Clicking "Preview" opens a MUI 
 * Dialog with the title "Preview" and shows the image along with the filename. The dialog 
 * has a "Close" button but the task requires leaving the preview open. No other dialogs 
 * or uploaders exist on the page.
 *
 * Success: A preview dialog is open (visible) for the uploader card.
 *          The dialog content corresponds to the file named "screenshot.webp".
 */

import React, { useState, useEffect } from 'react';
import { 
  Button, Card, CardContent, Typography, Box, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ImageIcon from '@mui/icons-material/Image';
import type { TaskComponentProps, SampleFile } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'screenshot.webp', type: 'image/webp' },
  { name: 'capture.png', type: 'image/png' },
  { name: 'snapshot.jpg', type: 'image/jpeg' },
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>('screenshot.webp');
  const [pickerOpen, setPickerOpen] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (previewOpen) {
      setCompleted(true);
      onSuccess();
    }
  }, [previewOpen, completed, onSuccess]);

  const handlePreviewOpen = () => {
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };

  const handleSelectFile = (sample: SampleFile) => {
    setSelectedFile(sample.name);
    setPickerOpen(false);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Screenshot
        </Typography>
        
        <Box data-testid="uploader-screenshot" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            size="small"
            onClick={() => setPickerOpen(true)}
          >
            Change file
          </Button>
          
          <Box 
            sx={{ 
              mt: 2, 
              p: 1.5, 
              bgcolor: 'grey.50', 
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="body2">{selectedFile}</Typography>
            <Button
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={handlePreviewOpen}
            >
              Preview
            </Button>
          </Box>
        </Box>
      </CardContent>

      {/* Preview Dialog */}
      <Dialog 
        open={previewOpen} 
        onClose={handlePreviewClose}
        maxWidth="sm"
        fullWidth
        data-testid="preview-dialog"
        data-file-name={selectedFile}
      >
        <DialogTitle>Preview</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center' }}>
            {/* Placeholder image since we can't load actual file */}
            <Box
              sx={{
                width: '100%',
                height: 200,
                bgcolor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                mb: 2
              }}
            >
              <Typography color="text.secondary">Image preview</Typography>
            </Box>
            <Typography variant="body2">{selectedFile}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePreviewClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Virtual file picker dialog */}
      <Dialog open={pickerOpen} onClose={() => setPickerOpen(false)}>
        <DialogTitle>Sample images</DialogTitle>
        <List sx={{ minWidth: 300 }}>
          {SAMPLE_FILES.map((file) => (
            <ListItem
              key={file.name}
              component="div"
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
      </Dialog>
    </Card>
  );
}
