'use client';

/**
 * file_dropzone-mui-T02: Upload profile photo using mixed text + visual guidance
 *
 * setup_description: Baseline scene: centered isolated card, light theme, comfortable spacing.
 * The dropzone is a MUI-styled dashed Paper area labeled "Profile photo" (react-dropzone composite).
 * To the right of the dropzone label, a small "Desired preview" thumbnail is displayed showing the target avatar (a blue square avatar).
 * The page also shows the target filename in text ("avatar-blue.png"), making guidance mixed (text + visual).
 * Clicking the drop area opens an in-page MUI Dialog ("Sample files") listing 3 images:
 * - avatar-blue.png   ← TARGET
 * - avatar-green.png
 * - id-card.jpg
 * After selection, the dropzone area shows an inline image preview and a chip row with the filename and "uploaded" status.
 * Initial state: empty (no selected files).
 *
 * Success: The "Profile photo" dropzone contains exactly one file: avatar-blue.png with status "uploaded".
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Paper, Dialog, DialogTitle, DialogContent, 
  List, ListItem, ListItemIcon, ListItemText, Chip, Box, Avatar
} from '@mui/material';
import { CloudUpload, Image as ImageIcon } from '@mui/icons-material';
import type { TaskComponentProps, SampleFile, DropzoneFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'avatar-blue.png', type: 'image/png' },
  { name: 'avatar-green.png', type: 'image/png' },
  { name: 'id-card.jpg', type: 'image/jpeg' },
];

const getAvatarColor = (name: string): string => {
  if (name.includes('blue')) return '#1677ff';
  if (name.includes('green')) return '#52c41a';
  return '#999';
};

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<DropzoneFile[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    if (
      files.length === 1 &&
      files[0].name === 'avatar-blue.png' &&
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
      thumbUrl: getAvatarColor(sample.name),
    };
    
    setFiles([newFile]);
    
    await simulateUpload(500);
    setFiles([{ ...newFile, status: 'uploaded' }]);
  };

  const handleRemove = (uid: string) => {
    setFiles(prev => prev.filter(f => f.uid !== uid));
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <div>
            <Typography variant="h6">Profile photo</Typography>
            <Typography variant="body2" color="text.secondary">
              Upload: avatar-blue.png
            </Typography>
          </div>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Desired preview
            </Typography>
            <Avatar sx={{ bgcolor: '#1677ff', width: 48, height: 48, mt: 0.5 }} />
          </Box>
        </Box>
        
        <Paper
          data-testid="dropzone-profile-photo"
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
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: files[0].thumbUrl, width: 40, height: 40 }} />
            <Chip
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{files[0].name}</span>
                  {files[0].status === 'uploaded' && (
                    <Typography variant="caption" color="success.main">
                      Uploaded
                    </Typography>
                  )}
                </Box>
              }
              onDelete={() => handleRemove(files[0].uid)}
            />
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
