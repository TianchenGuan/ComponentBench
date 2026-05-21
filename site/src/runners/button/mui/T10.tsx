'use client';

/**
 * button-mui-T10: Delete project with dialog confirmation
 * 
 * Danger zone card with "Delete project" button.
 * Clicking opens confirmation Dialog with Cancel and Delete buttons.
 * Task: Click "Delete project" then "Delete" in the dialog.
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Button,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleDeleteClick = () => {
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setDeleted(true);
    setDialogOpen(false);
    onSuccess();
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" color="error" gutterBottom>
            Danger zone
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Deleting the project will permanently remove all data, files, and settings. This action cannot be undone.
          </Typography>
          
          {deleted ? (
            <Typography color="success.main">Project deleted</Typography>
          ) : (
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteClick}
              data-testid="mui-btn-delete-project"
            >
              Delete project
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={handleCancel}>
        <DialogTitle>Delete project?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project? All data will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} data-testid="mui-btn-dialog-cancel">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            data-testid="mui-btn-dialog-delete"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
