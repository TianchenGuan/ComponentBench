'use client';

/**
 * file_upload_button-mui-T18: Upload an exact set of 3 similar-named PDFs (dark, compact, small)
 *
 * setup_description: A compact, small-scale upload card is centered on a dark-themed page. The 
 * card is titled "Supporting documents" and contains a single MUI Button-as-label uploader 
 * configured with multiple=true and accept="application/pdf". Below the button is a dense list 
 * of selected files where each row shows a filename and a small remove icon. The list starts 
 * empty. Once files are chosen, each should appear as its own row; the component considers 
 * the task complete when the list contains exactly the required three PDFs.
 *
 * Success: The Supporting documents uploader contains the set of files 
 *          {appendix_a.pdf, appendix_b.pdf, appendix_c.pdf} and no others.
 */

import React, { useState, useEffect } from 'react';
import { 
  Button, Card, CardContent, Typography, Box, 
  List, ListItem, ListItemText, IconButton,
  Dialog, DialogTitle, ListItemIcon
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import type { TaskComponentProps, SampleFile } from '../types';

interface FileItem {
  id: string;
  name: string;
}

const TARGET_FILES = new Set(['appendix_a.pdf', 'appendix_b.pdf', 'appendix_c.pdf']);

const SAMPLE_FILES: SampleFile[] = [
  { name: 'appendix_a.pdf', type: 'application/pdf' },
  { name: 'appendix_b.pdf', type: 'application/pdf' },
  { name: 'appendix_c.pdf', type: 'application/pdf' },
  { name: 'appendix_d.pdf', type: 'application/pdf' },
  { name: 'summary.pdf', type: 'application/pdf' },
];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [completed, setCompleted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (files.length === 3) {
      const fileNames = new Set(files.map(f => f.name));
      const hasAllRequired = Array.from(TARGET_FILES).every(name => fileNames.has(name));
      const hasOnlyRequired = files.every(f => TARGET_FILES.has(f.name));
      
      if (hasAllRequired && hasOnlyRequired) {
        setCompleted(true);
        onSuccess();
      }
    }
  }, [files, completed, onSuccess]);

  const handleSelectFile = (sample: SampleFile) => {
    // Check if file already exists
    if (!files.some(f => f.name === sample.name)) {
      const newFile = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: sample.name,
      };
      setFiles((prev) => [...prev, newFile]);
    }
    setPickerOpen(false);
  };

  const handleRemove = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  return (
    <Card 
      sx={{ 
        width: 350, 
        bgcolor: '#1e1e1e',
        '& .MuiCardContent-root': { p: 1.5 }
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" sx={{ color: '#fff', mb: 1.5 }}>
          Supporting documents
        </Typography>
        
        <Box data-testid="uploader-supporting-docs">
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            size="small"
            sx={{ mb: 1 }}
            onClick={() => setPickerOpen(true)}
          >
            Select files
          </Button>
          
          {files.length > 0 ? (
            <List dense sx={{ p: 0 }}>
              {files.map((file) => (
                <ListItem
                  key={file.id}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.08)', 
                    borderRadius: 0.5, 
                    mb: 0.5,
                    py: 0.25,
                    px: 1
                  }}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      size="small"
                      onClick={() => handleRemove(file.id)}
                      sx={{ color: 'grey.500' }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemText 
                    primary={file.name} 
                    primaryTypographyProps={{ 
                      variant: 'body2', 
                      sx: { color: '#fff' } 
                    }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="caption" sx={{ color: 'grey.500' }}>
              No files selected
            </Typography>
          )}
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
              sx={{ 
                cursor: 'pointer', 
                '&:hover': { bgcolor: 'action.hover' },
                opacity: files.some(f => f.name === file.name) ? 0.5 : 1
              }}
            >
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText 
                primary={file.name} 
                secondary={files.some(f => f.name === file.name) ? 'Already added' : undefined}
              />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </Card>
  );
}
