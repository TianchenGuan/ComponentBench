'use client';

/**
 * file_dropzone-mui-T06: Remove one specific receipt from a populated list
 *
 * setup_description: The page is a light-theme form_section with moderate clutter: there are several read-only expense fields (amount, date, merchant) and the target upload card.
 * Spacing is comfortable, scale default.
 * The target component is a MUI-styled dropzone labeled "Receipts" (react-dropzone composite, multiple=true).
 * Initial state: three files are already attached and shown in a vertical MUI List under the drop area:
 * - invoice-1042.pdf (uploaded)
 * - invoice-1043.pdf (uploaded)  ← TARGET for removal
 * - receipt-sample.pdf (uploaded)
 * Each list row has a trailing trash/delete icon button.
 * Clicking the delete icon removes that single file row immediately and shows a brief Snackbar ("Removed …").
 * The task requires removing only the specified file while leaving the other two intact.
 *
 * Success: The "Receipts" dropzone contains exactly two files: invoice-1042.pdf and receipt-sample.pdf with status "uploaded".
 *          invoice-1043.pdf is not present.
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Paper, List, ListItem, ListItemIcon, ListItemText,
  IconButton, Box, TextField, Snackbar
} from '@mui/material';
import { CloudUpload, InsertDriveFile, Delete } from '@mui/icons-material';
import type { TaskComponentProps, DropzoneFile } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<DropzoneFile[]>([
    { uid: 'initial-1', name: 'invoice-1042.pdf', status: 'uploaded' },
    { uid: 'initial-2', name: 'invoice-1043.pdf', status: 'uploaded' },
    { uid: 'initial-3', name: 'receipt-sample.pdf', status: 'uploaded' },
  ]);
  const [completed, setCompleted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    if (completed) return;
    
    const uploadedFiles = files.filter(f => f.status === 'uploaded');
    const hasInvoice1042 = uploadedFiles.some(f => f.name === 'invoice-1042.pdf');
    const hasReceiptSample = uploadedFiles.some(f => f.name === 'receipt-sample.pdf');
    const hasInvoice1043 = uploadedFiles.some(f => f.name === 'invoice-1043.pdf');
    
    if (uploadedFiles.length === 2 && hasInvoice1042 && hasReceiptSample && !hasInvoice1043) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleRemove = (uid: string, name: string) => {
    setFiles(prev => prev.filter(f => f.uid !== uid));
    setSnackbarMsg(`Removed ${name}`);
    setSnackbarOpen(true);
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Expense Report
        </Typography>
        
        {/* Distractor fields */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField 
            label="Amount" 
            value="$142.50" 
            size="small" 
            InputProps={{ readOnly: true }}
            sx={{ flex: 1 }}
          />
          <TextField 
            label="Date" 
            value="2026-01-15" 
            size="small" 
            InputProps={{ readOnly: true }}
            sx={{ flex: 1 }}
          />
        </Box>
        <TextField 
          label="Merchant" 
          value="Office Supplies Inc." 
          size="small" 
          fullWidth 
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />
        
        {/* Target dropzone */}
        <Typography variant="subtitle2" gutterBottom>
          Receipts
        </Typography>
        
        <Paper
          data-testid="dropzone-receipts"
          sx={{
            p: 2,
            border: '2px dashed',
            borderColor: 'grey.300',
            borderRadius: 2,
            textAlign: 'center',
            bgcolor: 'grey.50',
            mb: 1,
          }}
        >
          <CloudUpload sx={{ fontSize: 32, color: 'grey.400' }} />
          <Typography variant="body2" color="text.secondary">
            Drag files here
          </Typography>
        </Paper>

        <List dense>
          {files.map(file => (
            <ListItem
              key={file.uid}
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => handleRemove(file.uid, file.name)}
                >
                  <Delete />
                </IconButton>
              }
              sx={{ bgcolor: 'grey.50', borderRadius: 1, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <InsertDriveFile color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary={file.name}
                secondary={file.status === 'uploaded' ? 'Uploaded' : 'Uploading...'}
              />
            </ListItem>
          ))}
        </List>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMsg}
        />
      </CardContent>
    </Card>
  );
}
