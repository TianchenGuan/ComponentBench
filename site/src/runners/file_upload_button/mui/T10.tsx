'use client';

/**
 * file_upload_button-mui-T20: Remove one specific file from a long scrollable list (bottom-right)
 *
 * setup_description: The upload UI is placed near the bottom-right of the viewport inside a 
 * dashboard widget titled "Logs" (medium clutter: other widgets are visible but not relevant). 
 * The uploader supports multiple files and shows an already populated scrollable MUI List of 
 * many text log files (around 12–20 items) with very similar names and dates. Each list row 
 * shows a filename and a small trailing IconButton (trash icon) for removal. The list is 
 * constrained to a fixed height, so scrolling is required to reach some filenames. Initial 
 * state includes a row named "log_2025-11-20.txt" somewhere in the list.
 *
 * Success: In the "Logs" uploader, the filename "log_2025-11-20.txt" is no longer present.
 *          All other initial files remain present (no additional deletions).
 */

import React, { useState, useEffect } from 'react';
import { 
  Button, Card, CardContent, Typography, Box,
  List, ListItem, ListItemText, IconButton, Paper, Grid,
  Dialog, DialogTitle, ListItemIcon
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import type { TaskComponentProps, SampleFile } from '../types';

interface FileItem {
  id: string;
  name: string;
}

// Generate initial file list with many similar-named files
const generateInitialFiles = (): FileItem[] => {
  const files: FileItem[] = [];
  const dates = [
    '2025-11-15', '2025-11-16', '2025-11-17', '2025-11-18', '2025-11-19',
    '2025-11-20', '2025-11-21', '2025-11-22', '2025-11-23', '2025-11-24',
    '2025-11-25', '2025-11-26', '2025-11-27', '2025-11-28', '2025-11-29'
  ];
  
  dates.forEach((date, index) => {
    files.push({
      id: `log-${index}`,
      name: `log_${date}.txt`,
    });
  });
  
  return files;
};

const TARGET_FILE = 'log_2025-11-20.txt';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'log_2025-11-30.txt', type: 'text/plain' },
  { name: 'log_2025-12-01.txt', type: 'text/plain' },
  { name: 'system_log.txt', type: 'text/plain' },
];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [initialFiles] = useState<FileItem[]>(generateInitialFiles);
  const [files, setFiles] = useState<FileItem[]>(generateInitialFiles);
  const [completed, setCompleted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    const targetRemoved = !files.some(f => f.name === TARGET_FILE);
    const onlyTargetRemoved = files.length === initialFiles.length - 1 &&
      initialFiles.filter(f => f.name !== TARGET_FILE).every(
        initFile => files.some(f => f.name === initFile.name)
      );
    
    if (targetRemoved && onlyTargetRemoved) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, initialFiles, completed, onSuccess]);

  const handleRemove = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleSelectFile = (sample: SampleFile) => {
    const newFile = {
      id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: sample.name,
    };
    setFiles((prev) => [...prev, newFile]);
    setPickerOpen(false);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <Grid container spacing={2}>
        {/* Distractor widgets */}
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Storage Used</Typography>
            <Typography variant="h5">4.2 GB</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Active Users</Typography>
            <Typography variant="h5">24</Typography>
          </Paper>
        </Grid>
        
        {/* Logs widget */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Logs
              </Typography>
              
              <Box data-testid="uploader-logs">
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  size="small"
                  sx={{ mb: 2 }}
                  onClick={() => setPickerOpen(true)}
                >
                  Add logs
                </Button>
                
                <Box sx={{ maxHeight: 250, overflowY: 'auto', border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                  <List dense>
                    {files.map((file) => (
                      <ListItem
                        key={file.id}
                        secondaryAction={
                          <IconButton 
                            edge="end" 
                            size="small"
                            onClick={() => handleRemove(file.id)}
                            aria-label={`Remove ${file.name}`}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        }
                        sx={{ 
                          '&:hover': { bgcolor: 'grey.50' },
                          borderBottom: '1px solid',
                          borderColor: 'grey.200'
                        }}
                      >
                        <ListItemText 
                          primary={file.name}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
    </Box>
  );
}
