'use client';

/**
 * file_list_manager-mui-T05: Delete a draft contract with confirmation
 *
 * setup_description: A single Attachments manager is displayed in a centered card. Each row has a delete (trash)
 * IconButton. Clicking delete opens a Material UI Dialog titled "Delete file?" with body text showing the
 * filename to be deleted. The dialog has two buttons: "Cancel" and a primary red "Delete". No deletion happens
 * until the "Delete" button is pressed. After deletion, a Snackbar "Deleted" appears.
 *
 * Success: "draft_contract.docx" is removed from the Attachments list. The delete action was confirmed.
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
} from '@mui/material';
import { Delete as DeleteIcon, InsertDriveFile as FileIcon } from '@mui/icons-material';
import type { TaskComponentProps, FileItem } from '../types';

const initialFiles: FileItem[] = [
  { id: 'f1', name: 'contract-signed.pdf', type: 'PDF', size: 245000 },
  { id: 'f2', name: 'draft_contract.docx', type: 'DOCX', size: 128000 },
  { id: 'f3', name: 'receipt.png', type: 'PNG', size: 89000 },
  { id: 'f4', name: 'invoice-feb.pdf', type: 'PDF', size: 156000 },
  { id: 'f5', name: 'notes.txt', type: 'TXT', size: 4500 },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const draftExists = files.some((f) => f.name === 'draft_contract.docx');
    if (!draftExists && files.length === 4) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleDeleteClick = (file: FileItem) => {
    setFileToDelete(file);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (fileToDelete) {
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      setSnackbarOpen(true);
    }
    setDialogOpen(false);
    setFileToDelete(null);
  };

  const handleCancelDelete = () => {
    setDialogOpen(false);
    setFileToDelete(null);
  };

  return (
    <Card sx={{ width: 400 }} data-testid="flm-root">
      <CardHeader title="Attachments" />
      <CardContent data-testid="flm-Attachments">
        <List>
          {files.map((file) => (
            <ListItem
              key={file.id}
              data-testid={`flm-row-${file.id}`}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label={`Delete ${file.name}`}
                  onClick={() => handleDeleteClick(file)}
                  data-testid="flm-action-delete"
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemIcon>
                <FileIcon />
              </ListItemIcon>
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
      </CardContent>

      <Dialog open={dialogOpen} onClose={handleCancelDelete} data-testid="flm-delete-dialog">
        <DialogTitle>Delete file?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &ldquo;{fileToDelete?.name}&rdquo;?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} data-testid="flm-dialog-cancel">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            data-testid="flm-dialog-delete"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Deleted"
      />
    </Card>
  );
}
