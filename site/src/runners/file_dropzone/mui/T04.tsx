'use client';

/**
 * file_dropzone-mui-T04: Drag a file tile into a top-left dropzone (MUI composite)
 *
 * setup_description: The page is a small settings_panel section and the main dropzone card is positioned near the top-left of the viewport (placement=top_left).
 * Theme is light, spacing comfortable, scale default.
 * The target is a MUI-styled dashed Paper drop area labeled "Brand logo" (react-dropzone composite, accept=.svg, maxCount=1).
 * To support drag interaction, a compact "File tray" appears directly below the card with three draggable tiles:
 * - logo.svg   ← TARGET
 * - logo-mono.svg
 * - brand-guidelines.pdf
 * Dragging a tile over the drop area changes the border highlight (hover feedback).
 * On drop, the selected file is added and rendered as a single chip with filename and "uploaded" status.
 * Initial state: empty.
 *
 * Success: The "Brand logo" dropzone contains exactly one file: logo.svg, with status "uploaded".
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Paper, Chip, Box 
} from '@mui/material';
import { CloudUpload, InsertDriveFile, PictureAsPdf } from '@mui/icons-material';
import type { TaskComponentProps, SampleFile, DropzoneFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const FILE_TILES: SampleFile[] = [
  { name: 'logo.svg', type: 'image/svg+xml' },
  { name: 'logo-mono.svg', type: 'image/svg+xml' },
  { name: 'brand-guidelines.pdf', type: 'application/pdf' },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<DropzoneFile[]>([]);
  const [completed, setCompleted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    if (
      files.length === 1 &&
      files[0].name === 'logo.svg' &&
      files[0].status === 'uploaded'
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleDragStart = (e: React.DragEvent, file: SampleFile) => {
    e.dataTransfer.setData('application/json', JSON.stringify(file));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const data = e.dataTransfer.getData('application/json');
      const file: SampleFile = JSON.parse(data);
      
      const newFile: DropzoneFile = {
        uid: generateUid(),
        name: file.name,
        status: 'uploading',
      };
      
      setFiles([newFile]);
      
      await simulateUpload(500);
      setFiles([{ ...newFile, status: 'uploaded' }]);
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleRemove = (uid: string) => {
    setFiles(prev => prev.filter(f => f.uid !== uid));
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Brand logo
        </Typography>
        
        <Paper
          data-testid="dropzone-brand-logo"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          sx={{
            p: 3,
            border: '2px dashed',
            borderColor: isDragOver ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            cursor: 'pointer',
            textAlign: 'center',
            bgcolor: isDragOver ? 'action.hover' : 'grey.50',
            transition: 'all 0.2s',
          }}
        >
          <CloudUpload sx={{ fontSize: 48, color: isDragOver ? 'primary.main' : 'grey.400', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Drag a file here
          </Typography>
        </Paper>

        {files.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {files.map(file => (
              <Chip
                key={file.uid}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{file.name}</span>
                    {file.status === 'uploaded' && (
                      <Typography variant="caption" color="success.main">
                        Uploaded
                      </Typography>
                    )}
                  </Box>
                }
                onDelete={() => handleRemove(file.uid)}
              />
            ))}
          </Box>
        )}

        {/* File tray */}
        <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">File tray</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            {FILE_TILES.map(file => (
              <Box
                key={file.name}
                draggable
                onDragStart={(e) => handleDragStart(e, file)}
                sx={{
                  p: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  cursor: 'grab',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: 11,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                {file.type === 'application/pdf' ? (
                  <PictureAsPdf sx={{ fontSize: 16, color: 'error.main' }} />
                ) : (
                  <InsertDriveFile sx={{ fontSize: 16, color: 'primary.main' }} />
                )}
                {file.name}
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
