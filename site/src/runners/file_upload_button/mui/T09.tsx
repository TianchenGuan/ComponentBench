'use client';

/**
 * file_upload_button-mui-T19: Replace a file in a table row uploader (3 instances, table cell)
 *
 * setup_description: The page is a table-cell layout: a MUI Table titled "Required documents" is 
 * the main content and occupies most of the viewport (high clutter due to many rows and columns). 
 * Each of three relevant rows (Contract, ID, W-9) contains an upload control in the rightmost cell 
 * implemented as a small MUI Button-as-label with a hidden file input. The Contract row is pre-filled 
 * and currently shows "contract_old.pdf" as the selected file, with a small replace/upload button 
 * next to it. The other rows are either empty or have different placeholder statuses and serve as 
 * distractors. The user must update only the Contract row so that the selected file becomes 
 * "contract_signed.pdf".
 *
 * Success: In the "Contract" row uploader, the selected file is exactly "contract_signed.pdf".
 *          "contract_old.pdf" is not selected in the Contract row.
 *          Other rows' uploaders are unchanged.
 */

import React, { useState, useEffect } from 'react';
import { 
  Button, Card, CardContent, Typography, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Dialog, DialogTitle, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import type { TaskComponentProps, SampleFile } from '../types';

interface RowData {
  id: string;
  document: string;
  status: string;
  file: string | null;
}

const CONTRACT_FILES: SampleFile[] = [
  { name: 'contract_signed.pdf', type: 'application/pdf' },
  { name: 'contract_draft.pdf', type: 'application/pdf' },
  { name: 'contract_old.pdf', type: 'application/pdf' },
];

const ID_FILES: SampleFile[] = [
  { name: 'id_scan.pdf', type: 'application/pdf' },
  { name: 'passport.jpg', type: 'image/jpeg' },
];

const W9_FILES: SampleFile[] = [
  { name: 'w9_form.pdf', type: 'application/pdf' },
  { name: 'tax_form.pdf', type: 'application/pdf' },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<RowData[]>([
    { id: 'contract', document: 'Contract', status: 'Uploaded', file: 'contract_old.pdf' },
    { id: 'id', document: 'ID', status: 'Pending', file: null },
    { id: 'w9', document: 'W-9', status: 'Pending', file: null },
  ]);
  const [completed, setCompleted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState<string | null>(null);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    const contractRow = rows.find(r => r.id === 'contract');
    const idRow = rows.find(r => r.id === 'id');
    const w9Row = rows.find(r => r.id === 'w9');
    
    if (
      contractRow &&
      contractRow.file === 'contract_signed.pdf' &&
      idRow && idRow.file === null &&
      w9Row && w9Row.file === null
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [rows, completed, onSuccess]);

  const handleSelectFile = (rowId: string, sample: SampleFile) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? { ...row, file: sample.name, status: 'Uploaded' }
          : row
      )
    );
    setPickerOpen(null);
  };

  const getFilesForRow = (rowId: string): SampleFile[] => {
    switch (rowId) {
      case 'contract':
        return CONTRACT_FILES;
      case 'id':
        return ID_FILES;
      case 'w9':
        return W9_FILES;
      default:
        return [];
    }
  };

  return (
    <Card sx={{ width: '100%', maxWidth: 700 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Required documents
        </Typography>
        
        <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell><strong>Document</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>File</strong></TableCell>
                <TableCell align="right"><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.document}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      size="small"
                      color={row.status === 'Uploaded' ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {row.file || <Typography variant="body2" color="text.secondary">—</Typography>}
                  </TableCell>
                  <TableCell align="right">
                    <Box data-testid={`uploader-${row.id}`}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        onClick={() => setPickerOpen(row.id)}
                      >
                        {row.file ? 'Replace' : 'Upload'}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      {/* Virtual file picker dialog */}
      <Dialog 
        open={pickerOpen !== null} 
        onClose={() => setPickerOpen(null)}
      >
        <DialogTitle>Sample files</DialogTitle>
        <List sx={{ minWidth: 300 }}>
          {pickerOpen && getFilesForRow(pickerOpen).map((file) => (
            <ListItem
              key={file.name}
              component="div"
              onClick={() => handleSelectFile(pickerOpen, file)}
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
