'use client';

/**
 * file_dropzone-mui-T05: Upload two specific gallery images in compact spacing
 *
 * setup_description: The page is a centered isolated card in light theme but uses compact spacing (tighter padding and smaller gaps).
 * The dropzone is a MUI dashed Paper area labeled "Gallery images" (react-dropzone composite), configured for multiple image files (accept=image/*, maxFiles=5).
 * Clicking the drop area opens an in-page MUI Dialog ("Sample files") with a compact checkbox list of candidate images:
 * - gallery-01.jpg   ← TARGET
 * - gallery-02.jpg
 * - gallery-03.jpg   ← TARGET
 * - gallery-04.jpg
 * - avatar-blue.png
 * - avatar-green.png
 * The dialog has an "Add selected" button. After adding, the dropzone shows a stacked list of image thumbnails with filenames and per-item "uploaded" badges.
 * Initial state: no images selected.
 *
 * Success: The "Gallery images" dropzone contains exactly two files: gallery-01.jpg and gallery-03.jpg with status "uploaded".
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  FormGroup, FormControlLabel, Checkbox, Chip, Box, Button
} from '@mui/material';
import { CloudUpload, Image as ImageIcon } from '@mui/icons-material';
import type { TaskComponentProps, SampleFile, DropzoneFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'gallery-01.jpg', type: 'image/jpeg' },
  { name: 'gallery-02.jpg', type: 'image/jpeg' },
  { name: 'gallery-03.jpg', type: 'image/jpeg' },
  { name: 'gallery-04.jpg', type: 'image/jpeg' },
  { name: 'avatar-blue.png', type: 'image/png' },
  { name: 'avatar-green.png', type: 'image/png' },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<DropzoneFile[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    const uploadedFiles = files.filter(f => f.status === 'uploaded');
    const hasGallery01 = uploadedFiles.some(f => f.name === 'gallery-01.jpg');
    const hasGallery03 = uploadedFiles.some(f => f.name === 'gallery-03.jpg');
    
    if (uploadedFiles.length === 2 && hasGallery01 && hasGallery03) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleToggleFile = (fileName: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileName) 
        ? prev.filter(f => f !== fileName)
        : [...prev, fileName]
    );
  };

  const handleAddSelected = async () => {
    setDialogOpen(false);
    
    const newFiles: DropzoneFile[] = selectedFiles.map(name => ({
      uid: generateUid(),
      name,
      status: 'uploading' as const,
    }));
    
    setFiles(newFiles);
    
    await simulateUpload(500);
    setFiles(newFiles.map(f => ({ ...f, status: 'uploaded' as const })));
    
    setSelectedFiles([]);
  };

  const handleRemove = (uid: string) => {
    setFiles(prev => prev.filter(f => f.uid !== uid));
  };

  return (
    <Card sx={{ width: 380 }}>
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Gallery images
        </Typography>
        
        <Paper
          data-testid="dropzone-gallery-images"
          onClick={() => setDialogOpen(true)}
          sx={{
            p: 2,
            border: '2px dashed',
            borderColor: 'grey.300',
            borderRadius: 1,
            cursor: 'pointer',
            textAlign: 'center',
            bgcolor: 'grey.50',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            },
          }}
        >
          <CloudUpload sx={{ fontSize: 36, color: 'grey.400', mb: 0.5 }} />
          <Typography variant="body2" color="text.secondary" fontSize={12}>
            Click to add images
          </Typography>
        </Paper>

        {files.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {files.map(file => (
              <Chip
                key={file.uid}
                icon={<ImageIcon sx={{ fontSize: 16 }} />}
                label={file.name}
                onDelete={() => handleRemove(file.uid)}
                color={file.status === 'uploaded' ? 'success' : 'default'}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        )}

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ py: 1.5 }}>Sample files</DialogTitle>
          <DialogContent sx={{ py: 0 }}>
            <FormGroup>
              {SAMPLE_FILES.map(file => (
                <FormControlLabel
                  key={file.name}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedFiles.includes(file.name)}
                      onChange={() => handleToggleFile(file.name)}
                    />
                  }
                  label={<Typography variant="body2">{file.name}</Typography>}
                />
              ))}
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleAddSelected}
              disabled={selectedFiles.length === 0}
            >
              Add selected
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
