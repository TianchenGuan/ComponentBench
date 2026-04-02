'use client';

/**
 * file_upload_button-mui-T12: Upload a profile picture via small IconButton (corner placement)
 *
 * setup_description: The upload UI is anchored near the bottom-left of the viewport. A small card 
 * titled "Profile picture" shows a placeholder avatar and a compact MUI IconButton (camera icon) 
 * labeled with aria-label "Change photo". The IconButton is implemented as a label wrapping a 
 * hidden input[type=file] that accepts images (PNG/JPG). When a file is chosen, the avatar preview 
 * updates and a caption below the avatar shows the selected filename. No other uploaders are present.
 *
 * Success: The "Change photo" file input contains exactly one file named "profile_photo.png".
 *          The preview caption indicates the selected file is profile_photo.png.
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Box, IconButton, Avatar,
  Dialog, DialogTitle, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ImageIcon from '@mui/icons-material/Image';
import type { TaskComponentProps, SampleFile } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'profile_photo.png', type: 'image/png' },
  { name: 'avatar.jpg', type: 'image/jpeg' },
  { name: 'headshot.png', type: 'image/png' },
];

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (selectedFile === 'profile_photo.png') {
      setCompleted(true);
      onSuccess();
    }
  }, [selectedFile, completed, onSuccess]);

  const handleSelectFile = (sample: SampleFile) => {
    setSelectedFile(sample.name);
    setPickerOpen(false);
  };

  return (
    <Card sx={{ width: 280 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Profile picture
        </Typography>
        
        <Box 
          data-testid="uploader-profile-photo"
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}
        >
          <Box sx={{ position: 'relative' }}>
            <Avatar
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: selectedFile ? 'primary.main' : 'grey.300' 
              }}
            >
              {selectedFile ? selectedFile.substring(0, 2).toUpperCase() : ''}
            </Avatar>
            <IconButton
              aria-label="Change photo"
              onClick={() => setPickerOpen(true)}
              sx={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                width: 32,
                height: 32,
              }}
              size="small"
            >
              <CameraAltIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ mt: 2, textAlign: 'center' }}
          >
            {selectedFile || 'No file selected'}
          </Typography>
        </Box>
      </CardContent>

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
